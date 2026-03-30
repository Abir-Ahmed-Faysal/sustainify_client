/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { UserProfile } from "@/types/profile.types";
import { ApiResponse } from "@/types/api.types";

// Get user profile (client-side)
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
    return httpClient.get<UserProfile>("/profile");
};

// Update user profile (client-side)
export const updateUserProfile = async (payload: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    return httpClient.patch<UserProfile>("/profile", payload);
};

// For Server Component Prefetching (Node.js fetch)
export const prefetchUserProfile = async (accessToken: string): Promise<ApiResponse<UserProfile>> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/profile`;

    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Cookie": `accessToken=${accessToken}`,
            },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });

        if (!res.ok) {
            throw new Error("Failed to prefetch user profile");
        }

        return res.json();
    } catch (error) {
        console.error("Error prefetching profile:", error);
        throw error;
    }
};
