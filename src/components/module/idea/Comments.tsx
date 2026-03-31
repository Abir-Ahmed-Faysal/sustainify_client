"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, updateComment, deleteComment } from "@/services/comment.service";
import { IComment } from "@/services/comment.service";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit2, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CommentsProps {
  ideaId: string;
  comments: IComment[];
}

export default function Comments({ ideaId, comments }: CommentsProps) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      return await createComment({
        ideaId,
        content,
      });
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return await updateComment(commentId, { content: editingContent });
    },
    onSuccess: () => {
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return await deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    createMutation.mutate(newComment);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingContent.trim()) return;
    updateMutation.mutate(commentId);
  };

  return (
    <div className="space-y-6">
      {/* Add Comment */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Add Comment</h3>
        <div className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            disabled={createMutation.isPending}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
          />
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || createMutation.isPending}
            className="w-full"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Comment"
            )}
          </Button>
        </div>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Comments ({comments.length})
        </h3>
        {comments.length === 0 ? (
          <Card className="p-4 text-center">
            <p className="text-slate-500 text-sm">No comments yet. Be the first to comment!</p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-slate-900">{comment.author.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {editingId === comment.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={updateMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(comment.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingId === comment.id ? (
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={2}
                  disabled={updateMutation.isPending}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100"
                />
              ) : (
                <p className="text-slate-700">{comment.content}</p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
