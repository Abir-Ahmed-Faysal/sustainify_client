"use client";

import { useQuery } from "@tanstack/react-query";
import { prefetchIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import IdeaCard from "./IdeaCard";
import CardSkeleton from "@/components/shared/CardSkeleton";
import { motion } from "framer-motion";

interface RelatedIdeasProps {
  currentIdeaId: string;
  categoryId: string;
  categoryName?: string;
}

export default function RelatedIdeas({ currentIdeaId, categoryId, categoryName }: RelatedIdeasProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["related-ideas", categoryId, currentIdeaId],
    queryFn: () => prefetchIdeas({
      categoryName: categoryName || categoryId,
      limit: 4,
      sortBy: "totalUpVotes",
      sortOrder: "desc"
    }),
    enabled: !!categoryId
  });

  const relatedIdeas = (data?.data || []).filter(idea => idea.id !== currentIdeaId).slice(0, 4);

  if (!categoryId) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Related <span className="text-emerald-600">Ideas</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            Explore other innovative solutions in the same category
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : relatedIdeas.length > 0 ? (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {relatedIdeas.map((idea: IIdea) => (
                <motion.div
                  key={idea.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <IdeaCard idea={idea} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                No other ideas found in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
