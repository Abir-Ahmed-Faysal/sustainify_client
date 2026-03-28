"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const ideaId = searchParams.get("ideaId");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-900/30 rounded-full animate-pulse"></div>
            <CheckCircle className="w-20 h-20 text-emerald-600 dark:text-emerald-400 relative z-10" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-2">
          Thank you for your purchase.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Your access to the premium idea has been activated.
        </p>

        {/* Details */}
        {ideaId && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Idea ID:</span> {ideaId}
            </p>
          </div>
        )}

        {/* Status Message */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {isRedirecting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to dashboard...
              </span>
            ) : (
              "Redirecting to your pursued ideas in 3 seconds..."
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link href="/dashboard" className="flex items-center justify-center gap-2">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full"
          >
            <Link href="/ideas">Browse More Ideas</Link>
          </Button>
        </div>

        {/* Footer Message */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          Check your email for a receipt and access details.
        </p>
      </div>
    </div>
  );
}
