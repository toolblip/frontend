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

const categoryCounts = tools.reduce<Record<string, number>>((acc, tool) => {
  acc[tool.category] = (acc[tool.category] ?? 0) + 1;
  return acc;
}, {});

const categories = Object.entries(categoryCounts)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => a.name.localeCompare(b.name));

// ─── How it works ───────────────────────────────────────────────────────

const WORKFLOW = 'Pick a tool → Paste your data → Get your result';
const LOCAL_FIRST_NOTE = 'Browser-only by design: no servers, no uploads, nothing leaves your browser.';

const STEPS = [
  {
    n: '1',
    title: 'Pick a tool',
    desc: 'Choose a focused utility for text, code, URLs, images, or everyday cleanup.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17 9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
      </svg>
    ),
  },
  {
    n: '2',
    title: 'Paste your data',
    desc: 'Drop text, JSON, URLs, or values into the page — never into an upload queue.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      </svg>
    ),
  },
  {
    n: '3',
    title: 'Get your result',
    desc: 'Copy clean output immediately, with the work handled right inside your tab.',
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
    desc: 'Data never leaves your browser — no uploads, server processing, or background storage.',
  },
  {
    emoji: '⚡',
    title: 'Fast',
    desc: 'Runs instantly in your tab, so cleanup, conversion, and formatting jobs stay frictionless.',
  },
  {
    emoji: '🎁',
    title: 'Free',
    desc: 'No signup, no paywall, no “trial expired” surprise — open the tool and get moving.',
  },
];

const PRIVACY_PROMISES = ['No servers', 'No uploads', 'Nothing leaves your browser'];
const HERO_BADGES = ['Private by default', 'Instant results', 'Free forever'];
const CATEGORY_SUMMARY = `${categories.length} categories · ${tools.length} tools`;

// ─── Page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

      {/* ── Hero ── */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Quick browser tools
          <span className="text-red-600 dark:text-red-400"> that don’t touch your data</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {tools.length}+ focused utilities for text, encoding, development, and everyday cleanup — open one, paste once, and copy a clean result without signup or uploads.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#tools"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
          >
            Browse all tools
          </a>
          <a
            href="#categories"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-red-300 dark:hover:border-red-700 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Explore categories
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          {HERO_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 px-3 py-1"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-900/75 shadow-sm px-5 py-5 sm:px-7">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="lg:w-52 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
              How it works
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {WORKFLOW}. {LOCAL_FIRST_NOTE}
            </p>
            <p className="mt-2 inline-flex rounded-full bg-red-50 dark:bg-red-950/30 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
              Your data stays in your tab.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {STEPS.map((s, index) => (
              <div
                key={s.n}
                className="relative flex items-center gap-3 rounded-2xl bg-gray-50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 p-4 hover:border-red-200 dark:hover:border-red-900/70 transition-colors"
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
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-red-700 dark:text-red-300">
          {PRIVACY_PROMISES.map((promise) => (
            <span
              key={promise}
              className="rounded-full border border-red-100 dark:border-red-900/70 bg-red-50/70 dark:bg-red-950/30 px-3 py-1"
            >
              {promise}
            </span>
          ))}
        </div>
      </section>

      {/* ── Category quick-access ── */}
      <section id="categories" aria-label="Browse tools by category" className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/40 px-5 py-5 sm:px-6 space-y-3 scroll-mt-6">
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Jump to a category
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {CATEGORY_SUMMARY} grouped into one-tap filters, so you can land on the right utility faster.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/tools?category=${encodeURIComponent(cat.name)}`}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-900 hover:text-red-700 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 transition-colors"
              aria-label={`Browse ${cat.count} ${cat.name} tools`}
            >
              <span>{cat.name}</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-gray-950/60 text-gray-400 dark:text-gray-500">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Toolblip? ── */}
      <section className="space-y-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Why Toolblip?
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            Useful utilities without the usual friction.
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Toolblip keeps everyday text, developer, and encoding tasks local, immediate, and refreshingly low-friction — perfect for quick, messy work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-red-200 dark:hover:border-red-900 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl mb-3">
                {b.emoji}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">{b.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{b.desc}</p>
              <div className="mt-3 h-1 w-10 rounded-full bg-red-100 dark:bg-red-900/60" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools grid ── */}
      <section id="tools" className="scroll-mt-6">
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
