import { Quote, Star, TrendingUp } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import Image from "next/image";

interface TestimonialsProps {
  ideas: IIdea[];
}

export default function Testimonials({ ideas }: TestimonialsProps) {
  // We handle the ideas passed from the parent which are already sorted by positiveRatio
  const displayIdeas = ideas.slice(0, 3);

  if (displayIdeas.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 px-4">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Voices of <span className="text-emerald-600 dark:text-emerald-400">Impact</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Discover the highest-rated innovations driving sustainable change according to our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayIdeas.map((idea) => (
            <div
              key={idea.id}
              className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Trend Badge */}
              <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1.5 z-10 animate-pulse">
                <TrendingUp size={12} />
                {idea.positiveRatio}% ACCURACY
              </div>

              {/* Quote Icon Background */}
              <Quote className="absolute bottom-6 right-6 text-emerald-500 dark:text-emerald-500 w-16 h-16 opacity-[0.03] rotate-12" />

              {/* Verified Rating */}
              <div className="flex gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i <= Math.ceil(idea.positiveRatio / 20) ? "#10b981" : "transparent"} 
                    stroke={i <= Math.ceil(idea.positiveRatio / 20) ? "#10b981" : "#cbd5e1"}
                  />
                ))}
              </div>

              {/* Idea Problem Snippet */}
              <blockquote className="text-slate-700 dark:text-slate-300 font-medium italic mb-8 leading-relaxed text-base min-h-[90px] line-clamp-4 decoration-emerald-500/20 underline-offset-4 decoration-dashed underline">
                &quot;{idea.description.slice(0, 100)}...&quot;
              </blockquote>

              {/* Author Footer */}
              <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="relative h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 font-bold text-sm shadow-inner transition-transform group-hover:scale-110 duration-300">
                  {idea.author.profile?.avatar ? (
                    <Image 
                      src={idea.author.profile.avatar} 
                      alt={idea.author.name} 
                      fill 
                      sizes="48px"
                      className="object-cover rounded-2xl" 
                    />
                  ) : (
                    idea.author.name.split(" ").map((n) => n[0]).join("")
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight truncate">
                    {idea.author.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-1">
                    {idea.category.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
