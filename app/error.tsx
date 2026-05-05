"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Something Went Wrong | Toolblip",
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service if configured
    console.error("[Toolblip] Uncaught error:", error);
  }, [error]);

  return (
    <main className="tb-v2-shell">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "var(--red-tint)",
            color: "var(--red)",
            display: "grid",
            placeItems: "center",
            marginBottom: "24px",
          }}
        >
          <svg
            className="tb-v2-ic-xl"
            viewBox="0 0 24 24"
            aria-hidden="true"
            strokeWidth={1.6}
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--f-display)",
            fontWeight: 700,
            fontSize: "clamp(22px, 4vw, 32px)",
            letterSpacing: "-0.025em",
            color: "var(--fg-0)",
            margin: "0 0 12px",
          }}
        >
          Something went wrong
        </h1>

        {/* Message */}
        <p
          style={{
            color: "var(--fg-1)",
            fontSize: "16px",
            maxWidth: "40ch",
            lineHeight: 1.6,
            margin: "0 0 32px",
          }}
        >
          Try refreshing the page or go back home.
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={reset}
            className="tb-v2-btn"
          >
            Try again
          </button>
          <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
            <svg
              className="tb-v2-ic"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
            </svg>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
