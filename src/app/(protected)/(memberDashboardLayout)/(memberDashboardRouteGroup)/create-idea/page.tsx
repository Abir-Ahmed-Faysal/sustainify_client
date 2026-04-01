import { prefetchCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.types";
import CreateIdeaForm from "@/components/module/idea/CreateIdeaForm";
import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";

export default async function CreateIdeaPage() {
  let categories: ICategory[] = [];
  let error: string | null = null;

  try {
    const response = await prefetchCategories();
    if (response.data) {
      categories = response.data;
    }
  } catch {
    error = "Failed to load categories";
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/dashboard/my-ideas"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Ideas
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create New Idea
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Share your sustainability solution with the community
            </p>
          </div>
        </div>
      </div>

      <CreateIdeaForm initialCategories={categories} initialError={error} />
    </div>
  );
}
