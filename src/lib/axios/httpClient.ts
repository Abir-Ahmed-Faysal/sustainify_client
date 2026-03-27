/* eslint-disable @typescript-eslint/no-explicit-any */

import { envVars } from "@/config/env";
import { ApiError, ApiResponse } from "@/Types/api.types";
import axios, { AxiosInstance } from "axios";

/* ---------------------------------- */
/* ENV CONFIG */
/* ---------------------------------- */
const API_BASE_URL = envVars.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

/* ---------------------------------- */
/* TYPES */
export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}

/* ---------------------------------- */
/* SINGLETON AXIOS INSTANCE */
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

/* ---------------------------------- */
/* HTTP METHODS */
const httpGet = async <T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<T>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
            signal: options?.signal,
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw {
                success: false,
                message: error.response.data.message || "API Error",
                status: error.response.status,
                data: error.response.data,
            } as ApiError;
        }
        throw error;
    }
};

const httpPost = async <T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data, {
            headers: options?.headers,
            params: options?.params,
            signal: options?.signal,
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw {
                success: false,
                message: error.response.data.message || "API Error",
                status: error.response.status,
                data: error.response.data,
            } as ApiError;
        }
        throw error;
    }
};

const httpPatch = async <T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<T>>(endpoint, data, {
            headers: options?.headers,
            params: options?.params,
            signal: options?.signal,
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw {
                success: false,
                message: error.response.data.message || "API Error",
                status: error.response.status,
                data: error.response.data,
            } as ApiError;
        }
        throw error;
    }
};

const httpPut = async <T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance.put<ApiResponse<T>>(endpoint, data, {
            headers: options?.headers,
            params: options?.params,
            signal: options?.signal,
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw {
                success: false,
                message: error.response.data.message || "API Error",
                status: error.response.status,
                data: error.response.data,
            } as ApiError;
        }
        throw error;
    }
};

const httpDelete = async <T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<T>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
            signal: options?.signal,
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw {
                success: false,
                message: error.response.data.message || "API Error",
                status: error.response.status,
                data: error.response.data,
            } as ApiError;
        }
        throw error;
    }
};

/* ---------------------------------- */
/* EXPORT HTTP CLIENT */
export const httpClient = {
    get: httpGet,
    post: httpPost,
    patch: httpPatch,
    put: httpPut,
    delete: httpDelete,
};