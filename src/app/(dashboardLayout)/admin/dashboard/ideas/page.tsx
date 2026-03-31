"use client"

import { useState, useEffect } from "react"
import { prefetchIdeas } from "@/services/idea.service"
import { IIdea } from "@/types/idea.types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"

export default function IdeasManagementPage() {
  const [allIdeas, setAllIdeas] = useState<IIdea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true)
        const response = await prefetchIdeas({ limit: 100 })
        if (response.data) {
          setAllIdeas(response.data)
        }
      } catch (err) {
        console.error("Error fetching ideas:", err)
        setError("Failed to load ideas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  // Filter ideas by status
  const getFilteredIdeas = () => {
    switch (activeTab) {
      case "under-review":
        return allIdeas.filter(idea => idea.status === "UNDER_REVIEW")
      case "approved":
        return allIdeas.filter(idea => idea.status === "APPROVED")
      case "rejected":
        return allIdeas.filter(idea => idea.status === "REJECTED")
      default:
        return allIdeas
    }
  }

  const filteredIdeas = getFilteredIdeas()

  const handleApprove = async (ideaId: string) => {
    // TODO: Call API to approve idea
    console.log("Approving idea:", ideaId)
  }

  const handleReject = async (ideaId: string) => {
    // TODO: Call API to reject idea with feedback
    console.log("Rejecting idea:", ideaId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "UNDER_REVIEW":
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Idea Management</h1>
        <p className="text-slate-600 mt-2">Approve, reject, or review sustainability ideas</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Ideas ({allIdeas.length})</TabsTrigger>
          <TabsTrigger value="under-review">
            Under Review ({allIdeas.filter(i => i.status === "UNDER_REVIEW").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({allIdeas.filter(i => i.status === "APPROVED").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({allIdeas.filter(i => i.status === "REJECTED").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, getStatusIcon)}
        </TabsContent>
        <TabsContent value="under-review" className="space-y-4 mt-6">
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, getStatusIcon)}
        </TabsContent>
        <TabsContent value="approved" className="space-y-4 mt-6">
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, getStatusIcon)}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4 mt-6">
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, getStatusIcon)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderIdeasList(
  ideas: IIdea[],
  isLoading: boolean,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  getStatusIcon: (status: string) => React.ReactNode
) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No ideas found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <Card key={idea.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Idea Info */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-start gap-3">
                {getStatusIcon(idea.status)}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{idea.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{idea.problemStatement}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {idea.category.name}
                </span>
                {idea.isPaid && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Paid (${idea.price})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                By {idea.author.name} • {new Date(idea.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-slate-600">Votes:</span>
                <span className="font-bold text-slate-900 ml-2">
                  {idea.totalUpVotes - idea.totalDownVotes}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-slate-600">Comments:</span>
                <span className="font-bold text-slate-900 ml-2">
                  {idea._count.comments}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold block ${
                idea.status === "APPROVED" ? "bg-green-100 text-green-800" :
                idea.status === "REJECTED" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {idea.status}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {idea.status === "UNDER_REVIEW" && (
                <>
                  <Button
                    onClick={() => onApprove(idea.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => onReject(idea.id)}
                    variant="destructive"
                    className="w-full"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="w-full"
                size="sm"
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
