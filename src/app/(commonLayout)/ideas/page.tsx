
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";
import IdeasClient from "@/components/module/ideas/IdeasClient";
import { IIdeaQuery } from "@/types/idea.types";

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryClient = new QueryClient();
  const params = await searchParams;

  // Configure Query Parameters based on searchParams
  const query: IIdeaQuery = {
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 12,
    searchTerm: (params.searchTerm as string) || undefined,
    category: (params.category as string) || undefined,
    isPaid: params.isPaid === "true" ? true : params.isPaid === "false" ? false : undefined,
    sortBy: (params.sortBy as IIdeaQuery["sortBy"]) || "createdAt",
  };

  // Prefetching ideas on the server
  await queryClient.prefetchQuery({
    queryKey: ["ideas", query],
    queryFn: () => getIdeas(query),
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
      <div className="flex flex-col mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Explore <span className="text-emerald-600">Sustainability</span> Ideas
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Discover high-impact solutions shared by our community members. Search, filter, and 
          engage with the best green innovations for a better planet.
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <IdeasClient queryParams={query} />
      </HydrationBoundary>
    </div>
  );
}

