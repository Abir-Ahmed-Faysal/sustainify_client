"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsData {
  approved: number;
  rejected: number;
  underReview: number;
  totalCategory: number;
  paidIdeas: number;
  totalIdea: number;
}

// Mock data for charts (since real data would need backend enhancement)
const generateChartData = (stats: StatsData) => {
  const ideaStatusData = [
    { name: "Approved", value: stats.approved, fill: "#10b981" },
    { name: "Under Review", value: stats.underReview, fill: "#f59e0b" },
    { name: "Rejected", value: stats.rejected, fill: "#ef4444" },
  ];

  const ideaTypeData = [
    { name: "Free Ideas", value: stats.totalIdea - stats.paidIdeas, fill: "#06b6d4" },
    { name: "Paid Ideas", value: stats.paidIdeas, fill: "#8b5cf6" },
  ];

  // Simulated trend data (last 7 days)
  const trendData = [
    { date: "Mon", ideas: Math.floor(stats.totalIdea * 0.1) },
    { date: "Tue", ideas: Math.floor(stats.totalIdea * 0.15) },
    { date: "Wed", ideas: Math.floor(stats.totalIdea * 0.12) },
    { date: "Thu", ideas: Math.floor(stats.totalIdea * 0.18) },
    { date: "Fri", ideas: Math.floor(stats.totalIdea * 0.2) },
    { date: "Sat", ideas: Math.floor(stats.totalIdea * 0.14) },
    { date: "Sun", ideas: Math.floor(stats.totalIdea * 0.11) },
  ];

  return { ideaStatusData, ideaTypeData, trendData };
};

export default function DashboardCharts() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<StatsData> => {
      const response = await api.get<StatsData>("/stats");
      return response.data || {
        approved: 0,
        rejected: 0,
        underReview: 0,
        totalCategory: 0,
        paidIdeas: 0,
        totalIdea: 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
        Failed to load dashboard statistics
      </div>
    );
  }

  const { ideaStatusData, ideaTypeData, trendData } = generateChartData(stats);

  return (
    <div className="w-full space-y-8 py-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {stats.totalIdea}
            </CardTitle>
            <CardDescription className="text-emerald-600 dark:text-emerald-500">
              Total Ideas
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
              {stats.approved}
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-500">
              Approved
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-amber-700 dark:text-amber-400">
              {stats.underReview}
            </CardTitle>
            <CardDescription className="text-amber-600 dark:text-amber-500">
              Under Review
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {stats.paidIdeas}
            </CardTitle>
            <CardDescription className="text-purple-600 dark:text-purple-500">
              Paid Ideas
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Idea Status Distribution */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Idea Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of ideas by approval status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ideaStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  dataKey="value"
                >
                  {ideaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Idea Type Distribution */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Free vs Paid Ideas</CardTitle>
            <CardDescription>
              Distribution of free and paid content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ideaTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  dataKey="value"
                >
                  {ideaTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Ideas Trend (Last 7 Days)</CardTitle>
          <CardDescription>
            Weekly idea submission activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "0.5rem",
                  color: "#e2e8f0",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ideas"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
                name="Ideas Created"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 border-0 text-white">
        <CardHeader>
          <CardTitle>Quick Stats Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="opacity-90">Approval Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalIdea > 0
                  ? Math.round((stats.approved / stats.totalIdea) * 100)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="opacity-90">Total Categories</p>
              <p className="text-2xl font-bold">{stats.totalCategory}</p>
            </div>
            <div>
              <p className="opacity-90">Monetization Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalIdea > 0
                  ? Math.round((stats.paidIdeas / stats.totalIdea) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
