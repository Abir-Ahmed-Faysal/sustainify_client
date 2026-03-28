import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface NewsletterSubscribePayload {
    email: string;
}

export const subscribeNewsletter = async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return httpClient.post("/newsLetters/subscribe", { email });
};
