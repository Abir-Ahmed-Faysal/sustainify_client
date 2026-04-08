import Link from 'next/link';
import { Home, Search, MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />

        {/* 404 Display */}
        <div className="relative z-10 mb-8">
          <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Oops! The page you&apos;re looking for has gone green. It might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/ideas"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
            Explore Ideas
          </Link>
        </div>

        {/* Help Section */}
        <div className="relative z-10 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            Need Help?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            If you believe this is an error, you can:
          </p>
          <ul className="text-left space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Check the URL for typos and try again</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Use the search feature on our website</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Contact us if you need further assistance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
