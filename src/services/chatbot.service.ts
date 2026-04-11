"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ChatbotResponse, Conversation, SendMessageRequest } from "@/types/chatbot.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const chatbotService = {
  async sendMessage(payload: SendMessageRequest): Promise<ChatbotResponse> {
    const response = await httpClient.post(`${BASE_URL}/chatbot/send`, payload);
    return (response.data as { data: ChatbotResponse }).data;
  },

  async getChatHistory(limit: number = 50): Promise<Conversation[]> {
    const response = await httpClient.get(`${BASE_URL}/chatbot/history`, {
      params: { limit },
    });
    return (response.data as { data: Conversation[] }).data;
  },

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await httpClient.get(`${BASE_URL}/chatbot/conversations/${conversationId}`);
    return (response.data as { data: Conversation }).data;
  },

  async clearChatHistory(): Promise<{ deletedCount: number }> {
    const response = await httpClient.delete(`${BASE_URL}/chatbot/history`);
    return (response.data as { data: { deletedCount: number } }).data;
  },

  async saveConversation(conversationId: string, title: string): Promise<Conversation> {
    const response = await httpClient.patch(`${BASE_URL}/chatbot/conversations/${conversationId}/save`, {
      title,
    });
    return (response.data as { data: Conversation }).data;
  },
};
