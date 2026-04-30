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
      <style>{`
        @keyframes floatOops {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .float-oops { animation: floatOops 2.8s ease-in-out infinite; }
      `}</style>

      {/* Warning triangle icon */}
      <svg
        className="mb-6 opacity-30"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--red)' }}
        aria-hidden="true"
      >
        <path d="m10.29 3.86-8.07 14A2 2 0 0 0 3.79 21h16.42a2 2 0 0 0 1.57-3l-8.07-14a2 2 0 0 0-3.14 0Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>

      {/* Error glyph */}
      <div
        className="select-none mb-8 float-oops"
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
