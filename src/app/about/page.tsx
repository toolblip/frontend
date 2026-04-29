import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Toolblip',
  description:
    'Toolblip is a free collection of browser-based developer tools. No installs, no sign-ups — just fast, private utilities that run locally in your browser.',
  openGraph: {
    title: 'About — Toolblip',
    description:
      'Toolblip is a free collection of browser-based developer tools. No installs, no sign-ups — just fast, private utilities that run locally in your browser.',
    url: 'https://toolblip.com/about',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About — Toolblip',
    description:
      'Toolblip is a free collection of browser-based developer tools. No installs, no sign-ups — just fast, private utilities that run locally in your browser.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-5xl mb-4">🛠️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Toolblip</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl">
            Free developer tools that run in your browser. No installs. No sign-ups. No data leaves your machine.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What is Toolblip?</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Toolblip is a growing collection of free, browser-based utilities for developers and power users.
              Every tool runs entirely client-side — your data never leaves your browser. No accounts required,
              no tracking, no ads.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why we built this</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We were tired of developer tools bloated with ads, paywalls, and invasive tracking. Toolblip is
              our answer: fast, clean, and private. Open a tool, use it, close the tab. That&apos;s it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Our principles</h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">✦</span>
                <span><strong className="text-gray-900 dark:text-white">Privacy first</strong> — All processing happens in your browser. We never see your data.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">✦</span>
                <span><strong className="text-gray-900 dark:text-white">Free forever</strong> — Core tools are and will remain free. No bait-and-switch.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">✦</span>
                <span><strong className="text-gray-900 dark:text-white">Fast</strong> — No frameworks to install, no loading screens. Instant utilities.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">✦</span>
                <span><strong className="text-gray-900 dark:text-white">Open</strong> — We believe in transparent, accessible tools for everyone.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to try some tools?
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Browse All Tools →
          </Link>
        </div>
      </div>
    </div>
  );
}
