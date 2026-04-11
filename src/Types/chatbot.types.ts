export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestedIdeas?: string[];
  actionType?: string;
}

export interface ChatbotResponse {
  conversationId: string;
  message: ChatMessage;
  conversationTitle: string;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

export interface SendMessageRequest {
  message: string;
  conversationId?: string;
}
