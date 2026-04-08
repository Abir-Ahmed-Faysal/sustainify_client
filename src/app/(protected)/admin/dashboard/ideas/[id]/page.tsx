// src/app/(protected)/admin/dashboard/ideas/[id]/page.tsx

import { getAdminIdeaById } from "@/services/idea.service";
import IdeaDetailsClient from "@/components/module/ideas/IdeaDetailsClient";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { IIdea } from "@/types/idea.types";
import { Badge } from "@/components/ui/badge";

interface AdminIdeaDetailsPageProps {
  params: { id: string };
}

const AdminIdeaDetailsPage = async ({ params }: AdminIdeaDetailsPageProps) => {
  const { id } = await params;

  const response = await getAdminIdeaById(id);

  const idea: IIdea | null = response.data ?? null;

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Idea not found</h1>
        <p className="text-muted-foreground mt-2">
          The idea you are looking for might have been deleted or the ID is incorrect.
        </p>
        <Link href="/admin/dashboard/ideas-management" className="mt-6 inline-block text-primary hover:underline">
          Back to Ideas Management
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link
            href="/admin/dashboard/ideas-management"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Ideas Management
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Admin Review</h1>
            <Badge variant={idea.status === "APPROVED" ? "default" : idea.status === "REJECTED" ? "destructive" : "secondary"}>
              {idea.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Administrator View</p>
            <p className="text-xs text-amber-700">
              You are viewing this idea with full administrative privileges. 
              Status: <span className="font-bold">{idea.status}</span>. 
              Author: <span className="font-bold">{idea.author.name} ({idea.author.email})</span>.
            </p>
          </div>
        </div>

        <IdeaDetailsClient idea={idea} />
      </div>
    </div>
  );
};

export default AdminIdeaDetailsPage;
