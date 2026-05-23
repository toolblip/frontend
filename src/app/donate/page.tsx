import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support Toolblip | Toolblip',
  description: 'Toolblip is free, forever. No login, no paywalls. If it saved you time, a coffee keeps the lights on. Donate via GitHub Sponsors or Ko-fi.',
  openGraph: {
    title: 'Support Toolblip | Toolblip',
    description: 'Toolblip is free, forever. No login, no paywalls. If it saved you time, a coffee keeps the lights on. Donate via GitHub Sponsors or Ko-fi.',
    url: 'https://toolblip.com/donate',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Support Toolblip | Toolblip',
    description: 'Toolblip is free, forever. No login, no paywalls. If it saved you time, a coffee keeps the lights on. Donate via GitHub Sponsors or Ko-fi.',
  },
};

export default function DonatePage() {
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
        Support Toolblip
      </h1>

      <div className="space-y-6" style={{ fontSize: '17px', color: 'var(--fg-1)', lineHeight: 1.75 }}>
        <p>
          Toolblip is free and always will be. No ads, no tracking, no paywalls.
          If you find our tools useful, consider supporting us to help cover hosting
          and development costs.
        </p>

        <div
          className="mt-8 p-8 rounded-2xl border border-[var(--line)] text-center"
          style={{ background: 'var(--surface-2)' }}
        >
          <span className="text-4xl block mb-4">❤️</span>
          <p
            className="mb-6"
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--fg-0)',
            }}
          >
            Every contribution helps
          </p>
          <p style={{ color: 'var(--fg-2)', fontSize: '15px' }}>
            Donations help us keep Toolblip free, fast, and private for everyone.
          </p>
          {/* Payment link / button can be added here when ready */}
          <div className="mt-6 p-4 rounded-xl border border-dashed border-[var(--line)]"
            style={{ color: 'var(--fg-3)', fontSize: '14px' }}>
            Donation options coming soon. Thank you for your interest!
          </div>
        </div>

        <h2
          className="mt-10 mb-4"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Other Ways to Help
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Share Toolblip</strong>  -  Tell your friends and colleagues.</li>
          <li><strong>Link to us</strong>  -  Link from your blog, docs, or project README.</li>
          <li><strong>Feedback</strong>  -  Suggest new tools or report issues.</li>
        </ul>
      </div>

      <div className="mt-12 text-center">
        <Link href="/directory" className="tb-v2-btn tb-v2-btn-primary">
          Browse Tools →
        </Link>
      </div>
    </main>
  );
}
