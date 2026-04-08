export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center">
          {/* Loading Spinner */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-16 h-16">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-900/30" />
              {/* Animated inner ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Loading
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Getting sustainable ideas for you...
          </p>

          {/* Skeleton Loader Preview */}
          <div className="space-y-4 mt-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-lg h-20 animate-pulse" />
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-10">
            <div className="bg-slate-200 dark:bg-slate-800 rounded-full h-1 w-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full" 
                style={{
                  width: '100%',
                  animation: 'loading 2s ease-in-out infinite',
                  transformOrigin: 'left',
                }}
              />
            </div>
          </div>

          {/* Style for animation */}
          <style>{`
            @keyframes loading {
              0% { transform: scaleX(0); }
              50% { transform: scaleX(1); }
              100% { transform: scaleX(0); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
