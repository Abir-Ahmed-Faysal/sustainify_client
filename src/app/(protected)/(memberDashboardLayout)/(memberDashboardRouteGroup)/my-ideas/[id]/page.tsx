import { getMyIdeaById } from "@/services/idea.service";
import { getUserInfo } from "@/services/auth.service";
import IdeaDetailsClient from "@/components/module/ideas/IdeaDetailsClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { IIdea } from "@/types/idea.types";

export const dynamic = "force-dynamic";

interface MyIdeaDetailsPageProps {
  params: Promise<{ id: string }>;
}

const MyIdeaDetailsPage = async ({ params }: MyIdeaDetailsPageProps) => {
  const { id } = await params;

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
      <Link href="/dashboard/my-ideas" className="inline-flex items-center mb-6 text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to My Ideas
      </Link>

      <div className="max-w-4xl mx-auto">
        <IdeaDetailsClient
          idea={idea}
          isAuthor={true}
          currentUserId={currentUser?._id || currentUser?.id}
        />
      </div>
    </div>
  );
};

export default MyIdeaDetailsPage;
