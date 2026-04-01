"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import { updateIdeaStatusByAdmin } from "@/services/idea.service";
import { updateIdeaStatusByAdminSchema } from "@/zod/idea.zod";
import { toast } from "sonner";

interface AdminStatusFormProps {
  idea: IIdea;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const AdminStatusForm: React.FC<AdminStatusFormProps> = ({
  idea,
  onSubmit,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    status: "UNDER_REVIEW" as "APPROVED" | "REJECTED" | "UNDER_REVIEW",
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
                  <CheckCircle2 className="mr-2 h-4 w-4" />
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

export default AdminStatusForm;
