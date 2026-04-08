/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

export interface IComment {
  id: string;
  content: string;
  ideaId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    profile?: {
      avatar?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

export interface ICreateCommentPayload {
  content: string;
  ideaId: string;
  parentId?: string;
}

export interface IUpdateCommentPayload {
  content: string;
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

// Create a new comment
export const createComment = async (
  payload: ICreateCommentPayload
): Promise<ApiResponse<IComment>> => {
  const headers = await getCookieHeaders();
  return httpClient.post<IComment>("/comments", payload, { headers });
};

// Get all comments for an idea
export const getCommentsByIdeaId = async (
  ideaId: string
): Promise<ApiResponse<IComment[]>> => {
  const headers = await getCookieHeaders();
  return httpClient.get<IComment[]>(`/comments/idea/${ideaId}`, { headers });
};

// Update a comment
export const updateComment = async (
  commentId: string,
  payload: IUpdateCommentPayload
): Promise<ApiResponse<IComment>> => {
  const headers = await getCookieHeaders();
  return httpClient.patch<IComment>(`/comments/${commentId}`, payload, { headers });
};

// Delete a comment
export const deleteComment = async (
  commentId: string
): Promise<ApiResponse<any>> => {
  const headers = await getCookieHeaders();
  return httpClient.delete(`/comments/${commentId}`, { headers });
};

