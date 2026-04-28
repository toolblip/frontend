import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">

        {/* Large friendly 404 in green */}
        <div
          className="text-[8rem] sm:text-[10rem] leading-none font-extrabold tracking-tighter mb-2"
          style={{ color: 'var(--c-img)', fontFamily: 'var(--f-display)' }}
        >
          404
        </div>

        <h1
          className="text-2xl font-bold text-[var(--fg-0)] mb-3"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          Page not found
        </h1>

        <p className="text-[var(--fg-2)] text-base mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--red)', fontFamily: 'var(--f-sans)' }}
          >
            Go home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-80"
            style={{
              borderColor: 'var(--line-2)',
              backgroundColor: 'var(--surface)',
              color: 'var(--fg-1)',
              fontFamily: 'var(--f-sans)',
            }}
          >
            Browse tools
          </Link>
        </div>
      </div>
    </main>
  );
}
