export default function UsersManagementLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-200 rounded-lg h-24" />
        ))}
      </div>

      {/* Filter Section Skeleton */}
      <div className="p-4 bg-gray-200 rounded-lg space-y-4">
        <div className="h-10 bg-gray-300 rounded w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-300 rounded" />
          <div className="h-10 bg-gray-300 rounded" />
        </div>
      </div>

      {/* User Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-gray-200 rounded-lg space-y-4"
          >
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="space-y-2 pt-2 border-t border-gray-300">
              <div className="h-8 bg-gray-300 rounded" />
              <div className="h-10 bg-gray-300 rounded" />
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-300 rounded" />
                <div className="h-10 w-10 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
