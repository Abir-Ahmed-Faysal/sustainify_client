"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Sustainability Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold tracking-wide uppercase">
            EcoSpark Hub: Igniting Change
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Empowering <span className="text-emerald-400">Green Ideas</span> for a Better Tomorrow
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl">
            Sustainify is the community portal where your sustainable ideas come to life. 
            Join thousands of eco-warriors sharing high-impact solutions.
          </p>

          <div className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-2xl">
              <div className="relative flex-grow flex items-center px-4 py-2 bg-white rounded-xl">
                <Search className="text-gray-400 mr-2 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search ideas (e.g. Solar power...)"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
                />
              </div>
              <div className="relative flex-grow md:max-w-[200px] items-center px-4 py-2 bg-white rounded-xl hidden md:flex">
                <MapPin className="text-gray-400 mr-2 h-5 w-5" />
                <select className="w-full bg-transparent outline-none text-gray-800 text-sm appearance-none">
                  <option>All Categories</option>
                  <option>Energy</option>
                  <option>Waste</option>
                  <option>Transport</option>
                </select>
              </div>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-full">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
