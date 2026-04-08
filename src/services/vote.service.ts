/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

export interface VoteResponse {
  id?: string;
  userId?: string;
  ideaId?: string;
  type?: "UP" | "DOWN";
  createdAt?: string;
  action?: "VOTED" | "REMOVED";
  idea?: {
    id: string;
    totalUpVotes: number;
    totalDownVotes: number;
    positiveRatio: number;
    isFeatured: boolean;
    [key: string]: any;
  };
}

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

// Vote on an idea (toggles between UP/DOWN)
export const toggleVote = async (
  ideaId: string,
  type: "UP" | "DOWN"
): Promise<ApiResponse<VoteResponse | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.post<VoteResponse>(
      "/votes",
      { ideaId, type },
      { headers }
    );

    if (!response.data) {
      return { success: false, message: "Failed to vote", data: null };
    }

    return { success: true, message: "Vote recorded", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to vote", data: null };
  }
};
