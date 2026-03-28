import { getIdeaById } from "@/services/idea.service";
import { getUserInfo } from "@/services/auth.service";
import { checkIdeaAccess } from "@/services/access.service";
import IdeaDetails from "@/components/module/ideas/IdeaDetails";
import PaidIdeaAccess from "@/components/module/ideas/PaidIdeaAccess";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import { redirect } from "next/navigation";

interface IdeaDetailsPageProps {
  params: Promise<{ id: string }>;
}

const IdeaDetailsPage = async ({ params }: IdeaDetailsPageProps) => {
  const { id } = await params;
  const currentUser = await getUserInfo();

  let idea: IIdea | null = null;
  let errorMessage = "";

  try {
    const response = await getIdeaById(id);
    idea = response.data;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
    ) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Failed to load idea details";
    }
  }

  // Check if idea is not found
  if (!idea) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
        <Link href="/ideas" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ideas
        </Link>
        
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">Idea Not Found</h2>
          <p className="text-red-800 dark:text-red-200 mb-4">
            {errorMessage || "The idea you're looking for doesn't exist or is no longer available."}
          </p>
          <Button asChild variant="outline">
            <Link href="/ideas">Browse All Ideas</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if idea is approved or if user is the author
  const isAuthor = currentUser?.id === idea.author.id || currentUser?._id === idea.author.id;
  const canViewIdea =
    idea.status === "APPROVED" || isAuthor;

  if (!canViewIdea) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
        <Link href="/ideas" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ideas
        </Link>
        
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
            Idea Not Available
          </h2>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            This idea is {idea.status.toLowerCase().replace("_", " ")} and not available to view at this time.
          </p>
          <Button asChild variant="outline">
            <Link href="/ideas">Browse Other Ideas</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle paid idea access
  if (idea.isPaid && !isAuthor && currentUser?.role !== "ADMIN") {
    // If user is not logged in, redirect to login
    if (!currentUser) {
      redirect(`/login?redirect=/ideas/${id}`);
    }

    // Check if user has access to this paid idea
    let hasAccess = false;
    try {
      const accessResponse = await checkIdeaAccess(id);
      hasAccess = accessResponse.data === true;
    } catch (error) {
      console.error("Error checking idea access:", error);
      hasAccess = false;
    }

    // If user doesn't have access, show payment UI
    if (!hasAccess) {
      return (
        <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
          <Link href="/ideas" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ideas
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {idea.title}
                  </h1>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                This is exclusive, premium content. Purchase access to unlock the full insights and details.
              </p>

              <PaidIdeaAccess ideaId={idea.id} price={idea.price || 0} title={idea.title} />

              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  By purchasing, you'll get immediate access to the complete idea, including full problem statement, solution details, and community insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Determine voting status
  const hasUserUpvoted = currentUser ? idea.totalUpVotes > 0 : false;
  const hasUserDownvoted = currentUser ? idea.totalDownVotes > 0 : false;

  // Voting handlers (client-side would handle these)
  const handleUpvote = () => {
    // This would be handled by a client component
    console.log("Upvote");
  };

  const handleDownvote = () => {
    // This would be handled by a client component
    console.log("Downvote");
  };

  const handleRemoveVote = () => {
    // This would be handled by a client component
    console.log("Remove vote");
  };

  return (
    <IdeaDetails
      idea={idea}
      isAuthor={isAuthor}
      currentUserId={currentUser?._id}
      hasUserUpvoted={hasUserUpvoted}
      hasUserDownvoted={hasUserDownvoted}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      onRemoveVote={handleRemoveVote}
    />
  );
};

export default IdeaDetailsPage;
