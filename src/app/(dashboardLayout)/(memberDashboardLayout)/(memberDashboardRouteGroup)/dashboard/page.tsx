"use client";

import { useEffect, useState } from "react";
import { getMyAccessibleIdeas } from "@/services/access.service";
import { getIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import IdeaCard from "@/components/module/ideas/IdeaCard";

export default function MemberDashboardPage() {
  const [accessibleIdeas, setAccessibleIdeas] = useState<IIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPursuitIdeas = async () => {
      try {
        // Get list of idea IDs user has access to
        const accessResponse = await getMyAccessibleIdeas();
        const ideaIds = accessResponse.data || [];

        if (ideaIds.length === 0) {
          setAccessibleIdeas([]);
          setIsLoading(false);
          return;
        }

        // Fetch full idea details for each accessible idea
        const ideasResponse = await getIdeas({});
        if (ideasResponse.data) {
          const pursued = ideasResponse.data.filter((idea) =>
            ideaIds.includes(idea.id)
          );
          setAccessibleIdeas(pursued);
        }
      } catch (err) {
        console.error("Error fetching pursued ideas:", err);
        setError("Failed to load your pursued ideas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPursuitIdeas();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          My Pursued Ideas
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          View and manage all the premium ideas you have purchased access to.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
            Error Loading Ideas
          </h2>
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      ) : accessibleIdeas.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No Pursued Ideas Yet
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            You haven't purchased access to any premium ideas yet. Browse and purchase ideas to see them here.
          </p>
          <Link
            href="/ideas"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Browse Ideas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}

