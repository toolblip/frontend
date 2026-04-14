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
      <body className="bg-[#0a0a0a] text-white min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-white mb-2">500</div>
            <p className="text-red-400 text-sm font-medium">Critical error</p>
          </div>

          <p className="text-gray-400 text-sm mb-8">
            A critical error prevented the page from loading. The team has been notified.
          </p>

          <button
            onClick={reset}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
