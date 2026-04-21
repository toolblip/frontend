'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import { tools } from '@/data/tools';

const toolMap = Object.fromEntries(tools.map(t => [t.slug, t]));

// ─── Individual Tool UIs ──────────────────────────────────────────────────────

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
    const readingTime = minutes === 1 ? '1 minute' : `${minutes} minutes`;
    return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [input]);

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No Spaces', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading Time', value: stats.readingTime },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterUI() {
  const [input, setInput] = useState('');
  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Page Title', limit: 60 },
  ];
  const len = input.length;

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text here..."
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{len}</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">characters</span>
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
              <span className={`text-xs font-mono w-12 text-right ${over ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {len}/{l.limit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const conversions = useMemo(() => {
    if (!input) return [];
    return [
      { label: 'UPPERCASE', value: input.toUpperCase() },
      { label: 'lowercase', value: input.toLowerCase() },
      { label: 'camelCase', value: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '') },
      { label: 'PascalCase', value: input.replace(/(?:^\w|[A-Z]|\b\w)/g, w => w.toUpperCase()).replace(/\s+/g, '') },
      { label: 'snake_case', value: input.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
      { label: 'kebab-case', value: input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
      { label: 'Title Case', value: input.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) },
    ];
  }, [input]);

  const copy = async (val: string, label: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="space-y-2">
        {conversions.map(c => (
          <div key={c.label} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2.5">
            <span className="text-xs text-gray-400 dark:text-gray-500 w-28 shrink-0">{c.label}</span>
            <span className="flex-1 font-mono text-sm text-gray-900 dark:text-white break-all">{c.value}</span>
            <button
              onClick={() => copy(c.value, c.label)}
              className="shrink-0 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              {copied === c.label ? '✓' : 'copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Base64UI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

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
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-green-600 dark:text-green-400">copy</button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

function UrlEncodeUI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

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
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
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
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-green-600 dark:text-green-400">copy</button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const process = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === 'format' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
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
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-green-600 dark:text-green-400">copy</button>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

function ComingSoonUI({ slug }: { slug: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          This tool is on our roadmap. Stay tuned!
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Try it out</label>
        <textarea
          disabled
          placeholder="This tool is not yet available..."
          rows={4}
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-lg px-4 py-3 font-mono text-sm cursor-not-allowed resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</label>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400 dark:text-gray-500 italic">
          Output will appear here when the tool is ready.
        </div>
      </div>
    </div>
  );
}

// ─── Tool registry ────────────────────────────────────────────────────────────

type ToolUIComponent = () => JSX.Element;

const toolUIs: Record<string, ToolUIComponent> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': UrlEncodeUI,
  'json-formatter': JsonFormatterUI,
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = toolMap[params.slug];

  if (!tool) notFound();

  const ToolUI = toolUIs[params.slug];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
      >
        <span>←</span> All Tools
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        {ToolUI ? <ToolUI /> : <ComingSoonUI slug={params.slug} />}
      </div>

      {/* Share buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <ShareButtons toolName={tool.name} />
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
        100% client-side · nothing leaves your browser
      </p>
    </div>
  );
}
