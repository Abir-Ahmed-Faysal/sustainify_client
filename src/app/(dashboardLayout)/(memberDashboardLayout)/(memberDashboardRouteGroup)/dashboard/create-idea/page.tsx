import { prefetchCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.types";
import CreateIdeaForm from "@/components/module/idea/CreateIdeaForm";

export default async function CreateIdeaPage() {
  let categories: ICategory[] = [];
  let error: string | null = null;

  try {
    const response = await prefetchCategories();
    if (response.data) {
      categories = response.data;
    }
  } catch (err) {
    console.error("Error prefetching categories:", err);
    error = "Failed to load categories";
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Idea</h1>
        <p className="text-slate-600">Share your sustainability solution with the community</p>
      </div>

      <CreateIdeaForm initialCategories={categories} initialError={error} />
    </div>
  );
}
