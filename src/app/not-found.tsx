import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-24 dark:bg-gray-950">
      <section className="mx-auto w-full max-w-md text-center">
        <p className="text-8xl font-bold leading-none tracking-tight text-green-600 dark:text-green-400 sm:text-9xl">
          404
        </p>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-500 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
            Go home
          </Link>
          <Link href="/tools" className="tb-v2-btn">
            Browse tools
          </Link>
        </div>
      </section>
    </main>
  );
}
