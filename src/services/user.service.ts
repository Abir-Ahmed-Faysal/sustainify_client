"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IUser } from "@/types/user.types";
import { cookies } from "next/headers";

// GET: Get all users (Build-safe version for public pre-rendering or ISR)
export const getPublicUsers = async (
  query: Record<string, string> = {}
): Promise<ApiResponse<IUser[]>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const queryString = new URLSearchParams(query).toString();
  const url = `${baseUrl}/users/public?${queryString}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      // Omit cookies to prevent dynamic server usage error during build
    });

    if (!res.ok) {
      throw new Error("Failed to fetch public users");
    }

    return res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch public users",
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

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

// GET: Get all users with pagination, search, and filter
export const getAllUsers = async (
  query: Record<string, string> = {}
): Promise<ApiResponse<IUser[]>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const queryString = new URLSearchParams(query).toString();
  const url = `${baseUrl}/users?${queryString}`;

  try {
    const headers = await getCookieHeaders();
    const res = await fetch(url, {
      headers: {
        ...headers,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch users",
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// GET: Get user by ID
export const getUserById = async (id: string): Promise<ApiResponse<IUser | null>> => {
  try {
    const headers = await getCookieHeaders();
    const response = await httpClient.get<IUser>(`/users/${id}`, { headers });

    if (!response.data) {
      return { success: false, message: "User not found", data: null };
    }

    return { success: true, message: "User fetched successfully", data: response.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch user", data: null };
  }
};

// ─── ADMIN OPERATIONS ───────────────────────────────────────────────────────

// ADMIN: Toggle user active/inactive status
export const toggleUserStatus = async (
  userId: string,
  isActive?: boolean
): Promise<ApiResponse<IUser | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.patch<IUser>(
      `/admin/users/${userId}/status`,
      { isActive },
      { headers }
    );

    if (!response.data) {
      return { success: false, message: "Failed to toggle user status", data: null };
    }

    return {
      success: true,
      message: `User ${response.data.isActive ? "activated" : "deactivated"} successfully`,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to toggle user status",
      data: null,
    };
  }
};

// ADMIN: Update user role
export const updateUserRole = async (
  userId: string,
  role: "ADMIN" | "MEMBER"
): Promise<ApiResponse<IUser | null>> => {
  try {
    const headers = await getCookieHeaders();

    const response = await httpClient.patch<IUser>(
      `/admin/users/${userId}/role`,
      { role },
      { headers }
    );

    return {
      success: true,
      message: "User role updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user role",
      data: null,
    };
  }
};

// ADMIN: Delete user
export const deleteUser = async (userId: string): Promise<ApiResponse<null>> => {
  try {
    const headers = await getCookieHeaders();

    await httpClient.delete(`/admin/users/${userId}`, { headers });

    return {
      success: true,
      message: "User deleted successfully",
      data: null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete user",
      data: null,
    };
  }
};
