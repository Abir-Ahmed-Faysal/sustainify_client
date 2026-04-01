"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVote } from "@/services/vote.service";
import { getUserInfo } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IdeaCardVoteProps {
  ideaId: string;
  initialUpVotes: number;
  initialDownVotes: number;
  userVoteType?: "UP" | "DOWN";
}

export default function IdeaCardVote({
  ideaId,
  initialUpVotes,
  initialDownVotes,
  userVoteType,
}: IdeaCardVoteProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // We rely directly on invalidateQueries to update the parent data,
  // but we can compute net votes from props for initial display.
  const netVotes = initialUpVotes - initialDownVotes;
  const isUpvoted = userVoteType === "UP";

  const { mutate } = useMutation({
    mutationFn: async () => {
      // First check auth client side to avoid unnecessary api calls
      const user = await getUserInfo();
      if (!user) {
        throw new Error("UNAUTHORIZED");
      }
      return toggleVote(ideaId, isUpvoted ? "DOWN" : "UP"); // If already upvoted, clicking it removes vote/toggles. Wait, toggleVote just takes UP or DOWN. Standard behavior: click upvote to upvote.
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["ideas"] });
      } else {
        toast.error(data?.message || "Failed to vote");
      }
    },
    onError: (error: Error) => {
      if (error.message === "UNAUTHORIZED") {
        toast.error("You must be logged in to vote");
        router.push("/login");
      } else {
        toast.error("Something went wrong");
      }
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation since this is wrapped in Link in the card (wait, no. The card has separate link for view details. But let's be safe).
    if (isProcessing) return;
    setIsProcessing(true);
    mutate();
  };

  return (
    <button
      onClick={handleVote}
      disabled={isProcessing}
      className={`flex items-center gap-1.5 transition-colors group p-1 rounded-md ${
        isUpvoted 
          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" 
          : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
      title={isUpvoted ? "Remove vote" : "Upvote this idea"}
    >
      {isProcessing ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <Star className={`size-5 ${isUpvoted ? "fill-current" : "group-hover:fill-emerald-200 dark:group-hover:fill-emerald-800/50 transition-colors"}`} />
      )}
      <span className="text-sm font-bold">{netVotes} Votes</span>
    </button>
  );
}
