'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
        {/* Icon */}
        <div
          className="mb-6 inline-flex items-center justify-center rounded-2xl"
          style={{
            width: '72px',
            height: '72px',
            background: 'var(--red-tint)',
            fontSize: '32px',
          }}
        >
          ⚠️
        </div>

        {/* Divider */}
        <div className="mx-auto mb-8 h-px w-12" style={{ background: 'var(--red)', opacity: 0.3 }} />

        {/* Heading */}
        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--fg-0)',
            lineHeight: 1.1,
          }}
        >
          Something went wrong
        </h1>

        {/* Message */}
        <p
          className="mb-10"
          style={{
            fontSize: '16px',
            color: 'var(--fg-1)',
            lineHeight: 1.6,
          }}
        >
          Try refreshing the page or go back home.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="tb-v2-btn tb-v2-btn-primary"
          >
            <svg className="tb-v2-ic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go home
          </Link>
          <button
            onClick={reset}
            className="tb-v2-btn"
          >
            <svg className="tb-v2-ic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
