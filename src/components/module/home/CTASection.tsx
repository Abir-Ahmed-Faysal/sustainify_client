"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 dark:from-emerald-900/40 dark:via-emerald-900/50 dark:to-teal-900/40 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl -ml-40 -mb-40" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Badge className="mb-6 bg-white/20 text-white border border-white/30 hover:bg-white/30 font-semibold">
            <Sparkles className="w-4 h-4 mr-2" />
            START YOUR JOURNEY NOW
          </Badge>

          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Ready to Make an <span className="relative">
              Impact?
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-white/40" />
            </span>
          </h2>

          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of innovators and changemakers building a sustainable future. Share your ideas, connect with your community, and create real environmental change today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold gap-2 px-8 py-6"
            >
              <Link href="/register">
                Create Your Account <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-bold gap-2 px-8 py-6"
            >
              <Link href="/ideas">
                <Zap className="w-5 h-5" />
                Explore Ideas
              </Link>
            </Button>
          </div>

          <p className="text-emerald-50/70 text-sm mt-8">
            ✨ Free to join. No credit card required. Start in seconds.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/20"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-white">5K+</p>
            <p className="text-emerald-50/80 text-sm mt-2">Active Members</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">1.2K+</p>
            <p className="text-emerald-50/80 text-sm mt-2">Ideas Shared</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">50+</p>
            <p className="text-emerald-50/80 text-sm mt-2">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">98%</p>
            <p className="text-emerald-50/80 text-sm mt-2">Positive Reviews</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
