import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Toolblip',
  description: 'Terms for using Toolblip. Tools are free for personal and commercial use. No attribution required. Read the full terms of service here.',
  openGraph: {
    title: 'Terms of Service | Toolblip',
    description: 'Terms for using Toolblip. Tools are free for personal and commercial use. No attribution required. Read the full terms of service here.',
    url: 'https://toolblip.com/terms',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'Terms of Service | Toolblip', description: 'Toolblip terms of service. Free for personal and commercial use.' },
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">Effective April 2026</p>

      <div className="space-y-10 text-gray-600 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Use of the service</h2>
          <p>Toolblip tools are free to use for personal and commercial purposes. No attribution required. You may not use Toolblip to process illegal content or to violate any applicable law.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">No warranty</h2>
          <p>Tools are provided as-is, with no guarantee of accuracy, uptime, or fitness for any particular purpose. Use at your own discretion.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rate limits</h2>
          <p>Free-tier usage may be subject to rate limits to keep the service available for everyone. Excessive automated usage may be restricted without notice.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Paid features</h2>
          <p>Toolblip may introduce paid features or plans in the future. Free tools will remain free.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Governing law</h2>
          <p>These terms are governed by the laws of Bangladesh, where the service owner is based.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
          <p>Questions? Email <a href="mailto:harun@toolblip.com" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">harun@toolblip.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
