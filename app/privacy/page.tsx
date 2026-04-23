import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Toolblip',
  description: 'Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server. No account required. Read the full privacy policy.',
  openGraph: {
    title: 'Privacy Policy | Toolblip',
    description: 'Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server. No account required. Read the full privacy policy.',
    url: 'https://toolblip.com/privacy',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'Privacy Policy | Toolblip', description: 'Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server.' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">Effective April 2026</p>

      <div className="space-y-10 text-gray-600 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">The short version</h2>
          <p>Toolblip tools run 100% in your browser. Nothing you paste or upload is sent to any server. No account is required to use any free tool.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cookies</h2>
          <ul className="space-y-3 list-none">
            <li><span className="text-gray-900 dark:text-white font-medium">tb_usage</span> — stores your daily tool usage count in your browser only. This number never leaves your device. It is a functional cookie and is not used for tracking.</li>
            <li><span className="text-gray-900 dark:text-white font-medium">tb_session</span> — set by the Toolblip API if you create an account. Used only to keep you signed in. Not present if you use Toolblip without an account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics</h2>
          <p>Toolblip uses Cloudflare Web Analytics for basic page-view statistics. It is cookieless and does not track individuals. Google Analytics is also available on the site but only loads after you click &quot;Accept&quot; on the cookie banner. If you click &quot;Decline&quot; or ignore the banner, Google Analytics is never loaded.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data processing</h2>
          <p>All tool operations happen in your browser using JavaScript. Text, images, and other content you work with are never transmitted to Toolblip servers. There is no server-side processing for free tools.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data sharing</h2>
          <p>Toolblip does not sell, rent, or share your data with third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
          <p>Questions? Email <a href="mailto:harun@toolblip.com" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">harun@toolblip.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
