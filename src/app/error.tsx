'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-[10rem] leading-none font-bold tracking-tight text-red-500 dark:text-red-400 mb-6 select-none">
        500
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm">
        Try refreshing the page or go back home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 active:scale-95 transition-all"
        >
          Go home
        </Link>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 active:scale-95 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
