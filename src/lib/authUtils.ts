export type UserRole = "ADMIN" | "MEMBER";

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((router: string) => router === pathname);
}

export type RouteConfig = {
    exact: string[],
    pattern: RegExp[]
}

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/profile", "/settings"],
    pattern: []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin\/dashboard/ ],
    exact : []
}

export const memberProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard/ ],
    exact : [ "/payment/success"]
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : "ADMIN"  | "MEMBER" | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }

    if (isRouteMatches(pathname, memberProtectedRoutes)) {
        return "MEMBER";
    }

    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
    const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    
    // 🛑 Prevent redirect loop (e.g., redirecting back to login after login)
    if (isAuthRoute(sanitizedRedirectPath)) {
        return false;
    }

    const routeOwner = getRouteOwner(sanitizedRedirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if (role === "ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "MEMBER") {
        return "/dashboard";
    }

    return "/";
}