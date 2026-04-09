import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full" />
      
      {/* Content Skeleton */}
      <div className="space-y-3 p-5">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 rounded" />
        
        {/* Metadata */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        {/* Footer stats */}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
