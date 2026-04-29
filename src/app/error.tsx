'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-9xl font-bold text-red-500 dark:text-red-400 leading-none mb-4">
        Error
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        Try refreshing the page or go back home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
