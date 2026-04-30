import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <style>{`
        @keyframes float404 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-404 { animation: float404 3s ease-in-out infinite; }
      `}</style>

      {/* Compass icon — suggesting "you're lost" */}
      <svg
        className="mb-6 opacity-30"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--green)' }}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
      </svg>

      {/* 404 glyph */}
      <div
        className="select-none mb-8 float-404"
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
