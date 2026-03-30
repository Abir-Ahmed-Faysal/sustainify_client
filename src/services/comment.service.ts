/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

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

// Create a new comment
export const createComment = async (
  payload: ICreateCommentPayload
): Promise<ApiResponse<IComment>> => {
  return httpClient.post<IComment>("/comments", payload);
};

// Get all comments for an idea
export const getCommentsByIdeaId = async (
  ideaId: string
): Promise<ApiResponse<IComment[]>> => {
  return httpClient.get<IComment[]>(`/comments/idea/${ideaId}`);
};

// Update a comment
export const updateComment = async (
  commentId: string,
  payload: IUpdateCommentPayload
): Promise<ApiResponse<IComment>> => {
  return httpClient.patch<IComment>(`/comments/${commentId}`, payload);
};

// Delete a comment
export const deleteComment = async (
  commentId: string
): Promise<ApiResponse<any>> => {
  return httpClient.delete(`/comments/${commentId}`);
};
