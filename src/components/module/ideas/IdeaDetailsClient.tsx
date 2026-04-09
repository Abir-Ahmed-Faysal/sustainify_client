"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import IdeaDetails from "./IdeaDetails";
import CommentsDisplay from "./CommentsDisplay";
import CommentInput from "./CommentInput";
import RelatedIdeas from "./RelatedIdeas";
import RatingDisplay from "./RatingDisplay";
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
import { extractErrorMessage, extractResponseErrorMessage } from "@/lib/errorMessageExtractor";
import { useUser } from "@/hooks/useUser";

interface IdeaDetailsClientProps {
  idea: IIdea;
  hideAuthorInfo?: boolean;
}

export default function IdeaDetailsClient({
  idea,
  hideAuthorInfo = false,
}: IdeaDetailsClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  // Ensure author is populated for my-ideas where it might not be
  const ideaWithAuthor: IIdea = {
    ...idea,
    author:
      idea.author ||
      (user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: {
              avatar: user.profile?.avatar || "",
            },
          }
        : undefined),
  };
  
  const [mounted, setMounted] = useState(false);
  const currentUserId = user?.id;
  const isAuthor = currentUserId === (ideaWithAuthor.author?.id || idea.authorId);
  
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);
  
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
        toast.success(`Vote ${type === "UP" ? "up" : "down"}voted! 👍`);
        // Invalidate idea queries to refresh vote counts
        queryClient.invalidateQueries({ queryKey: ["idea", idea.id] });
        queryClient.invalidateQueries({ queryKey: ["ideas"] });
      } else {
        const msg = extractResponseErrorMessage(response, "Failed to vote");
        toast.error(msg);
      }
    },
    onError: (error: unknown) => {
      const errorMsg = extractErrorMessage(error, "Failed to vote");
      toast.error(errorMsg);
    },
  });

  // Toggle favourite mutation
  const toggleFavouriteMutation = useMutation({
    mutationFn: () => toggleFavourite({ ideaId: idea.id }),
    onSuccess: (response) => {
      if (response.data) {
        const newStatus = response.data.action === "ADDED";
        setIsFavourited(newStatus);
        // Show toast based on action
        if (newStatus) {
          toast.success("Added to favorites! ❤️");
        } else {
          toast.info("Removed from favorites");
        }
        // Invalidate favourite queries
        queryClient.invalidateQueries({ queryKey: ["myFavourites"] });
      } else {
        const msg = extractResponseErrorMessage(response, "Failed to toggle favorite");
        toast.error(msg);
      }
    },
    onError: (error: unknown) => {
      const errorMsg = extractErrorMessage(error, "Failed to toggle favorite");
      toast.error(errorMsg);
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

  const hasAlreadyCommented = comments.some(
    (comment: IComment) => comment.authorId === currentUserId
  );

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
        isLoadingFavourite={toggleFavouriteMutation.isPending}        hideAuthorInfo={hideAuthorInfo}      />

      {/* Community Rating Section */}
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="max-w-4xl mx-auto">
          <RatingDisplay
            totalUpVotes={idea.totalUpVotes || 0}
            totalDownVotes={idea.totalDownVotes || 0}
            totalComments={comments.length}
          />
        </div>
      </div>

      {/* Comments Section — only shown when the idea has comments enabled */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {idea.comment !== false ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                💬 Comments ({comments.length})
              </h2>

              {/* Comment Input — logged-in users only */}
              {mounted ? (
                currentUserId ? (
                  <div className="mb-8">
                    {hasAlreadyCommented && !editingComment ? (
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl text-center space-y-2">
                        <p className="text-emerald-800 dark:text-emerald-300 font-medium text-sm">
                          You have already shared your thoughts on this idea.
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                          Each member is allowed one comment per idea. You can still edit or delete your existing comment below.
                        </p>
                      </div>
                    ) : (
                      <CommentInput
                        onSubmit={handleCommentSubmit}
                        isLoading={createCommentMutation.isPending}
                        editingComment={editingComment}
                        onCancelEdit={() => setEditingComment(null)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="mb-8 text-center py-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-400">
                      <a
                        href="/login"
                        className="text-emerald-600 hover:underline font-semibold"
                      >
                        Login
                      </a>{" "}
                      to join the conversation
                    </p>
                  </div>
                )
              ) : (
                <div className="mb-8 text-center py-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-400">
                    <a
                      href="/login"
                      className="text-emerald-600 hover:underline font-semibold"
                    >
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

      {/* Related Ideas Section */}
      {idea.categoryId && (
        <RelatedIdeas 
          currentIdeaId={idea.id} 
          categoryId={idea.categoryId}
          categoryName={idea.category?.name}
        />
      )}
    </div>
  );
}
