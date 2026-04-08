"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { ICategory } from "@/types/category.types";
import { deleteCategory } from "@/services/category.service";
import { toast } from "sonner";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CategoryListProps {
  categories: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: () => void;
  isLoading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
  pagination,
  onPageChange,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const handleDeleteClick = (category: ICategory) => {
    setSelectedCategory(category);
    setConfirmDeleteId(category.id);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    setDeletingId(selectedCategory.id);
    try {
      const result = await deleteCategory(selectedCategory.id);

      if (result.success) {
        toast.success(result.message);
        onDelete();
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
      setSelectedCategory(null);
    }
  };

  const handleCancel = () => {
    setConfirmDeleteId(null);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No categories found</h3>
        <p className="text-sm text-muted-foreground">
          Create your first category to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{category.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                {category.image ? (
                  <a
                    href={category.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                    title={category.image}
                  >
                    View Image
                  </a>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    No Image
                  </Badge>
                )}
                {category.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(category)}
                className="h-8 w-8 p-0"
                title="Edit category"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(category)}
                disabled={deletingId === category.id}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Delete category"
              >
                {deletingId === category.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} categories
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  disabled={isLoading}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Prompt */}
      {confirmDeleteId && selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold">Delete Category</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete <strong>{selectedCategory.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={!!deletingId}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={!!deletingId}
              >
                {deletingId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryList;
