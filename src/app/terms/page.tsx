import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Toolblip',
  description:
    'Toolblip terms of service. By using Toolblip, you agree to these terms governing the use of our free browser-based developer tools.',
  openGraph: {
    title: 'Terms of Service — Toolblip',
    description:
      'Toolblip terms of service. By using Toolblip, you agree to these terms governing the use of our free browser-based developer tools.',
    url: 'https://toolblip.com/terms',
    siteName: 'Toolblip',
    type: 'website',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service — Toolblip',
    description:
      'Toolblip terms of service. By using Toolblip, you agree to these terms governing the use of our free browser-based developer tools.',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">Last updated: April 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Acceptance of terms</h2>
            <p>
              By accessing and using Toolblip, you agree to be bound by these terms of service. If you do not
              agree with any part of these terms, you should not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Use of services</h2>
            <p>
              Toolblip provides free, browser-based developer tools. You may use our tools for personal and
              commercial purposes. You agree not to misuse our services, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>Attempting to disrupt or overload our infrastructure</li>
              <li>Using automated systems to scrape or abuse the API beyond reasonable limits</li>
              <li>Reverse engineering or repackaging our tools without permission</li>
              <li>Using our services for illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Accounts</h2>
            <p>
              Some features may require an account. You are responsible for maintaining the security of your
              account credentials. You must provide accurate information when registering and keep it up to date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intellectual property</h2>
            <p>
              The Toolblip name, logo, and website content are our intellectual property. You may not use our
              branding without permission. Tool outputs belong to you — we claim no rights over data you process
              using our tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Disclaimer</h2>
            <p>
              Toolblip is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy,
              reliability, or availability of our services. Use at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Limitation of liability</h2>
            <p>
              In no event shall Toolblip be liable for any indirect, incidental, special, or consequential
              damages arising from the use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Changes to terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of Toolblip after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
            <p>
              Questions about these terms? Reach us at{' '}
              <a href="mailto:legal@toolblip.com" className="text-red-600 dark:text-red-400 hover:underline">
                legal@toolblip.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
