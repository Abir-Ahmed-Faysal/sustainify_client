"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home, Mail } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to external service (e.g., Sentry, LogRocket)
    console.error("Error caught by error boundary:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto">
            An unexpected error occurred. Our team has been notified and we&apos;re working to fix it.
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-left max-w-lg mx-auto">
              <p className="text-sm font-mono text-red-800 dark:text-red-300 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-700 dark:text-red-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </div>

          {/* Support Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              Need Support?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              If this problem persists, please contact our support team:
            </p>
            <a
              href="mailto:support@sustainify.com"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
            >
              support@sustainify.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
