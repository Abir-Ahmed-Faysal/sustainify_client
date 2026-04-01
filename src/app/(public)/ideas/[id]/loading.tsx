export default function IdeaDetailsLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2">
          {/* Image Skeleton */}
          <div className="w-full h-96 bg-slate-200 dark:bg-slate-700 rounded-lg mb-6 animate-pulse" />
          
          {/* Title Skeleton */}
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse" />
          
          {/* Metadata Skeleton */}
          <div className="flex gap-4 mb-8">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar Skeleton */}
        <div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
