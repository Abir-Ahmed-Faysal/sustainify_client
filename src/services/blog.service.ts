"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IBlog, IBlogCreate, IBlogUpdate, IBlogQuery } from "@/types/blog.types";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

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

// GET: All blogs
export const getAllBlogs = async (params: IBlogQuery = {}): Promise<ApiResponse<IBlog[]>> => {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  const url = `/blogs?${queryString}`;
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.get<IBlog[]>(url, { headers });
    return { success: true, message: "Blogs fetched successfully", data: response.data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blogs";
    return { success: false, message, data: [] };
  }
};

// GET: Single blog by ID
export const getBlogById = async (id: string): Promise<ApiResponse<IBlog | null>> => {
    try {
      const headers = await getCookieHeaders();
      const response = await httpClient.get<IBlog>(`/blogs/${id}`, { headers });
      return { success: true, message: "Blog fetched successfully", data: response.data };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch blog";
      return { success: false, message, data: null };
    }
  };

// GET: Single blog by slug
export const getBlogBySlug = async (slug: string): Promise<ApiResponse<IBlog | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.get<IBlog>(`/blogs/slug/${slug}`, { headers });
    return { success: true, message: "Blog fetched successfully", data: response.data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch blog";
    return { success: false, message, data: null };
  }
};

// ADMIN: Create blog
export const createBlog = async (payload: IBlogCreate): Promise<ApiResponse<IBlog | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.post<IBlog>("/blogs", payload, { headers });
    return { success: true, message: "Blog created successfully", data: response.data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create blog";
    return { success: false, message, data: null };
  }
};

// ADMIN: Update blog
export const updateBlog = async (id: string, payload: IBlogUpdate): Promise<ApiResponse<IBlog | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.patch<IBlog>(`/blogs/${id}`, payload, { headers });
    return { success: true, message: "Blog updated successfully", data: response.data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update blog";
    return { success: false, message, data: null };
  }
};

// ADMIN: Delete blog
export const deleteBlog = async (id: string): Promise<ApiResponse<{ message: string } | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.delete<{ message: string }>(`/blogs/${id}`, { headers });
    return { success: true, message: "Blog deleted successfully", data: response.data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete blog";
    return { success: false, message, data: null };
  }
};
