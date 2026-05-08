'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-20">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--green)] shadow-sm">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1
          className="mb-3 text-3xl font-bold tracking-[-0.03em] text-[var(--fg-0)] sm:text-4xl"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Something went wrong
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-base leading-7 text-[var(--fg-1)]">
          Try refreshing the page or go back home
        </p>

        <Link href="/" className="tb-v2-btn tb-v2-btn-primary mx-auto inline-flex">
          Go home
        </Link>
      </section>
    </main>
  );
}
