"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVote, removeVote, toggleFavorite } from "@/services/vote.service";

// Hook for voting
export const useVote = (ideaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: "UP" | "DOWN") => {
      return await toggleVote(ideaId, type);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["myIdeas"] });
    },
  });
};

// Hook for removing vote
export const useRemoveVote = (ideaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await removeVote(ideaId);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
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
