"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
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

const categories = ["Energy", "Waste", "Transportation", "Food", "Water", "Biodiversity"];

export default function IdeasFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");

  // Update query params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page when filters change
      if (name !== "page") {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        if (searchTerm !== (searchParams.get("searchTerm") || "")) {
            router.push(pathname + "?" + createQueryString("searchTerm", searchTerm));
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, createQueryString, searchParams]);

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value === "all" ? "" : value));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
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

      <div className="flex items-center gap-3">
        {/* Category Filter */}
        <div className="w-full md:w-[180px]">
          <Select 
            defaultValue={searchParams.get("category") || "all"}
            onValueChange={(val: string) => handleFilterChange("category", val)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sorting */}
        <div className="w-full md:w-[160px]">
          <Select 
            defaultValue={searchParams.get("sortBy") || "createdAt"}
            onValueChange={(val: string) => handleFilterChange("sortBy", val)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Recent</SelectItem>
              <SelectItem value="voteCount">Top Voted</SelectItem>
              <SelectItem value="commentCount">Most Discussed</SelectItem>
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
        
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl shrink-0" onClick={() => router.push(pathname)}>
          <SlidersHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}

