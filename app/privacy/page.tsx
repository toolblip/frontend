import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Toolblip',
  description: 'Privacy Policy for Toolblip, including account data, cookies, analytics, retention, and user rights.',
  openGraph: {
    title: 'Privacy Policy | Toolblip',
    description: 'Privacy Policy for Toolblip, including account data, cookies, analytics, retention, and user rights.',
    url: 'https://toolblip.com/privacy',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Toolblip',
    description: 'Privacy Policy for Toolblip, including account data, cookies, analytics, retention, and user rights.',
  },
};

export default function PrivacyPage() {
  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <article className="tb-v2-article">
          <div className="tb-v2-kicker">Legal</div>
          <h1 className="tb-v2-page-title">Privacy Policy</h1>
          <p className="tb-v2-page-meta">Effective May 2026</p>

          <div className="tb-v2-article-section">
            <h2>The short version</h2>
            <p>
              Most Toolblip tools run directly in your browser. For those browser tools, the text, images, files, or data you enter stay on your device and are not sent to Toolblip servers.
              Account and paid features may require limited server-side data so we can keep you signed in, provide access, and support you.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Information we collect</h2>
            <ul>
              <li><strong>Account information:</strong> name, email address, authentication status, and basic profile details you provide.</li>
              <li><strong>Security and session data:</strong> cookies or tokens needed to keep you signed in and protect your account.</li>
              <li><strong>Usage and diagnostics:</strong> page views, browser/device signals, errors, and aggregate performance information.</li>
              <li><strong>Payment information:</strong> if paid features are introduced, payment details are processed by our payment provider, not stored directly by Toolblip.</li>
              <li><strong>Support messages:</strong> information you send when contacting us.</li>
            </ul>
          </div>

          <div className="tb-v2-article-section">
            <h2>How we use information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide accounts, sessions, premium access, and customer support.</li>
              <li>Secure the service, prevent abuse, and investigate errors.</li>
              <li>Understand aggregate product usage and improve Toolblip.</li>
              <li>Send transactional messages such as password reset or account notices.</li>
            </ul>
          </div>

          <div className="tb-v2-article-section">
            <h2>Browser tools and local processing</h2>
            <p>
              Toolblip’s core utilities are designed to process data locally in your browser whenever possible. Avoid entering highly sensitive data into any online tool unless you have verified the tool’s behavior and your own compliance requirements.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Cookies and analytics</h2>
            <ul>
              <li><strong>Functional cookies:</strong> used for sessions, preferences, and basic product operation.</li>
              <li><strong>Cloudflare Web Analytics:</strong> cookieless analytics for aggregate traffic and performance insights.</li>
              <li><strong>Optional analytics:</strong> Google Analytics only loads after consent through the cookie banner.</li>
            </ul>
          </div>

          <div className="tb-v2-article-section">
            <h2>Data sharing</h2>
            <p>
              We do not sell your personal information. We may share limited data with service providers that help operate Toolblip, such as hosting, analytics, email, payments, and security providers.
              We may also disclose information if required by law or to protect Toolblip and its users.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Data retention</h2>
            <p>
              We keep account and operational data only as long as needed to provide the service, meet legal obligations, resolve disputes, prevent abuse, and maintain backups.
              You may request deletion of your account data by contacting us.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Your rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, export, restrict, or object to processing of your personal information.
              Contact us and we will respond within a reasonable timeframe.
            </p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Children</h2>
            <p>Toolblip is not directed to children under 13, and we do not knowingly collect personal information from children under 13.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Changes to this policy</h2>
            <p>We may update this Privacy Policy as Toolblip changes. The effective date will be updated when material changes are made.</p>
          </div>

          <div className="tb-v2-article-section">
            <h2>Contact</h2>
            <p>Questions or privacy requests? Email <a href="mailto:harun@toolblip.com">harun@toolblip.com</a>.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
