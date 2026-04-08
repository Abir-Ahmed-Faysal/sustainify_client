"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { ICategory } from "@/types/category.types";
import { getCategories, GetCategoriesParams } from "@/services/category.service";
import CategoryForm from "@/components/module/category/CategoryForm";
import CategoryList from "@/components/module/category/CategoryList";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface SheetState {
  isOpen: boolean;
  mode: "create" | "edit";
  category: ICategory | null;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({
    isOpen: false,
    mode: "create",
    category: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories
  const fetchCategories = useCallback(
    async (pageNum = 1, showRefreshToast = false) => {
      try {
        if (showRefreshToast) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const params: GetCategoriesParams = {
          page: pageNum,
          limit: 10,
          searchTerm: debouncedSearchTerm || undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        };

        const response = await getCategories(params);

        if (response.success) {
          setCategories(response.data || []);
          if (response.meta) {
            setPagination(response.meta);
          }
          if (showRefreshToast) {
            toast.success("Categories refreshed successfully");
          }
        } else {
          toast.error(response.message || "Failed to fetch categories");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch categories";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [debouncedSearchTerm]
  );

  // Initial fetch
  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  // Handle create
  const handleCreate = () => {
    setSheetState({
      isOpen: true,
      mode: "create",
      category: null,
    });
    setSheetOpen(true);
  };

  // Handle edit
  const handleEdit = (category: ICategory) => {
    setSheetState({
      isOpen: true,
      mode: "edit",
      category,
    });
    setSheetOpen(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    setSheetOpen(false);
    fetchCategories(1, true);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setSheetOpen(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchCategories(pagination.page, true);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchCategories(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage sustainability categories and their information
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Category
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetTitle>
                {sheetState.mode === "create" ? "Create Category" : "Edit Category"}
              </SheetTitle>
              <CategoryForm
                category={sheetState.category || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {/* Categories Card */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={() => fetchCategories(pagination.page)}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      {/* Stats */}
      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">With Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.filter((c) => c.image).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Without Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.filter((c) => !c.image).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

