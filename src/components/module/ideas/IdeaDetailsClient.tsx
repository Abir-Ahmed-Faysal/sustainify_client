"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

export default function IdeaDetailsClient({
  idea,
  currentUserId,
  isAuthor,
}: IdeaDetailsClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [userUpvoteStatus, setUserUpvoteStatus] = useState<
    "upvote" | "downvote" | "none"
  >(idea.userVote?.type === "UP" ? "upvote" : idea.userVote?.type === "DOWN" ? "downvote" : "none");
  const [isFavourited, setIsFavourited] = useState<boolean>(() => !!idea.userFavourite);

  // Fetch comments — only when comments are enabled for this idea
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
    enabled: idea.comment !== false,
  });

  // Note: we avoid syncing vote/favourite via effects to satisfy `react-hooks/set-state-in-effect`.

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
    mutationFn: (type: "UP" | "DOWN") => toggleVote(idea.id, type),
    onSuccess: (response, type) => {
      if (response.success) {
        setUserUpvoteStatus(type === "UP" ? "upvote" : "downvote");
        // Invalidate idea queries to refresh vote counts
        queryClient.invalidateQueries({ queryKey: ["idea", idea.id] });
        queryClient.invalidateQueries({ queryKey: ["ideas"] });
      }
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

  const requireAuth = (action: () => void) => {
    if (!currentUserId) {
      toast.error("You must be logged in to perform this action");
      router.push("/login");
      return;
    }
    action();
  };

  const handleUpvote = () => {
    requireAuth(() => toggleVoteMutation.mutate("UP"));
  };

  const handleDownvote = () => {
    requireAuth(() => toggleVoteMutation.mutate("DOWN"));
  };

  const handleToggleFavourite = () => {
    requireAuth(() => toggleFavouriteMutation.mutate());
  };

  const handleRemoveVote = () => {
    requireAuth(() => toggleVoteMutation.mutate(userUpvoteStatus === "downvote" ? "DOWN" : "UP"));
  };

  return (
    <div className="space-y-12">
      {/* Idea Details with Voting */}
      <IdeaDetails
        idea={idea}
        isAuthor={isAuthor}
        hasUserUpvoted={userUpvoteStatus === "upvote"}
        hasUserDownvoted={userUpvoteStatus === "downvote"}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onRemoveVote={handleRemoveVote}
        isFavourited={isFavourited}
        onToggleFavourite={handleToggleFavourite}
        isLoadingVote={
          toggleVoteMutation.isPending
        }
        isLoadingFavourite={toggleFavouriteMutation.isPending}
      />

      {/* Comments Section — only shown when the idea has comments enabled */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {idea.comment !== false ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                💬 Comments ({comments.length})
              </h2>

              {/* Comment Input — logged-in users only */}
              {currentUserId ? (
                <div className="mb-8">
                  <CommentInput
                    onSubmit={handleCommentSubmit}
                    isLoading={createCommentMutation.isPending}
                    editingComment={editingComment}
                    onCancelEdit={() => setEditingComment(null)}
                  />
                </div>
              ) : (
                <div className="mb-8 text-center py-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400">
                    <a href="/login" className="text-emerald-600 hover:underline font-semibold">
                      Login
                    </a>{" "}
                    to join the conversation
                  </p>
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
            </>
          ) : (
            <div className="text-center py-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                💬 Comments are disabled for this idea.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
