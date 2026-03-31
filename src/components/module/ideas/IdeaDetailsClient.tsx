"use client";

import { useState, useEffect } from "react";
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
import { toggleVote, removeVote } from "@/services/vote.service";
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
  const queryClient = useQueryClient();
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [userUpvoteStatus, setUserUpvoteStatus] = useState<
    "upvote" | "downvote" | "none"
  >("none");
  const [isFavourited, setIsFavourited] = useState(false);

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

  // Fetch user's current vote status and favorites
  useEffect(() => {
    if (currentUserId) {
      // Check current vote status from idea data
      if (idea.userVote?.type === "UP") {
        setUserUpvoteStatus("upvote");
      } else if (idea.userVote?.type === "DOWN") {
        setUserUpvoteStatus("downvote");
      } else {
        setUserUpvoteStatus("none");
      }
      
      // Check if favorited
      if (idea.userFavourite) {
        setIsFavourited(true);
      }
    }
  }, [currentUserId, idea.id, idea.userVote, idea.userFavourite]);

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

  // Remove vote mutation
  const removeVoteMutation = useMutation({
    mutationFn: () => removeVote(idea.id),
    onSuccess: () => {
      setUserUpvoteStatus("none");
      // Invalidate idea queries to refresh vote counts
      queryClient.invalidateQueries({ queryKey: ["idea", idea.id] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
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
    if (userUpvoteStatus === "upvote") {
      removeVoteMutation.mutate();
    } else {
      toggleVoteMutation.mutate("UP");
    }
  };

  const handleDownvote = () => {
    if (userUpvoteStatus === "downvote") {
      removeVoteMutation.mutate();
    } else {
      toggleVoteMutation.mutate("DOWN");
    }
  };

  const handleToggleFavourite = () => {
    toggleFavouriteMutation.mutate();
  };

  return (
    <div className="space-y-12">
      {/* Idea Details with Voting */}
      <IdeaDetails
        idea={idea}
        isAuthor={isAuthor}
        currentUserId={currentUserId}
        hasUserUpvoted={userUpvoteStatus === "upvote"}
        hasUserDownvoted={userUpvoteStatus === "downvote"}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onRemoveVote={() => removeVoteMutation.mutate()}
        isFavourited={isFavourited}
        onToggleFavourite={handleToggleFavourite}
        isLoadingVote={
          toggleVoteMutation.isPending || removeVoteMutation.isPending
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
