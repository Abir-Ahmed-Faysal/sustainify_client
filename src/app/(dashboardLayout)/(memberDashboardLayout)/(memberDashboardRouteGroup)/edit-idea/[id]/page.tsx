import { getIdeaById } from "@/services/idea.service";
import { prefetchCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.types";
import EditIdeaForm from "@/components/module/idea/EditIdeaForm";
import { redirect } from "next/navigation";

export default async function EditIdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let categories: ICategory[] = [];
  let error: string | null = null;
  let idea = null;

  try {
    const [ideaResponse, categoriesResponse] = await Promise.all([
      getIdeaById(id),
      prefetchCategories()
    ]);
    
    if (ideaResponse.data) {
       idea = ideaResponse.data;
    } else {
       error = ideaResponse.message || "Failed to load idea";
    }

    if (categoriesResponse.data) {
      categories = categoriesResponse.data;
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error = "Failed to load idea or categories";
  }

  // If the idea doesn't exist or we fail to find it, maybe redirect or show error?
  if(!idea && !error) {
     redirect("/dashboard/my-ideas");
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Idea</h1>
        <p className="text-slate-600">Update your sustainability solution</p>
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
