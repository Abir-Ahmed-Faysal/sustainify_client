"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { IIdea, IIdeaQuery } from "@/types/idea.types";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

export const getIdeas = async (filters: IIdeaQuery = {}): Promise<ApiResponse<IIdea[]>> => {
    const params: IIdeaQuery = { ...filters };

    // axios handles params serialization
    return httpClient.get<IIdea[]>("/ideas", { params: params as Record<string, any> });
};



// services/idea.service.ts

export const getIdeaById = async (
  id: string
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const cookieStore =await cookies();
    const accessToken =  cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get ("refreshToken")?.value;

    const response = await httpClient.get<IIdea>(`/ideas/${id}`, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    if (!response.data) {
      return {
        success: false,
        message: "Idea not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Idea fetched successfully",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "External server error",
      data: null,
    };
  }
};


// For Server Component Prefetching (Node.js fetch)
export const prefetchIdeas = async (filters: IIdeaQuery = {}): Promise<ApiResponse<IIdea[]>> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const queryString = new URLSearchParams(filters as Record<string, string>).toString();
    const url = `${baseUrl}/ideas?${queryString}`;

    const res = await fetch(url, {
        next: { revalidate: 60 }
    });

    if (!res.ok) {
        throw new Error("Failed to prefetch ideas");
    }

    return res.json();
};

// CREATE: Create a new idea
export const createIdea = async (payload: any): Promise<ApiResponse<IIdea>> => {
    return httpClient.post<IIdea>("/ideas", payload);
};

// UPDATE: Update an existing idea
export const updateIdea = async (id: string, payload: any): Promise<ApiResponse<IIdea>> => {
    return httpClient.patch<IIdea>(`/ideas/${id}`, payload);
};

// DELETE: Delete an idea
export const deleteIdea = async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return httpClient.delete<{ message: string }>(`/ideas/${id}`);
};

// GET: Get current user's ideas
export const getMyIdeas = async (): Promise<ApiResponse<IIdea[]>> => {
    return httpClient.get<IIdea[]>("/ideas/my-ideas");
};

// VOTING: Upvote an idea
export const upvoteIdea = async (ideaId: string): Promise<ApiResponse<any>> => {
    return httpClient.post("/votes", { ideaId, voteType: "UPVOTE" });
};

// VOTING: Downvote an idea
export const downvoteIdea = async (ideaId: string): Promise<ApiResponse<any>> => {
    return httpClient.post("/votes", { ideaId, voteType: "DOWNVOTE" });
};

// VOTING: Remove vote from an idea
export const removeVote = async (ideaId: string): Promise<ApiResponse<any>> => {
    return httpClient.delete(`/votes/${ideaId}`);
};
