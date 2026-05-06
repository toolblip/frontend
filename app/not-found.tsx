import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '404 — Page Not Found | Toolblip',
  description: 'The page you\'re looking for doesn\'t exist. Head back to Toolblip\'s free online tools.',
  openGraph: {
    title: '404 — Page Not Found | Toolblip',
    description: 'The page you\'re looking for doesn\'t exist. Head back to Toolblip\'s free online tools.',
    url: 'https://toolblip.com',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: '404 — Page Not Found | Toolblip',
    description: 'The page you\'re looking for doesn\'t exist. Head back to Toolblip\'s free online tools.',
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
        {/* Large 404 */}
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
              <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
            </svg>
            Go home
          </Link>
          <Link href="/tools" className="tb-v2-btn">
            Browse tools
          </Link>
        </div>
      </div>
    </main>
  );
}
