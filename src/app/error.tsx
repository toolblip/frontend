'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-6 py-20 text-[var(--fg-0)]">
      <section aria-labelledby="error-title" className="w-full max-w-md text-center">
        <p
          className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[var(--green)]"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Error
        </p>

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
