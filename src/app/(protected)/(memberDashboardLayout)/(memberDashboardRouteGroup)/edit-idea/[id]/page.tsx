import { getMyIdeaById } from "@/services/idea.service";
import { prefetchCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.types";
import EditIdeaForm from "@/components/module/idea/EditIdeaForm";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function EditIdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let categories: ICategory[] = [];
  let error: string | null = null;
  let idea = null;

  try {
    const [ideaResponse, categoriesResponse] = await Promise.all([
      getMyIdeaById(id),
      prefetchCategories(),
    ]);

    if (ideaResponse.data) {
      idea = ideaResponse.data;
    } else {
      error = ideaResponse.message || "Failed to load idea";
    }

    if (categoriesResponse.data) {
      categories = categoriesResponse.data;
    }
  } catch {
    error = "Failed to load idea or categories";
  }

  if (!idea && !error) {
    redirect("/dashboard/my-ideas");
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
            <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Edit Idea
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update your sustainability solution
            </p>
          </div>
        </div>
      </div>

      <EditIdeaForm
        initialIdea={idea}
        initialCategories={categories}
        initialError={error}
        ideaId={id}
      />
    </div>
  );
}
