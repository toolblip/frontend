import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-4 py-16 text-[var(--fg-0)]">
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface-2)] p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:shadow-none sm:p-10"
      >
        <p
          aria-hidden="true"
          className="mb-5 select-none font-bold leading-none tracking-[-0.07em] text-[var(--green)]"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(104px, 24vw, 168px)',
          }}
        >
          404
        </p>

        <h1
          id="not-found-title"
          className="mb-3 text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Page not found
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-balance text-base leading-7 text-[var(--fg-1)]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
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
