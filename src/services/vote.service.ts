/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface VoteResponse {
  id: string;
  userId: string;
  ideaId: string;
  type: "UP" | "DOWN";
  createdAt: string;
}

// Vote on an idea (toggles between UP/DOWN)
export const toggleVote = async (
  ideaId: string,
  type: "UP" | "DOWN"
): Promise<ApiResponse<VoteResponse | null>> => {
  try {
    const response = await httpClient.post<VoteResponse>("/votes", {
      ideaId,
      type,
    });

    if (!response.data) {
      return { success: false, message: "Failed to vote", data: null };
    }

    return { success: true, message: "Vote recorded", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to vote", data: null };
  }
};



// Toggle favorite
export const toggleFavorite = async (ideaId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await httpClient.post("/favourites", {
      ideaId,
    });

    if (!response.data) {
      return { success: false, message: "Failed to toggle favorite", data: null };
    }

    return { success: true, message: "Favorite toggled", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to toggle favorite", data: null };
  }
};

// Get user's favorites
export const getMyFavorites = async (): Promise<ApiResponse<any[] | null>> => {
  try {
    const response = await httpClient.get<any[]>("/favourites/my-favourites");

    return {
      success: true,
      message: "Favorites fetched",
      data: response.data || [],
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch favorites", data: null };
  }
};
