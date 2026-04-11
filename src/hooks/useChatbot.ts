import { useCallback, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatbotService } from "@/services/chatbot.service";
import { ChatMessage, Conversation, SendMessageRequest } from "@/types/chatbot.types";
import { toast } from "sonner";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messageCountRef = useRef(0);
  const queryClient = useQueryClient();

  // Load conversation history
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["chat-history"],
    queryFn: () => chatbotService.getChatHistory(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (payload: SendMessageRequest) => chatbotService.sendMessage(payload),
    onSuccess: (data) => {
      setConversationId(data.conversationId);
      setMessages((prev) => [...prev, data.message]);
      messageCountRef.current += 1;
      setError(null);
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Load single conversation
  const { data: currentConversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => conversationId ? chatbotService.getConversation(conversationId) : Promise.resolve(null),
    enabled: !!conversationId,
  });

  // Clear history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: () => chatbotService.clearChatHistory(),
    onSuccess: () => {
      setMessages([]);
      setConversationId(null);
      messageCountRef.current = 0;
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Chat history cleared");
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear history";
      toast.error(errorMessage);
    },
  });

  // Save conversation mutation
  const saveConversationMutation = useMutation({
    mutationFn: (title: string) => {
      if (!conversationId) {
        return Promise.reject(new Error("No active conversation to save"));
      }
      return chatbotService.saveConversation(conversationId, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Conversation saved");
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : "Failed to save conversation";
      toast.error(errorMessage);
    },
  });

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      try {
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}_user`,
          role: "user",
          content: message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        await sendMessageMutation.mutateAsync({
          message: message.trim(),
          conversationId: conversationId || undefined,
        });
      } catch (error) {
        // Error is handled by mutation's onError handler
        console.error("Error sending message:", error);
      }
    },
    [conversationId, sendMessageMutation]
  );

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    messageCountRef.current = 0;
    setError(null);
  }, []);

  return {
    messages,
    conversationId,
    error,
    isLoading: sendMessageMutation.isPending,
    isLoadingHistory,
    chatHistory: chatHistory || [],
    currentConversation,
    sendMessage,
    resetChat,
    clearHistory: () => clearHistoryMutation.mutate(),
    saveConversation: (title: string) => saveConversationMutation.mutate(title),
    isSavingConversation: saveConversationMutation.isPending,
  };
}
