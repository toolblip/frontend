import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-md w-full">
        {/* Large 404 */}
        <div
          className="font-bold leading-none mb-6"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(80px, 18vw, 140px)',
            letterSpacing: '-0.04em',
            color: 'var(--green)',
            textShadow: '0 0 60px color-mix(in srgb, var(--green) 25%, transparent)',
          }}
        >
          404
        </div>

        {/* Heading */}
        <h1
          className="mb-4"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--fg-0)',
            lineHeight: 1.1,
          }}
        >
          Page not found
        </h1>

        {/* Message */}
        <p
          className="mb-10"
          style={{
            fontSize: '16px',
            color: 'var(--fg-1)',
            lineHeight: 1.6,
          }}
        >
          The page you're looking for doesn't exist.
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="tb-v2-btn tb-v2-btn-primary"
          >
            <svg className="tb-v2-ic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go home
          </Link>
          <Link
            href="/tools"
            className="tb-v2-btn"
          >
            <svg className="tb-v2-ic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Browse tools
          </Link>
        </div>
      </div>
    </main>
  );
}
