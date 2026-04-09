"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import CardSkeleton from "@/components/shared/CardSkeleton";

interface RecommendedIdea {
  id: string;
  title: string;
  description: string;
  image: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name: string;
    profile?: {
      avatar?: string;
    };
  };
  totalUpVotes: number;
  _count: {
    votes: number;
    comments: number;
  };
}

export default function RecommendationsSection() {
  const [isOpen, setIsOpen] = useState(true);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["ideas-recommendations"],
    queryFn: async (): Promise<RecommendedIdea[]> => {
      const response = await api.get<RecommendedIdea[]>("/ideas/recommendations/personalized");
      return response.data || [];
    },
  });

  if (!isOpen) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              ✨ Recommended For You
            </h2>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Personalized ideas based on your interests and voting history
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recommendations.slice(0, 6).map((idea: RecommendedIdea) => (
                <Link key={idea.id} href={`/ideas/${idea.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900/30 dark:to-purple-900/30 overflow-hidden">
                      {idea.image ? (
                        <img
                          src={idea.image}
                          alt={idea.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">💡</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          {idea.category.name}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 flex flex-col h-full">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 mb-2">
                        {idea.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                        {idea.description}
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-2 mb-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        {idea.author.profile?.avatar ? (
                          <img
                            src={idea.author.profile.avatar}
                            alt={idea.author.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {idea.author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {idea.author.name}
                        </span>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-600" />
                          {idea.totalUpVotes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-emerald-600" />
                          {idea._count.comments}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {recommendations.length > 6 && (
              <div className="flex justify-center">
                <Link href="/ideas?recommended=true">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                    View All Recommendations
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No recommendations yet. Start voting and favoriting ideas to get personalized suggestions!
            </p>
            <Link href="/ideas">
              <Button variant="outline">Explore Ideas</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
