import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Donate — Support Toolblip',
  description:
    'Support Toolblip with a donation. Help us keep developer tools free, ad-free, and privacy-respecting for everyone.',
  openGraph: {
    title: 'Donate — Support Toolblip',
    description:
      'Support Toolblip with a donation. Help us keep developer tools free, ad-free, and privacy-respecting for everyone.',
    url: 'https://toolblip.com/donate',
    siteName: 'Toolblip',
    type: 'website',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Donate — Support Toolblip',
    description:
      'Support Toolblip with a donation. Help us keep developer tools free, ad-free, and privacy-respecting for everyone.',
  },
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <div className="text-5xl mb-4">❤️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Toolblip</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Help us keep tools free, ad-free, and privacy-respecting. Every contribution counts.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why donate?</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Toolblip is built and maintained by a small team. Your donation helps us cover server costs,
              build new tools, and keep everything free and ad-free. No paywalls, no tracking — just tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to donate</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">💳</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">One-time donation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Support us with a single payment of any amount. Quick and easy.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">🔄</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monthly support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Become a recurring supporter and help us plan for the long term.
                </p>
              </div>
            </div>
          </section>

          {/* Placeholder CTA */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Donation options coming soon. In the meantime, the best way to support us is to use and share our tools!
            </p>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Browse Free Tools →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
