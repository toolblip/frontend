import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise on Toolblip',
  description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
  openGraph: {
    title: 'Advertise on Toolblip | Toolblip',
    description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
    url: 'https://toolblip.com/advertise',
    siteName: 'Toolblip',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: { card: 'summary', title: 'Advertise on Toolblip | Toolblip', description: 'Sponsor a tool and reach developers using Toolblip every day. Slots from $100/month.' },
};

export default function AdvertisePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Advertise on Toolblip</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Toolblip is a growing collection of free developer tools used by developers every day.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Audience</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Developers using tools like JSON formatters, base64 encoders, UUID generators, and more.
            Primarily web developers, backend engineers, and DevOps professionals.
            Growing audience - exact traffic numbers available on request.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Formats</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex gap-3">
              <span className="text-red-600 dark:text-red-400 shrink-0">Above-tool banner</span>
              <span className="text-gray-400 dark:text-gray-500"> - shown above the tool UI on every tool page</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 dark:text-red-400 shrink-0">Below-tool banner</span>
              <span className="text-gray-400 dark:text-gray-500"> - shown below the tool output, after the user gets their result</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 dark:text-red-400 shrink-0">Per-tool sponsorship</span>
              <span className="text-gray-400 dark:text-gray-500"> - exclusive placement on a single high-traffic tool</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pricing</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Sponsor slots start at <span className="text-gray-900 dark:text-white font-medium">$100/month</span>.
            Discounts available for quarterly or annual bookings.
            All sponsors are clearly labeled - no deceptive placements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Get in touch</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Send an email with your product, target audience, and preferred format.
          </p>
          <a
            href="mailto:harun@toolblip.com"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Email harun@toolblip.com
          </a>
        </section>
      </div>
    </div>
  );
}
