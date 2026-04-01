/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIdea, changeIdeaStatus } from "@/services/idea.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, AlertCircle, CheckCircle, Save, Send,
  ArrowLeft, FileText, Lock, DollarSign,
} from "lucide-react";
import { IIdea, IIdeaUpdate } from "@/types/idea.types";
import { ICategory } from "@/types/category.types";
import { toast } from "sonner";
import CloudinaryImageUploader from "./CloudinaryImageUploader";

interface EditIdeaFormProps {
  initialIdea: IIdea | null;
  initialCategories: ICategory[];
  initialError?: string | null;
  ideaId: string;
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  UNDER_REVIEW: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

export default function EditIdeaForm({
  initialIdea,
  initialCategories,
  initialError = null,
  ideaId,
}: EditIdeaFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState(false);
  const [isPaid, setIsPaid] = useState(initialIdea?.isPaid || false);

  // Content fields — does NOT include status (separate endpoint)
  const [formData, setFormData] = useState<IIdeaUpdate>({
    title: initialIdea?.title || "",
    problemStatement: initialIdea?.problemStatement || "",
    solution: initialIdea?.solution || "",
    description: initialIdea?.description || "",
    categoryId: initialIdea?.categoryId || initialIdea?.category?.id || "",
    image: initialIdea?.image || undefined,
    price: initialIdea?.price || undefined,
    attachments: initialIdea?.attachments || [],
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);

  // ── Mutation: save content only ────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload: IIdeaUpdate) => updateIdea(ideaId, payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["myIdeas"] });
        queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
        toast.success("Changes saved!");
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/my-ideas"), 1200);
      } else {
        setError(data.message || "Failed to save idea");
        toast.error(data.message || "Failed to save idea");
      }
    },
    onError: (err: any) => {
      const msg = err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
    },
  });

  // ── Mutation: submit for review (status only) ──────────────────────────────
  const submitMutation = useMutation({
    mutationFn: async () => {
      // 1. save content first
      await updateIdea(ideaId, buildCleanPayload());
      // 2. then change status
      return changeIdeaStatus(ideaId, "UNDER_REVIEW");
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["myIdeas"] });
        queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
        toast.success("Idea submitted for review! 🎉");
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/my-ideas"), 1200);
      } else {
        setError(data.message || "Failed to submit idea");
        toast.error(data.message || "Failed to submit idea");
      }
    },
    onError: (err: any) => {
      const msg = err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
    },
  });

  const isPending = saveMutation.isPending || submitMutation.isPending || isUploadingImage || isUploadingAttachments;

  // ── Helpers ───────────────────────────────────────────────────────────────

  const buildCleanPayload = (): IIdeaUpdate => {
    const payload: IIdeaUpdate = { ...formData };
    // Strip empty image string
    if (typeof payload.image === "string" && payload.image.trim() === "") {
      payload.image = undefined;
    }
    // Strip price if not paid
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

  const handleSave = () => {
    const err = validate();
    if (err) { setError(err); toast.error(err); return; }
    saveMutation.mutate(buildCleanPayload());
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) { setError(err); toast.error(err); return; }
    submitMutation.mutate();
  };

  // ── Guard: no idea ─────────────────────────────────────────────────────────
  if (!initialIdea && error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-5 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // ── Guard: approved idea ───────────────────────────────────────────────────
  if (initialIdea?.status === "APPROVED") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-8 rounded-2xl">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Idea Approved
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Approved ideas cannot be edited. Contact support if you need changes.
          </p>
          <Button onClick={() => router.push("/dashboard/my-ideas")}>
            Back to My Ideas
          </Button>
        </div>
      </div>
    );
  }

  const currentStatus = initialIdea?.status ?? "DRAFT";
  const canSubmit = currentStatus === "DRAFT" || currentStatus === "REJECTED";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1 text-slate-500 hover:text-slate-700 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex-1" />
        <Badge
          className={`text-xs px-2.5 py-1 border font-semibold ${STATUS_CLASS[currentStatus] ?? ""}`}
        >
          {STATUS_LABEL[currentStatus] ?? currentStatus}
        </Badge>
      </div>

      {/* Feedback banner (rejected ideas) */}
      {currentStatus === "REJECTED" && initialIdea?.feedback && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Admin Feedback
          </p>
          <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
            {initialIdea.feedback}
          </p>
        </div>
      )}

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

          {/* ── Title ──────────────────────────────────────────── */}
          <Field label="Idea Title" required hint={`${formData.title?.length ?? 0} / 200 chars (min 3)`}>
            <Input
              name="title"
              value={formData.title ?? ""}
              onChange={handleChange}
              placeholder="Give your idea a catchy title"
              maxLength={200}
              disabled={isPending}
            />
          </Field>

          {/* ── Problem Statement ───────────────────────────────── */}
          <Field label="Problem Statement" required hint={`${formData.problemStatement?.length ?? 0} chars (min 10)`}>
            <Textarea
              name="problemStatement"
              value={formData.problemStatement ?? ""}
              onChange={handleChange}
              placeholder="What problem are you trying to solve?"
              rows={3}
              maxLength={1000}
              disabled={isPending}
            />
          </Field>

          {/* ── Solution ────────────────────────────────────────── */}
          <Field label="Proposed Solution" required hint={`${formData.solution?.length ?? 0} chars (min 10)`}>
            <Textarea
              name="solution"
              value={formData.solution ?? ""}
              onChange={handleChange}
              placeholder="Describe your proposed solution"
              rows={3}
              maxLength={1000}
              disabled={isPending}
            />
          </Field>

          {/* ── Description ─────────────────────────────────────── */}
          <Field label="Full Description" required hint={`${formData.description?.length ?? 0} chars (min 10)`}>
            <Textarea
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              placeholder="More details, impact, timeline…"
              rows={4}
              maxLength={2000}
              disabled={isPending}
            />
          </Field>

          {/* ── Category ────────────────────────────────────────── */}
          <Field label="Category" required>
            <select
              name="categoryId"
              value={formData.categoryId ?? ""}
              onChange={handleChange}
              disabled={isPending || initialCategories.length === 0}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 dark:text-white disabled:opacity-60"
            >
              <option value="">
                {initialCategories.length === 0 ? "No categories available" : "Select a category"}
              </option>
              {initialCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          {/* ── Image Upload ───────────────────────────────────────── */}
          <Field label="Cover Image" hint="Optional cover image for your idea">
            <CloudinaryImageUploader
              multiple={false}
              value={formData.image ? [formData.image] : []}
              onChange={(urls) => setFormData(prev => ({ ...prev, image: urls[0] || undefined }))}
              onUploadingChange={setIsUploadingImage}
            />
          </Field>

          {/* ── Attachments Upload ─────────────────────────────────── */}
          <Field label="Additional Attachments" hint="Optional multiple images (max 5)">
            <CloudinaryImageUploader
              multiple={true}
              value={formData.attachments || []}
              onChange={(urls) => setFormData(prev => ({ ...prev, attachments: urls }))}
              onUploadingChange={setIsUploadingAttachments}
              maxFiles={5}
            />
          </Field>

          {/* ── Paid toggle ─────────────────────────────────────── */}
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
              <label htmlFor="isPaid" className="text-sm font-medium text-slate-800 dark:text-white cursor-pointer flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Make this idea paid
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Users will need to pay to view the full solution.
              </p>
            </div>
          </div>

          {/* ── Price ───────────────────────────────────────────── */}
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
                  value={formData.price ?? ""}
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

        {/* ── Footer buttons ────────────────────────────────────── */}
        <div className="px-6 md:px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleSave}
            disabled={isPending || success}
            className="gap-2"
          >
            {saveMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save Draft</>
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

            {canSubmit && (
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
            )}
          </div>
        </div>
      </div>

      {/* Info note */}
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4 flex items-center justify-center gap-1">
        <FileText className="w-3 h-3" />
        Idea content is saved separately from status changes.
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
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
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
