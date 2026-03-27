import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-indigo-700 p-8 md:p-16 text-center text-white">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Get the Weekly <span className="text-emerald-200 underline decoration-emerald-400/50">Green Spark</span>
            </h2>
            <p className="text-emerald-100 text-lg">
              Join 5,000+ sustainability enthusiasts. We'll send you the top 3 high-impact ideas 
              and community news once a week. No spam, ever.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 pt-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
              />
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl px-8 py-4 font-bold flex items-center justify-center gap-2">
                Subscribe <Send size={18} />
              </Button>
            </form>
            <p className="text-xs text-white/60">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
