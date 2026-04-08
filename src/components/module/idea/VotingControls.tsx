"use client";

import { useState } from "react";
import { useVote, useFavourite } from "@/hooks/useVote";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Heart } from "lucide-react";
import { IIdea } from "@/types/idea.types";

interface VotingControlsProps {
  idea: IIdea;
  userVoteType?: "UP" | "DOWN" | null;
  isFavorite?: boolean;
  onVoteChange?: (voteType: "UP" | "DOWN" | null) => void;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export default function VotingControls({
  idea,
  userVoteType = null,
  isFavorite = false,
  onVoteChange,
  onFavoriteChange,
}: VotingControlsProps) {
  const [localVote, setLocalVote] = useState<"UP" | "DOWN" | null>(userVoteType);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const voteMutation = useVote(idea.id);
  const favoriteMutation = useFavourite(idea.id);

  const handleVote = async (type: "UP" | "DOWN") => {
    voteMutation.mutate(type, {
      onSuccess: (res) => {
        const nextVote = res?.data?.type ?? null; // backend returns null when removed
        setLocalVote(nextVote);
        onVoteChange?.(nextVote);
      },
    });
  };

  const handleFavorite = async () => {
    favoriteMutation.mutate(undefined, {
      onSuccess: () => {
        setLocalFavorite(!localFavorite);
        onFavoriteChange?.(!localFavorite);
      },
    });
  };

  const isLoading =
    voteMutation.isPending || favoriteMutation.isPending;

  return (
    <div className="flex items-center gap-2">
      {/* Upvote Button */}
      <Button
        variant={localVote === "UP" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("UP")}
        disabled={isLoading}
        className="flex items-center gap-1"
        title="Upvote this idea"
      >
        <ArrowUp className="w-4 h-4" />
        <span className="text-xs font-medium">{idea.totalUpVotes}</span>
      </Button>

      {/* Downvote Button */}
      <Button
        variant={localVote === "DOWN" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("DOWN")}
        disabled={isLoading}
        className="flex items-center gap-1"
        title="Downvote this idea"
      >
        <ArrowDown className="w-4 h-4" />
        <span className="text-xs font-medium">{idea.totalDownVotes}</span>
      </Button>

      {/* Vote Ratio */}
      <div className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {Math.round(idea.positiveRatio * 100)}%
        </span>
      </div>

      {/* Favorite Button */}
      <Button
        variant={localFavorite ? "default" : "outline"}
        size="sm"
        onClick={handleFavorite}
        disabled={isLoading}
        className="flex items-center gap-1 ml-2"
        title="Add to favorites"
      >
        <Heart
          className={`w-4 h-4 ${
            localFavorite ? "fill-current" : ""
          }`}
        />
        <span className="text-xs">
          {localFavorite ? "Saved" : "Save"}
        </span>
      </Button>
    </div>
  );
}
