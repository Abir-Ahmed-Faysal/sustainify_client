"use client";

import { useEffect, useState } from "react";
import { getMyIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import Link from "next/link";
import { Loader2, Plus, FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MemberDashboardPage() {
  const [ideas, setIdeas] = useState<IIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const response = await getMyIdeas();
        if (response.data) {
          setIdeas(response.data);
        }
      } catch (err) {
        console.error("Error fetching ideas:", err);
        setError("Failed to load your ideas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyIdeas();
  }, []);

  const stats = {
    total: ideas.length,
    approved: ideas.filter(i => i.status === "APPROVED").length,
    underReview: ideas.filter(i => i.status === "UNDER_REVIEW").length,
    rejected: ideas.filter(i => i.status === "REJECTED").length,
  };

  const recentIdeas = ideas.slice(0, 3);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Member Dashboard</h1>
        <p className="text-slate-600">Create, manage, and track your sustainability ideas</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/dashboard/create-idea" className="w-full">
          <Button className="w-full h-auto py-4 text-lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Idea
          </Button>
        </Link>
        <Link href="/dashboard/my-ideas" className="w-full">
          <Button variant="outline" className="w-full h-auto py-4 text-lg">
            <FileText className="w-5 h-5 mr-2" />
            View All My Ideas
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Total Ideas</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Under Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.underReview}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </Card>
          </div>

          {/* Recent Ideas */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Ideas</h2>
            {recentIdeas.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-600 mb-4">You haven`&apos;`t created any ideas yet</p>
                <Link href="/dashboard/create-idea">
                  <Button>Create Your First Idea</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentIdeas.map((idea) => (
                  <Card key={idea.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{idea.title}</h3>
                        <p className="text-slate-600 text-sm mb-3">{idea.description}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            idea.status === "APPROVED" ? "bg-green-100 text-green-800" :
                            idea.status === "REJECTED" ? "bg-red-100 text-red-800" :
                            idea.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {idea.status}
                          </span>
                          {idea.isPaid && <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">Paid</span>}
                        </div>
                      </div>
                      <Link href={`/ideas/${idea.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

