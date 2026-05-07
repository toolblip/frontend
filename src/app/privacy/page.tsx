import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Toolblip',
  description:
    'Toolblip privacy policy. All tools run client-side — we don\'t collect, store, or transmit your data. Learn how we handle your information.',
  openGraph: {
    title: 'Privacy Policy | Toolblip',
    description:
      'Toolblip privacy policy. All tools run client-side — we don\'t collect, store, or transmit your data.',
    url: 'https://toolblip.com/privacy',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Toolblip',
    description:
      'Toolblip privacy policy. All tools run client-side — we don\'t collect, store, or transmit your data.',
  },
};

export default function PrivacyPage() {
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
        Privacy Policy
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
          Your Data Stays in Your Browser
        </h2>
        <p>
          All Toolblip tools run entirely in your browser. We do <strong>not</strong> collect,
          transmit, or store the data you input into any tool. Your text, files, and conversions
          never leave your device.
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
          Analytics
        </h2>
        <p>
          We may use privacy-respecting analytics to understand how our tools are used (page views,
          tool popularity). We do not track individual users or build user profiles.
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
          Cookies
        </h2>
        <p>
          We use minimal cookies for essential site functionality (such as theme preferences).
          We do not use advertising cookies or sell data to third parties.
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
          Third-Party Services
        </h2>
        <p>
          Our site may link to external services. We are not responsible for the privacy practices
          of those third-party sites. We encourage you to read their privacy policies.
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
          If you have questions about this privacy policy, reach out to us at{' '}
          <a href="mailto:privacy@toolblip.com" className="text-[var(--red)] hover:underline">
            privacy@toolblip.com
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
