'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-6 py-20 text-[var(--fg-0)]">
      <section
        aria-labelledby="error-title"
        className="relative isolate w-full max-w-md overflow-hidden rounded-[2rem] border border-black/5 bg-white/50 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035] sm:p-10"
        role="alert"
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 -z-10 h-28 rounded-full bg-[var(--green)]/10 blur-3xl" />

        <h1
          id="error-title"
          className="mb-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
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
