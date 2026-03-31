/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IIdea, IIdeaQuery } from "@/types/idea.types";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

export const adminDashboardIdeas = async (
  filters: IIdeaQuery = {}
): Promise<ApiResponse<IIdea[]>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const queryString = new URLSearchParams(filters as Record<string, string>).toString();
  const url = `${baseUrl}/ideas?${queryString}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to prefetch ideas");
  return res.json();
};

export const prefetchIdeas = async (
  filters: IIdeaQuery = {}
): Promise<ApiResponse<IIdea[]>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const queryString = new URLSearchParams(filters as Record<string, string>).toString();
  const url = `${baseUrl}/ideas?${queryString}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to prefetch ideas");
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

export const getIdeaById = async (id: string): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();
    return await httpClient.get<IIdea | null>(`/ideas/${id}`, { headers });
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

export const createIdea = async (payload: any): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();
    return await httpClient.post<IIdea | null>("/ideas", payload, { headers });
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

export const updateIdea = async (
  id: string,
  payload: any
): Promise<ApiResponse<IIdea | null>> => {
  try {
    const headers = await getCookieHeaders();
    return await httpClient.patch<IIdea | null>(`/ideas/${id}`, payload, { headers });
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

export const deleteIdea = async (
  id: string
): Promise<ApiResponse<{ message: string } | null>> => {
  try {
    const headers = await getCookieHeaders();
    return await httpClient.delete<{ message: string } | null>(`/ideas/${id}`, { headers });
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

export const getMyIdeas = async (): Promise<ApiResponse<IIdea[] | null>> => {
  try {
    const headers = await getCookieHeaders();
    return await httpClient.get<IIdea[] | null>("/ideas/my-ideas", { headers });
  } catch (error: any) {
    return { success: false, message: error?.message || "External server error", data: null };
  }
};

