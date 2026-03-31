/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from "@/lib/axios/httpClient";
import { IIdea, IIdeaQuery } from "@/types/idea.types";
import { ApiResponse } from "@/types/api.types";
 





// Client-safe idea APIs (uses browser cookies via `withCredentials`)
export const getIdeas = async (
  filters: IIdeaQuery = {}
): Promise<ApiResponse<IIdea[]>> => {
  try {
    return await httpClient.get<IIdea[]>("/ideas", { params: filters as any });
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch ideas", data: [] };
  }
};

export const getIdeaByIdClient = async (
  id: string
): Promise<ApiResponse<IIdea | null>> => {
  try {
    return await httpClient.get<IIdea | null>(`/ideas/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch idea", data: null };
  }
};

// Back-compat alias used across client pages/components
export const getIdeaById = getIdeaByIdClient;

export const createIdea = async (payload: any): Promise<ApiResponse<IIdea | null>> => {
  try {
    return await httpClient.post<IIdea | null>("/ideas", payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create idea", data: null };
  }
};

export const updateIdea = async (
  id: string,
  payload: any
): Promise<ApiResponse<IIdea | null>> => {
  try {
    return await httpClient.patch<IIdea | null>(`/ideas/${id}`, payload);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update idea", data: null };
  }
};

export const deleteIdea = async (
  id: string
): Promise<ApiResponse<{ message: string } | null>> => {
  try {
    return await httpClient.delete<{ message: string } | null>(`/ideas/${id}`);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete idea", data: null };
  }
};

export const getMyIdeas = async (): Promise<ApiResponse<IIdea[] | null>> => {
  try {
    return await httpClient.get<IIdea[] | null>("/ideas/my-ideas");
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch my ideas", data: null };
  }
};







