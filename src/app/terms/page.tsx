import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Toolblip',
  description:
    'Toolblip terms of service. Free browser-based tools provided as-is. Read our terms covering usage, liability, and intellectual property.',
  openGraph: {
    title: 'Terms of Service | Toolblip',
    description:
      'Toolblip terms of service. Free browser-based tools provided as-is. Read our terms covering usage, liability, and intellectual property.',
    url: 'https://toolblip.com/terms',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | Toolblip',
    description:
      'Toolblip terms of service. Free browser-based tools provided as-is.',
  },
};

export default function TermsPage() {
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
        Terms of Service
      </h1>

      <div className="space-y-6" style={{ fontSize: '17px', color: 'var(--fg-1)', lineHeight: 1.75 }}>
        <p className="text-sm" style={{ color: 'var(--fg-3)' }}>Last updated: May 2026</p>

        <h2
          className="mt-8 mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Acceptance of Terms
        </h2>
        <p>
          By using Toolblip, you agree to these terms of service. If you do not agree, please do
          not use the site.
        </p>

        <h2
          className="mt-8 mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Use of Services
        </h2>
        <p>
          Toolblip provides free, browser-based tools for developer and productivity purposes.
          All tools are provided &quot;as is&quot; without warranty of any kind. We do not guarantee
          the accuracy, completeness, or reliability of any tool&apos;s output.
        </p>

        <h2
          className="mt-8 mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Intellectual Property
        </h2>
        <p>
          The Toolblip website, including its design, code, and content, is the intellectual
          property of Toolblip. You may not copy, modify, or redistribute the site&apos;s source
          code without permission.
        </p>

        <h2
          className="mt-8 mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Limitation of Liability
        </h2>
        <p>
          Toolblip is not liable for any damages arising from the use of our tools. Use the tools
          at your own risk. We are not responsible for any loss of data, profits, or other
          damages resulting from tool usage.
        </p>

        <h2
          className="mt-8 mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Changes to Terms
        </h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes
          constitutes acceptance of the updated terms.
        </p>

        <h2
          className="mt-8 mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Contact
        </h2>
        <p>
          Questions about these terms? Reach us at{' '}
          <a href="mailto:legal@toolblip.com" className="text-[var(--red)] hover:underline">
            legal@toolblip.com
          </a>.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="tb-v2-btn tb-v2-btn-primary">
          Back to Tools →
        </Link>
      </div>
    </main>
  );
}
