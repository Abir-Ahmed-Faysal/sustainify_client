"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getIdeas } from "@/services/idea.service";
import Link from "next/link";
import { BarChart3, Users, FileText, Eye, Filter, AlertCircle } from "lucide-react";
import { IIdea } from "@/types/idea.types";

interface DashboardStats {
  totalIdeas: number;
  underReview: number;
  approved: number;
  rejected: number;
  paidIdeas: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIdeas: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    paidIdeas: 0,
  });
  const [recentIdeas, setRecentIdeas] = useState<IIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getIdeas({ limit: 100 });
        const ideas = response.data || [];

        // Calculate stats
        const totalIdeas = ideas.length;
        const underReview = ideas.filter(
          (i) => i.status === "UNDER_REVIEW"
        ).length;
        const approved = ideas.filter((i) => i.status === "APPROVED").length;
        const rejected = ideas.filter((i) => i.status === "REJECTED").length;
        const paidIdeas = ideas.filter((i) => i.isPaid).length;

        setStats({
          totalIdeas,
          underReview,
          approved,
          rejected,
          paidIdeas,
        });

        // Get recent ideas
        const recent = ideas.slice(0, 5);
        setRecentIdeas(recent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    textColor,
    href,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    href?: string;
  }) => (
    <Card className={`${bgColor} border-none`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${textColor}`}>{Icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        {href && (
          <Button asChild variant="link" size="sm" className="mt-2 h-auto p-0">
            <Link href={href} className="text-xs">
              View Details →
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage and moderate sustainable ideas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Ideas"
          value={stats.totalIdeas}
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          textColor="bg-blue-100 dark:bg-blue-900/40"
          href="/admin/dashboard/ideas?status=all"
        />

        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
          textColor="bg-yellow-100 dark:bg-yellow-900/40"
          href="/admin/dashboard/ideas?status=under-review"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<Eye className="w-5 h-5 text-green-600" />}
          bgColor="bg-green-50 dark:bg-green-900/20"
          textColor="bg-green-100 dark:bg-green-900/40"
          href="/admin/dashboard/ideas?status=approved"
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<Filter className="w-5 h-5 text-red-600" />}
          bgColor="bg-red-50 dark:bg-red-900/20"
          textColor="bg-red-100 dark:bg-red-900/40"
          href="/admin/dashboard/ideas?status=rejected"
        />

        <StatCard
          title="Paid Ideas"
          value={stats.paidIdeas}
          icon={<BarChart3 className="w-5 h-5 text-purple-600" />}
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          textColor="bg-purple-100 dark:bg-purple-900/40"
        />
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/admin/dashboard/ideas?status=under-review">
                <AlertCircle className="w-4 h-4" />
                Review Ideas
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/admin/dashboard/members">
                <Users className="w-4 h-4" />
                Manage Members
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/admin/dashboard/ideas?status=approved">
                <Eye className="w-4 h-4" />
                View Approved
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/admin/dashboard/ideas?status=rejected">
                <Filter className="w-4 h-4" />
                View Rejected
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Ideas */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Ideas</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/dashboard/ideas">View All →</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : recentIdeas.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No ideas found
            </div>
          ) : (
            <div className="space-y-4">
              {recentIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                      {idea.problemStatement}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                        {idea.category.name}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          idea.status === "APPROVED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : idea.status === "REJECTED"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {idea.status}
                      </span>
                      {idea.isPaid && (
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          PAID
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="ml-2 flex-shrink-0"
                  >
                    <Link href={`/admin/dashboard/ideas`}>Review</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
