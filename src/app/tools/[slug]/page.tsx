'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tools } from '@/data/tools';

const toolMap = Object.fromEntries(tools.map(t => [t.slug, t]));

// ─── Shared copy helper ───────────────────────────────────────────────────────

async function copyToClipboard(text: string, setter: (v: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  setter('Copied!');
  setTimeout(() => setter(''), 1500);
}

// ─── Word Counter ─────────────────────────────────────────────────────────────

function WordCounterUI() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => {
    if (!input.trim()) return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: '' };
    const words = input.trim().split(/\s+/).filter(Boolean);
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const sentences = (input.match(/[.!?]+/g) || []).length || (input.trim() ? 1 : 0);
    const paragraphs = input.split(/\n\n+/).filter(l => l.trim()).length || (input.trim() ? 1 : 0);
    const minutes = Math.ceil(words.length / 200);
    const readingTime = minutes === 1 ? '1 min' : `${minutes} mins`;
    return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [input]);

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No Spaces', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Read Time', value: stats.readingTime },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {cards.map(c => (
          <div key={c.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{c.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Character Counter ────────────────────────────────────────────────────────

function CharacterCounterUI() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');
  const len = input.length;

  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Page Title', limit: 60 },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text here..."
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{len}</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">characters</span>
        {len > 0 && (
          <button
            onClick={() => copyToClipboard(String(len), setCopied)}
            className="ml-auto text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            {copied || 'copy count'}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {limits.map(l => {
          const pct = Math.min((len / l.limit) * 100, 100);
          const over = len > l.limit;
          return (
            <div key={l.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-36 shrink-0">{l.label}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-xs font-mono w-14 text-right ${over ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                {len}/{l.limit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Case Converter ───────────────────────────────────────────────────────────

function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const conversions = useMemo(() => {
    if (!input) return [];
    const s = input.trim();
    return [
      { label: 'UPPERCASE', value: s.toUpperCase() },
      { label: 'lowercase', value: s.toLowerCase() },
      { label: 'Sentence case', value: s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
      { label: 'Title Case', value: s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
      { label: 'camelCase', value: s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toLowerCase()) },
      { label: 'PascalCase', value: s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toUpperCase()) },
      { label: 'snake_case', value: s.replace(/[\s-]+/g, '_').toLowerCase() },
      { label: 'kebab-case', value: s.replace(/[\s_]+/g, '-').toLowerCase() },
      { label: 'CONSTANT_CASE', value: s.replace(/[\s-]+/g, '_').toUpperCase() },
      { label: 'dot.case', value: s.replace(/[\s-]+/g, '.').toLowerCase() },
    ];
  }, [input]);

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      {conversions.length > 0 ? (
        <div className="space-y-2">
          {conversions.map(c => (
            <div key={c.label} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
              <span className="text-xs text-gray-400 dark:text-gray-500 w-28 shrink-0">{c.label}</span>
              <span className="flex-1 font-mono text-sm text-gray-900 dark:text-white break-all">{c.value}</span>
              <button
                onClick={() => copyToClipboard(c.value, setCopied)}
                className="shrink-0 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              >
                {copied === 'Copied!' ? '✓' : 'copy'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          Enter text above to see all case conversions
        </p>
      )}
    </div>
  );
}

// ─── Base64 Encode / Decode ───────────────────────────────────────────────────

function Base64UI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setMode(m => m === 'encode' ? 'decode' : 'encode');
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={process}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </button>
        <button
          onClick={swap}
          className="px-3 py-2 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
          title="Swap input with result, flip mode"
        >
          ⇄
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => copyToClipboard(output, setCopied)} className="text-xs text-green-600 dark:text-green-400">
              {copied || 'copy'}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── URL Encode / Decode ──────────────────────────────────────────────────────

function UrlEncodeUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid input for URL ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'URL Encode' : 'URL Decode'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => copyToClipboard(output, setCopied)} className="text-xs text-green-600 dark:text-green-400">
              {copied || 'copy'}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter ───────────────────────────────────────────────────────────

function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState('');

  const process = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === 'format' ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2">
          {(['format', 'minify'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(''); setError(''); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m === 'format' ? 'Format' : 'Minify'}
            </button>
          ))}
        </div>
        {mode === 'format' && (
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Indent:</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`px-2 py-1 rounded text-xs transition-colors ${indent === n ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {n} spaces
              </button>
            ))}
          </div>
        )}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"example": "paste JSON here"}'
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
      </button>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => copyToClipboard(output, setCopied)} className="text-xs text-green-600 dark:text-green-400">
              {copied || 'copy'}
            </button>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white overflow-x-auto max-h-80 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Coming Soon ───────────────────────────────────────────────────────────────

function ComingSoonUI({ name }: { name: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          <strong>{name}</strong> is on our roadmap and will be available soon.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Try it out</label>
        <textarea
          disabled
          placeholder="This tool is not yet available..."
          rows={4}
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-xl px-4 py-3 font-mono text-sm cursor-not-allowed resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</label>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400 dark:text-gray-500 italic">
          Output will appear here when the tool is ready.
        </div>
      </div>
    </div>
  );
}

// ─── Share buttons (inline — avoids import chain issues) ──────────────────────

function ShareButtons({ toolName }: { toolName: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  if (typeof window !== 'undefined' && !url) setUrl(window.location.href);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`Check out ${toolName} on @toolblip`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
    </div>
  );
}

// ─── Tool registry ────────────────────────────────────────────────────────────

type ToolUIComponent = () => React.ReactElement;

const toolUIs: Record<string, ToolUIComponent> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': UrlEncodeUI,
  'json-formatter': JsonFormatterUI,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = toolMap[params.slug];

  if (!tool) notFound();

  const ToolUI = toolUIs[params.slug];

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
        <Link href="/tools" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200">{tool.name}</span>
      </nav>

      {/* Header */}
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

      {/* Tool UI card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        {ToolUI ? <ToolUI /> : <ComingSoonUI name={tool.name} />}
      </div>

      {/* Share */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
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

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-10">
        100% client-side · nothing leaves your browser
      </p>
    </div>
  );
}
