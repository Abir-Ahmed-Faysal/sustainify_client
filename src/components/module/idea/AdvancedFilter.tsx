"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X, Filter } from "lucide-react";

interface AdvancedFilterProps {
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  authors: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

export interface FilterState {
  // Vote range
  minVotes?: number;
  maxVotes?: number;
  
  // Author
  authorId?: string;
  
  // Category
  categoryId?: string;
  
  // Price
  ispaid?: string;
  
  // Status
  status?: string;
  
  // Featured
  featured?: string;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  onApplyFilters,
  onClearFilters,
  authors,
  categories,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (value === "" || value === null || value === undefined) {
        delete updated[key];
      } else {
        updated[key] = value;
      }
      return updated;
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setHasActiveFilters(Object.keys(filters).length > 0);
  };

  const handleClear = () => {
    setFilters({});
    setHasActiveFilters(false);
    onClearFilters();
  };

  return (
    <div className="space-y-3">
      {/* Filter Toggle Button */}
      <Button
        variant={hasActiveFilters ? "default" : "outline"}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full"
      >
        <Filter className="w-4 h-4 mr-2" />
        Advanced Filters {hasActiveFilters && `(${Object.keys(filters).length})`}
      </Button>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <Card className="p-4 space-y-4">
          {/* Vote Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Vote Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min votes"
                value={filters.minVotes ?? ""}
                onChange={(e) =>
                  handleFilterChange("minVotes", e.target.value ? parseInt(e.target.value) : undefined)
                }
                min="0"
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Max votes"
                value={filters.maxVotes ?? ""}
                onChange={(e) =>
                  handleFilterChange("maxVotes", e.target.value ? parseInt(e.target.value) : undefined)
                }
                min="0"
                className="w-1/2"
              />
            </div>
            <p className="text-xs text-gray-500">Filter by total upvotes range</p>
          </div>

          {/* Author Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Author</label>
            <Select
              value={filters.authorId ?? ""}
              onValueChange={(value) =>
                handleFilterChange("authorId", value === "" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select author..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Clear Selection</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <Select
              value={filters.categoryId ?? ""}
              onValueChange={(value) =>
                handleFilterChange("categoryId", value === "" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Clear Selection</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Price Type</label>
            <Select
              value={filters.ispaid ?? ""}
              onValueChange={(value) =>
                handleFilterChange("ispaid", value === "" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All prices..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="true">Paid Ideas</SelectItem>
                <SelectItem value="false">Free Ideas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Featured</label>
            <Select
              value={filters.featured ?? ""}
              onValueChange={(value) =>
                handleFilterChange("featured", value === "" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All ideas..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ideas</SelectItem>
                <SelectItem value="true">Featured Only</SelectItem>
                <SelectItem value="false">Non-Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button onClick={handleApply} className="flex-1" variant="default">
              Apply Filters
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
              disabled={Object.keys(filters).length === 0}
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
