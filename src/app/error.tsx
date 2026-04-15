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

  const is500 = !error?.message?.toLowerCase().includes('not found');

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
      <div className="mb-6">
        <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
          {is500 ? '500' : 'Error'}
        </div>
        <p className="text-red-600 dark:text-red-400 text-sm font-medium">
          {is500 ? 'Internal server error' : 'Something went wrong'}
        </p>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
        {is500
          ? 'An unexpected error occurred on our servers. The team has been notified.'
          : error?.message || 'An unexpected error occurred.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={reset}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Try again
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Back to home
        </Link>
      </div>

      <p className="text-gray-400 dark:text-gray-500 text-xs mt-8">
        If this keeps happening,{' '}
        <a
          href="https://github.com/toolblip/toolblip/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
        >
          open an issue on GitHub
        </a>
        .
      </p>
    </div>
  );
}
