'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">

        {/* Large error indicator */}
        <div
          className="text-[7rem] sm:text-[9rem] leading-none font-extrabold tracking-tighter mb-4"
          style={{ color: 'var(--red)', fontFamily: 'var(--f-display)' }}
        >
          !
        </div>

        <h1
          className="text-2xl font-bold text-[var(--fg-0)] mb-3"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Something went wrong
        </h1>

        <p className="text-[var(--fg-2)] text-base mb-10 leading-relaxed">
          Try refreshing the page or go back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
            style={{
              borderColor: 'var(--line-2)',
              backgroundColor: 'var(--surface)',
              color: 'var(--fg-1)',
              fontFamily: 'var(--f-sans)',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--red)', fontFamily: 'var(--f-sans)' }}
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
