import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://toolblip.com/about',
  },
  title: 'About | Toolblip',
  description: 'Toolblip offers free browser tools for everyday tasks. Most process input locally; optional accounts and paid features use online services.',
  openGraph: {
    title: 'About | Toolblip',
    description: 'Toolblip offers free browser tools for everyday tasks. Most process input locally; optional accounts and paid features use online services.',
    url: 'https://toolblip.com/about',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'About | Toolblip',
    description: 'Toolblip offers free browser tools for everyday tasks. Most process input locally; optional accounts and paid features use online services.',
  },
};

export default function AboutPage() {
  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <div className="tb-v2-article">
          <div className="tb-v2-kicker">About</div>
          <h1 className="tb-v2-page-title">About Toolblip</h1>

          <div className="tb-v2-article-section">
            <p>
              Toolblip offers free browser tools for everyday developer and productivity tasks. Most process
              your input in your browser. You can use those tools without an account; optional accounts and paid
              features use online services.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <p>
              JSON formatting, Base64 encoding, QR generation, and word counting process input locally. Toolblip
              also uses analytics and handles account data. Read our{' '}
              <a href="/privacy">privacy policy</a> for details.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <p>
              Toolblip is built and maintained by{' '}
              <a href="https://github.com/HarunRRayhan">Harun R Rayhan</a>
              . He also builds{' '}
              <a href="https://crontinel.com">Crontinel</a>
              , a Laravel cron and queue monitoring tool for production apps. Both projects share the same goal:
              useful software that respects the people using it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
