"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

const getCookieHeaders = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const cookieParts: string[] = [];
    if (accessToken) {
        cookieParts.push(`accessToken=${accessToken}`);
    }
    if (refreshToken) {
        cookieParts.push(`refreshToken=${refreshToken}`);
    }

    const headers: Record<string, string> = {};
    if (cookieParts.length > 0) {
        headers.Cookie = cookieParts.join("; ");
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
};

export const checkIdeaAccess = async (ideaId: string): Promise<ApiResponse<boolean>> => {
    const headers = await getCookieHeaders();
    return httpClient.get<boolean>(`/access/${ideaId}`, { headers });
};

export interface IAccessIdeaRecord {
    id: string;
    title: string;
    problemStatement: string;
    description: string;
    image?: string | null;
    isPaid: boolean;
    status: string;
    authorId: string;
    categoryId: string;
    positiveRatio: number;
    negativeRatio?: number;
    createdAt: string;
    category: {
        id: string;
        name: string;
    };
    author: {
        id: string;
        name: string;
        email: string;
    };
    [key: string]: any;
}

export const getMyAccessibleIdeas = async (): Promise<ApiResponse<Array<{ idea: IAccessIdeaRecord }>>> => {
    const headers = await getCookieHeaders();
    return httpClient.get<Array<{ idea: IAccessIdeaRecord }>>(`/access/my`, { headers });
};

export const createCheckoutSession = async (ideaId: string): Promise<ApiResponse<{ url: string | null }>> => {
    const headers = await getCookieHeaders();
    return httpClient.post(`/payment/create-checkout-session`, { ideaId }, { headers });
};
