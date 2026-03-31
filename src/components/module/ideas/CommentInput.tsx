"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { IComment } from "@/services/comment.service";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  editingComment?: IComment | null;
  onCancelEdit?: () => void;
}

export default function CommentInput({
  onSubmit,
  isLoading = false,
  editingComment,
  onCancelEdit,
}: CommentInputProps) {
  const [content, setContent] = useState(editingComment?.content || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (content.length > 1000) {
      setError("Comment must be less than 1000 characters");
      return;
    }

    setError(null);
    onSubmit(content);
    setContent("");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
        {editingComment ? "Edit Comment" : "Add Comment"}
      </p>

      <Textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {
          setContent(e.target.value);
          if (error) setError(null);
        }}
        disabled={isLoading}
        className="mb-3 min-h-24 resize-none"
        maxLength={1000}
      />

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {content.length}/1000
        </p>

        <div className="flex gap-2">
          {editingComment && onCancelEdit && (
            <Button
              variant="outline"
              onClick={() => {
                onCancelEdit();
                setContent("");
                setError(null);
              }}
              disabled={isLoading}
              size="sm"
            >
              Cancel
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !content.trim()}
            size="sm"
            className="gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingComment ? "Update" : "Post Comment"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
