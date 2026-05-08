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

const categories = Array.from(new Set(tools.map((tool) => tool.category))).sort((a, b) =>
  a.localeCompare(b),
);

// ─── How it works ───────────────────────────────────────────────────────

const STEPS = [
  {
    n: '1',
    title: 'Pick a tool',
    desc: 'Choose a focused browser tool for text, encoding, development, and more.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17 9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
      </svg>
    ),
  },
  {
    n: '2',
    title: 'Paste your data',
    desc: 'Type or paste right into the page. No servers, no uploads, no account.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      </svg>
    ),
  },
  {
    n: '3',
    title: 'Get your result',
    desc: 'Copy the result instantly. Nothing leaves your browser.',
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
    desc: 'Your data never leaves your browser — no uploads, no storage, no server roundtrips.',
  },
  {
    emoji: '⚡',
    title: 'Fast',
    desc: 'Everything runs instantly in your tab, so common cleanup tasks feel immediate.',
  },
  {
    emoji: '🎁',
    title: 'Free',
    desc: 'No signup, no paywall, no hidden limits. Every tool is ready when you are.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

      {/* ── Hero ── */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Free Online Tools
          <span className="text-red-600 dark:text-red-400">, in Your Browser</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          20+ tools for text, encoding, development, and more. No signup, no uploads — everything stays on your device.
        </p>
      </section>

      {/* ── How it works ── */}
      <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm px-5 py-6 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="lg:w-48 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
              How it works
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pick a tool → paste your data → get your result.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {STEPS.map((s, index) => (
              <div
                key={s.n}
                className="relative flex items-center gap-3 rounded-2xl bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 p-4"
              >
                {index < STEPS.length - 1 && (
                  <span className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700 text-lg">
                    →
                  </span>
                )}
                <div className="w-11 h-11 shrink-0 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                    <span className="text-red-600 dark:text-red-400 font-mono">{s.n}.</span>
                    <span>{s.title}</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-5">
          Browser-only by default: no servers, no uploads, nothing leaves your browser.
        </p>
      </section>

      {/* ── Category quick-access ── */}
      <section aria-label="Browse tools by category" className="space-y-3">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Jump to a category
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
      <section className="space-y-5">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Why Toolblip?
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            Handy utilities without the usual friction.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl mb-4">
                {b.emoji}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">{b.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{b.desc}</p>
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
