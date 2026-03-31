/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIdea } from "@/services/idea.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle, Save, Send } from "lucide-react";
import { ICategory } from "@/types/category.types";
import { IIdeaCreate } from "@/types/idea.types";

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
  });

  // Mutation for creating idea (Submit for review)
  const createIdeaMutation = useMutation({
    mutationFn: async (payload: IIdeaCreate) => {
      return await createIdea(payload);
    },
    onSuccess: (data) => {
      if (data.success) {
        setSuccess(true);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["myIdeas"] });

        // Redirect after short delay
        setTimeout(() => {
          router.push("/dashboard/my-ideas");
        }, 1500);
      } else {
        setError(data.message || "Failed to create idea");
      }
    },
    onError: (err: any) => {
      setError(err.message || "An error occurred while creating the idea");
    },
  });

  // Mutation for saving as draft
  const saveDraftMutation = useMutation({
    mutationFn: async (payload: IIdeaCreate) => {
      return await createIdea({ ...payload, status: "DRAFT" });
    },
    onSuccess: (data) => {
      if (data.success) {
        setSuccess(true);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["myIdeas"] });

        // Redirect after short delay
        setTimeout(() => {
          router.push("/dashboard/my-ideas");
        }, 1500);
      } else {
        setError(data.message || "Failed to save draft");
      }
    },
    onError: (err: any) => {
      setError(err.message || "An error occurred while saving draft");
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

    if (isDraft) {
      // Draft can be saved with minimal data
      saveDraftMutation.mutate(formData);
    } else {
      // Full validation for submission
      if (!formData.title || formData.title.length < 3) {
        setError("Title must be at least 3 characters");
        return;
      }

      if (
        !formData.problemStatement ||
        formData.problemStatement.length < 10
      ) {
        setError("Problem statement must be at least 10 characters");
        return;
      }

      if (!formData.solution || formData.solution.length < 10) {
        setError("Solution must be at least 10 characters");
        return;
      }

      if (!formData.description || formData.description.length < 10) {
        setError("Description must be at least 10 characters");
        return;
      }

      if (!formData.categoryId) {
        setError("Please select a category");
        return;
      }

      // If image URL is provided, validate it
      if (formData.image && !formData.image.match(/^https?:\/\/.+/)) {
        setError("Please provide a valid image URL");
        return;
      }

      // If paid, validate price
      if (isPaid) {
        if (!formData.price || formData.price <= 0) {
          setError("Price must be greater than $0.01");
          return;
        }
        if (formData.price > 9999.99) {
          setError("Price must not exceed $9,999.99");
          return;
        }
      }

      createIdeaMutation.mutate(formData);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>Idea created successfully! Redirecting...</span>
          </div>
        )}

        {/* Title */}
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
            disabled={createIdeaMutation.isPending}
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 3 characters (Currently: {formData.title.length})
          </p>
        </div>

        {/* Problem Statement */}
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
            disabled={createIdeaMutation.isPending}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 10 characters (Currently: {formData.problemStatement.length})
          </p>
        </div>

        {/* Proposed Solution */}
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
            disabled={createIdeaMutation.isPending}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 10 characters (Currently: {formData.solution.length})
          </p>
        </div>

        {/* Full Description */}
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
            disabled={createIdeaMutation.isPending}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 10 characters (Currently: {formData.description.length})
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
            disabled={
              createIdeaMutation.isPending || initialCategories.length === 0
            }
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

        {/* Image URL */}
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
            disabled={createIdeaMutation.isPending}
          />
          <p className="text-xs text-slate-500 mt-1">
            Must be a valid URL starting with http:// or https://
          </p>
        </div>

        {/* Make Idea Paid Checkbox */}
        <div className="border-t pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPaid"
              checked={isPaid}
              onChange={handleChange}
              disabled={createIdeaMutation.isPending}
              className="w-4 h-4 text-primary rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Make this idea paid
            </span>
          </label>
          <p className="text-xs text-slate-500 mt-2">
            Users will need to purchase access to view this idea
          </p>
        </div>

        {/* Price Input - Only shown when paid */}
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
                disabled={createIdeaMutation.isPending}
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
            disabled={saveDraftMutation.isPending || createIdeaMutation.isPending || success}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {saveDraftMutation.isPending ? (
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
            disabled={createIdeaMutation.isPending || saveDraftMutation.isPending || success}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {createIdeaMutation.isPending ? (
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
            disabled={createIdeaMutation.isPending || saveDraftMutation.isPending}
            className="px-4"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
