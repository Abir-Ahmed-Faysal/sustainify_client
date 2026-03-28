export default function IdeasLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-screen">
      <div className="flex flex-col mb-12">
        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 animate-pulse" />
        <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
