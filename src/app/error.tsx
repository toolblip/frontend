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
    // Log to error monitoring service in production
    console.error('[Toolblip Error]', error);
  }, [error]);

  const is500 = !error?.message?.toLowerCase().includes('not found');

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
      <div className="mb-6">
        <div className="text-6xl font-bold text-white mb-2">
          {is500 ? '500' : 'Error'}
        </div>
        <p className="text-red-400 text-sm font-medium">
          {is500 ? 'Internal server error' : 'Something went wrong'}
        </p>
      </div>

      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        {is500
          ? 'An unexpected error occurred on our servers. The team has been notified.'
          : error?.message || 'An unexpected error occurred.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={reset}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Try again
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto border border-gray-700 hover:border-gray-600 text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Back to home
        </Link>
      </div>

      <p className="text-gray-600 text-xs mt-8">
        If this keeps happening,{' '}
        <a
          href="https://github.com/toolblip/toolblip/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-400 underline transition-colors"
        >
          open an issue on GitHub
        </a>
        .
      </p>
    </div>
  );
}
