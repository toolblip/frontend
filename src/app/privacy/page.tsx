import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Toolblip',
  description:
    'Toolblip privacy policy. All tools run client-side in your browser. We collect minimal data and never sell your information.',
  openGraph: {
    title: 'Privacy Policy — Toolblip',
    description:
      'Toolblip privacy policy. All tools run client-side in your browser. We collect minimal data and never sell your information.',
    url: 'https://toolblip.com/privacy',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy — Toolblip',
    description:
      'Toolblip privacy policy. All tools run client-side in your browser. We collect minimal data and never sell your information.',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Client-side processing</h2>
            <p>
              All Toolblip tools run entirely in your browser. Your data is processed locally and never sent to
              our servers. We cannot see, store, or access the content you work with in any tool.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Information we collect</h2>
            <p className="mb-3">We collect minimal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-gray-900 dark:text-white">Account data</strong> — If you create an account, we store your name, email, and hashed password.</li>
              <li><strong className="text-gray-900 dark:text-white">Usage analytics</strong> — We use privacy-respecting analytics to understand which tools are popular. No personal data is collected.</li>
              <li><strong className="text-gray-900 dark:text-white">API tokens</strong> — If you use the API, we store authentication tokens securely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What we don&apos;t do</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We never sell your personal data.</li>
              <li>We never share your data with third parties for marketing.</li>
              <li>We never track individual users across sessions.</li>
              <li>We never read or log tool inputs/outputs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We do not use tracking cookies
              or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data deletion</h2>
            <p>
              You can request deletion of your account and all associated data at any time by contacting us.
              We will process your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Changes to this policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page with an
              updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
            <p>
              Questions about privacy? Reach us at{' '}
              <a href="mailto:privacy@toolblip.com" className="text-red-600 dark:text-red-400 hover:underline">
                privacy@toolblip.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
