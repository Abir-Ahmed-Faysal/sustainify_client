"use client";

import ChatbotWidget from "@/components/module/chatbot/ChatbotWidget";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            💬 Sustainify AI Assistant
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Ask me anything about sustainable ideas, how to create ideas, or explore our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Widget */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 h-[600px]">
              <ChatbotWidget embedded={false} />
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                💡 Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Ask about sustainability topics</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Get personalized idea recommendations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Learn how to create and share ideas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Explore trending ideas in our community</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Get help navigating the platform</span>
                </li>
              </ul>
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                🌍 Example Questions
              </h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200 font-medium">
                <li className="cursor-pointer hover:underline">
                  • "Show me trending sustainable ideas"
                </li>
                <li className="cursor-pointer hover:underline">• "How do I create an idea?"</li>
                <li className="cursor-pointer hover:underline">
                  • "What categories are available?"
                </li>
                <li className="cursor-pointer hover:underline">• "Tell me about sustainability"</li>
                <li className="cursor-pointer hover:underline">
                  • "How does the voting system work?"
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ℹ️ About
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Sustainify AI is your personal guide to explore sustainable ideas and learn how to
                make a positive impact on the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
