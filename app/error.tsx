'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #58D65D12 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
        {/* Error icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-6 border border-red-500/20 dark:border-red-500/25">
          <svg
            className="w-9 h-9 text-red-500 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#58D65D] hover:bg-[#4bc44e] text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 text-sm hover:shadow-lg hover:shadow-[#58D65D]/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home size={16} />
            Go home
          </Link>
          <button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 text-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
