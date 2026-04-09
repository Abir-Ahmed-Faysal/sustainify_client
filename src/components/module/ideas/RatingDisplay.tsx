"use client";

import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  totalUpVotes: number;
  totalDownVotes: number;
  totalComments: number;
}

export default function RatingDisplay({ totalUpVotes, totalDownVotes, totalComments }: RatingDisplayProps) {
  const totalVotes = totalUpVotes + totalDownVotes;
  const approvalRate = totalVotes > 0 ? (totalUpVotes / totalVotes) * 100 : 0;
  
  // Calculate star rating (out of 5)
  const starRating = totalVotes > 0 ? ((approvalRate / 100) * 5).toFixed(1) : 0;
  const score = parseFloat(starRating as string);

  return (
    <div className="bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        ⭐ Community Rating
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Star Rating */}
        <div>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {score}
          </div>
          <div className="flex items-center gap-2 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(score)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            based on {totalVotes} votes
          </p>
        </div>

        {/* Approval Rate */}
        <div>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {approvalRate.toFixed(0)}%
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Community Approval
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-linear-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${approvalRate}%` }}
            />
          </div>
        </div>

        {/* Engagement */}
        <div>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {totalComments}
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Community Comments
          </p>
          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
            {totalComments === 0
              ? "Be the first to comment"
              : totalComments === 1
              ? "1 person discussed"
              : `${totalComments} people discussed`}
          </Badge>
        </div>
      </div>

      {/* Vote Breakdown */}
      <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-800 grid grid-cols-2 gap-4">
        <div className="text-sm">
          <p className="text-slate-600 dark:text-slate-400 mb-2">Upvotes</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalUpVotes}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({((totalUpVotes / totalVotes) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-slate-600 dark:text-slate-400 mb-2">Downvotes</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {totalDownVotes}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({((totalDownVotes / totalVotes) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
