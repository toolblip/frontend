'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
      <p className="text-8xl sm:text-9xl font-bold text-red-500 dark:text-red-400 mb-6 select-none">
        500
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10 text-base">
        Try refreshing the page or go back home.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Go home
        </Link>
        <button
          onClick={reset}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
