"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, Minimize2, Maximize2, RefreshCw } from "lucide-react";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage as IChatMessage } from "@/types/chatbot.types";
import clsx from "clsx";

interface ChatbotWidgetProps {
  embedded?: boolean;
  position?: "bottom-right" | "bottom-left";
}

export default function ChatbotWidget({
  embedded = false,
  position = "bottom-right",
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(!embedded);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const { messages, isLoading, sendMessage, clearHistory, resetChat } = useChatbot();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput("");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear chat history?")) {
      clearHistory();
      resetChat();
    }
  };

  if (embedded && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          "fixed bottom-6 right-6 size-14 rounded-full bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 hover:scale-110",
          position === "bottom-left" && "right-auto left-6"
        )}
        title="Open chat"
      >
        💬
      </button>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-2xl",
        embedded
          ? clsx(
              "fixed z-50 w-96 h-[600px] border border-slate-200 dark:border-slate-700",
              position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"
            )
          : "w-full h-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center text-lg">
            🌱
          </div>
          <div>
            <h3 className="font-semibold">Sustainify AI</h3>
            <p className="text-xs opacity-90">Your sustainability guide</p>
          </div>
        </div>
        <div className="flex gap-2">
          {embedded && (
            <>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Close"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Container */}
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p className="text-lg mb-4">👋 Welcome to Sustainify AI!</p>
                  <p className="text-sm mb-4">
                    I'm here to help you explore sustainable ideas and learn about creating a better
                    future.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold mb-2">Try asking me about:</p>
                    <ul className="text-left space-y-1">
                      <li>• Sustainable ideas in different categories</li>
                      <li>• How to create and share your own idea</li>
                      <li>• Trending ideas in the community</li>
                      <li>• Tips for sustainability</li>
                    </ul>
                  </div>
                </div>
              ) : (
                messages.map((msg: IChatMessage) => (
                  <div
                    key={msg.id}
                    className={clsx(
                      "flex gap-2 animate-in fade-in-50 slide-in-from-bottom-2",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                        🤖
                      </div>
                    )}
                    <div
                      className={clsx(
                        "max-w-xs mx-2 p-3 rounded-lg",
                        msg.role === "user"
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={clsx(
                          "text-xs mt-1",
                          msg.role === "user" ? "opacity-70" : "opacity-60 dark:opacity-50"
                        )}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        👤
                      </div>
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    🤖
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
            {messages.length > 0 && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resetChat()}
                  className="flex-1 text-xs"
                >
                  <RefreshCw size={14} className="mr-1" />
                  New Chat
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} className="mr-1" />
                  Clear
                </Button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me something..."
                disabled={isLoading}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
