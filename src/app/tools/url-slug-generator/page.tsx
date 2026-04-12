'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export const toolMeta = {
  name: 'URL Slug Generator',
  description: 'Convert any text into a clean, URL-friendly slug. Supports custom separators, length limits, and tracks your last 5 generated slugs. 100% client-side — nothing leaves your browser.',
  category: 'web',
};

const canonicalUrl = `https://toolblip.com/tools/url-slug-generator/`;

export const metadata = {
  title: `${toolMeta.name} | Toolblip`,
  description: toolMeta.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: toolMeta.name,
    description: toolMeta.description,
    images: [{ url: 'https://toolblip.com/og-default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@HarunRRayhan',
  },
};

// ─── Slug logic ───────────────────────────────────────────────────────────────

type Separator = '-' | '_';

interface SlugOptions {
  separator: Separator;
  maxLength: number | null;
  lowercase: boolean;
  removeSpecial: boolean;
  trimSeparators: boolean;
}

function generateSlug(input: string, opts: SlugOptions): string {
  if (!input.trim()) return '';

  let slug = input;

  // Lowercase
  if (opts.lowercase) {
    slug = slug.toLowerCase();
  }

  // Normalize unicode (é → e, ñ → n, etc.)
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Remove special characters — keep alphanumeric, spaces, hyphens, underscores
  if (opts.removeSpecial) {
    slug = slug.replace(/[^a-zA-Z0-9\s\-_]/g, '');
  }

  // Replace spaces and any separator with the chosen separator
  slug = slug.replace(/[\s\-_]+/g, opts.separator);

  // Trim leading/trailing separators
  if (opts.trimSeparators) {
    const sep = opts.separator === '-' ? '-' : '_';
    const escapedSep = sep === '-' ? '\\-' : '_';
    slug = slug.replace(new RegExp(`^[${escapedSep}]+|[${escapedSep}]+$`, 'g'), '');
  }

  // Enforce max length — cut at separator boundary when possible
  if (opts.maxLength && slug.length > opts.maxLength) {
    const truncated = slug.slice(0, opts.maxLength);
    const lastSep = truncated.lastIndexOf(opts.separator);
    slug = lastSep > opts.maxLength * 0.6 ? truncated.slice(0, lastSep) : truncated;
    // Trim trailing separator again after cut
    if (opts.trimSeparators) {
      const sep = opts.separator === '-' ? '-' : '_';
      const escapedSep = sep === '-' ? '\\-' : '_';
      slug = slug.replace(new RegExp(`[${escapedSep}]+$`, 'g'), '');
    }
  }

  return slug;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionToggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-gray-700'}`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </div>
      <div>
        <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</div>
        {description && <div className="text-xs text-gray-600 mt-0.5">{description}</div>}
      </div>
    </label>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MAX_HISTORY = 5;
const LENGTH_PRESETS = [30, 50, 75, 100];

export default function UrlSlugGeneratorPage() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<Separator>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeSpecial, setRemoveSpecial] = useState(true);
  const [trimSeparators, setTrimSeparators] = useState(true);
  const [limitLength, setLimitLength] = useState(false);
  const [maxLength, setMaxLength] = useState(50);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedHistory, setCopiedHistory] = useState<number | null>(null);
  const prevSlugRef = useRef('');

  const slug = generateSlug(input, {
    separator,
    maxLength: limitLength ? maxLength : null,
    lowercase,
    removeSpecial,
    trimSeparators,
  });

  // Push to history whenever the slug stabilises to a new non-empty value
  useEffect(() => {
    if (!slug || slug === prevSlugRef.current) return;
    prevSlugRef.current = slug;
    setHistory((prev) => {
      const deduped = prev.filter((s) => s !== slug);
      return [slug, ...deduped].slice(0, MAX_HISTORY);
    });
  }, [slug]);

  const copy = (text: string, histIdx?: number) => {
    navigator.clipboard.writeText(text).then(() => {
      if (histIdx !== undefined) {
        setCopiedHistory(histIdx);
        setTimeout(() => setCopiedHistory(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-800 bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 py-2 text-sm text-gray-500 flex gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-gray-300" aria-current="page">URL Slug Generator</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔗</span>
            <h1 className="text-2xl font-bold text-white">URL Slug Generator</h1>
          </div>
          <p className="text-gray-400">{toolMeta.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            Web
          </span>
        </div>

        {/* Tool */}
        <section aria-label="Tool" className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          {/* Input */}
          <div className="mb-5">
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="slug-input">
              Text to convert
            </label>
            <textarea
              id="slug-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. My Awesome Blog Post Title!"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm resize-y focus:outline-none focus:border-green-500 placeholder-gray-600 font-mono"
              aria-label="Text to convert into a URL slug"
            />
          </div>

          {/* Live preview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-gray-400">Slug preview</span>
              {slug && (
                <button
                  onClick={() => copy(slug)}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors"
                  aria-label="Copy slug to clipboard"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div
              className={`bg-gray-800 border rounded-lg px-4 py-3 min-h-12 flex items-center transition-colors ${slug ? 'border-green-700/40' : 'border-gray-700'}`}
              aria-live="polite"
              aria-label="Generated slug"
            >
              {slug ? (
                <span className="text-green-400 font-mono text-sm break-all">{slug}</span>
              ) : (
                <span className="text-gray-600 font-mono text-sm">your-slug-will-appear-here</span>
              )}
            </div>
            {slug && (
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-gray-600">
                  {slug.length} character{slug.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-gray-600">
                  {slug.split(separator).filter(Boolean).length} word{slug.split(separator).filter(Boolean).length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="border-t border-gray-800 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left: toggles */}
            <div className="space-y-4">
              <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium">Transformations</h2>
              <OptionToggle
                label="Lowercase"
                description="Convert all characters to lowercase"
                checked={lowercase}
                onChange={setLowercase}
              />
              <OptionToggle
                label="Remove special characters"
                description="Strip punctuation and symbols"
                checked={removeSpecial}
                onChange={setRemoveSpecial}
              />
              <OptionToggle
                label="Trim leading/trailing separators"
                description="Remove hyphens or underscores at the edges"
                checked={trimSeparators}
                onChange={setTrimSeparators}
              />
            </div>

            {/* Right: separator + length */}
            <div className="space-y-5">
              {/* Separator */}
              <div>
                <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Separator</h2>
                <div className="flex gap-2">
                  {(['-', '_'] as Separator[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeparator(s)}
                      className={`px-4 py-1.5 rounded-full text-sm font-mono transition-colors ${
                        separator === s
                          ? 'bg-green-600 text-black font-medium'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                      aria-pressed={separator === s}
                    >
                      {s === '-' ? 'Hyphen  –' : 'Underscore  _'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length limit */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium">Max length</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={limitLength}
                        onChange={(e) => setLimitLength(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full transition-colors ${limitLength ? 'bg-green-600' : 'bg-gray-700'}`} />
                      <div className={`absolute top-0 left-0 w-4 h-4 rounded-full bg-white transition-transform ${limitLength ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-xs text-gray-500">{limitLength ? 'On' : 'Off'}</span>
                  </label>
                </div>

                {limitLength && (
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {LENGTH_PRESETS.map((p) => (
                        <button
                          key={p}
                          onClick={() => setMaxLength(p)}
                          className={`text-xs px-3 py-1 rounded-full transition-colors ${
                            maxLength === p
                              ? 'bg-green-600 text-black font-medium'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={maxLength}
                        min={5}
                        max={500}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v) && v >= 1) setMaxLength(v);
                        }}
                        className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-green-500"
                        aria-label="Custom maximum length"
                      />
                      <span className="text-xs text-gray-500">characters</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        {history.length > 0 && (
          <section aria-label="Recent slugs" className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
            <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
              Recent slugs
            </h2>
            <ul className="space-y-2">
              {history.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
                >
                  <span className="text-sm text-gray-300 font-mono truncate">{s}</span>
                  <button
                    onClick={() => copy(s, i)}
                    className="text-xs text-gray-500 hover:text-green-400 transition-colors shrink-0"
                    aria-label={`Copy slug: ${s}`}
                  >
                    {copiedHistory === i ? 'Copied!' : 'Copy'}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setHistory([])}
              className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear history
            </button>
          </section>
        )}

        <p className="text-xs text-gray-600 text-center">
          🔒 100% client-side — your data never leaves your browser
        </p>
      </div>
    </>
  );
}
