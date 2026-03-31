"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVote, toggleFavorite } from "@/services/vote.service";
import type { IIdea } from "@/types/idea.types";
import type { ApiResponse } from "@/types/api.types";

type VoteType = "UP" | "DOWN";

const applyVoteUpdate = (
  idea: IIdea,
  prevVote: VoteType | null,
  newVote: VoteType | null
): IIdea => {
  let totalUpVotes = idea.totalUpVotes;
  let totalDownVotes = idea.totalDownVotes;

  if (prevVote === "UP") totalUpVotes = Math.max(0, totalUpVotes - 1);
  if (prevVote === "DOWN") totalDownVotes = Math.max(0, totalDownVotes - 1);

  if (newVote === "UP") totalUpVotes += 1;
  if (newVote === "DOWN") totalDownVotes += 1;

  const total = totalUpVotes + totalDownVotes;
  const positiveRatio = total === 0 ? 0 : totalUpVotes / total;

  return {
    ...idea,
    totalUpVotes,
    totalDownVotes,
    positiveRatio,
    userVote: newVote ? { id: idea.userVote?.id ?? "local", type: newVote } : null,
  };
};

const isIdeasApiResponse = (value: unknown): value is ApiResponse<IIdea[]> => {
  if (!value || typeof value !== "object") return false;
  const v = value as { data?: unknown };
  return Array.isArray(v.data);
};

const isIdeaOrIdeaApiResponse = (value: unknown): value is IIdea | ApiResponse<IIdea | null> => {
  if (!value || typeof value !== "object") return false;
  const v = value as { id?: unknown; data?: unknown };
  return typeof v.id === "string" || "data" in v;
};

// Single smart-vote hook (same vote removes, different toggles)
export const useVote = (ideaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: VoteType) => {
      return await toggleVote(ideaId, type);
    },
    onSuccess: (res, requestedType) => {
      const nextVote: VoteType | null = res?.data?.type ?? null; // null means backend removed vote

      // Update any cached ideas lists (all variants of ["ideas", ...])
      queryClient.setQueriesData(
        { queryKey: ["ideas"] },
        (old: unknown) => {
          if (!isIdeasApiResponse(old)) return old;
          const ideas = old.data;

          const updated = ideas.map((i) => {
            if (i.id !== ideaId) return i;
            const prevVote = i.userVote?.type ?? null;
            return applyVoteUpdate(i, prevVote, nextVote ?? (requestedType === prevVote ? null : requestedType));
          });

          return { ...old, data: updated };
        }
      );

      // Update cached single idea if present
      queryClient.setQueryData(["idea", ideaId], (old: unknown) => {
        if (!isIdeaOrIdeaApiResponse(old)) return old;
        const idea: IIdea | null =
          (old as ApiResponse<IIdea | null>).data ?? (old as IIdea);
        if (!idea) return old;

        const prevVote = idea.userVote?.type ?? null;
        const finalVote =
          nextVote ?? (requestedType === prevVote ? null : requestedType);
        const updated = applyVoteUpdate(idea, prevVote, finalVote);
        return (old as ApiResponse<IIdea | null>)?.data !== undefined
          ? ({ ...(old as ApiResponse<IIdea | null>), data: updated } as ApiResponse<IIdea | null>)
          : updated;
      });

      // Keep other pages consistent
      queryClient.invalidateQueries({ queryKey: ["myIdeas"] });
    },
  });
};

// Hook for favorite toggle
export const useFavorite = (ideaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await toggleFavorite(ideaId);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["myFavorites"] });
    },
  });
};
