import type { Metadata } from 'next';

const description = 'Terms and Conditions for using Toolblip accounts, free tools, APIs, and paid features.';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Toolblip',
  description,
  openGraph: {
    title: 'Terms and Conditions | Toolblip',
    description,
    url: 'https://toolblip.com/terms',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Terms and Conditions | Toolblip',
    description,
  },
};

export default function TermsPage() {
  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <article className="tb-v2-article">
          <div className="tb-v2-kicker">Legal</div>
          <h1 className="tb-v2-page-title">Terms and Conditions</h1>
          <p className="tb-v2-page-meta">Effective May 2026</p>

          <div className="tb-v2-article-section">
            <h2>Acceptance of terms</h2>
            <p>
              By accessing Toolblip, creating an account, or using any Toolblip tool, you agree to these Terms and Conditions and our Privacy Policy.
              If you do not agree, do not use the service.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Use of the service</h2>
            <p>
              Toolblip provides browser-based utilities for developers, marketers, makers, and teams. Free tools may be used for personal and commercial work.
              You are responsible for the content you enter into tools and for validating outputs before relying on them.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Account registration</h2>
            <p>
              Some features may require an account. You must provide accurate information, keep your login credentials secure, and notify us if you suspect unauthorized access.
              You are responsible for activity that happens through your account.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Acceptable use</h2>
            <p>You agree not to misuse Toolblip, including by:</p>
            <ul>
              <li>Uploading or processing illegal, harmful, or infringing content.</li>
              <li>Attempting to disrupt, overload, reverse engineer, or abuse the service.</li>
              <li>Using automation in a way that harms availability for other users.</li>
              <li>Bypassing security, rate limits, payment controls, or access restrictions.</li>
            </ul>
          </div>

          <div className="tb-v2-article-section">
            <h2>Paid features and subscriptions</h2>
            <p>
              Toolblip may offer paid plans, API access, or premium features. Prices, limits, and plan details will be shown before purchase.
              Paid access may be suspended or cancelled for fraud, abuse, chargebacks, or violation of these terms.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>No warranty</h2>
            <p>
              Toolblip is provided “as is” and “as available.” We do not guarantee that tools will be error-free, uninterrupted, or suitable for a specific purpose.
              Always review generated or converted output before using it in production or legal, financial, medical, or security-sensitive contexts.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Limitation of liability</h2>
            <p>
              To the maximum extent allowed by law, Toolblip and its owner are not liable for indirect, incidental, consequential, special, or punitive damages,
              or for lost profits, lost data, business interruption, or reliance on tool output.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Changes to these terms</h2>
            <p>
              We may update these terms as the product changes. The effective date will be updated when material changes are made.
              Continued use of Toolblip after changes means you accept the updated terms.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Governing law</h2>
            <p>These terms are governed by the laws of Bangladesh, without regard to conflict-of-law rules.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:harun@toolblip.com">harun@toolblip.com</a>.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
