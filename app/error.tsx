'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Toolblip Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-base leading-relaxed">
          Try refreshing the page or go back home.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#58D65D] hover:bg-[#4bc44e] text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 text-sm hover:shadow-lg hover:shadow-[#58D65D]/20 hover:-translate-y-0.5"
          >
            <Home size={16} />
            Go home
          </Link>
          <button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 text-sm hover:-translate-y-0.5"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
