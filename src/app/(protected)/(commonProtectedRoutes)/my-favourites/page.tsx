"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyFavourites, IFavourite } from "@/services/favourite.service";
import IdeaCard from "@/components/module/ideas/IdeaCard";
import { Loader2, Heart, Search } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyFavouritesPage() {
  const { data: favouritesResponse, isLoading, isError } = useQuery({
    queryKey: ["myFavourites"],
    queryFn: () => getMyFavourites(),
  });

  const favourites: IFavourite[] = favouritesResponse?.data || [];

  // Safely map favourites to ideas
  const likedIdeas = favourites
    .map((item) => item.idea)
    .filter((idea): idea is IIdea => !!idea);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-slate-500 animate-pulse font-medium">Loading your favourites...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            My Favourites
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Keep track of the sustainability ideas you love
          </p>
        </div>
        
        <Link href="/ideas">
            <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50 transition-all">
                <Search className="w-4 h-4" />
                Browse More Ideas
            </Button>
        </Link>
      </div>

      {isError ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-6 rounded-2xl text-center">
            <p className="text-red-700 dark:text-red-400 font-medium">Failed to load your favorite ideas. Please try again later.</p>
        </div>
      ) : likedIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-slate-300" />
          </div>
          <div className="text-center space-y-2 px-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No favourites yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Explore thousands of sustainability ideas and save the ones that inspire you!
            </p>
          </div>
          <Link href="/ideas">
            <Button className="bg-emerald-600 hover:bg-emerald-700 h-11 px-8 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                Start Exploring
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedIdeas.map((idea) => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea}
                />
            ))}
        </div>
      )}
    </div>
  );
}
