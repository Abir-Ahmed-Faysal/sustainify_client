"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full flex items-center justify-center overflow-hidden bg-slate-50/50 dark:bg-slate-950 px-6 py-12">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-12 w-96 h-96 bg-emerald-200/40 dark:bg-emerald-900/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute -bottom-24 -right-12 w-[30rem] h-[30rem] bg-teal-200/40 dark:bg-teal-900/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-50/50 dark:bg-slate-950"></div>

      {/* Decorative SVG Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none overflow-hidden select-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="dark:text-emerald-500 text-emerald-800">
          <defs>
            <pattern id="leaf-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
               <path d="M60,30 C35,30 15,50 15,75 C15,100 35,115 60,115 C85,115 105,100 105,75 C105,50 85,30 60,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

