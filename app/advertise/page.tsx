import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise on Toolblip | Toolblip',
  description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
  openGraph: {
    title: 'Advertise on Toolblip | Toolblip',
    description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
    url: 'https://toolblip.com/advertise',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Advertise on Toolblip | Toolblip',
    description: 'Sponsor a tool on Toolblip and reach developers who use JSON formatters, Base64 encoders, UUID generators, and more every day. Slots start at $100/month.',
  },
};

const SLOTS: { id: string; name: string; description: string }[] = [
  { id: 'below-tool', name: 'Below-tool banner', description: 'Shown right after the user gets their result — the highest-attention slot on every tool page.' },
  { id: 'above-tool', name: 'Above-tool banner', description: 'Shown above the tool widget, before the visitor starts using it. Opt-in per campaign.' },
  { id: 'directory', name: 'Directory listing', description: 'A native card inside the tools directory and search results, alongside organic listings.' },
  { id: 'blog-inline', name: 'Blog inline', description: 'A native card embedded inside blog posts, matched to the article content.' },
  { id: 'per-tool', name: 'Per-tool sponsorship', description: 'Exclusive placement on a single high-traffic tool (or a whole category), replacing the house rotation for that slug.' },
];

const EXAMPLE_CAMPAIGN = `{
  "id": "rankwell-seo-tools",
  "creative": "rankwell-seo",
  "type": "paid",
  "priority": 1,
  "pageTypes": ["tool"],
  "slugs": ["keyword-generator", "sitemap-xml-validator"],
  "categories": ["SEO"],
  "startDate": "2026-07-08",
  "endDate": null
}`;

const EXAMPLE_CREATIVE = `{
  "id": "rankwell-seo",
  "title": "Rankwell Analytics",
  "tagline": "Track keyword rankings and sitemap health in one dashboard.",
  "url": "https://rankwell.example.com",
  "cta": "Start free trial",
  "brandColor": "#16a34a"
}`;

export default function AdvertisePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Hero */}
      <div className="mb-16 text-center">
        <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:bg-red-950 dark:text-red-400">
          Media Kit
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Advertise on Toolblip
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
          Reach developers at the exact moment they&apos;re working — inside 1,500+ free tools like JSON
          formatters, Base64 encoders, and UUID generators. Native placements only. No popups, no interstitials,
          always labeled.
        </p>
      </div>

      {/* Audience */}
      <section className="mb-16 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">1,500+</div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">free tools live on Toolblip today</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">Growing</div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">audience — exact traffic figures on request</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">Developers</div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">web, backend, DevOps, and SEO practitioners</p>
        </div>
      </section>

      {/* Live preview mockup */}
      <section className="mb-16">
        <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">What your sponsor card looks like</h2>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Native, brand-colored, and clearly labeled — this is the exact component rendered on toolblip.com.
        </p>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-950/50">
          <div className="relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <span className="absolute right-3 top-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:bg-gray-800 dark:text-gray-500">
              Sponsored
            </span>
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg text-red-600"
              style={{ backgroundColor: '#dc26261a' }}
            >
              <span>★</span>
            </div>
            <div className="min-w-0 flex-1 pr-16">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Your Product Name</p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                One clear sentence about what you do and who it&apos;s for.
              </p>
              <span className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white">
                Try it free
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Slot IDs */}
      <section className="mb-16">
        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">Available placements</h2>
        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {SLOTS.map((slot) => (
            <div key={slot.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-4">
              <code className="w-32 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-gray-800 dark:text-red-400">
                {slot.id}
              </code>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{slot.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{slot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Targeting */}
      <section className="mb-16">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Targeting</h2>
        <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
          Campaigns can target specific tool slugs, whole categories (Developer, SEO, Text, Image, Color, Encoder,
          and more), specific placements, or run everywhere as a house rotation. More specific targeting always
          wins over generic placements.
        </p>
        <div className="rounded-xl border border-gray-200 bg-gray-900 p-4 dark:border-gray-800">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Example completed campaign</p>
          <pre className="overflow-x-auto text-xs leading-relaxed text-gray-100">
            <code>{EXAMPLE_CAMPAIGN}</code>
          </pre>
          <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">Its creative</p>
          <pre className="overflow-x-auto text-xs leading-relaxed text-gray-100">
            <code>{EXAMPLE_CREATIVE}</code>
          </pre>
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-16">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Pricing</h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          Sponsor slots start at <span className="font-medium text-gray-900 dark:text-white">$100/month</span>.
          Discounts available for quarterly or annual bookings, and for bundling multiple placements.
          All sponsors are clearly labeled &mdash; no deceptive placements, ever.
        </p>
      </section>

      {/* Get in touch */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Get the full media kit</h2>
        <p className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Send us your product, target audience, and preferred placement — we&apos;ll reply with current traffic
          figures, available slots, and a proposed campaign.
        </p>
        <a
          href="mailto:harun@toolblip.com"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
        >
          Email harun@toolblip.com
        </a>
      </section>
    </div>
  );
}
