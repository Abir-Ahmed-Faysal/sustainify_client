"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { getMyFavourites } from "@/services/favourite.service";
import { upvoteIdea, downvoteIdea, removeVote } from "@/services/idea.service";
import { Loader2 } from "lucide-react";

interface IdeaDetailsClientProps {
  idea: IIdea;
  currentUserId?: string;
  isAuthor: boolean;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onRemoveVote?: () => void;
}

export default function IdeaDetailsClient({
  idea,
  currentUserId,
  isAuthor,
  onUpvote,
  onDownvote,
  onRemoveVote: onRemoveVoteCallback,
}: IdeaDetailsClientProps) {
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

  // Fetch user's favourites
  useEffect(() => {
    if (currentUserId) {
      getMyFavourites()
        .then((response) => {
          const favouriteIdeas = response.data || [];
          const isFav = favouriteIdeas.some((fav) => fav.ideaId === idea.id);
          setIsFavourited(isFav);
        })
        .catch((err) => console.error("Error fetching favourites:", err));
    }
  }, [currentUserId, idea.id]);

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

  // Voting mutations
  const upvoteMutation = useMutation({
    mutationFn: () => upvoteIdea(idea.id),
    onSuccess: () => {
      setUserUpvoteStatus("upvote");
      onUpvote?.();
    },
  });

  const downvoteMutation = useMutation({
    mutationFn: () => downvoteIdea(idea.id),
    onSuccess: () => {
      setUserUpvoteStatus("downvote");
      onDownvote?.();
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: () => removeVote(idea.id),
    onSuccess: () => {
      setUserUpvoteStatus("none");
      onRemoveVoteCallback?.();
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

  return (
    <div className="space-y-12">
      {/* Idea Details with Voting */}
      <IdeaDetails
        idea={idea}
        isAuthor={isAuthor}
        currentUserId={currentUserId}
        hasUserUpvoted={userUpvoteStatus === "upvote"}
        hasUserDownvoted={userUpvoteStatus === "downvote"}
        onUpvote={() => upvoteMutation.mutate()}
        onDownvote={() => downvoteMutation.mutate()}
        onRemoveVote={() => removeVoteMutation.mutate()}
        isFavourited={isFavourited}
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
