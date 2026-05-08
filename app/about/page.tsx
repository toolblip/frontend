import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Toolblip',
  description: 'Toolblip is a collection of free developer and productivity tools that run entirely in your browser. No servers, no uploads, no accounts required.',
  openGraph: {
    title: 'About | Toolblip',
    description: 'Toolblip is a collection of free developer and productivity tools that run entirely in your browser. No servers, no uploads, no accounts required.',
    url: 'https://toolblip.com/about',
    siteName: 'Toolblip',
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
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <div className="tb-v2-article">
          <div className="tb-v2-kicker">About</div>
          <h1 className="tb-v2-page-title">About Toolblip</h1>

          <div className="tb-v2-article-section">
            <p>
              Toolblip is a collection of free developer and productivity tools that run entirely in your browser.
              There are no servers, no uploads, and no accounts required. You paste your data in, get your result out,
              and nothing leaves your machine.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <p>
              Privacy-first is not a marketing phrase here. Every tool on Toolblip processes data locally using
              JavaScript. Base64 encoding, JSON formatting, text conversion, image manipulation - all of it happens
              client-side. The only analytics collected are cookieless page-view stats via Cloudflare, and optional
              Google Analytics loaded only after you give consent.
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
