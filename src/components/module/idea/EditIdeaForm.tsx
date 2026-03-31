/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIdea } from "@/services/idea.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle, Save, Send } from "lucide-react";
import { ICategory } from "@/types/category.types";
import { IIdea, IIdeaUpdate } from "@/types/idea.types";

interface EditIdeaFormProps {
  initialIdea: IIdea | null;
  initialCategories: ICategory[];
  initialError?: string | null;
  ideaId: string;
}

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
  
  // Initialize form
  const [formData, setFormData] = useState<IIdeaUpdate>({
    title: initialIdea?.title || "",
    problemStatement: initialIdea?.problemStatement || "",
    solution: initialIdea?.solution || "",
    description: initialIdea?.description || "",
    categoryId: initialIdea?.categoryId || initialIdea?.category?.id || "",
    image: initialIdea?.image || undefined,
    price: initialIdea?.price || undefined,
  });

  // Mutation for updating idea
  const updateIdeaMutation = useMutation({
    mutationFn: async (payload: IIdeaUpdate) => {
      return await updateIdea(ideaId, payload);
    },
    onSuccess: (data) => {
      if (data.success) {
        setSuccess(true);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["myIdeas"] });
        queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });

        // Redirect after short delay
        setTimeout(() => {
          router.push("/dashboard/my-ideas");
        }, 1500);
      } else {
        setError(data.message || "Failed to update idea");
      }
    },
    onError: (err: any) => {
      setError(err.message || "An error occurred while updating the idea");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "isPaid") {
      setIsPaid((e.target as HTMLInputElement).checked);
      if (!(e.target as HTMLInputElement).checked) {
        setFormData((prev) => ({ ...prev, price: undefined }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number"
            ? value === ""
              ? undefined
              : parseFloat(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Provide a payload that optionally sets status
    const updatePayload = { ...formData };
    if (isDraft) {
        updatePayload.status = "DRAFT";
    }

    if (isDraft) {
      // Draft can be saved with minimal data using update payload
      updateIdeaMutation.mutate(updatePayload);
    } else {
      const payloadReadyForSubmit = { ...formData, status: "UNDER_REVIEW" as const };
      
      // Full validation for submission
      if (!payloadReadyForSubmit.title || payloadReadyForSubmit.title.length < 3) {
        setError("Title must be at least 3 characters");
        return;
      }

      if (
        !payloadReadyForSubmit.problemStatement ||
        payloadReadyForSubmit.problemStatement.length < 10
      ) {
        setError("Problem statement must be at least 10 characters");
        return;
      }

      if (!payloadReadyForSubmit.solution || payloadReadyForSubmit.solution.length < 10) {
        setError("Solution must be at least 10 characters");
        return;
      }

      if (!payloadReadyForSubmit.description || payloadReadyForSubmit.description.length < 10) {
        setError("Description must be at least 10 characters");
        return;
      }

      if (!payloadReadyForSubmit.categoryId) {
        setError("Please select a category");
        return;
      }

      if (payloadReadyForSubmit.image && !payloadReadyForSubmit.image.match(/^https?:\/\/.+/)) {
        setError("Please provide a valid image URL");
        return;
      }

      if (isPaid) {
        if (!payloadReadyForSubmit.price || payloadReadyForSubmit.price <= 0) {
          setError("Price must be greater than $0.01");
          return;
        }
        if (payloadReadyForSubmit.price > 9999.99) {
          setError("Price must not exceed $9,999.99");
          return;
        }
      }

      updateIdeaMutation.mutate(payloadReadyForSubmit);
    }
  };

  if(!initialIdea && error) {
      return (
         <Card className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
         </Card>
      )
  }
  
  // If approved, show error and don't allow edits
  if (initialIdea?.status === "APPROVED") {
      return (
          <Card className="p-8 text-center text-red-600">
             <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3 mb-4">
               <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
               <span>You cannot edit an approved idea.</span>
             </div>
             <Button onClick={() => router.push("/dashboard/my-ideas")}>Back to My Ideas</Button>
          </Card>
      )
  }

  return (
    <Card className="p-8">
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>Idea updated successfully! Redirecting...</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Idea Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Give your idea a catchy title"
            maxLength={200}
            disabled={updateIdeaMutation.isPending}
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 3 characters (Currently: {formData.title?.length || 0})
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Problem Statement <span className="text-red-500">*</span>
          </label>
          <textarea
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            placeholder="What problem are you trying to solve?"
            rows={3}
            maxLength={1000}
            disabled={updateIdeaMutation.isPending}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 10 characters (Currently: {formData.problemStatement?.length || 0})
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Proposed Solution <span className="text-red-500">*</span>
          </label>
          <textarea
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            placeholder="Describe your proposed solution"
            rows={3}
            maxLength={1000}
            disabled={updateIdeaMutation.isPending}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 10 characters (Currently: {formData.solution?.length || 0})
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide more details about your idea, expected impact, and implementation timeline"
            rows={4}
            maxLength={2000}
            disabled={updateIdeaMutation.isPending}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 10 characters (Currently: {formData.description?.length || 0})
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
            disabled={updateIdeaMutation.isPending || initialCategories.length === 0}
          >
            <option value="">
              {initialCategories.length === 0
                ? "No categories available"
                : "Select a category"}
            </option>
            {initialCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Image URL <span className="text-slate-500 text-xs">(optional)</span>
          </label>
          <Input
            type="url"
            name="image"
            value={formData.image || ""}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            disabled={updateIdeaMutation.isPending}
          />
          <p className="text-xs text-slate-500 mt-1">
            Must be a valid URL starting with http:// or https://
          </p>
        </div>

        <div className="border-t pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPaid"
              checked={isPaid}
              onChange={handleChange}
              disabled={updateIdeaMutation.isPending}
              className="w-4 h-4 text-primary rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Make this idea paid</span>
          </label>
          <p className="text-xs text-slate-500 mt-2">
            Users will need to purchase access to view this idea
          </p>
        </div>

        {isPaid && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Set Price <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-700">$</span>
              <Input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder="9.99"
                min="0.01"
                step="0.01"
                max="9999.99"
                disabled={updateIdeaMutation.isPending}
                className="flex-1"
              />
              <span className="text-sm text-slate-600">USD</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Price must be between $0.01 and $9,999.99
            </p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-2 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as any, true);
            }}
            disabled={updateIdeaMutation.isPending || success}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {updateIdeaMutation.isPending && formData.status === "DRAFT" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save as Draft
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as any, false);
            }}
            disabled={updateIdeaMutation.isPending || success}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {updateIdeaMutation.isPending && formData.status === "UNDER_REVIEW" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit for Review
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={updateIdeaMutation.isPending}
            className="px-4"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
