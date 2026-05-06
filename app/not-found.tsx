import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Toolblip",
  description:
    "The page you're looking for doesn't exist. Head back to Toolblip's free online tools.",
  openGraph: {
    title: "404 — Page Not Found | Toolblip",
    description:
      "The page you're looking for doesn't exist. Head back to Toolblip's free online tools.",
    url: "https://toolblip.com",
    siteName: "Toolblip",
  },
  twitter: {
    card: "summary",
    title: "404 — Page Not Found | Toolblip",
    description:
      "The page you're looking for doesn't exist. Head back to Toolblip's free online tools.",
  },
};

export default function NotFound() {
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
        {/* Large 404 with glow */}
        <div
          style={{
            fontFamily: "var(--f-display)",
            fontWeight: 700,
            fontSize: "clamp(80px, 18vw, 160px)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "var(--green)",
            marginBottom: "8px",
            userSelect: "none",
            textShadow: "0 0 60px color-mix(in srgb, var(--green) 30%, transparent)",
          }}
        >
          404
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
          Page not found
        </h1>

        {/* Message */}
        <p
          style={{
            color: "var(--fg-1)",
            fontSize: "16px",
            maxWidth: "36ch",
            lineHeight: 1.6,
            margin: "0 0 36px",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
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
          <Link href="/tools" className="tb-v2-btn">
            <svg
              className="tb-v2-ic"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Browse tools
          </Link>
        </div>
      </div>
    </main>
  );
}
