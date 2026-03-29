/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import { ICategory } from "@/types/category.types";
import { ApiResponse } from "@/types/api.types";

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
