import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IIdea } from "@/types/idea.types";

interface FeaturedIdeasProps {
  ideas: IIdea[];
  isLoading?: boolean;
}

export default function FeaturedIdeas({ ideas, isLoading }: FeaturedIdeasProps) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Sustainability <span className="text-emerald-600">Ideas</span>
            </h2>
            <p className="text-gray-600 dark:text-slate-300">
              Explore the most innovative and impactful ideas submitted by our community members recently.
            </p>
          </div>
          <Button variant="outline" asChild className="group border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <Link href="/ideas" className="flex items-center gap-2">
              View All Ideas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-slate-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700">
            <p className="text-gray-600 dark:text-slate-300 mb-4">No featured ideas available at the moment.</p>
            <Button asChild>
              <Link href="/ideas">Browse All Ideas</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div key={idea.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700">
                {/* Image Placeholder */}
                <div className="relative h-48 w-full bg-emerald-100 dark:bg-emerald-900/20 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400 shadow-sm">
                      {idea.category.name}
                    </span>
                  </div>
                  {idea.isPaid && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-amber-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm italic">
                        PAID
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-center h-full text-emerald-300 dark:text-emerald-800 font-bold text-lg italic opacity-50">
                    {idea.category.name} Idea
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-6 line-clamp-2">
                    {idea.problemStatement}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Star size={18} fill="currentColor" />
                      <span className="text-sm font-bold">{idea.totalUpVotes - idea.totalDownVotes} Votes</span>
                    </div>
                    <Button size="sm" asChild variant="ghost" className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300">
                      <Link href={`/ideas/${idea.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
