"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVote } from "@/services/vote.service";
import { toggleFavourite } from "@/services/favourite.service";

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

// Hook for favourite toggle
export const useFavourite = (ideaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await toggleFavourite({ ideaId });
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["myFavourites"] });
    },
  });
};
