"use client";

import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { subscribeNewsletter } from "@/services/newsletter.service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/errorUtils";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await subscribeNewsletter(email);
      
      if (response.success || response.data) {
        toast.success("Subscription successful! Check your email.");
        setIsSubscribed(true);
        setEmail("");
        
        // Reset subscription message after 3 seconds
        setTimeout(() => {
          setIsSubscribed(false);
        }, 3000);
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      const errorMessage = extractErrorMessage(error, "Failed to subscribe. Please try again.");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-10 md:p-20 text-center text-white shadow-2xl shadow-emerald-900/20">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-emerald-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-[120px]" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            {isSubscribed && (
              <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white/10 border border-emerald-300/30 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
                <CheckCircle size={24} className="text-emerald-200 animate-pulse" />
                <p className="text-emerald-50 font-semibold">Thank you for subscribing!</p>
              </div>
            )}
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-sm font-semibold tracking-wider uppercase mb-2">
              Newsletter
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Get the Weekly <span className="text-emerald-200 block md:inline italic underline decoration-emerald-400/30 underline-offset-8">Green Spark</span>
            </h2>
            <p className="text-emerald-50/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Join 5,000+ sustainability enthusiasts. We&apos;ll send you the top 3 high-impact ideas 
              and community news once a week. 
            </p>

            {!isSubscribed && (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 pt-6 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="flex-grow px-8 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all backdrop-blur-md shadow-inner disabled:opacity-50"
                />
                <Button 
                  type="submit"
                  disabled={isLoading}
                  size="lg" 
                  className="bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 rounded-2xl px-10 py-5 h-auto font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/20 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Join Now <Send size={20} className="animate-pulse" />
                    </>
                  )}
                </Button>
              </form>
            )}
            <p className="text-xs text-emerald-100/50 pt-2 font-medium">
              Zero spam. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

