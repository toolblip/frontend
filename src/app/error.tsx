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
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-4 py-16 text-[var(--fg-0)]">
      <section
        aria-labelledby="error-title"
        aria-describedby="error-description"
        className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface-2)] p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:shadow-none sm:p-10"
        role="alert"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green)]/10"
        >
          <svg
            className="h-8 w-8 text-[var(--green)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1
          id="error-title"
          className="mb-3 text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Something went wrong
        </h1>

        <p
          id="error-description"
          className="mx-auto mb-8 max-w-sm text-balance text-base leading-7 text-[var(--fg-1)]"
        >
          Try refreshing the page or go back home
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="tb-v2-btn"
          >
            Try again
          </button>
          <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}