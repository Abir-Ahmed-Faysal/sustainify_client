"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(pathname + "?" + createQueryString("page", page.toString()));
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 py-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-800"
            >
                <ChevronLeft className="size-4" />
            </Button>
            
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // For short pagination, just show all. For many pages, we should ellipsis.
                    // For now, simple implementation as we expect ~10-12 ideas per page.
                    return (
                        <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(pageNum)}
                            className={`h-10 w-10 rounded-xl ${
                                currentPage === pageNum 
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                                : "border-slate-200 dark:border-slate-800"
                            }`}
                        >
                            {pageNum}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-800"
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
}
