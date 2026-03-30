/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { IIdea, IIdeaQuery } from "@/types/idea.types";
import { ApiResponse } from "@/types/api.types";

export const getIdeas = async (filters: IIdeaQuery = {}): Promise<ApiResponse<IIdea[]>> => {
    const params: IIdeaQuery = { ...filters };
    
    // axios handles params serialization
    return httpClient.get<IIdea[]>("/ideas", { params: params as Record<string, any> });
};

export const getIdeaById = async (id: string): Promise<ApiResponse<IIdea>> => {
    return httpClient.get<IIdea>(`/ideas/${id}`);
};

// For Server Component Prefetching (Node.js fetch)
export const prefetchIdeas = async (filters: IIdeaQuery = {}): Promise<ApiResponse<IIdea[]>> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const queryString = new URLSearchParams(filters as Record<string, string>).toString();
    const url = `${baseUrl}/ideas?${queryString}`;

    const res = await fetch(url, {
        next: { revalidate: 60 } // or whatever revalidation strategy
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
    return httpClient.put<IIdea>(`/ideas/${id}`, payload);
};

// DELETE: Delete an idea
export const deleteIdea = async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return httpClient.delete<{ message: string }>(`/ideas/${id}`);
};

// GET: Get current user's ideas
export const getMyIdeas = async (): Promise<ApiResponse<IIdea[]>> => {
    return httpClient.get<IIdea[]>("/ideas/my-ideas");
};
