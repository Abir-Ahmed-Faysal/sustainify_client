"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

const getCookieHeaders = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const cookieParts: string[] = [];
    if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
    if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);

    return {
        Cookie: cookieParts.join("; "),
    };
};

export interface NewsletterSubscribePayload {
    email: string;
}

export const subscribeNewsletter = async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const headers = await getCookieHeaders();
    return httpClient.post("/newsLetters/subscribe", { email }, { headers });
};
