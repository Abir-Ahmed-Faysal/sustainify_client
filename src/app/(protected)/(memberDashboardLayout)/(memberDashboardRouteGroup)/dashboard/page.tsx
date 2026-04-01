"use client";

import { useEffect, useState } from "react";
import { getMyIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import Link from "next/link";
import {
  Loader2, Plus, FileText, CheckCircle2, XCircle, Clock,
  Lightbulb, ArrowRight, TrendingUp, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMemberStats } from "@/types/stats.types";
import { getStats } from "@/services/stats.service";
import { format } from "date-fns";

// ─── Status config ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  APPROVED:     { label: "Approved",     badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  REJECTED:     { label: "Rejected",     badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  UNDER_REVIEW: { label: "Under Review", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  DRAFT:        { label: "Draft",        badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
};

// ─── Page ─────────────────────────────────────────────────────────────────

export default function MemberDashboardPage() {
  const [ideas, setIdeas] = useState<IIdea[]>([]);
  const [stats, setStats] = useState<IMemberStats>({
    total: 0, approved: 0, underReview: 0, rejected: 0, draft: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ideasResponse, statsResponse] = await Promise.all([
          getMyIdeas(),
          getStats(),
        ]);

        if (ideasResponse.data) setIdeas(ideasResponse.data);

        if (statsResponse.success && statsResponse.data && "total" in statsResponse.data) {
          setStats(statsResponse.data as IMemberStats);
        } else {
          setError(statsResponse.message || "Failed to fetch stats");
        }
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentIdeas = ideas.slice(0, 4);

  // ── Stat cards config ───────────────────────────────────────────────────

  const statCards = [
    {
      label: "Total Ideas",
      value: stats.total,
      icon: FileText,
      color: "text-slate-700 dark:text-slate-200",
      iconColor: "text-slate-400",
      bg: "bg-white dark:bg-slate-900",
      border: "border-slate-200 dark:border-slate-800",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "text-emerald-700 dark:text-emerald-300",
      iconColor: "text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Under Review",
      value: stats.underReview,
      icon: Clock,
      color: "text-amber-700 dark:text-amber-300",
      iconColor: "text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/10",
      border: "border-amber-200 dark:border-amber-800",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      iconColor: "text-red-400",
      bg: "bg-red-50 dark:bg-red-900/10",
      border: "border-red-200 dark:border-red-800",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Member Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Create, manage, and track your sustainability ideas.
          </p>
        </div>
        <Link href="/dashboard/create-idea">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shrink-0">
            <Plus className="w-4 h-4" /> New Idea
          </Button>
        </Link>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm">
          <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-slate-500 text-sm">Loading your dashboard…</p>
        </div>
      ) : (
        <>
          {/* ── Stats grid ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`${s.bg} ${s.border} border rounded-2xl p-5 flex flex-col gap-3`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {s.label}
                    </p>
                    <Icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>
                  <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* ── Quick actions ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <Link href="/dashboard/create-idea">
              <div className="group flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-2xl text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 cursor-pointer">
                <div className="p-2.5 bg-white/20 rounded-xl">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base">Create New Idea</p>
                  <p className="text-emerald-100 text-xs">Submit a sustainability solution</p>
                </div>
                <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/dashboard/my-ideas">
              <div className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <FileText className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base text-slate-900 dark:text-white">My Ideas</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Manage and track all ideas</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* ── Recent ideas ──────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Recent Ideas
              </h2>
              <Link href="/dashboard/my-ideas">
                <Button variant="ghost" size="sm" className="gap-1 text-emerald-600 hover:text-emerald-700 text-xs">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {recentIdeas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                  <Lightbulb className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  No ideas yet
                </h3>
                <p className="text-slate-500 text-sm mb-5 max-w-xs">
                  Start sharing your sustainability solutions with the community.
                </p>
                <Link href="/dashboard/create-idea">
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="w-4 h-4" /> Create Your First Idea
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentIdeas.map((idea) => {
                  const cfg = STATUS_CONFIG[idea.status] ?? STATUS_CONFIG.DRAFT;
                  return (
                    <div
                      key={idea.id}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-sm transition-shadow group"
                    >
                      {/* Status accent */}
                      <div
                        className={`w-1 self-stretch rounded-full shrink-0 ${
                          idea.status === "APPROVED" ? "bg-emerald-500" :
                          idea.status === "REJECTED" ? "bg-red-500" :
                          idea.status === "UNDER_REVIEW" ? "bg-amber-500" :
                          "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {idea.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {format(new Date(idea.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>

                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.badge}`}>
                        {cfg.label}
                      </span>

                      <Link href={`/dashboard/my-ideas/${idea.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}