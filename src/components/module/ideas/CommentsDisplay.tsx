"use client";

import { IComment } from "@/services/comment.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

interface CommentsDisplayProps {
  comments: IComment[];
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  onEdit: (comment: IComment) => void;
  isLoading?: boolean;
}

export default function CommentsDisplay({
  comments,
  currentUserId,
  onDelete,
  onEdit,
  isLoading = false,
}: CommentsDisplayProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.author.profile?.avatar}
                  alt={comment.author.name}
                />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {comment.author.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Comment Actions */}
            {currentUserId === comment.authorId && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(comment)}
                  className="h-6 w-6 p-0"
                  title="Edit comment"
                >
                  <Edit2 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this comment?")
                    ) {
                      setDeletingId(comment.id);
                      onDelete(comment.id);
                    }
                  }}
                  disabled={deletingId === comment.id || isLoading}
                  className="h-6 w-6 p-0"
                  title="Delete comment"
                >
                  <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                </Button>
              </div>
            )}
          </div>

          {/* Comment Content */}
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}
