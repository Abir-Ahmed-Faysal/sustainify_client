"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyIdeas, deleteIdea, changeIdeaStatus } from "@/services/idea.service";
import { IIdea, IIdeaMemberStatus } from "@/types/idea.types";
import Link from "next/link";
import {
  Loader2, Trash2, Edit2, Plus, Lightbulb, Eye, Send, RotateCcw,
  CheckCircle2, XCircle, Clock, FileText, DollarSign, MessageSquare,
  ThumbsUp, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    icon: Clock,
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  },
  DRAFT: {
    label: "Draft",
    icon: FileText,
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MyIdeasPage() {
  const [ideas, setIdeas] = useState<IIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChanging, setStatusChanging] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMyIdeas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMyIdeas();
      if (response.data) setIdeas(response.data);
      else setError(response.message || "Failed to load ideas");
    } catch {
      setError("Failed to load your ideas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyIdeas();
  }, [fetchMyIdeas]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    setDeleting(id);
    try {
      const res = await deleteIdea(id);
      if (res.success) {
        setIdeas((prev) => prev.filter((i) => i.id !== id));
        toast.success("Idea deleted");
      } else {
        toast.error(res.message || "Failed to delete idea");
      }
    } catch {
      toast.error("Failed to delete idea");
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (idea: IIdea, newStatus: IIdeaMemberStatus) => {
    setStatusChanging(idea.id);
    try {
      const res = await changeIdeaStatus(idea.id, newStatus);
      if (res.success && res.data) {
        setIdeas((prev) =>
          prev.map((i) => (i.id === idea.id ? { ...i, status: newStatus } : i))
        );
        toast.success(
          newStatus === "UNDER_REVIEW"
            ? "Idea submitted for review! 🎉"
            : "Idea moved back to draft"
        );
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusChanging(null);
    }
  };

  // ── Counts ─────────────────────────────────────────────────

  const counts = {
    total: ideas.length,
    approved: ideas.filter((i) => i.status === "APPROVED").length,
    pending: ideas.filter((i) => i.status === "UNDER_REVIEW").length,
    draft: ideas.filter((i) => i.status === "DRAFT").length,
    rejected: ideas.filter((i) => i.status === "REJECTED").length,
  };

  // ── Loading ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-slate-500 text-sm">Loading your ideas…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Ideas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and track your sustainability ideas
          </p>
        </div>
        <Link href="/dashboard/create-idea">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
            <Plus className="w-4 h-4" />
            New Idea
          </Button>
        </Link>
      </div>

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl mb-6 flex items-center gap-2">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Stats row ──────────────────────────────────────── */}
      {ideas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: counts.total, color: "text-slate-700 dark:text-slate-200", bg: "bg-slate-50 dark:bg-slate-800/60" },
            { label: "Approved", value: counts.approved, color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Under Review", value: counts.pending, color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-900/20" },
            { label: "Draft", value: counts.draft, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/60" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-200 dark:border-slate-700`}>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────── */}
      {ideas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="p-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 mb-6">
            <Lightbulb className="w-12 h-12 text-emerald-500 opacity-60" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No ideas yet
          </h2>
          <p className="text-slate-500 mb-6 max-w-sm">
            Share your sustainability ideas with the community and make a positive impact.
          </p>
          <Link href="/dashboard/create-idea">
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4" /> Create Your First Idea
            </Button>
          </Link>
        </div>
      )}

      {/* ── Idea cards ──────────────────────────────────────── */}
      {ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ideas.map((idea) => {
            const isChangingStatus = statusChanging === idea.id;
            const isDeletingThis = deleting === idea.id;
            const canEdit = idea.status === "DRAFT" || idea.status === "REJECTED";
            const canSubmit = idea.status === "DRAFT";
            const canRetract = idea.status === "UNDER_REVIEW";

            return (
              <div
                key={idea.id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden"
              >
                {/* Accent bar */}
                <div
                  className={`h-1 w-full ${
                    idea.status === "APPROVED"
                      ? "bg-emerald-500"
                      : idea.status === "REJECTED"
                        ? "bg-red-500"
                        : idea.status === "UNDER_REVIEW"
                          ? "bg-amber-500"
                          : "bg-slate-300 dark:bg-slate-700"
                  }`}
                />

                <div className="p-5">
                  {/* Title + status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 flex-1">
                      {idea.title}
                    </h2>
                    <StatusBadge status={idea.status} />
                  </div>

                  {/* Problem statement */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {idea.problemStatement}
                  </p>

                  {/* Rejection feedback */}
                  {idea.status === "REJECTED" && idea.feedback && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                        Admin Feedback
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">
                        {idea.feedback}
                      </p>
                    </div>
                  )}

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 mb-5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(idea.createdAt), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {idea.totalUpVotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {idea._count?.comments ?? 0}
                    </span>
                    {idea.isPaid && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {idea.price}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {/* Submit for review */}
                    {canSubmit && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(idea, "UNDER_REVIEW")}
                        disabled={isChangingStatus}
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        {isChangingStatus ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        Submit for Review
                      </Button>
                    )}

                    {/* Retract from review */}
                    {canRetract && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(idea, "DRAFT")}
                        disabled={isChangingStatus}
                        className="gap-1.5 text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
                      >
                        {isChangingStatus ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3.5 h-3.5" />
                        )}
                        Retract
                      </Button>
                    )}

                    {/* Edit */}
                    {canEdit && (
                      <Link href={`/dashboard/edit-idea/${idea.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </Link>
                    )}

                    {/* View */}
                    <Link href={`/dashboard/my-ideas/${idea.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </Link>

                    {/* Delete — only DRAFT or REJECTED */}
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(idea.id)}
                        disabled={isDeletingThis}
                        className="gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto"
                      >
                        {isDeletingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
