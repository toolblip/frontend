'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* Error glyph */}
      <div
        className="select-none mb-8"
        style={{
          fontFamily: 'var(--f-display)',
          fontWeight: 800,
          fontSize: 'clamp(5rem, 16vw, 9rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'var(--red-tint)',
          WebkitTextStroke: '2px var(--red)',
        }}
        aria-hidden="true"
      >
        Oops
      </div>

      <h1
        className="mb-3"
        style={{
          fontFamily: 'var(--f-display)',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          letterSpacing: '-0.025em',
          color: 'var(--fg-0)',
        }}
      >
        Something went wrong
      </h1>
      <p
        className="mb-10 max-w-xs"
        style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.6 }}
      >
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
