/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getMyPurchasedIdeas } from "@/services/idea.service";
import IdeaCard from "@/components/module/ideas/IdeaCard";
import { Loader2 } from "lucide-react";
import { IIdea } from "@/types/idea.types";

export default async function PurchasedIdeasPage() {
  let ideas: IIdea[];
  try {
    const result = await getMyPurchasedIdeas();
    ideas = result.data || [];
    
  } catch (error) {
    ideas = [];
  }

  console.log(ideas,"from idea on me")

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Purchased Ideas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            These are the ideas you have purchased access for. Click any card to view details.
          </p>
        </div>
        <Link href="/dashboard/my-ideas" className="text-sm text-emerald-600 hover:text-emerald-700">
          Back to My Ideas
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No purchased ideas yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Find ideas and purchase to view full details.</p>
          <Link href="/ideas" className="inline-flex mt-4 items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Browse Ideas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea as any} />
          ))}
        </div>
      )}
    </div>
  );
}
