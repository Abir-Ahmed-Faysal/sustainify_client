/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIdea } from "@/services/idea.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2, AlertCircle, CheckCircle, Save, Send,
  Lock, DollarSign, FileText,
} from "lucide-react";
import { ICategory } from "@/types/category.types";
import { IIdeaCreate } from "@/types/idea.types";
import { toast } from "sonner";
import CloudinaryImageUploader from "./CloudinaryImageUploader";

interface CreateIdeaFormProps {
  initialCategories: ICategory[];
  initialError?: string | null;
}

export default function CreateIdeaForm({
  initialCategories,
  initialError = null,
}: CreateIdeaFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const [formData, setFormData] = useState<IIdeaCreate>({
    title: "",
    problemStatement: "",
    solution: "",
    description: "",
    categoryId: "",
    image: undefined,
    price: undefined,
    attachments: [],
  });
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);

  // ── Mutation: save as draft ──────────────────────────────────────────────
  const saveDraftMutation = useMutation({
    mutationFn: () => createIdea({ ...buildCleanPayload(), status: "DRAFT" }),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["myIdeas"] });
        toast.success("Draft saved!");
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/my-ideas"), 1200);
      } else {
        const msg = data.message || "Failed to save draft";
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

  // ── Mutation: submit for review ──────────────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: () => createIdea(buildCleanPayload()),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["myIdeas"] });
        toast.success("Idea submitted for review! 🎉");
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/my-ideas"), 1200);
      } else {
        const msg = data.message || "Failed to submit idea";
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

  const isPending = saveDraftMutation.isPending || submitMutation.isPending || isUploadingImage || isUploadingAttachments;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const buildCleanPayload = (): IIdeaCreate => {
    const payload: IIdeaCreate = { ...formData };
    if (typeof payload.image === "string" && payload.image.trim() === "") {
      payload.image = undefined;
    }
    if (!isPaid) payload.price = undefined;
    return payload;
  };

  const validate = (): string | null => {
    if (!formData.title || formData.title.length < 3)
      return "Title must be at least 3 characters";
    if (!formData.problemStatement || formData.problemStatement.length < 10)
      return "Problem statement must be at least 10 characters";
    if (!formData.solution || formData.solution.length < 10)
      return "Solution must be at least 10 characters";
    if (!formData.description || formData.description.length < 10)
      return "Description must be at least 10 characters";
    if (!formData.categoryId)
      return "Please select a category";
    if (formData.image && !formData.image.match(/^https?:\/\/.+/))
      return "Please provide a valid image URL";
    if (isPaid) {
      if (!formData.price || formData.price <= 0)
        return "Price must be greater than $0";
      if (formData.price > 9999.99)
        return "Price must not exceed $9,999.99";
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "isPaid") {
      setIsPaid((e.target as HTMLInputElement).checked);
      if (!(e.target as HTMLInputElement).checked)
        setFormData((prev) => ({ ...prev, price: undefined }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number" ? (value === "" ? undefined : parseFloat(value)) : value,
      }));
    }
    if (error) setError(null);
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate();
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) { setError(err); toast.error(err); return; }
    submitMutation.mutate();
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-xl flex items-start gap-2.5 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl flex items-start gap-2.5 text-sm">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Redirecting…
          </div>
        )}

        {/* ── Title ──────────────────────────────────────────────────── */}
        <Field
          label="Idea Title"
          required
          hint={`${formData.title.length} / 200 chars (min 3)`}
        >
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Give your idea a catchy title"
            maxLength={200}
            disabled={isPending}
          />
        </Field>

        {/* ── Problem Statement ───────────────────────────────────────── */}
        <Field
          label="Problem Statement"
          required
          hint={`${formData.problemStatement.length} chars (min 10)`}
        >
          <Textarea
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            placeholder="What problem are you trying to solve?"
            rows={3}
            maxLength={1000}
            disabled={isPending}
          />
        </Field>

        {/* ── Solution ────────────────────────────────────────────────── */}
        <Field
          label="Proposed Solution"
          required
          hint={`${formData.solution.length} chars (min 10)`}
        >
          <Textarea
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            placeholder="Describe your proposed solution"
            rows={3}
            maxLength={1000}
            disabled={isPending}
          />
        </Field>

        {/* ── Description ─────────────────────────────────────────────── */}
        <Field
          label="Full Description"
          required
          hint={`${formData.description.length} chars (min 10)`}
        >
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="More details, expected impact, implementation timeline…"
            rows={4}
            maxLength={2000}
            disabled={isPending}
          />
        </Field>

        {/* ── Category ────────────────────────────────────────────────── */}
        <Field label="Category" required>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={isPending || initialCategories.length === 0}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 dark:text-white disabled:opacity-60"
          >
            <option value="">
              {initialCategories.length === 0
                ? "No categories available"
                : "Select a category"}
            </option>
            {initialCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        {/* ── Image Upload ───────────────────────────────────────────────── */}
        <Field label="Cover Image" hint="Optional cover image for your idea">
          <CloudinaryImageUploader
            multiple={false}
            value={formData.image ? [formData.image] : []}
            onChange={(urls) => setFormData(prev => ({ ...prev, image: urls[0] || undefined }))}
            onUploadingChange={setIsUploadingImage}
          />
        </Field>

        {/* ── Attachments Upload ────────────────────────────────────────── */}
        <Field label="Additional Attachments" hint="Optional multiple images (max 5)">
          <CloudinaryImageUploader
            multiple={true}
            value={formData.attachments || []}
            onChange={(urls) => setFormData(prev => ({ ...prev, attachments: urls }))}
            onUploadingChange={setIsUploadingAttachments}
            maxFiles={5}
          />
        </Field>

        {/* ── Paid toggle ─────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <input
            type="checkbox"
            id="isPaid"
            name="isPaid"
            checked={isPaid}
            onChange={handleChange}
            disabled={isPending}
            className="mt-0.5 w-4 h-4 accent-emerald-600 rounded border-slate-300 cursor-pointer"
          />
          <div>
            <label
              htmlFor="isPaid"
              className="text-sm font-medium text-slate-800 dark:text-white cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Make this idea paid
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Users will need to pay to view the full solution.
            </p>
          </div>
        </div>

        {/* ── Price ───────────────────────────────────────────────────── */}
        {isPaid && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <label className="block text-sm font-medium text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" />
              Set Price <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">$</span>
              <Input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder="9.99"
                min="0.01"
                step="0.01"
                max="9999.99"
                disabled={isPending}
                className="flex-1"
              />
              <span className="text-sm text-slate-500">USD</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Between $0.01 and $9,999.99</p>
          </div>
        )}
      </div>

      {/* ── Footer buttons ─────────────────────────────────────────────── */}
      <div className="px-6 md:px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isPending || success}
          className="gap-2"
        >
          {saveDraftMutation.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-4 h-4" /> Save as Draft</>
          )}
        </Button>

        <div className="flex gap-2 ml-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
            className="text-slate-500"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || success}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
          >
            {submitMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : (
              <><Send className="w-4 h-4" /> Submit for Review</>
            )}
          </Button>
        </div>
      </div>

      {/* Info note */}
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-3 flex items-center justify-center gap-1 border-t border-slate-100 dark:border-slate-800">
        <FileText className="w-3 h-3" />
        Drafts can be edited and submitted later from My Ideas.
      </p>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>
      )}
    </div>
  );
}

function Textarea({
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
  disabled,
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      disabled={disabled}
      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none bg-white dark:bg-slate-800 dark:text-white disabled:opacity-60"
    />
  );
}
