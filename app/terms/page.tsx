import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using Toolblip. Tools are free for personal and commercial use. No attribution required. Read the full terms of service here.',
  openGraph: {
    title: 'Terms of Service | Toolblip',
    description: 'Terms for using Toolblip. Tools are free for personal and commercial use. No attribution required. Read the full terms of service here.',
    url: 'https://toolblip.com/terms',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-default.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: { card: 'summary', title: 'Terms of Service | Toolblip', description: 'Toolblip terms of service. Free for personal and commercial use.' },
};

export default function TermsPage() {
  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <div className="tb-v2-article">
          <div className="tb-v2-kicker">Legal</div>
          <h1 className="tb-v2-page-title">Terms of Service</h1>
          <p className="tb-v2-page-meta">Effective April 2026</p>

          <div className="tb-v2-article-section">
            <h2>Use of the service</h2>
            <p>Toolblip tools are free to use for personal and commercial purposes. No attribution required. You may not use Toolblip to process illegal content or to violate any applicable law.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>No warranty</h2>
            <p>Tools are provided as-is, with no guarantee of accuracy, uptime, or fitness for any particular purpose. Use at your own discretion.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Rate limits</h2>
            <p>Free-tier usage may be subject to rate limits to keep the service available for everyone. Excessive automated usage may be restricted without notice.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Paid features</h2>
            <p>Toolblip may introduce paid features or plans in the future. Free tools will remain free.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Governing law</h2>
            <p>These terms are governed by the laws of Bangladesh, where the service owner is based.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Contact</h2>
            <p>Questions? Email <a href="mailto:harun@toolblip.com">harun@toolblip.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
