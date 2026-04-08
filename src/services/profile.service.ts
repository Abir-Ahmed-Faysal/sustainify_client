/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { UserProfile } from "@/types/profile.types";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

// Get user profile (client-side)
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
    const headers = await getCookieHeaders();
    return httpClient.get<UserProfile>("/profile", { headers });
};

// Update user profile (server-side) - All fields optional
export const updateUserProfile = async (payload: {
  name?: string;
  avatar?: string | null;
  bio?: string | null;
  address?: string | null;
}): Promise<ApiResponse<UserProfile | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.patch<UserProfile>("/profile", payload, { headers });

    if (!response.data) {
      return { success: false, message: "Failed to update profile", data: null };
    }

    // Revalidate profile-related pages to refresh cached data
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/"); // Update navbar info

    return { success: true, message: "Profile updated successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
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
            next: { revalidate: 0 } // Bypass cache to ensure fresh data
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
