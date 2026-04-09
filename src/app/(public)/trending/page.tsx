import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Flame } from "lucide-react";
import { getPublicIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import IdeaCard from "@/components/module/ideas/IdeaCard";
import { motion } from "framer-motion";

// Revalidate trending page every 1 hour
export const revalidate = 3600;

export default async function TrendingPage() {
  let trendingIdeas: IIdea[] = [];
  let isLoading = false;

  try {
    // Fetch top ideas by votes (trending)
    const response = await getPublicIdeas({
      limit: 12,
      sortBy: "totalUpVotes",
      sortOrder: "desc"
    });

    if (response.success) {
      trendingIdeas = response.data || [];
    }
  } catch (error) {
    console.error("Error fetching trending ideas:", error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-600 dark:from-emerald-900/40 dark:via-emerald-900/50 dark:to-teal-900/40 relative overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl -ml-40 -mb-40" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/ideas"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Ideas
            </Link>

            <Badge className="mb-6 bg-white/20 text-white border border-white/30 hover:bg-white/30 font-semibold">
              <Flame className="w-4 h-4 mr-2 animate-bounce" />
              TRENDING NOW
            </Badge>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              🔥 Trending <span className="relative">
                Ideas
                <span className="absolute -bottom-3 left-0 right-0 h-1 bg-white/40" />
              </span>
            </h1>

            <p className="text-xl text-emerald-50 max-w-2xl leading-relaxed mb-8">
              Discover the hottest sustainability solutions gaining momentum from our community. These are the ideas making real impact right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold"
              >
                <Link href="/register">
                  Join the Movement →
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold"
              >
                <Link href="/ideas">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View All Ideas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              Top Trending Ideas
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Ranked by community votes and recent engagement
            </p>
          </div>

          {trendingIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingIdeas.map((idea: IIdea, index: number) => (
                <div key={idea.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-4 -right-4 z-10">
                      <Badge className={`${
                        index === 0 
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                          : index === 1 
                          ? "bg-gray-400 hover:bg-gray-500 text-white"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      } font-bold px-3 py-1`}>
                        {index === 0 ? "🥇 #1" : index === 1 ? "🥈 #2" : "🥉 #3"}
                      </Badge>
                    </div>
                  )}
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <Flame className="w-16 h-16 mx-auto text-orange-400 mb-4 opacity-30" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No trending ideas yet. Be the first to share your sustainability vision!
              </p>
              <Button asChild className="mt-6">
                <Link href="/register">Start Contributing</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-50 dark:bg-emerald-900/20 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Have Your Own Trending Idea?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Share your innovation and let the community decide if it's the next big sustainability solution.
          </p>
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/register/create-idea">
              Submit Your Idea Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
