export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Pagination
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiError {
    success: boolean;
    message: string;
}