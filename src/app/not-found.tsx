import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* 404 glyph */}
      <div
        className="select-none mb-8"
        style={{
          fontFamily: 'var(--f-display)',
          fontWeight: 800,
          fontSize: 'clamp(7rem, 20vw, 11rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'var(--green-tint)',
          WebkitTextStroke: '2px var(--green)',
        }}
        aria-hidden="true"
      >
        404
      </div>

      <h1
        className="mb-3"
        style={{
          fontFamily: 'var(--f-display)',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          letterSpacing: '-0.025em',
          color: 'var(--fg-0)',
        }}
      >
        Page not found
      </h1>
      <p
        className="mb-10 max-w-xs"
        style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.6 }}
      >
        The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Go home
        </Link>
        <Link
          href="/tools"
          className="tb-v2-btn"
        >
          Browse tools
        </Link>
      </div>
    </div>
  );
}
