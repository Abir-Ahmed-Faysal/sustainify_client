import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export const checkIdeaAccess = async (ideaId: string): Promise<ApiResponse<boolean>> => {
    return httpClient.get<boolean>(`/access/${ideaId}`);
};

export const getMyAccessibleIdeas = async (): Promise<ApiResponse<string[]>> => {
    return httpClient.get<string[]>(`/access/my`);
};

export const createCheckoutSession = async (ideaId: string): Promise<ApiResponse<{ sessionId: string; url: string }>> => {
    return httpClient.post(`/payment/create-checkout-session`, { ideaId });
};
