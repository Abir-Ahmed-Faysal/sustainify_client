"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, AlertCircle, Loader2 } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import { toggleIdeaFeatured, updateIdeaStatusByAdmin } from "@/services/idea.service";
import { updateIdeaStatusByAdminSchema } from "@/zod/idea.zod";
import { toast } from "sonner";
import Link from "next/link";

interface AdminIdeaCardProps {
  idea: IIdea;
  onStatusChange?: () => void;
  onFeaturedToggle?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-50 border-green-200";
    case "REJECTED":
      return "bg-red-50 border-red-200";
    case "UNDER_REVIEW":
      return "bg-yellow-50 border-yellow-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "UNDER_REVIEW":
      return "secondary";
    default:
      return "outline";
  }
};

export const AdminIdeaCard: React.FC<AdminIdeaCardProps> = ({
  idea,
  onStatusChange,
  onFeaturedToggle,
}) => {
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);

  const handleToggleFeatured = async () => {
    setIsTogglingFeatured(true);
    try {
      const result = await toggleIdeaFeatured(idea.id, !idea.isFeatured);

      if (result.success) {
        toast.success(result.message);
        onFeaturedToggle?.();
      } else {
        toast.error(result.message || "Failed to toggle featured status");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsTogglingFeatured(false);
    }
  };

  return (
    <>
      <Card className={`border-2 ${getStatusColor(idea.status)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                by {idea.author.name}
              </p>
            </div>
            <div className="flex gap-1">
              <Badge variant={getStatusBadgeVariant(idea.status)}>
                {idea.status}
              </Badge>
              {idea.isFeatured && (
                <Badge variant="default" className="bg-amber-500">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Idea Details */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Problem Statement:</p>
            <p className="text-sm line-clamp-2">{idea.problemStatement}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Solution:</p>
            <p className="text-sm line-clamp-2">{idea.solution || "N/A"}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{idea.category.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">${idea.price || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Votes</p>
              <p className="font-medium">
                {idea.totalUpVotes}🔼 {idea.totalDownVotes}🔽
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant={idea.isFeatured ? "default" : "outline"}
              onClick={handleToggleFeatured}
              disabled={isTogglingFeatured}
              className="flex-1 gap-2"
            >
              <Star className={`h-4 w-4 ${idea.isFeatured ? "fill-current" : ""}`} />
              {idea.isFeatured ? "Remove Featured" : "Mark Featured"}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowStatusForm(true)}
            >
              Change Status
            </Button>

            <Link href={`/admin/dashboard/ideas/${idea.id}`} className="flex-1">
              <Button
                size="sm"
                variant="secondary"
                className="w-full gap-2"
              >
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Status Change Form - Inline */}
      {showStatusForm && <AdminStatusFormInline idea={idea} onSubmit={() => {
            setShowStatusForm(false);
            onStatusChange?.();
          }} onCancel={() => setShowStatusForm(false)} />}
    </>
  );
};

// Inline Status Form Component
interface AdminStatusFormInlineProps {
  idea: IIdea;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const AdminStatusFormInline: React.FC<AdminStatusFormInlineProps> = ({
  idea,
  onSubmit,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    status: idea.status as "APPROVED" | "REJECTED" | "UNDER_REVIEW",
    feedback: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const result = updateIdeaStatusByAdminSchema.safeParse(formData);

    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      result.error.issues?.forEach((issue: any) => {
        const path = issue.path[0];
        if (path) {
          validationErrors[String(path)] = issue.message;
        }
      });
      setErrors(validationErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      const result = await updateIdeaStatusByAdmin(idea.id, formData);

      if (result.success) {
        toast.success(result.message);
        onSubmit?.();
      } else {
        setGlobalError(result.message || "An error occurred");
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setGlobalError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50 mt-4">
      <CardHeader>
        <CardTitle className="text-base">Review & Change Status</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {globalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status" className="font-medium">
              Decision *
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as "APPROVED" | "REJECTED" | "UNDER_REVIEW",
                }));
                if (errors.status) {
                  setErrors((prev) => ({ ...prev, status: "" }));
                }
              }}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm disabled:opacity-50"
            >
              <option value="UNDER_REVIEW">Keep Under Review</option>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
            </select>
            {errors.status && (
              <p className="text-xs text-destructive">{errors.status}</p>
            )}
          </div>

          {/* Feedback (Required for Rejection) */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="font-medium">
              Feedback {formData.status === "REJECTED" && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="feedback"
              placeholder={
                formData.status === "REJECTED"
                  ? "Explain why this idea is being rejected (required)..."
                  : "Add feedback or comments (optional)..."
              }
              value={formData.feedback}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, feedback: e.target.value }));
                if (errors.feedback) {
                  setErrors((prev) => ({ ...prev, feedback: "" }));
                }
              }}
              disabled={isLoading}
              className="min-h-24 resize-none"
            />
            {errors.feedback && (
              <p className="text-xs text-destructive">{errors.feedback}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.status === "REJECTED"
                ? "Feedback is required for rejected ideas"
                : "Help the author improve their submission"}
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${
                formData.status === "APPROVED"
                  ? "bg-green-600 hover:bg-green-700"
                  : formData.status === "REJECTED"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Submit Decision
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminIdeaCard;
