"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemType {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItemType[] = [
  {
    id: "1",
    question: "How do I submit my sustainability idea?",
    answer: "Simply log in or register, click 'Create Idea', fill in the required fields (title, problem statement, description, category), and submit for review. Our team typically reviews submissions within 48 hours.",
  },
  {
    id: "2",
    question: "Can I monetize my idea on Sustainify?",
    answer: "Yes! You can mark your idea as 'Paid' to set a price for access. Community members who value your solution can purchase it. You retain control over pricing and content.",
  },
  {
    id: "3",
    question: "How does the voting system work?",
    answer: "Members can upvote ideas they support or downvote if they have concerns. The net vote count helps rank ideas by community consensus. Your vote is private and helps personalize recommendations.",
  },
  {
    id: "4",
    question: "What makes an idea 'approved'?",
    answer: "Our admin team reviews submissions for relevance, feasibility, and compliance with community guidelines. Approved ideas gain visibility across the platform and can be voted on and commented by the community.",
  },
  {
    id: "5",
    question: "Is Sustainify free to use?",
    answer: "Yes, basic platform usage is completely free. You can browse, vote, comment, and submit ideas at no cost. Only premium ideas created by members have a price tag.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Frequently Asked <span className="text-emerald-600 dark:text-emerald-400">Questions</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Find answers to common questions about Sustainify and how to get started.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-left">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 transition-transform duration-300 ${
                    openId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <p className="px-6 py-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Still have questions?</p>
          <a
            href="/help"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            View Full FAQ →
          </a>
        </div>
      </div>
    </section>
  );
}
