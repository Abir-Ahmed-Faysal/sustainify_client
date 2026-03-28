/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { createCheckoutSession } from "@/services/access.service";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/lib/errorUtils";

interface PaidIdeaAccessProps {
    ideaId: string;
    price: number;
    title: string;
}

export default function PaidIdeaAccess({ ideaId, price, title }: PaidIdeaAccessProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handlePurchase = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createCheckoutSession(ideaId);
            
            if (response.data?.url) {
                // Redirect to payment page
                window.location.href = response.data.url;
            } else if (response.data?.sessionId) {
                // Alternative: if backend returns only session ID, construct URL
                window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
            } else {
                setError("Failed to create payment session");
            }
        } catch (err: any) {
            console.error("Payment error:", err);
            const errorMessage = extractErrorMessage(err, "Failed to initiate payment. Please try again.");
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                    Premium Content
                </h3>
            </div>
            
            <p className="text-amber-800 dark:text-amber-200 mb-4">
                This is a premium resource. Purchase access to view the full content and insights.
            </p>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-4">
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
            )}

            <div className="mb-4">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    ${price.toFixed(2)}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    One-time purchase for ${title}
                </p>
            </div>

            <Button
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 h-auto"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 mr-2" />
                        Purchase Access
                    </>
                )}
            </Button>

            <p className="text-xs text-amber-700 dark:text-amber-300 mt-3 text-center">
                Secure payment powered by Stripe
            </p>
        </div>
    );
}
