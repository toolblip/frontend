"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Large 500 */}
      <div
        className="text-[clamp(100px,18vw,180px)] font-bold leading-none select-none mb-6"
        style={{
          color: "var(--red-tint)",
          WebkitTextStroke: "2px var(--red)",
        }}
      >
        500
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: "var(--fg-0)" }}>
        Something went wrong
      </h1>
      <p className="mb-10 max-w-sm text-base" style={{ color: "var(--fg-2)" }}>
        Try refreshing the page or go back home.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="tb-v2-btn tb-v2-btn-primary"
        >
          Go home
        </Link>
        <button
          onClick={reset}
          className="tb-v2-btn"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
