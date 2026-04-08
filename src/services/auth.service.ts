"use server"

import { envVars } from "@/config/env";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";


const NEXT_PUBLIC_API_BASE_URL = envVars.NEXT_PUBLIC_API_BASE_URL;


if (!NEXT_PUBLIC_API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}


export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export async function getNewTokensWithRefreshToken(
    refreshToken: string
): Promise<TokenResponse | null> {
    try {
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`,
            },
            credentials: 'include'
        });

        if (!res.ok) {
            return null;
        }

        const { data } = await res.json();

        const { accessToken, refreshToken: newRefreshToken } = data;

        if (accessToken) {
            try {
                await setTokenInCookies("accessToken", accessToken);
            } catch {
                // Silently ignore: setTokenInCookies uses cookies().set() which fails in middleware.
                // The middleware (proxy.ts) handles setting cookies on the response itself.
            }
        }

        if (newRefreshToken) {
            try {
                await setTokenInCookies("refreshToken", newRefreshToken);
            } catch {
                // Silently ignore: setTokenInCookies uses cookies().set() which fails in middleware.
            }
        }

        return { accessToken, refreshToken: newRefreshToken || refreshToken };
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
}


export async function getUserInfo() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!accessToken) {
            return null;
        }

        const cookieHeader = `accessToken=${accessToken}${refreshToken ? `; refreshToken=${refreshToken}` : ''}`;

        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}
