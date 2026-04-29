import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Advertise — Toolblip',
  description:
    'Reach thousands of developers by advertising on Toolblip. Sponsor our free tools and connect with a tech-savvy audience.',
  openGraph: {
    title: 'Advertise — Toolblip',
    description:
      'Reach thousands of developers by advertising on Toolblip. Sponsor our free tools and connect with a tech-savvy audience.',
    url: 'https://toolblip.com/advertise',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Advertise — Toolblip',
    description:
      'Reach thousands of developers by advertising on Toolblip. Sponsor our free tools and connect with a tech-savvy audience.',
  },
};

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-5xl mb-4">📢</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advertise with Toolblip</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl">
            Reach a growing audience of developers, designers, and power users who use our tools daily.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our audience</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Toolblip attracts developers, designers, and technical professionals who rely on our tools for
              everyday tasks. If your product or service targets this audience, we&apos;d love to work with you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Sponsorship options</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">🛠️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tool sponsorship</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sponsor a specific tool page with a contextual placement relevant to your product.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">📝</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Blog sponsorship</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reach readers through sponsored content on our developer-focused blog.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">🏠</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Homepage placement</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get premium visibility on the Toolblip homepage and directory pages.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Custom partnerships</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Have a different idea? Let&apos;s talk about a custom partnership that works for both sides.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our commitment</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We only work with sponsors whose products are genuinely useful to our audience. No deceptive ads,
              no pop-ups, no auto-playing videos. We keep it clean and respectful — just like our tools.
            </p>
          </section>

          {/* CTA */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Interested in partnering with us? Drop us a line.
            </p>
            <a
              href="mailto:ads@toolblip.com"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
