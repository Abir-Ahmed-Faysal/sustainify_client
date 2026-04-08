"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

/**
 * Submit a contact form message
 */
export const submitContactMessage = async (
  data: ContactPayload
): Promise<ApiResponse<ContactResponse>> => {
  return httpClient.post<ContactResponse>("/contact", data);
};
