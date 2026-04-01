import BlogForm from "@/components/module/blog/BlogForm";
import { getBlogById } from "@/services/blog.service";
import { Edit3, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const response = await getBlogById(id);

  if (!response.success || !response.data) {
    redirect("/admin/dashboard/blogs-management");
  }

  const blog = response.data;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/dashboard/blogs-management" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          <span className="font-medium">Back to Management</span>
        </Link>
        
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
              <Edit3 className="size-6" />
           </div>
           <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Story</h1>
              <p className="text-slate-500">Updating: <span className="font-bold text-slate-700 dark:text-slate-300">`&quot;`{blog.title}`&quot;`</span></p>
           </div>
        </div>
      </div>

      {/* Main Form */}
      <BlogForm initialData={blog} isEdit={true} />
      
      {/* Meta Info */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 flex items-start gap-3">
         <AlertCircle className="size-4 text-blue-500 mt-0.5 shrink-0" />
         <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            Changing the title will automatically update the SEO slug. Existing links using the old slug may break unless a redirect is configured on the proxy.
         </div>
      </div>

      <div className="h-10" />
    </div>
  );
}
