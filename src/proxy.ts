import { NextRequest, NextResponse } from "next/server";
import { envVars } from "./config/env";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { getAuthCookieOptions, isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokensWithRefreshToken, TokenResponse } from "./services/auth.service";

async function refreshTokenMiddleware(refreshToken: string): Promise<TokenResponse | null> {
  try {
    const refreshed = await getNewTokensWithRefreshToken(refreshToken);
    return refreshed;
  } catch {
    return null;
  }
}

/**
 * Helper to apply cookies from one response to another (e.g. from NexResponse.next to NextResponse.redirect)
 */
function applyResponseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value, getAuthCookieOptions(cookie.value));
  });
}

/**
 * Helper to set auth tokens on a response
 */
function setAuthCookies(
  response: NextResponse,
  tokens: TokenResponse,
  accessTokenName: string,
  refreshTokenName: string
) {
  response.cookies.set(
    accessTokenName,
    tokens.accessToken,
    getAuthCookieOptions(tokens.accessToken)
  );
  response.cookies.set(
    refreshTokenName,
    tokens.refreshToken,
    getAuthCookieOptions(tokens.refreshToken)
  );
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname, search } = request.nextUrl;

    // 🔍 Flexible token extraction
    const accessTokenName = request.cookies.has("__accessToken") ? "__accessToken" : "accessToken";
    const refreshTokenName = request.cookies.has("__refreshToken") ? "__refreshToken" : "refreshToken";

    const accessToken = request.cookies.get(accessTokenName)?.value;
    const refreshToken = request.cookies.get(refreshTokenName)?.value;

    // 🔍 Verify token
    const verifyResult = accessToken 
      ? jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET)
      : { success: false, data: null };

    let isValidAccessToken = verifyResult?.success;
    let decoded = verifyResult?.data;
    let userRole: UserRole | null = decoded?.role ?? null;

    const response = NextResponse.next();
    let tokensRefreshed = false;

    // Rule 0: Session Rescue - If access token is missing/invalid but refresh token exists, try to recover
    if (!isValidAccessToken && refreshToken) {
      const refreshedTokens = await refreshTokenMiddleware(refreshToken);
      if (refreshedTokens) {
        setAuthCookies(response, refreshedTokens, accessTokenName, refreshTokenName);
        
        const newVerify = jwtUtils.verifyToken(refreshedTokens.accessToken, envVars.ACCESS_TOKEN_SECRET);
        if (newVerify.success) {
           isValidAccessToken = true;
           decoded = newVerify.data;
           userRole = decoded?.role ?? null;
           tokensRefreshed = true;
        }
      }
    }

    // Rule 0.1: Proactive refresh - If token is nearing expiration, refresh it now
    if (
      isValidAccessToken &&
      accessToken &&
      refreshToken &&
      !tokensRefreshed && // Only if not already refreshed by Rule 0
      (await isTokenExpiringSoon(accessToken))
    ) {
      const refreshedTokens = await refreshTokenMiddleware(refreshToken);
      if (refreshedTokens) {
        setAuthCookies(response, refreshedTokens, accessTokenName, refreshTokenName);
        tokensRefreshed = true;
        
        const newVerify = jwtUtils.verifyToken(refreshedTokens.accessToken, envVars.ACCESS_TOKEN_SECRET);
        isValidAccessToken = newVerify.success;
        decoded = newVerify.data;
        userRole = decoded?.role ?? null;
      }
    }

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Rule 1: Logged-in users should not access Auth pages (Login/Register)
    if (isAuth && isValidAccessToken) {
      const dashboardUrl = new URL(getDefaultDashboardRoute(userRole as UserRole), request.url);
      
      const redirectResponse = NextResponse.redirect(dashboardUrl);
      if (tokensRefreshed) {
        applyResponseCookies(response, redirectResponse);
      }
      return redirectResponse;
    }

    // Rule 2: Public routes access
    if (routeOwner === null) {
      return response;
    }

    // Rule 3: Handle Unauthenticated access to protected routes
    if (!isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      const pathWithQuery = `${pathname}${search}`;
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 4: Common protected routes
    if (routeOwner === "COMMON") {
      return response;
    }

    // Rule 5: Role-based Authorization
    if (routeOwner !== userRole) {
      const dashboardUrl = new URL(getDefaultDashboardRoute(userRole as UserRole), request.url);
      
      const redirectResponse = NextResponse.redirect(dashboardUrl);
      if (tokensRefreshed) {
        applyResponseCookies(response, redirectResponse);
      }
      return redirectResponse;
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};