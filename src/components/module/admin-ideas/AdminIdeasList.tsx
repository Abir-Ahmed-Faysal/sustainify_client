"use client";

import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import { AdminIdeaCard } from "./AdminIdeaCard";

interface AdminIdeasListProps {
  ideas: IIdea[];
  status?: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const AdminIdeasList: React.FC<AdminIdeasListProps> = ({
  ideas,
  status = "UNDER_REVIEW",
  isLoading = false,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading ideas...</p>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No {status.toLowerCase()} ideas</h3>
        <p className="text-sm text-muted-foreground">
          {status === "UNDER_REVIEW"
            ? "All ideas have been reviewed!"
            : `No ideas with ${status} status yet`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          Ideas for Review ({ideas.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ideas.map((idea) => (
          <AdminIdeaCard
            key={idea.id}
            idea={idea}
            onStatusChange={onRefresh}
            onFeaturedToggle={onRefresh}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminIdeasList;
