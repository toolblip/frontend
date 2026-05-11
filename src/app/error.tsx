'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-4 py-16 text-[var(--fg-0)]">
      <section
        aria-labelledby="error-title"
        aria-describedby="error-description"
        className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface-2)] p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:shadow-none sm:p-10"
        role="alert"
      >
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

        <Link href="/" className="tb-v2-btn tb-v2-btn-primary mx-auto inline-flex">
          Go home
        </Link>
      </section>
    </main>
  );
}
