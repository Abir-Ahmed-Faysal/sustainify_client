"use client"

import { useState, useEffect } from "react"
import { adminDashboardIdeas, updateIdeaStatusByAdmin, toggleIdeaFeatured } from "@/services/idea.service"
import { IIdea } from "@/types/idea.types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Clock, Star } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"

export default function IdeasManagementPage() {
  const [allIdeas, setAllIdeas] = useState<IIdea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
  const [rejectionFeedback, setRejectionFeedback] = useState("")
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null)
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true)
        const response = await adminDashboardIdeas({ limit: 100 })
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
    try {
      const res = await updateIdeaStatusByAdmin(ideaId, { status: "APPROVED" })
      if(res.success) {
        toast.success("Idea approved successfully!")
        setAllIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: "APPROVED" } : i))
      } else {
        toast.error(res.message || "Failed to approve idea")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleReject = (ideaId: string) => {
    setSelectedIdeaId(ideaId)
    setRejectionFeedback("")
    setIsRejectionDialogOpen(true)
  }

  const handleRejectionConfirm = async () => {
    if (!selectedIdeaId || !rejectionFeedback.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }

    setIsSubmittingRejection(true)
    try {
      const res = await updateIdeaStatusByAdmin(selectedIdeaId, { status: "REJECTED", feedback: rejectionFeedback })
      if (res.success) {
        toast.success("Idea rejected successfully!")
        setAllIdeas(prev => prev.map(i => i.id === selectedIdeaId ? { ...i, status: "REJECTED", feedback: rejectionFeedback } : i))
        setIsRejectionDialogOpen(false)
        setRejectionFeedback("")
        setSelectedIdeaId(null)
      } else {
        toast.error(res.message || "Failed to reject idea")
      }
    } catch {
      toast.error("An error occurred while rejecting the idea")
    } finally {
      setIsSubmittingRejection(false)
    }
  }

  const handleReview = async (ideaId: string) => {
    try {
      const res = await updateIdeaStatusByAdmin(ideaId, { status: "UNDER_REVIEW" })
      if(res.success) {
        toast.success("Idea moved back to under review!")
        setAllIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: "UNDER_REVIEW" } : i))
      } else {
        toast.error(res.message || "Failed to move idea to review")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleToggleFeatured = async (ideaId: string, currentStatus: boolean) => {
    try {
      const res = await toggleIdeaFeatured(ideaId, !currentStatus)
      if(res.success) {
        toast.success(`Idea ${!currentStatus ? "featured" : "unfeatured"}!`)
        setAllIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, isFeatured: !currentStatus } : i))
      } else {
        toast.error(res.message || "Failed to feature idea")
      }
    } catch {
      toast.error("An error occurred")
    }
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
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, handleReview, handleToggleFeatured, getStatusIcon)}
        </TabsContent>
        <TabsContent value="under-review" className="space-y-4 mt-6">
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, handleReview, handleToggleFeatured, getStatusIcon)}
        </TabsContent>
        <TabsContent value="approved" className="space-y-4 mt-6">
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, handleReview, handleToggleFeatured, getStatusIcon)}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4 mt-6">
          {renderIdeasList(filteredIdeas, isLoading, handleApprove, handleReject, handleReview, handleToggleFeatured, getStatusIcon)}
        </TabsContent>
      </Tabs>

      {/* Professional Rejection Dialog */}
      <AlertDialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Reject Idea</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              Please provide a professional reason for rejecting this idea. This feedback will help the author improve their concept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Rejection Reason *
              </label>
              <Textarea
                placeholder="Explain why this idea is being rejected (be constructive and helpful)..."
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                {rejectionFeedback.length}/500 characters
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isSubmittingRejection}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectionConfirm}
              disabled={!rejectionFeedback.trim() || isSubmittingRejection}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmittingRejection ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </>
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function renderIdeasList(
  ideas: IIdea[],
  isLoading: boolean,
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  onReview: (id: string) => void,
  onToggleFeatured: (id: string, isFeatured: boolean) => void,
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
            <div className="md:col-span-2 space-y-2 border-r pr-4">
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
                {idea.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                    Featured
                  </span>
                )}
                {idea.isPaid && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Paid (${idea.price})
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500">
                By {idea.author?.name || "Unknown Author"} • {new Date(idea.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Status Information (Simplified) */}
            <div className="flex flex-col justify-center items-center space-y-2 text-center px-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Current Status
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block shadow-sm ${
                idea.status === "APPROVED" ? "bg-green-100 text-green-800" :
                idea.status === "REJECTED" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {idea.status}
              </span>
              <p className="text-[10px] text-slate-400 max-w-37.5">
                Admins can change this status at any time to manage platform content.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 border-l pl-4 flex flex-col justify-center">
                <div className="grid grid-cols-1 gap-2">
                  {idea.status !== "APPROVED" && (
                    <Button
                      onClick={() => onApprove(idea.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {idea.status !== "REJECTED" && (
                    <Button
                      onClick={() => onReject(idea.id)}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  {idea.status !== "UNDER_REVIEW" && (
                    <Button
                      onClick={() => onReview(idea.id)}
                      variant="outline"
                      className="w-full hover:bg-yellow-50 hover:text-yellow-700"
                      size="sm"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  )}
                  
                  {idea.status === "APPROVED" && (
                    <Button
                        onClick={() => onToggleFeatured(idea.id, idea.isFeatured)}
                        variant={idea.isFeatured ? "default" : "outline"}
                        className="w-full"
                        size="sm"
                    >
                      <Star className={`w-4 h-4 mr-2 ${idea.isFeatured ? "fill-current" : ""}`} />
                      {idea.isFeatured ? "Featured" : "Feature"}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="w-full border-t border-slate-100 pt-2 h-10"
                    size="sm"
                    asChild
                  >
                    <Link href={`/ideas/${idea.id}`}>View Details</Link>
                  </Button>
                </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

