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
      <div
        className="text-9xl font-bold select-none leading-none mb-4"
        style={{ color: 'var(--red-tint)', WebkitTextStroke: '2px var(--red)' }}
      >
        !
      </div>
      <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--fg-0)' }}>
        Something went wrong
      </h1>
      <p className="mb-8 max-w-sm" style={{ color: 'var(--fg-2)' }}>
        Try refreshing the page or go back home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Go home
        </Link>
        <button
          onClick={reset}
          className="tb-v2-btn"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
