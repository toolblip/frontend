import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--bg)] px-6 py-20 text-[var(--fg-0)]">
      <section
        aria-labelledby="not-found-title"
        className="relative isolate w-full max-w-md overflow-hidden rounded-[2rem] border border-black/5 bg-white/55 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035] sm:p-10"
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 -z-10 h-28 rounded-full bg-[var(--green)]/10 blur-3xl" />

        <p
          aria-hidden="true"
          className="mb-5 select-none font-bold leading-none tracking-[-0.07em] text-[var(--green)]"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(96px, 24vw, 168px)',
            textShadow: '0 0 56px color-mix(in srgb, var(--green) 24%, transparent)',
          }}
        >
          404
        </p>

        <h1
          id="not-found-title"
          className="mb-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Page not found
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-base leading-7 text-[var(--fg-1)]">
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
