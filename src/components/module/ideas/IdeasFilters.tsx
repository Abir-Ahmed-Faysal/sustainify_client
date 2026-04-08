"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getPublicUsers } from "@/services/user.service";
import { getCategories } from "@/services/category.service";

export default function IdeasFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [showAdvanced, setShowAdvanced] = useState(
    searchParams.get("totalUpVotes[gte]") || 
    searchParams.get("totalUpVotes[lte]") || 
    searchParams.get("price[gte]") ||
    searchParams.get("price[lte]") ||
    searchParams.get("authorId") ? true : false
  );
  const [minVotes, setMinVotes] = useState(searchParams.get("totalUpVotes[gte]") || "");
  const [maxVotes, setMaxVotes] = useState(searchParams.get("totalUpVotes[lte]") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("price[gte]") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("price[lte]") || "");

  // Fetch real authors
  const { data: authorsData, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: () => getPublicUsers({ limit: "100" }), // Get more users to populate filter
  });

  // Fetch real categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const authors = authorsData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  // Update query params using QueryBuilder format
  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      
      // Update or add params
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });
      
      // Reset page when filters change
      currentParams.delete("page");
      return currentParams.toString();
    },
    [searchParams]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        if (searchTerm !== (searchParams.get("searchTerm") || "")) {
            router.push(pathname + "?" + createQueryString({ searchTerm }));
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, createQueryString, searchParams]);

  const handleRangeChange = () => {
    router.push(pathname + "?" + createQueryString({ 
      "totalUpVotes[gte]": minVotes || undefined,
      "totalUpVotes[lte]": maxVotes || undefined,
      "price[gte]": minPrice || undefined,
      "price[lte]": maxPrice || undefined 
    }));
  };

  const handleClearFilters = () => {
    setMinVotes("");
    setMaxVotes("");
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setShowAdvanced(false);
    router.push(pathname);
  };

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString({ 
      [name]: value === "all" ? undefined : value 
    }));
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Main Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input 
            placeholder="Search ideas by title or keyword..." 
            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus-visible:ring-emerald-500/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          {/* Category Filter */}
          <div className="w-full md:w-[180px]">
            <Select 
              defaultValue={searchParams.get("categoryName") || "all"}
              onValueChange={(val: string) => handleFilterChange("categoryName", val)}
              disabled={isLoadingCategories}
            >
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none">
                <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sorting */}
          <div className="w-full md:w-[180px]">
            <Select 
              defaultValue={searchParams.get("sortBy") || "positiveRatio,createdAt"}
              onValueChange={(val: string) => handleFilterChange("sortBy", val)}
            >
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positiveRatio,createdAt">Top Match & Recent</SelectItem>
                <SelectItem value="createdAt">Recent</SelectItem>
                <SelectItem value="totalUpVotes">Top Rated</SelectItem>
                <SelectItem value="comments._count">Most Commented</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Filter */}
          <div className="w-full md:w-[140px]">
            <Select 
              defaultValue={searchParams.get("isPaid") || "all"}
              onValueChange={(val: string) => handleFilterChange("isPaid", val)}
            >
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access</SelectItem>
                <SelectItem value="false">Free</SelectItem>
                <SelectItem value="true">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Advanced Filters Toggle */}
          <Button 
            variant={showAdvanced ? "default" : "ghost"} 
            size="icon" 
            className="h-11 w-11 rounded-xl shrink-0" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Toggle advanced filters"
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Vote Range Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Vote Range (Upvotes)
                </label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Min votes"
                      value={minVotes}
                      onChange={(e) => setMinVotes(e.target.value)}
                      min="0"
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Max votes"
                      value={maxVotes}
                      onChange={(e) => setMaxVotes(e.target.value)}
                      min="0"
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={handleRangeChange}
                    size="sm"
                    className="h-10 px-4"
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Filter ideas by total upvotes</p>
              </div>

              {/* Price Range Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Price Range ($)
                </label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Min price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Max price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={handleRangeChange}
                    size="sm"
                    className="h-10 px-4"
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Filter paid ideas by price</p>
              </div>

              {/* Author Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Filter by Author
                </label>
                <Select
                  defaultValue={searchParams.get("authorId") || "all"}
                  onValueChange={(val: string) => handleFilterChange("authorId", val)}
                  disabled={isLoadingAuthors}
                >
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder={isLoadingAuthors ? "Loading authors..." : "All Authors"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {authors.map((author: { id: string; name: string }) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Show ideas from specific authors</p>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(minVotes || maxVotes || minPrice || maxPrice || searchParams.get("authorId") || searchParams.get("categoryName") !== null || searchParams.get("sortBy") !== null || searchParams.get("isPaid") !== null) && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="w-full text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
