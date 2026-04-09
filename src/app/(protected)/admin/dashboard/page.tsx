"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  Eye,
  Filter,
  AlertCircle,
} from "lucide-react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

import { IIdea } from "@/types/idea.types";
import { getStats } from "@/services/stats.service";
import { adminDashboardIdeas } from "@/services/idea.service";
import { DashboardStats, IMemberStats } from "@/types/stats.types";

// ✅ Type Guard (STRICT)
const isAdminStats = (data: unknown): data is DashboardStats => {
  return (
    typeof data === "object" &&
    data !== null &&
    "totalIdea" in data
  );
};

// ✅ Normalize (FULL SAFE)
const normalizeStats = (
  data: DashboardStats | IMemberStats | null
): DashboardStats => {
  if (!data) {
    return {
      totalIdea: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      paidIdeas: 0,
    };
  }

  if (isAdminStats(data)) {
    return {
      totalIdea: data.totalIdea ?? 0,
      underReview: data.underReview ?? 0,
      approved: data.approved ?? 0,
      rejected: data.rejected ?? 0,
      paidIdeas: data.paidIdeas ?? 0,
    };
  }

  // ✅ Member → convert to Dashboard
  return {
    totalIdea: data.total ?? 0,
    underReview: data.underReview ?? 0,
    approved: data.approved ?? 0,
    rejected: data.rejected ?? 0,
    paidIdeas: 0,
  };
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIdea: 0,
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

        const [statsResponse, recent] = await Promise.all([
          getStats(),
          adminDashboardIdeas({ limit: 5, sortOrder: "desc" }),
        ]);

        // ✅ FIX: remove undefined safely
        const backendStats = statsResponse.data ?? null;

        const mappedStats = normalizeStats(backendStats);

        setStats(mappedStats);
        setRecentIdeas(recent.data ?? []);
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
    icon,
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${textColor}`}>{icon}</div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>

        {href && (
          <Button asChild variant="link" size="sm" className="mt-2 p-0">
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Ideas"
          value={stats.totalIdea}
          icon={<FileText className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          textColor="bg-emerald-100 dark:bg-emerald-900/40"
          href="/admin/dashboard/ideas?status=all"
        />

        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={<AlertCircle className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          textColor="bg-emerald-100 dark:bg-emerald-900/40"
          href="/admin/dashboard/ideas?status=under-review"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<Eye className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          textColor="bg-emerald-100 dark:bg-emerald-900/40"
          href="/admin/dashboard/ideas?status=approved"
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<Filter className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          textColor="bg-emerald-100 dark:bg-emerald-900/40"
          href="/admin/dashboard/ideas?status=rejected"
        />

        <StatCard
          title="Paid Ideas"
          value={stats.paidIdeas}
          icon={<BarChart3 className="w-5 h-5 text-emerald-600" />}
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          textColor="bg-emerald-100 dark:bg-emerald-900/40"
        />
      </div>

      {/* Dashboard Charts */}
      <DashboardCharts />

      {/* Recent Ideas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Recent Ideas</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/dashboard/ideas">View All →</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : recentIdeas.length === 0 ? (
            <div className="text-center py-8">No ideas found</div>
          ) : (
            <div className="space-y-4">
              {recentIdeas.map((idea) => (
                <div key={idea.id} className="flex justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{idea.title}</h3>
                    <p className="text-sm text-gray-500">
                      {idea.problemStatement}
                    </p>
                  </div>

                  <Button asChild size="sm">
                    <Link href={`/ideas/${idea.id}`}>Review</Link>
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