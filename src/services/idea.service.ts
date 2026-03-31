"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { IIdea, IIdeaQuery } from "@/types/idea.types";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";





export const adminDashboardIdeas = async (filters: IIdeaQuery = {}): Promise<ApiResponse<IIdea[]>> => {
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




// services/idea.service.ts



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


const getCookieHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  return {
    Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
  };
};

// GET: Get idea by ID
export const getIdeaById = async (
  id: string
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.get<IIdea>(`/ideas/${id}`, { headers });

    if (!response.data) {
      return { success: false, message: "Idea not found", data: null };
    }

    return { success: true, message: "Idea fetched successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// CREATE: Create a new idea
export const createIdea = async (payload: any): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.post<IIdea>("/ideas", payload, { headers });

    if (!response.data) {
      return { success: false, message: "Failed to create idea", data: null };
    }

    return { success: true, message: "Idea created successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// UPDATE: Update an existing idea
export const updateIdea = async (
  id: string,
  payload: any
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.patch<IIdea>(`/ideas/${id}`, payload, { headers });

    if (!response.data) {
      return { success: false, message: "Failed to update idea", data: null };
    }

    return { success: true, message: "Idea updated successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// DELETE: Delete an idea
export const deleteIdea = async (
  id: string
): Promise<ApiResponse<{ message: string } | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.delete<{ message: string }>(`/ideas/${id}`, { headers });

    return { success: true, message: response.data?.message || "Idea deleted", data: response.data || null };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// GET: Current user's ideas
export const getMyIdeas = async (): Promise<ApiResponse<IIdea[] | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.get<IIdea[]>("/ideas/my-ideas", { headers });

    return { success: true, message: "My ideas fetched successfully", data: response.data || [] };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// VOTING: Upvote an idea
export const upvoteIdea = async (ideaId: string): Promise<ApiResponse<any>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.post("/votes", { ideaId, voteType: "UPVOTE" }, { headers });

    return { success: true, message: "Upvoted successfully", data: response.data || null };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// VOTING: Downvote an idea
export const downvoteIdea = async (ideaId: string): Promise<ApiResponse<any>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.post("/votes", { ideaId, voteType: "DOWNVOTE" }, { headers });

    return { success: true, message: "Downvoted successfully", data: response.data || null };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// VOTING: Remove vote
export const removeVote = async (ideaId: string): Promise<ApiResponse<any>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.delete(`/votes/${ideaId}`, { headers });

    return { success: true, message: "Vote removed successfully", data: response.data || null };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};







