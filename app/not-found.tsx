import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Large 404 */}
      <div
        className="text-[clamp(100px,18vw,180px)] font-bold leading-none select-none mb-6"
        style={{
          color: "var(--green-tint)",
          WebkitTextStroke: "2px var(--green)",
        }}
      >
        404
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: "var(--fg-0)" }}>
        Page not found
      </h1>
      <p className="mb-10 max-w-sm text-base" style={{ color: "var(--fg-2)" }}>
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
