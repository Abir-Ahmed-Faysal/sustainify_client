import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllBlogs } from "@/services/blog.service";
import BlogsClient from "@/components/module/blog/BlogsClient";
import { IBlogQuery } from "@/types/blog.types";

// Revalidate blog listing page every 1 hour (3600s) - blogs are created/updated
export const revalidate = 3600;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryClient = new QueryClient();
  const params = await searchParams;

  const query: IBlogQuery = {
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 12,
    searchTerm: (params.searchTerm as string) || undefined,
    sortBy: (params.sortBy as string) || "createdAt",
    sortOrder: (params.sortOrder as "asc" | "desc") || "desc",
  };

  // Prefetch blogs on the server
  await queryClient.prefetchQuery({
    queryKey: ["blogs", query],
    queryFn: () => getAllBlogs(query),
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
      <div className="flex flex-col mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Sustainify <span className="text-emerald-600">Stories</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The hub for environmental insights and sustainable living. Read deep-dives, community 
          success stories, and expert tips on planet-first living.
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogsClient queryParams={query} />
      </HydrationBoundary>
    </div>
  );
}
