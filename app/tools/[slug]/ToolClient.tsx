'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { tools, type Tool } from '@/data/tools';
import SquareCropClient from '@/components/tools/SquareCropClient';
import CircleCropClient from '@/components/tools/CircleCropClient';
import ShareButtons from '@/components/ShareButtons';

/* ─── Copy button ──────────────────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = () => navigator.clipboard.writeText(text).then(() => setCopied(true));
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={2} />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth={2} />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/* ─── Card UI primitives ─────────────────────────────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
      {children}
    </h3>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 min-w-[72px]">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{value}</span>
    </div>
  );
}

/* ─── Word Counter ─────────────────────────────────────────────────────────── */

function WordCounterUI() {
  const [text, setText] = useState('');
  const s = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
    paragraphs: text.split(/\n\n+/).filter(s => s.trim()).length,
    readMin: Math.ceil(text.trim() ? text.trim().split(/\s+/).length / 200 : 0),
  };
  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={6}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
        <StatPill label="Words" value={s.words} />
        <StatPill label="Chars" value={s.chars} />
        <StatPill label="No spaces" value={s.charsNoSpaces} />
        <StatPill label="Sentences" value={s.sentences} />
        <StatPill label="Paragraphs" value={s.paragraphs} />
        <StatPill label="Read (min)" value={s.readMin} />
      </div>
    </Card>
  );
}

/* ─── Character Counter ─────────────────────────────────────────────────────── */

function CharacterCounterUI() {
  const [text, setText] = useState('');
  const len = text.length;
  const limits = [
    { name: 'Twitter / X', limit: 280 },
    { name: 'LinkedIn', limit: 3000 },
    { name: 'Meta description', limit: 160 },
    { name: 'Google title', limit: 60 },
  ];
  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text…"
          rows={5}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Characters (with spaces)</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{len}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Characters (no spaces)</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{text.replace(/\s/g, '').length}</span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
          {limits.map(l => {
            const pct = Math.min((len / l.limit) * 100, 100);
            const over = len > l.limit;
            return (
              <div key={l.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{l.name} ({l.limit})</span>
                  <span className={`text-xs font-medium tabular-nums ${over ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                    {len}/{l.limit}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-400' : 'bg-green-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ─── Case Converter ────────────────────────────────────────────────────────── */

const CASE_VARIANTS: { label: string; fn: (s: string) => string }[] = [
  {
    label: 'UPPERCASE',
    fn: s => s.toUpperCase(),
  },
  {
    label: 'lowercase',
    fn: s => s.toLowerCase(),
  },
  {
    label: 'Title Case',
    fn: s => s.replace(/\b\w/g, c => c.toUpperCase()),
  },
  {
    label: 'camelCase',
    fn: s => {
      const words = s.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z])|\d+/g) || [];
      if (!words.length) return '';
      return (words[0] as string).toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    },
  },
  {
    label: 'snake_case',
    fn: s => {
      const words = s.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z])|\d+/g) || [];
      return words.map(w => w.toLowerCase()).join('_');
    },
  },
  {
    label: 'kebab-case',
    fn: s => {
      const words = s.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z])|\d+/g) || [];
      return words.map(w => w.toLowerCase()).join('-');
    },
  },
  {
    label: 'PascalCase',
    fn: s => {
      const words = s.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z])|\d+/g) || [];
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    },
  },
];

function CaseConverterUI() {
  const [input, setInput] = useState('');
  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text to convert…"
          rows={4}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4 space-y-2">
        <SectionLabel>Converted</SectionLabel>
        {CASE_VARIANTS.map(({ label, fn }) => {
          const result = input ? fn(input) : '';
          return (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 w-28 shrink-0">{label}</span>
              <code className="flex-1 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded px-2 py-1.5 truncate font-mono">
                {result || '—'}
              </code>
              {result && <CopyButton text={result} />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ─── Base64 Encode / Decode ───────────────────────────────────────────────── */

function Base64UI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = useCallback(() => {
    setError('');
    try {
      setOutput(mode === 'encode'
        ? btoa(unescape(encodeURIComponent(input)))
        : decodeURIComponent(escape(atob(input))));
    } catch {
      setError('Invalid input for the selected mode.');
      setOutput('');
    }
  }, [mode, input]);

  useEffect(() => { run(); }, [run]);

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 mb-3">
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`text-sm px-4 py-1.5 rounded-lg transition-colors font-medium ${
                mode === m
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder={mode === 'encode' ? 'Text to encode…' : 'Base64 string to decode…'}
          rows={4}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed font-mono"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Output</SectionLabel>
          {output && !error && <CopyButton text={output} />}
        </div>
        {error ? (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 whitespace-pre-wrap break-all font-mono leading-relaxed max-h-40 overflow-y-auto">
            {output}
          </pre>
        )}
      </div>
    </Card>
  );
}

/* ─── URL Encode / Decode ──────────────────────────────────────────────────── */

function URLEncodeUI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = useCallback(() => {
    setError('');
    try {
      setOutput(mode === 'encode'
        ? encodeURIComponent(input)
        : decodeURIComponent(input));
    } catch {
      setError('Invalid URL-encoded string.');
      setOutput('');
    }
  }, [mode, input]);

  useEffect(() => { run(); }, [run]);

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 mb-3">
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`text-sm px-4 py-1.5 rounded-lg transition-colors font-medium ${
                mode === m
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m === 'encode' ? 'Encode → URL-safe' : 'Decode ← URL-safe'}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder={mode === 'encode' ? 'Text to URL-encode…' : 'URL-encoded string to decode…'}
          rows={3}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed font-mono"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Output</SectionLabel>
          {output && !error && <CopyButton text={output} />}
        </div>
        {error ? (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 whitespace-pre-wrap break-all font-mono leading-relaxed max-h-40 overflow-y-auto">
            {output}
          </pre>
        )}
      </div>
    </Card>
  );
}

/* ─── JSON Formatter ───────────────────────────────────────────────────────── */

function JSONFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<2 | 4>(2);

  const process = useCallback((raw: string, minify = false) => {
    setError('');
    if (!raw.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(raw);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [indent]);

  useEffect(() => { process(input); }, [input, process]);

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Indent:</span>
          {([2, 4] as const).map(i => (
            <button
              key={i}
              onClick={() => { setIndent(i); process(input); }}
              className={`text-xs px-3 py-1 rounded-md transition-colors font-mono ${
                indent === i
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {i} spaces
            </button>
          ))}
          <button
            onClick={() => process(input, true)}
            className="ml-auto text-xs px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Minify
          </button>
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); }}
          placeholder={'Paste JSON here — {"key": "value"}'}
          rows={6}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm font-mono leading-relaxed"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Formatted Output</SectionLabel>
          {output && !error && <CopyButton text={output} />}
        </div>
        {error ? (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 whitespace-pre-wrap break-all font-mono leading-relaxed max-h-64 overflow-y-auto">
            {output || <span className="text-gray-400 italic">Output will appear here…</span>}
          </pre>
        )}
      </div>
    </Card>
  );
}

