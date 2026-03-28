
import { envVars } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";


export const getAuthCookieOptions = (token?: string) => {
    const maxAge = token ? getTokenSecondsRemaining(token) : undefined;
    
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax" | "strict",
        path: "/",
        maxAge: maxAge || 60 * 60 * 24, // 1 day default
    };
};


export const setTokenInCookies = async (
    name: string,
    token: string,
    fallbackMaxAgeInSeconds = 60 * 60 * 24 // 1 days
) => {
    const maxAgeInSeconds = getTokenSecondsRemaining(token);


    await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
}


export async function isTokenExpiringSoon(token: string, thresholdInSeconds = 300): Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}


export async function isTokenExpired(token: string): Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds === 0;
}




export const getTokenSecondsRemaining = (token: string): number => {
    if (!token) return 0;

    try {
        let payload: JwtPayload | null;

        try {
            payload = jwt.verify(token, envVars.ACCESS_TOKEN_SECRET) as JwtPayload;
        } catch {
            payload = jwt.decode(token) as JwtPayload | null;
        }

        if (!payload?.exp) return 0;

        const now = Math.floor(Date.now() / 1000);
        const remaining = payload.exp - now;

        return remaining > 0 ? remaining : 0;
    } catch {
        return 0;
    }
};