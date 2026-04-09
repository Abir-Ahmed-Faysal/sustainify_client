"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Loader2, TrendingUp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/axios/api";

interface SearchSuggestion {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  totalUpVotes: number;
  author: {
    id: string;
    name: string;
  };
}

export default function SearchSuggestions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get<SearchSuggestion[]>(
          "/ideas/search/suggestions",
          {
            params: {
              search: query,
              limit: 5,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setSuggestions(response.data);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(searchQuery);
  }, [searchQuery, fetchSuggestions]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/ideas?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSuggestionClick = (idea: SearchSuggestion) => {
    window.location.href = `/ideas/${idea.id}`;
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <Input
              type="text"
              placeholder="Search ideas by title, category, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-4 py-2 h-11 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  <span className="ml-2 text-slate-600 dark:text-slate-400">
                    Searching...
                  </span>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      Results ({suggestions.length})
                    </p>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {suggestions.map((idea) => (
                      <button
                        key={idea.id}
                        onClick={() => handleSuggestionClick(idea)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-slate-900 dark:text-white line-clamp-1">
                              {idea.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              >
                                {idea.category.name}
                              </Badge>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                by {idea.author.name}
                              </span>
                            </div>
                          </div>
                          {idea.totalUpVotes > 0 && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 ml-2 flex-shrink-0">
                              <TrendingUp className="h-3 w-3" />
                              {idea.totalUpVotes}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <Button
                      onClick={handleSearch}
                      variant="ghost"
                      className="w-full text-emerald-600 dark:text-emerald-400 font-medium text-sm"
                    >
                      View all results for `&quot;`{searchQuery}`&quot;`
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No ideas found matching `&quot;`{searchQuery}`&quot;`. Try a different search term.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={handleSearch}
          disabled={!searchQuery.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 rounded-lg"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
