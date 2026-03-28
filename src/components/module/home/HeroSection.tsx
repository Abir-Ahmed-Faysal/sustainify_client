/* eslint-disable react/jsx-no-undef */
"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react"

export default function HeroSection() {
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

          <div className="pt-4">
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-2xl shadow-2xl">
              <div className="relative flex-grow flex items-center px-4 py-3 bg-white rounded-xl group transition-all">
                <Search className="text-slate-400 group-focus-within:text-emerald-600 mr-2 h-5 w-5 transition-colors" />
                <input
                  type="text"
                  placeholder="Search solutions..."
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base font-medium"
                />
              </div>
              <div className="relative flex-grow md:max-w-[180px] items-center px-4 py-3 bg-white rounded-xl hidden md:flex">
                <MapPin className="text-slate-400 mr-2 h-5 w-5" />
                <select className="w-full bg-transparent outline-none text-slate-700 text-sm appearance-none cursor-pointer font-medium">
                  <option>All Categories</option>
                  <option>Energy</option>
                  <option>Waste</option>
                  <option>Transport</option>
                </select>
              </div>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-10 h-auto shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

