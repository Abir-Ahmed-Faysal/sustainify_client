/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ICategory } from "@/types/category.types";
import { ApiResponse } from "@/types/api.types";
// import { cookies } from "next/headers"; // Moved to function level

export const getCategories = async (): Promise<ApiResponse<ICategory[]>> => {
    return httpClient.get<ICategory[]>("/categories");
};

// For Server Component Prefetching (Node.js fetch)
export const prefetchCategories = async (): Promise<ApiResponse<ICategory[]>> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/categories`;

    const res = await fetch(url, {
        next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
        throw new Error("Failed to prefetch categories");
    }

    return res.json();
};

const getCookieHeaders = async () => {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    return {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    };
};

// POST: Create new category
export const createCategory = async (
    data: Omit<ICategory, "id" | "createdAt">
): Promise<ApiResponse<ICategory>> => {
    try {
        const headers = await getCookieHeaders();
        const response = await httpClient.post<ICategory>("/categories", data, { headers });

        return {
            success: true,
            message: "Category created successfully",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error?.message || "Failed to create category",
            data: {} as ICategory,
        };
    }
};

// PATCH: Update category
export const updateCategory = async (
    id: string,
    data: Partial<Omit<ICategory, "id" | "createdAt">>
): Promise<ApiResponse<ICategory>> => {
    try {
        const headers = await getCookieHeaders();
        const response = await httpClient.patch<ICategory>(`/categories/${id}`, data, { headers });

        return {
            success: true,
            message: "Category updated successfully",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error?.message || "Failed to update category",
            data: {} as ICategory,
        };
    }
};

// DELETE: Delete category
export const deleteCategory = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const headers = await getCookieHeaders();
        await httpClient.delete(`/categories/${id}`, { headers });

        return {
            success: true,
            message: "Category deleted successfully",
            data: null,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error?.message || "Failed to delete category",
            data: null,
        };
    }
};

// GET: Get single category
export const getCategoryById = async (id: string): Promise<ApiResponse<ICategory | null>> => {
    try {
        const response = await httpClient.get<ICategory>(`/categories/${id}`);

        if (!response.data) {
            return { success: false, message: "Category not found", data: null };
        }

        return { success: true, message: "Category fetched successfully", data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to fetch category", data: null };
    }
};
