import BlogForm from "@/components/module/blog/BlogForm";
import { FilePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateBlogPage() {
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
           <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <FilePlus className="size-6" />
           </div>
           <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Create New Story</h1>
              <p className="text-slate-500">Share a new sustainability insight with the community.</p>
           </div>
        </div>
      </div>

      {/* Main Form */}
      <BlogForm />
      
      <div className="h-10" /> {/* Extra spacing */}
    </div>
  );
}
