"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import IdeaDetails from "./IdeaDetails";
import CommentsDisplay from "./CommentsDisplay";
import CommentInput from "./CommentInput";
import { IIdea } from "@/types/idea.types";
import {
  getCommentsByIdeaId,
  createComment,
  updateComment,
  deleteComment,
  IComment,
} from "@/services/comment.service";
import { toggleVote } from "@/services/vote.service";
import { toggleFavourite } from "@/services/favourite.service";
import { Loader2 } from "lucide-react";

interface IdeaDetailsClientProps {
  idea: IIdea;
  currentUserId?: string;
  isAuthor: boolean;
}

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

export default function IdeaDetailsClient({
  idea,
  currentUserId,
  isAuthor,
}: IdeaDetailsClientProps) {
  const queryClient = useQueryClient();
  const [ideaState, setIdeaState] = useState<IIdea>(idea);
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [isFavourited, setIsFavourited] = useState<boolean>(() => !!idea.userFavourite);

  // Fetch comments
  const {
    data: comments = [],
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", idea.id],
    queryFn: async () => {
      const response = await getCommentsByIdeaId(idea.id);
      return response.data || [];
    },
  });

  const currentVoteType: VoteType | null = ideaState.userVote?.type ?? null;
  const hasUserUpvoted = currentVoteType === "UP";
  const hasUserDownvoted = currentVoteType === "DOWN";

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (editingComment) {
        return updateComment(editingComment.id, { content });
      }
      return createComment({ content, ideaId: idea.id });
    },
    onSuccess: () => {
      refetchComments();
      setEditingComment(null);
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      refetchComments();
    },
  });

  // Toggle vote mutation (single API call for UP/DOWN toggle)
  const toggleVoteMutation = useMutation({
    mutationFn: (type: VoteType) => toggleVote(ideaState.id, type),
    onSuccess: (response, requestedType) => {
      if (!response?.success) return;

      const prevVote = ideaState.userVote?.type ?? null;
      const nextVote: VoteType | null = response.data?.type ?? null; // null => removed
      const finalVote = nextVote ?? (requestedType === prevVote ? null : requestedType);

      setIdeaState((prev) => applyVoteUpdate(prev, prevVote, finalVote));

      // Keep any lists/details caches consistent
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea", ideaState.id] });
    },
  });

  // Toggle favourite mutation
  const toggleFavouriteMutation = useMutation({
    mutationFn: () => toggleFavourite({ ideaId: idea.id }),
    onSuccess: (response) => {
      if (response.data) {
        const newStatus = response.data.action === "ADDED";
        setIsFavourited(newStatus);
        // Invalidate favourite queries
        queryClient.invalidateQueries({ queryKey: ["myFavorites"] });
      }
    },
  });

  const handleCommentSubmit = (content: string) => {
    createCommentMutation.mutate(content);
  };

  const handleCommentDelete = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleCommentEdit = (comment: IComment) => {
    setEditingComment(comment);
  };

  const handleUpvote = () => {
    toggleVoteMutation.mutate("UP");
  };

  const handleDownvote = () => {
    toggleVoteMutation.mutate("DOWN");
  };

  const handleToggleFavourite = () => {
    toggleFavouriteMutation.mutate();
  };

  return (
    <div className="space-y-12">
      {/* Idea Details with Voting */}
      <IdeaDetails
        idea={ideaState}
        isAuthor={isAuthor}
        currentUserId={currentUserId}
        hasUserUpvoted={hasUserUpvoted}
        hasUserDownvoted={hasUserDownvoted}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onRemoveVote={() =>
          toggleVoteMutation.mutate(currentVoteType === "DOWN" ? "DOWN" : "UP")
        }
        isFavourited={isFavourited}
        onToggleFavourite={handleToggleFavourite}
        isLoadingVote={
          toggleVoteMutation.isPending
        }
        isLoadingFavourite={toggleFavouriteMutation.isPending}
      />

      {/* Comments Section */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            💬 Comments ({comments.length})
          </h2>

          {/* Comment Input */}
          {currentUserId && (
            <div className="mb-8">
              <CommentInput
                onSubmit={handleCommentSubmit}
                isLoading={createCommentMutation.isPending}
                editingComment={editingComment}
                onCancelEdit={() => setEditingComment(null)}
              />
            </div>
          )}

          {/* Comments Display */}
          {commentsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <CommentsDisplay
              comments={comments}
              currentUserId={currentUserId}
              onDelete={handleCommentDelete}
              onEdit={handleCommentEdit}
              isLoading={deleteCommentMutation.isPending}
            />
          )}

          {!currentUserId && comments.length > 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>
                <a href="/login" className="text-emerald-600 hover:underline">
                  Login
                </a>{" "}
                to add a comment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
