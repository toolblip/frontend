'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-24 dark:bg-gray-950">
      <section className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl dark:bg-red-950/40">
          ⚠️
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Something went wrong
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-500 dark:text-gray-400">
          Try refreshing the page or go back home
        </p>

        <div className="mt-8 flex justify-center">
          <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
