/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { DashboardStats, IMemberStats } from "@/types/stats.types";
import { cookies } from "next/headers";




export const getStats = async (): Promise<ApiResponse<DashboardStats|IMemberStats|null>>=> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        const response = await httpClient.get<DashboardStats>('/stats', {
            headers: {
                Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
            }
        })

 if (!response.data) {
            return {
                success: false,
                message: "Idea not found",
                data: null,
            };
        }

        return {
            success: true,
            message: "Idea fetched successfully",
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "External server error",
            data: null,
        };
    }
}