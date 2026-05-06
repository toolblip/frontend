"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Metadata } from "next";

// NOTE: metadata exports are inert in "use client" components.
// The root layout's openGraph/twitter defaults apply instead.
export const metadata: Metadata = {
  title: "Something Went Wrong | Toolblip",
  description:
    "An unexpected error occurred. Try refreshing the page or head back to Toolblip.",
  openGraph: {
    title: "Something Went Wrong | Toolblip",
    description:
      "An unexpected error occurred. Try refreshing the page or head back to Toolblip.",
    url: "https://toolblip.com",
    siteName: "Toolblip",
  },
  twitter: {
    card: "summary",
    title: "Something Went Wrong | Toolblip",
    description:
      "An unexpected error occurred. Try refreshing or head back to Toolblip.",
  },
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
          <button onClick={reset} className="tb-v2-btn">
            <svg
              className="tb-v2-ic"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try again
          </button>
          <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
            <svg
              className="tb-v2-ic"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
