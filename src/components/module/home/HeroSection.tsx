"use client";
 
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ICategory } from "@/types/category.types";
import SearchSuggestions from "@/components/shared/SearchSuggestions";

interface HeroSectionProps {
  categories?: ICategory[];
}

export default function HeroSection({ categories = [] }: HeroSectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <section className="relative w-full h-[650px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Sustainability Hero"
          fill
          sizes="100vw"
          className="object-cover scale-105 animate-slow-zoom"
          priority
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
      </div>
 
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-4xl space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            EcoSpark Hub: Igniting Change
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            Empowering <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Green Ideas</span> <br className="hidden md:block" />
            for a Better Tomorrow
          </h1>
          
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
            Sustainify is the community portal where your sustainable ideas come to life. 
            Join thousands of eco-warriors sharing high-impact solutions.
          </p>
 
          {/* AI-Powered Search */}
          <div className="pt-4 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SearchSuggestions />
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              asChild
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all"
            >
              <a href="/ideas">Explore Ideas</a>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg" 
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-bold rounded-xl px-8 transition-all"
            >
              <a href="/register">Create Idea</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
