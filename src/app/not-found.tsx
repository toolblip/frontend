import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-20">
      <section className="w-full max-w-md text-center">
        <p
          className="mb-4 select-none font-bold leading-none tracking-[-0.06em] text-[var(--green)]"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(84px, 20vw, 152px)',
            textShadow: '0 0 56px color-mix(in srgb, var(--green) 24%, transparent)',
          }}
        >
          404
        </p>

        <h1
          className="mb-3 text-3xl font-bold tracking-[-0.03em] text-[var(--fg-0)] sm:text-4xl"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Page not found
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-base leading-7 text-[var(--fg-1)]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
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
