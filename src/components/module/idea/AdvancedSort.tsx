"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
  description?: string;
}

interface AdvancedSortProps {
  onSortChange: (sortBy: string, sortOrder: string) => void;
  currentSort?: string;
}

const SORT_OPTIONS: SortOption[] = [
  {
    label: "Newest First",
    value: "createdAt-desc",
    description: "Recently created ideas",
  },
  {
    label: "Oldest First",
    value: "createdAt-asc",
    description: "Earliest created ideas",
  },
  {
    label: "Most Voted",
    value: "totalUpVotes-desc",
    description: "Ideas with most upvotes",
  },
  {
    label: "Least Voted",
    value: "totalUpVotes-asc",
    description: "Ideas with fewest upvotes",
  },
  {
    label: "Best Ratio",
    value: "positiveRatio-desc",
    description: "Ideas with best upvote ratio",
  },
  {
    label: "Most Commented (Client Sort)",
    value: "comments-desc",
    description: "Sorted on client side",
  },
  {
    label: "Price: Low to High",
    value: "price-asc",
    description: "Cheapest first",
  },
  {
    label: "Price: High to Low",
    value: "price-desc",
    description: "Most expensive first",
  },
];

export const AdvancedSort: React.FC<AdvancedSortProps> = ({
  onSortChange,
  currentSort = "createdAt-desc",
}) => {
  const handleSortChange = (value: string) => {
    if (value === "comments-desc") {
      // Client-side sorting indicator
      onSortChange("comments", "desc");
    } else if (value === "comments-asc") {
      onSortChange("comments", "asc");
    } else {
      const [field, order] = value.split("-");
      onSortChange(field, order as "asc" | "desc");
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4" />
        Sort By
      </label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort ideas..." />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-gray-500">{option.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
