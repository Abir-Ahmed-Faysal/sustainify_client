// app/(public)/ideas/[id]/page.tsx

import { getIdeaById } from "@/services/idea.server.service";
import { getUserInfo } from "@/services/auth.service";
import IdeaDetailsClient from "@/components/module/ideas/IdeaDetailsClient";
import PaidIdeaAccess from "@/components/module/ideas/PaidIdeaAccess";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { IIdea } from "@/types/idea.types";

export const dynamic = "force-dynamic";

interface IdeaDetailsPageProps {
  params: { id: string };
}

const IdeaDetailsPage = async ({ params }: IdeaDetailsPageProps) => {
  const { id } = await params;

  const [response, currentUser] = await Promise.all([
    getIdeaById(id),
    getUserInfo(),
  ]);

  const idea: IIdea | null = response.data ?? null;

  if (!idea) {
    return <div>Idea not found</div>;
  }

  const userId = currentUser?.id || currentUser?._id;
  const isAuthor = userId === idea.author.id;

  const isLocked = idea.isPaid && !idea.unlock;
  const canViewIdea = idea.status === "APPROVED";

  if (!canViewIdea) {
    return <div>Not available</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
      <Link href="/ideas" className="inline-flex items-center mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Ideas
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* 🔓 FULL ACCESS */}
        {!isLocked ? (
          <IdeaDetailsClient
            idea={idea}
            isAuthor={isAuthor}
            currentUserId={currentUser?._id}
          />
        ) : (
          <>
            {/* 🔒 PREVIEW */}
            <div className="bg-white rounded-lg shadow mb-8">
              {idea.image && (
                <div className="h-64 overflow-hidden">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-amber-600" />
                  <h1 className="text-2xl font-bold">{idea.title}</h1>
                </div>

                <p className="mb-4">{idea.problemStatement}</p>

                {/* 🔥 IMPORTANT: DO NOT SHOW SOLUTION */}
                <div className="bg-slate-100 p-4 rounded">
                  <p className="text-sm italic">
                    🔒 Solution is locked. Purchase to unlock full content.
                  </p>
                </div>
              </div>
            </div>

            {/* 💳 PAYWALL */}
            <PaidIdeaAccess
              ideaId={idea.id}
              price={idea.price ?? 0}
              title={idea.title}
              isLoggedIn={!!currentUser}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaDetailsPage;