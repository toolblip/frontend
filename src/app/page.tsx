import Link from 'next/link';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';

export const metadata: Metadata = {
  title: 'Toolblip — Free Browser-Based Online Tools',
  description:
    'Free, fast, and private online tools. No signup, no uploads, nothing leaves your browser.',
  openGraph: {
    title: 'Toolblip — Free Browser-Based Online Tools',
    description:
      'Free, fast, and private online tools. No signup, no uploads, nothing leaves your browser.',
    url: 'https://toolblip.com',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Toolblip — Free Browser-Based Online Tools',
    description:
      'Free, fast, and private online tools. No signup, no uploads, nothing leaves your browser.',
  },
};

const categories = Array.from(new Set(tools.map((tool) => tool.category)));

// ─── How it works ───────────────────────────────────────────────────────

const STEPS = [
  {
    n: '1',
    title: 'Pick a tool',
    desc: 'Browse by category or search. 20+ tools covering text, encoding, dev, and more.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17 9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
      </svg>
    ),
  },
  {
    n: '2',
    title: 'Paste your data',
    desc: 'Type or paste right in the box. Everything runs client-side in your tab.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      </svg>
    ),
  },
  {
    n: '3',
    title: 'Get your result',
    desc: 'Copy the output instantly. No servers, no uploads, nothing leaves your browser.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    ),
  },
];

// ─── Benefits ──────────────────────────────────────────────────────────

const BENEFITS = [
  {
    emoji: '🔒',
    title: 'Private',
    desc: 'Your data never leaves your browser. Nothing is uploaded, stored, or sent to any server.',
  },
  {
    emoji: '⚡',
    title: 'Fast',
    desc: 'All processing happens instantly in your tab. No waiting for server roundtrips.',
  },
  {
    emoji: '🎁',
    title: 'Free',
    desc: 'No signup, no paywall, no limits. Every tool is completely free to use.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-14">

      {/* ── Hero ── */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Free Online Tools
          <span className="text-red-600 dark:text-red-400">, in Your Browser</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          20+ tools for text, encoding, development, and more. No signup, no uploads — everything stays on your device.
        </p>
      </section>

      {/* ── How it works ── */}
      <section>
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((s, index) => (
            <div
              key={s.n}
              className="relative flex flex-col items-center text-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
            >
              {index < STEPS.length - 1 && (
                <span className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700 text-xl">
                  →
                </span>
              )}
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                  <span className="text-red-600 dark:text-red-400 font-mono text-sm mr-1">{s.n}.</span>
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
          No servers. No uploads. Nothing leaves your browser.
        </p>
      </section>

      {/* ── Category quick-access ── */}
      <section aria-label="Browse tools by category" className="space-y-3">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Browse by category
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/tools?category=${encodeURIComponent(cat)}`}
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Toolblip? ── */}
      <section>
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          Why Toolblip?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex gap-4 items-start"
            >
              <span className="text-3xl shrink-0">{b.emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">{b.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools grid ── */}
      <section>
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          All tools
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex items-start gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-400 dark:hover:border-red-600 hover:shadow-md transition-all"
            >
              <span className="text-2xl shrink-0 mt-0.5">{tool.emoji}</span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-sm leading-snug">
                  {tool.name}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tool.category}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
