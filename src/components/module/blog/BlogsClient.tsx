/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllBlogs } from "@/services/blog.service";
import { IBlogQuery } from "@/types/blog.types";
import BlogCard from "./BlogCard";
import { Loader2, Search, SlidersHorizontal, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogsClientProps {
  queryParams: IBlogQuery;
}

export default function BlogsClient({ queryParams }: BlogsClientProps) {
  const [params, setParams] = useState<IBlogQuery>(queryParams);
  const [searchInput, setSearchInput] = useState(queryParams.searchTerm || "");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogs", params],
    queryFn: () => getAllBlogs(params),
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({ ...prev, searchTerm: searchInput || undefined, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    setParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
      page: 1,
    }));
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-500 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Failed to load blogs</h3>
        <p className="text-slate-500 max-w-md">
          {(error as any)?.message || "An unexpected error occurred. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            placeholder="Search blogs..."
            className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all shadow-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select onValueChange={handleSortChange} defaultValue="createdAt-desc">
            <SelectTrigger className="w-full md:w-[180px] h-11 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 shadow-none">
              <SlidersHorizontal className="size-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="size-10 animate-spin text-emerald-600" />
          <p className="text-slate-500 font-medium animate-pulse">Fetching latest stories...</p>
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.data.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
             <Search className="size-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No blogs found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Try adjusting your search keywords to find what you&apos;re looking for.
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setSearchInput("")}
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Pagination (Simplified for now) */}
      {!isLoading && data?.data && data.data.length > 0 && (
        <div className="flex justify-center py-8">
           <p className="text-sm text-slate-400 italic">Showing {data.data.length} inspiring stories</p>
        </div>
      )}
    </div>
  );
}
