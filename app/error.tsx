"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      {/* Outlined 500 number with soft red bg circle */}
      <div className="relative mb-10">
        <div
          className="w-44 h-44 rounded-full flex items-center justify-center select-none"
          style={{ background: "var(--red-tint)" }}
          aria-hidden="true"
        >
          <span
            className="text-[clamp(72px,12vw,120px)] font-bold leading-none tracking-tight"
            style={{
              color: "var(--red-tint)",
              WebkitTextStroke: "2px var(--red)",
            }}
          >
            500
          </span>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold mb-3" style={{ color: "var(--fg-0)" }}>
        Something went wrong
      </h1>
      <p className="mb-10 max-w-sm text-base" style={{ color: "var(--fg-2)" }}>
        Try refreshing the page or go back home.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
          <Home size={15} />
          Go home
        </Link>
        <button onClick={reset} className="tb-v2-btn">
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    </div>
  );
}
