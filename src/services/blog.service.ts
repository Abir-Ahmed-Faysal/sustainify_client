"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IBlog, IBlogCreate, IBlogUpdate, IBlogQuery } from "@/types/blog.types";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

const getCookieHeaders = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
  
    return {
      Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    };
  };

// GET: All blogs
export const getAllBlogs = async (params: IBlogQuery = {}): Promise<ApiResponse<IBlog[]>> => {
  const queryString = new URLSearchParams(params as any).toString();
  const url = `/blogs?${queryString}`;
  try {
    const response = await httpClient.get<IBlog[]>(url);
    return { success: true, message: "Blogs fetched successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch blogs", data: [] };
  }
};

// GET: Single blog by ID
export const getBlogById = async (id: string): Promise<ApiResponse<IBlog | null>> => {
    try {
      const response = await httpClient.get<IBlog>(`/blogs/${id}`);
      return { success: true, message: "Blog fetched successfully", data: response.data };
    } catch (error: any) {
      return { success: false, message: error?.message || "Failed to fetch blog", data: null };
    }
  };

// GET: Single blog by slug
export const getBlogBySlug = async (slug: string): Promise<ApiResponse<IBlog | null>> => {
  try {
    const response = await httpClient.get<IBlog>(`/blogs/slug/${slug}`);
    return { success: true, message: "Blog fetched successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch blog", data: null };
  }
};

// ADMIN: Create blog
export const createBlog = async (payload: IBlogCreate): Promise<ApiResponse<IBlog | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.post<IBlog>("/blogs", payload, { headers });
    return { success: true, message: "Blog created successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create blog", data: null };
  }
};

// ADMIN: Update blog
export const updateBlog = async (id: string, payload: IBlogUpdate): Promise<ApiResponse<IBlog | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.patch<IBlog>(`/blogs/${id}`, payload, { headers });
    return { success: true, message: "Blog updated successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update blog", data: null };
  }
};

// ADMIN: Delete blog
export const deleteBlog = async (id: string): Promise<ApiResponse<{ message: string } | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.delete<{ message: string }>(`/blogs/${id}`, { headers });
    return { success: true, message: "Blog deleted successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete blog", data: null };
  }
};
