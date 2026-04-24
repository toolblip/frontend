import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server. No account required. Read the full privacy policy.',
  openGraph: {
    title: 'Privacy Policy | Toolblip',
    description: 'Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server. No account required. Read the full privacy policy.',
    url: 'https://toolblip.com/privacy',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-default.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: { card: 'summary', title: 'Privacy Policy | Toolblip', description: 'Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server.' },
};

export default function PrivacyPage() {
  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <div className="tb-v2-article">
          <div className="tb-v2-kicker">Legal</div>
          <h1 className="tb-v2-page-title">Privacy Policy</h1>
          <p className="tb-v2-page-meta">Effective April 2026</p>

          <div className="tb-v2-article-section">
            <h2>The short version</h2>
            <p>Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server. No account is required to use any free tool.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Cookies</h2>
            <ul>
              <li><strong>tb_usage</strong> - stores your daily tool usage count in your browser only. This number never leaves your device. It is a functional cookie and is not used for tracking.</li>
              <li><strong>tb_session</strong> - set by the Toolblip API if you create an account. Used only to keep you signed in. Not present if you use Toolblip without an account.</li>
            </ul>
          </div>

          <div className="tb-v2-article-section">
            <h2>Analytics</h2>
            <p>Toolblip uses Cloudflare Web Analytics for basic page-view statistics. It is cookieless and does not track individuals. Google Analytics is also available on the site but only loads after you click &quot;Accept&quot; on the cookie banner. If you click &quot;Decline&quot; or ignore the banner, Google Analytics is never loaded.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Data processing</h2>
            <p>All tool operations happen in your browser using JavaScript. Text, images, and other content you work with are never transmitted to Toolblip servers. There is no server-side processing for free tools.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Data sharing</h2>
            <p>Toolblip does not sell, rent, or share your data with third parties.</p>
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
