/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog, updateBlog } from "@/services/blog.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  Send,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { IBlog, IBlogCreate, IBlogUpdate } from "@/types/blog.types";
import { toast } from "sonner";

interface BlogFormProps {
  initialData?: IBlog;
  isEdit?: boolean;
}

export default function BlogForm({
  initialData,
  isEdit = false,
}: BlogFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<IBlogCreate | IBlogUpdate>(
    initialData
      ? {
          title: initialData.title,
          content: initialData.content,
          image: initialData.image || "",
          isPublished: initialData.isPublished,
        }
      : {
          title: "",
          content: "",
          image: "",
          isPublished: true,
        },
  );

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEdit ? updateBlog(initialData!.id, data) : createBlog(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
        toast.success(
          isEdit
            ? "Blog updated successfully!"
            : "Blog created successfully! 🎉",
        );
        setSuccess(true);
        setTimeout(
          () => router.push("/admin/dashboard/blogs-management"),
          1200,
        );
      } else {
        const msg = data.message || "Something went wrong";
        setError(msg);
        toast.error(msg);
      }
    },
    onError: (err: any) => {
      const msg = err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!formData.content || formData.content.length < 10) {
      toast.error("Content must be at least 10 characters");
      return;
    }
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (error) setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-xl flex items-start gap-2.5 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl flex items-start gap-2.5 text-sm">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Redirecting to management...
          </div>
        )}

        <Field
          label="Blog Title"
          required
          hint="Make it catchy and descriptive"
        >
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. 10 Ways to Reduce Plastic Waste"
            disabled={mutation.isPending || success}
          />
        </Field>

        <Field
          label="Content"
          required
          hint="Markdown support coming soon (plain text for now)"
        >
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            rows={10}
            disabled={mutation.isPending || success}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none bg-white dark:bg-slate-800 dark:text-white disabled:opacity-60"
          />
        </Field>

        <Field
          label="Thumbnail Image URL"
          hint="Optional — high quality landscape suggested"
        >
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="pl-10"
              disabled={mutation.isPending || success}
            />
          </div>
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isPublished: e.target.checked,
              }))
            }
            disabled={mutation.isPending || success}
            className="w-4 h-4 accent-emerald-600 cursor-pointer"
          />
          <label
            htmlFor="isPublished"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Publish this post immediately
          </label>
        </div>
      </div>

      <div className="px-6 md:px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={mutation.isPending || success}
          className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />{" "}
              {isEdit ? "Update Blog" : "Create Blog"}
            </>
          )}
        </Button>
      </div>

      <p className="text-[10px] text-slate-400 text-center py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1">
        <FileText className="size-3" />
        All changes are saved to the central database.
      </p>
    </form>
  );
}

function Field({ label, required, hint, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
}
