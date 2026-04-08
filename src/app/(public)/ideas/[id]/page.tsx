// app/(public)/ideas/[id]/page.tsx

import { getIdeaById } from "@/services/idea.service";
import IdeaDetailsClient from "@/components/module/ideas/IdeaDetailsClient";
import PaidIdeaAccess from "@/components/module/ideas/PaidIdeaAccess";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock } from "lucide-react";
import { IIdea } from "@/types/idea.types";

interface IdeaDetailsPageProps {
  params: { id: string };
}

const IdeaDetailsPage = async ({ params }: IdeaDetailsPageProps) => {
  const { id } = await params;

  const response = await getIdeaById(id);

  const idea: IIdea | null = response.data ?? null;

  if (!idea) {
    return <div>Idea not found</div>;
  }

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
          />
        ) : (
          <>
            {/* 🔒 PREVIEW */}
            <div className="bg-white rounded-lg shadow mb-8">
              {idea.image && (
              <div className="h-64 overflow-hidden relative">
                <Image
                  src={idea.image}
                  alt={idea.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw"
                  priority
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
            />
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaDetailsPage;