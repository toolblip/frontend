'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Toolblip Global Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="mb-6">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">500</div>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">Critical error</p>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              A critical error prevented the page from loading. The team has been notified.
            </p>

            <button
              onClick={reset}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
