"use client";

import { IIdea } from "@/types/idea.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ThumbsDown, ThumbsUp, Lock } from "lucide-react";
import { isValidImageUrl, getPlaceholderGradient } from "@/lib/imageUtils";

interface IdeaDetailsProps {
  idea: IIdea;
  isAuthor: boolean;
  currentUserId?: string;
  hasUserUpvoted: boolean;
  hasUserDownvoted: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
  onRemoveVote: () => void;
  userHasAccess?: boolean; // For paid ideas
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "zoro carbon1": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    Energy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    Waste: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    Transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    Food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    Water: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
    Biodiversity: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  };
  return colors[category] || "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100";
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    DRAFT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  };
  return colors[status] || "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    APPROVED: "Approved",
    DRAFT: "Draft",
    REJECTED: "Rejected",
    UNDER_REVIEW: "Under Review",
  };
  return labels[status] || status;
};

export default function IdeaDetails({
  idea,
  isAuthor,
  currentUserId,
  hasUserUpvoted,
  hasUserDownvoted,
  onUpvote,
  onDownvote,
  onRemoveVote,
}: IdeaDetailsProps) {
  const isValidImage = isValidImageUrl(idea.image);
  const placeholderGradient = getPlaceholderGradient(idea.title);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen flex flex-col">
      {/* Back Button */}
      <Link href="/ideas" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Ideas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="mb-8">
            {isValidImage ? (
              <div className="relative w-full h-80 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                <Image
                  src={idea.image}
                  alt={idea.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100%, 768px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className={`w-full h-80 rounded-lg bg-linear-to-br ${placeholderGradient} flex items-center justify-center`}>
                <Heart className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            {idea.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={idea.author.profile.avatar} alt={idea.author.name} />
                <AvatarFallback>{idea.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{idea.author.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{idea.createdAt}</p>
              </div>
            </div>

            <div className="flex gap-2 ml-auto flex-wrap items-center">
              <Badge className={getCategoryColor(idea.category.name)}>{idea.category.name}</Badge>
              <Badge className={getStatusColor(idea.status)}>{getStatusLabel(idea.status)}</Badge>
              {idea.isPaid && (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 gap-1">
                  <Lock className="w-3 h-3" />
                  Paid
                </Badge>
              )}
            </div>
          </div>

          {/* Problem Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Problem</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {idea.problemStatement}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col">
          {/* Voting Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-6 sticky top-20">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Community Votes</h3>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 mb-4">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {idea.totalUpVotes - idea.totalDownVotes}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Net votes</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                👍 {idea.totalUpVotes} | 👎 {idea.totalDownVotes}
              </p>
            </div>

            {currentUserId ? (
              <div className="space-y-2">
                <Button
                  onClick={hasUserUpvoted ? onRemoveVote : onUpvote}
                  variant={hasUserUpvoted ? "default" : "outline"}
                  className={`w-full gap-2 ${
                    hasUserUpvoted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : ""
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Upvote {hasUserUpvoted && "✓"}
                </Button>
                <Button
                  onClick={hasUserDownvoted ? onRemoveVote : onDownvote}
                  variant={hasUserDownvoted ? "destructive" : "outline"}
                  className="w-full gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Downvote {hasUserDownvoted && "✓"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Link href="/login" className="text-emerald-600 hover:underline">
                  Login
                </Link>
                {" "}to vote
              </p>
            )}
          </div>

          {/* Author Actions */}
          {isAuthor && idea.status === "DRAFT" && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Your Idea</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                This idea is in draft mode. You can edit or submit it for review.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/ideas/${idea.id}/edit`}>Edit Idea</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
