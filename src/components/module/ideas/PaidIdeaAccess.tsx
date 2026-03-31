"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { createCheckoutSession } from "@/services/access.service";

interface Props {
  ideaId: string;
  price: number;
  title: string;
  isLoggedIn: boolean;
}

export default function PaidIdeaAccess({
  ideaId,
  price,
  title,
  isLoggedIn,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const res = await createCheckoutSession(ideaId);

      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-amber-50">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Premium Content
      </h3>

      <p className="mb-4">
        Unlock full access to <b>{title}</b>
      </p>

      <p className="text-2xl font-bold mb-4">${price.toFixed(2)}</p>

      {!isLoggedIn ? (
        <Button asChild className="w-full">
          <Link href={`/login?redirect=/ideas/${ideaId}`}>
            Login to Purchase
          </Link>
        </Button>
      ) : (
        <Button onClick={handlePurchase} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Purchase Access"
          )}
        </Button>
      )}
    </div>
  );
}