import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advertise on Toolblip | Toolblip',
  description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
  openGraph: {
    title: 'Advertise on Toolblip | Toolblip',
    description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
    url: 'https://toolblip.com/advertise',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Advertise on Toolblip | Toolblip',
    description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
  },
};

export default function AdvertisePage() {
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
        Advertise with Toolblip
      </h1>

      <div className="space-y-6" style={{ fontSize: '17px', color: 'var(--fg-1)', lineHeight: 1.75 }}>
        <p>
          Toolblip reaches developers, designers, and tech professionals who use our
          free browser-based tools daily. We offer clean, non-intrusive sponsorship
          opportunities.
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
          Our Audience
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Developers and software engineers</li>
          <li>DevOps and system administrators</li>
          <li>Designers and content creators</li>
          <li>Students and educators in tech</li>
        </ul>

        <h2
          className="mt-8 mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--fg-0)',
          }}
        >
          Sponsorship Options
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Tool Sponsorship</strong>  -  Brand a specific tool page.</li>
          <li><strong>Site-wide Banner</strong>  -  Non-intrusive banner across all pages.</li>
          <li><strong>Blog Post</strong>  -  Sponsored content on our blog.</li>
        </ul>

        <div
          className="mt-10 p-6 rounded-2xl border border-[var(--line)] text-center"
          style={{ background: 'var(--surface-2)' }}
        >
          <p
            className="mb-4"
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--fg-0)',
            }}
          >
            Interested?
          </p>
          <p style={{ color: 'var(--fg-2)', fontSize: '15px' }}>
            Get in touch at{' '}
            <a href="mailto:ads@toolblip.com" className="text-[var(--red)] hover:underline">
              ads@toolblip.com
            </a>
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/directory" className="tb-v2-btn tb-v2-btn-primary">
          Browse Tools →
        </Link>
      </div>
    </main>
  );
}
