import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMyIdeaById } from "@/services/idea.service";
import { getUserInfo } from "@/services/auth.service";
import { getCommentsByIdeaId } from "@/services/comment.service";
import IdeaDetailsClient from "@/components/module/ideas/IdeaDetailsClient";
import Link from "next/link";
import { ArrowLeft, Edit2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IIdea } from "@/types/idea.types";

export const dynamic = "force-dynamic";

interface MyIdeaDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyIdeaDetailsPage({ params }: MyIdeaDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Prefetch comments using TanStack Query
  await queryClient.prefetchQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await getCommentsByIdeaId(id);
      return response.data || [];
    },
  });

  // Fetch idea details and user info concurrently
  const [response, currentUser] = await Promise.all([
    getMyIdeaById(id),
    getUserInfo(),
  ]);

  const idea: IIdea | null = response.data ?? null;

  if (!idea) {
    redirect("/dashboard/my-ideas");
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b pb-4">
        <div>
          <Link 
            href="/dashboard/my-ideas" 
            className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to My Ideas
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Idea Details</h1>
        </div>

        {idea.status !== "APPROVED" && (
          <Link href={`/dashboard/edit-idea/${id}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Idea
            </Button>
          </Link>
        )}
      </div>

      {/* Idea Content */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <IdeaDetailsClient
            idea={idea}
            isAuthor={true}
            currentUserId={currentUser?._id || currentUser?.id}
          />
        </div>
      </HydrationBoundary>
    </div>
  );
}
