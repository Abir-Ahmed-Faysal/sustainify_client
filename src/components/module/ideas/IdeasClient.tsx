"use client";

import { useQuery } from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";
import { IIdeaQuery } from "@/types/idea.types";
import IdeaCard from "./IdeaCard";
import IdeasFilters from "./IdeasFilters";
import Pagination from "@/components/shared/Pagination";
import { Loader2, LightbulbOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IdeasClientProps {
  queryParams: IIdeaQuery;
}

export default function IdeasClient({ queryParams }: IdeasClientProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ideas", queryParams],
    queryFn: () => getIdeas(queryParams),
    placeholderData: (prev) => prev, // Smooth transitions between queries
  });

  const ideas = data?.data || [];
  const meta = data?.meta;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Something went wrong</h2>
        <p className="text-slate-500">Could not load sustainability ideas. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <IdeasFilters />

      {isLoading ? (
        <div className="flex items-center justify-center py-40">
          <Loader2 className="size-10 text-emerald-500 animate-spin" />
        </div>
      ) : ideas.length > 0 ? (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {ideas.map((idea) => (
                <motion.div key={idea.id} variants={itemVariants} layout>
                  <IdeaCard idea={idea} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {meta && (
            <Pagination 
                totalPages={meta.totalPages} 
                currentPage={meta.page} 
            />
          )}
        </>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="p-6 rounded-full bg-emerald-50 dark:bg-emerald-900/10 mb-6">
            <LightbulbOff className="size-12 text-emerald-500 opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No ideas found</h2>
          <p className="text-slate-500 max-w-sm">We couldn&apos;t find any ideas matching your current filters. Try adjusting your search query.</p>
        </motion.div>
      )}
    </div>
  );
}
