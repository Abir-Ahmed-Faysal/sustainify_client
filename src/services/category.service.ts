"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ICategory } from "@/types/category.types";
import { ApiResponse } from "@/types/api.types";
import { cookies } from "next/headers";

export interface GetCategoriesParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CategoriesResponse {
    success: boolean;
    message: string;
    data: ICategory[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const getCategories = async (params?: GetCategoriesParams): Promise<CategoriesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const query = queryParams.toString();
    const url = `/categories${query ? '?' + query : ''}`;
    
    const headers = await getCookieHeaders();
    return httpClient.get<ICategory[]>(url, { headers }) as Promise<CategoriesResponse>;
};

// For Server Component Prefetching (Node.js fetch)
export const prefetchCategories = async (): Promise<CategoriesResponse> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseUrl}/categories?limit=1000`;

    const res = await fetch(url, {
        next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
        throw new Error("Failed to prefetch categories");
    }

    return res.json();
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
        const headers = await getCookieHeaders();
        const response = await httpClient.get<ICategory>(`/categories/${id}`, { headers });

        if (!response.data) {
            return { success: false, message: "Category not found", data: null };
        }

        return { success: true, message: "Category fetched successfully", data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to fetch category", data: null };
    }
};
