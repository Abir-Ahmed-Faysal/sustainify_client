"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ICategory } from "@/types/category.types";
import { createCategory, updateCategory } from "@/services/category.service";
import { createCategoryZodSchema, updateCategoryZodSchema } from "@/zod/category.zod";
import { toast } from "sonner";
import CloudinaryImageUploader from "@/components/shared/CloudinaryImageUploader";
import { rollbackUploadedImages } from "@/services/cloudinary.service";

interface CategoryFormProps {
  category?: ICategory;
  onSuccess?: (category: ICategory) => void;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!category;
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    image: category?.image || "",
  });
  const [previousImage, setPreviousImage] = useState(category?.image || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (data: typeof formData) => {
    const schema = isEditing ? updateCategoryZodSchema : createCategoryZodSchema;
    const result = schema.safeParse(data);
    
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (value: string | string[]) => {
    const imageUrl = Array.isArray(value) ? value[0] : value;
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    // Clear image error when user uploads
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm(formData)) {
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      let result;
      if (isEditing && category?.id) {
        result = await updateCategory(category.id, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result.success && result.data) {
        toast.success(result.message);
        setPreviousImage(formData.image);
        onSuccess?.(result.data);
      } else {
        setGlobalError(result.message || "An error occurred");
        toast.error(result.message || "An error occurred");

        // Rollback uploaded images if submission failed
        if (formData.image && formData.image !== previousImage) {
          await rollbackUploadedImages([formData.image], (error) => {
            console.warn("Rollback warning:", error);
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setGlobalError(errorMessage);
      toast.error(errorMessage);

      // Rollback uploaded images if submission failed
      if (formData.image && formData.image !== previousImage) {
        await rollbackUploadedImages([formData.image], (error) => {
          console.warn("Rollback warning:", error);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || isUploadingImage;

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Category" : "Create New Category"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing
              ? "Update the category information below"
              : "Fill in the details to create a new category"}
          </p>
        </div>

        {globalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Solar Energy"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isSubmitDisabled}
              className="h-10"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Image Upload Field */}
          <div className="space-y-2">
            <CloudinaryImageUploader
              mode="single"
              value={formData.image}
              onChange={handleImageChange}
              onUploadingChange={setIsUploadingImage}
              label="Category Image"
              hint="Upload a representative image for this category (JPG, PNG, WEBP)"
              disabled={isSubmitDisabled}
            />
            {errors.image && (
              <p className="text-xs text-destructive mt-1">
                {errors.image}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitDisabled}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="flex-1"
            >
              {isSubmitDisabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Category" : "Create Category"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;

