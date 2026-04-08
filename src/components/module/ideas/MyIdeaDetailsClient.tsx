import Link from "next/link";
import { IIdea } from "@/types/idea.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, CheckCircle, XCircle, Clock, FileText, AlertCircle } from "lucide-react";

interface MyIdeaDetailsClientProps {
  idea: IIdea;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-800 dark:text-emerald-200", icon: CheckCircle };
    case "REJECTED":
      return { bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", text: "text-red-800 dark:text-red-200", icon: XCircle };
    case "UNDER_REVIEW":
      return { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-800 dark:text-amber-200", icon: Clock };
    case "DRAFT":
      return { bg: "bg-slate-50 dark:bg-slate-800/20", border: "border-slate-200 dark:border-slate-700", text: "text-slate-800 dark:text-slate-200", icon: FileText };
    default:
      return { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-800", icon: FileText };
  }
};

export default function MyIdeaDetailsClient({ idea }: MyIdeaDetailsClientProps) {
  const statusConfig = getStatusColor(idea.status);
  const StatusIcon = statusConfig.icon;

  const statusDescriptions: Record<string, string> = {
    DRAFT: "Your idea is saved as a draft and not yet submitted for review.",
    UNDER_REVIEW: "Your idea is currently under review by the admin team. You can retract it to make changes.",
    APPROVED: "Congratulations! Your idea has been approved and is now visible to the community.",
    REJECTED: "Your idea was not approved. Please review the feedback below and consider resubmitting with improvements.",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/my-ideas"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Ideas
        </Link>
        <Link href={`/dashboard/edit-idea/${idea.id}`}>
          <Button variant="default" size="sm" className="inline-flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Idea
          </Button>
        </Link>
      </div>

      {/* Professional Status Section */}
      <div className={`border-l-4 rounded-lg p-6 ${statusConfig.bg} ${statusConfig.border} border`}>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${statusConfig.bg}`}>
            <StatusIcon className={`w-6 h-6 ${statusConfig.text}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg font-bold ${statusConfig.text}`}>
                {idea.status === "DRAFT" ? "Draft" : idea.status === "UNDER_REVIEW" ? "Under Review" : idea.status === "APPROVED" ? "Approved" : "Rejected"}
              </h3>
              <Badge className={idea.status === "APPROVED" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200" : idea.status === "REJECTED" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"}>
                {idea.status}
              </Badge>
            </div>
            <p className={`text-sm ${statusConfig.text}`}>
              {statusDescriptions[idea.status]}
            </p>
            {idea.updatedAt && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Last updated: {new Date(idea.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Feedback - Professional Block */}
      {idea.status === "REJECTED" && (
        <div className="border-l-4 border-red-500 rounded-lg bg-red-50 dark:bg-red-900/20 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <h4 className="text-base font-bold text-red-800 dark:text-red-300">Admin Feedback</h4>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {idea.feedback || "No specific feedback was provided. Please contact the admin team for more details."}
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded p-4 border border-red-200 dark:border-red-800 space-y-2">
            <h5 className="font-semibold text-sm text-slate-900 dark:text-white">Suggested Actions:</h5>
            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li>Review the feedback carefully</li>
              <li>Make improvements to address the concerns</li>
              <li>Edit your idea and resubmit for review</li>
            </ul>
          </div>
        </div>
      )}

      {/* Approval Success Block */}
      {idea.status === "APPROVED" && (
        <div className="border-l-4 border-emerald-500 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300">Approval Confirmed</h4>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Your idea has been successfully approved and is now live on the platform. The community can view, comment, and engage with your idea.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col gap-3 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{idea.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-100">{idea.category.name}</Badge>
            {idea.isPaid && <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100">Paid</Badge>}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Created at {new Date(idea.createdAt).toLocaleString()}</p>
        </div>

        <section className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Problem Statement</h2>
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{idea.problemStatement}</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Description</h2>
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{idea.description}</p>
        </section>

        {idea.solution && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Solution</h2>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{idea.solution}</p>
          </section>
        )}
      </div>
    </div>
  );
}
