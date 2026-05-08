import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Toolblip',
  description: 'Toolblip is a collection of free developer and productivity tools that run entirely in your browser. No servers, no uploads, no accounts required.',
  openGraph: {
    title: 'About | Toolblip',
    description: 'Toolblip is a collection of free developer and productivity tools that run entirely in your browser. No servers, no uploads, no accounts required.',
    url: 'https://toolblip.com/about',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'About | Toolblip',
    description: 'Toolblip is a collection of free developer and productivity tools that run entirely in your browser. No servers, no uploads, no accounts required.',
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1
        className="mb-6"
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--fg-0)',
          lineHeight: 1.15,
        }}
      >
        About Toolblip
      </h1>

      <div className="space-y-6" style={{ fontSize: '17px', color: 'var(--fg-1)', lineHeight: 1.75 }}>
        <p>
          Toolblip is a free collection of browser-based developer and productivity tools.
          Every tool runs <strong>100% client-side</strong> — your data never leaves your browser.
        </p>
        <p>
          No accounts, no signups, no paywalls. Just open a tool and use it.
        </p>
        <p>
          We built Toolblip because we were tired of online tools that upload your data to
          unknown servers, bombard you with ads, or hide basic features behind paywalls.
        </p>

        <h2
          className="mt-10 mb-4"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Why Toolblip?
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Private</strong> — Nothing is uploaded, stored, or sent anywhere.</li>
          <li><strong>Fast</strong> — All processing happens instantly in your tab.</li>
          <li><strong>Free</strong> — No signup, no limits, no paywall.</li>
          <li><strong>Open</strong> — Clean, minimal interface. No distractions.</li>
        </ul>

        <div className="mt-10 p-6 rounded-2xl border border-[var(--line)] text-center"
          style={{ background: 'var(--surface-2)' }}>
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--fg-0)',
            }}
          >
            Have questions or feedback?
          </p>
          <Link href="/directory" className="tb-v2-btn tb-v2-btn-primary">
            Browse Our Tools →
          </Link>
        </div>
      </div>
    </main>
  );
}