/* ─── Coming Soon ──────────────────────────────────────────────────────────── */

function ComingSoonUI() {
  return (
    <Card>
      <div className="p-12 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Coming Soon</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
            This tool&apos;s interactive UI is on its way. Check back shortly!
          </p>
        </div>
        <div className="w-full max-w-sm mt-4">
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '45%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">Loading…</p>
        </div>
      </div>
    </Card>
  );
}

/* ─── Tool router ─────────────────────────────────────────────────────────── */

const TOOL_UI_MAP: Record<string, React.ComponentType> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': URLEncodeUI,
  'json-formatter': JSONFormatterUI,
  'square-crop': SquareCropClient,
  'circle-crop': CircleCropClient,
};

function ToolUI({ tool }: { tool: Tool }) {
  const Component = TOOL_UI_MAP[tool.slug];
  return Component ? <Component /> : <ComingSoonUI />;
}

/* ─── ToolClient ───────────────────────────────────────────────────────────── */

export default function ToolClient({ tool }: { tool: Tool }) {
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `https://toolblip.com/tools/${tool.slug}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">All Tools</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{tool.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</p>
            <span className="inline-block mt-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      {/* Tool UI */}
      <ToolUI tool={tool} />

      {/* Share */}
      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
        <ShareButtons toolName={tool.name} />
      </div>

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map(t => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl p-3 transition-all"
              >
                <span className="text-xl flex-shrink-0">{t.emoji}</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 truncate">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
