import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div
        className="text-9xl font-bold select-none leading-none mb-4"
        style={{ color: 'var(--green-tint)', WebkitTextStroke: '2px var(--c-img, #1e6b42)' }}
      >
        404
      </div>
      <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--fg-0)' }}>
        Page not found
      </h1>
      <p className="mb-8 max-w-sm" style={{ color: 'var(--fg-2)' }}>
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
