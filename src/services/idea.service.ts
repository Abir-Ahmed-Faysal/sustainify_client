"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { IIdea, IIdeaCreate, IIdeaUpdate, IIdeaMemberStatus, IIdeaQuery } from "@/types/idea.types";
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

// GET: Get specific idea belonging to current user
export const getMyIdeaById = async (
  id: string
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.get<IIdea>(`/ideas/my-idea/${id}`, { headers });

    if (!response.data) {
      return { success: false, message: "Idea not found", data: null };
    }

    return { success: true, message: "Idea fetched successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

// CREATE: Create a new idea
export const createIdea = async (payload: IIdeaCreate): Promise<ApiResponse<IIdea | null>> => {
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

// UPDATE: Update idea content fields only (title, description, solution, etc.)
// ⚠️  Do NOT include status here — use changeIdeaStatus() for that
export const updateIdea = async (
  id: string,
  payload: IIdeaUpdate
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

// STATUS: Change idea status (member-facing: DRAFT ↔ UNDER_REVIEW)
// Matches server updateIdeaStatus schema — separate endpoint from content update
export const changeIdeaStatus = async (
  id: string,
  status: IIdeaMemberStatus
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.patch<IIdea>(`/ideas/${id}`, { status }, { headers });

    if (!response.data) {
      return { success: false, message: "Failed to change idea status", data: null };
    }

    return { success: true, message: "Idea status updated", data: response.data };
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

// ─── ADMIN OPERATIONS ───────────────────────────────────────────────────────

// ADMIN: Toggle idea featured status
export const toggleIdeaFeatured = async (
  ideaId: string,
  isFeatured: boolean
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.patch<IIdea>(
      `/ideas/${ideaId}`,
      { isFeatured },
      { headers }
    );

    if (!response.data) {
      return { success: false, message: "Failed to toggle featured status", data: null };
    }

    return {
      success: true,
      message: `Idea ${isFeatured ? "marked" : "unmarked"} as featured`,
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

// ADMIN: Update idea status with feedback (APPROVED, REJECTED, UNDER_REVIEW)
// Feedback is required when status is REJECTED
export const updateIdeaStatusByAdmin = async (
  ideaId: string,
  payload: { status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"; feedback?: string }
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.patch<IIdea>(
      `/ideas/${ideaId}`,
      payload,
      { headers }
    );

    if (!response.data) {
      return {
        success: false,
        message: "Failed to update idea status",
        data: null,
      };
    }

    return {
      success: true,
      message: `Idea status updated to ${payload.status}`,
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

// ADMIN: Get ideas with specific status for review
export const getIdeasByStatus = async (
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "DRAFT" = "UNDER_REVIEW"
): Promise<ApiResponse<IIdea[]>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/ideas?status=${status}`;

    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch ideas by status");
    }

    return res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch ideas",
      data: [],
    };
  }
};

// const changeIdeaStatusByAdmin =async (ideaId: string, status: string): Promise<ApiResponse<any>> => {




