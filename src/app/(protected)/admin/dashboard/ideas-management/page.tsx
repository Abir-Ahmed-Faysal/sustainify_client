"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Loader2 } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import { getIdeasByStatus } from "@/services/idea.service";
import AdminIdeasList from "@/components/module/admin-ideas/AdminIdeasList";
import { toast } from "sonner";

type FilterStatus = "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export default function AdminIdeasManagementPage() {
  const [ideas, setIdeas] = useState<Record<FilterStatus, IIdea[]>>({
    UNDER_REVIEW: [],
    APPROVED: [],
    REJECTED: [],
  });
  const [isLoading, setIsLoading] = useState<Record<FilterStatus, boolean>>({
    UNDER_REVIEW: true,
    APPROVED: false,
    REJECTED: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterStatus>("UNDER_REVIEW");

  // Fetch ideas for a specific status
  const fetchIdeasByStatus = useCallback(
    async (status: FilterStatus, showRefreshToast = false) => {
      try {
        setIsLoading((prev) => ({ ...prev, [status]: true }));

        const response = await getIdeasByStatus(status);

        if (response.success) {
          setIdeas((prev) => ({
            ...prev,
            [status]: response.data || [],
          }));

          if (showRefreshToast) {
            toast.success(`${status} ideas refreshed`);
          }
        } else {
          toast.error(response.message || `Failed to fetch ${status} ideas`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch ideas";
        toast.error(errorMessage);
      } finally {
        setIsLoading((prev) => ({ ...prev, [status]: false }));
      }
    },
    []
  );

  // Initial fetch for UNDER_REVIEW
  useEffect(() => {
    fetchIdeasByStatus("UNDER_REVIEW");
  }, [fetchIdeasByStatus]);

  // Fetch ideas when tab changes
  const handleTabChange = (status: FilterStatus) => {
    setActiveTab(status);
    if (ideas[status].length === 0 && !isLoading[status]) {
      fetchIdeasByStatus(status);
    }
  };

  // Refresh all tabs
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchIdeasByStatus("UNDER_REVIEW", true),
        fetchIdeasByStatus("APPROVED", true),
        fetchIdeasByStatus("REJECTED", true),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalIdeas =
    ideas.UNDER_REVIEW.length + ideas.APPROVED.length + ideas.REJECTED.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ideas Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage submitted ideas
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="gap-2"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIdeas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {ideas.UNDER_REVIEW.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ideas.APPROVED.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {ideas.REJECTED.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Different Statuses */}
      <Card>
        <CardHeader>
          <CardTitle>Ideas by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as FilterStatus)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="UNDER_REVIEW" className="gap-2">
                <span className="hidden sm:inline">Under Review</span>
                <span className="sm:hidden">Review</span>
                {ideas.UNDER_REVIEW.length > 0 && (
                  <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full px-2">
                    {ideas.UNDER_REVIEW.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="APPROVED" className="gap-2">
                <span className="hidden sm:inline">Approved</span>
                <span className="sm:hidden">OK</span>
                {ideas.APPROVED.length > 0 && (
                  <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2">
                    {ideas.APPROVED.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="gap-2">
                <span className="hidden sm:inline">Rejected</span>
                <span className="sm:hidden">No</span>
                {ideas.REJECTED.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {ideas.REJECTED.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="UNDER_REVIEW" className="space-y-4 mt-6">
              <AdminIdeasList
                ideas={ideas.UNDER_REVIEW}
                status="UNDER_REVIEW"
                isLoading={isLoading.UNDER_REVIEW}
                onRefresh={() => fetchIdeasByStatus("UNDER_REVIEW")}
              />
            </TabsContent>

            <TabsContent value="APPROVED" className="space-y-4 mt-6">
              <AdminIdeasList
                ideas={ideas.APPROVED}
                status="APPROVED"
                isLoading={isLoading.APPROVED}
                onRefresh={() => fetchIdeasByStatus("APPROVED")}
              />
            </TabsContent>

            <TabsContent value="REJECTED" className="space-y-4 mt-6">
              <AdminIdeasList
                ideas={ideas.REJECTED}
                status="REJECTED"
                isLoading={isLoading.REJECTED}
                onRefresh={() => fetchIdeasByStatus("REJECTED")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
