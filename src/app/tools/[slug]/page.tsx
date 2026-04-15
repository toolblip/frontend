import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import type { Tool } from '@/data/tools';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

function WordCounterUI() {
  return <WordCounterClient />;
}

function CharacterCounterUI() {
  return <CharacterCounterClient />;
}

function CaseConverterUI() {
  return <CaseConverterClient />;
}

function Base64UI() {
  return <Base64Client />;
}

function UrlEncodeUI() {
  return <UrlEncodeClient />;
}

function JsonFormatterUI() {
  return <JsonFormatterClient />;
}

function ComingSoon({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Coming Soon</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        The interactive UI for this tool is being built. Check back soon!
      </p>
      <div className="mt-8 w-full max-w-lg">
        <textarea
          readOnly
          placeholder="Preview coming soon..."
          className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
        />
        <div className="flex justify-end mt-3">
          <button disabled className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium">
            Process
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Individual tool UIs ----

'use client';
import { useState } from 'react';

function WordCounterClient() {
  const [text, setText] = useState('');
  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    readingTime: Math.max(1, Math.round(text.trim().split(/\s+/).length / 200)),
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpace },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: `${stats.readingTime} min` },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterClient() {
  const [text, setText] = useState('');
  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Page Title', limit: 60 },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text..."
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
      />
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-300">Total characters</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">{text.length}</span>
      </div>
      <div className="space-y-2">
        {limits.map(l => {
          const pct = Math.min(100, (text.length / l.limit) * 100);
          const over = text.length > l.limit;
          return (
            <div key={l.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-32 shrink-0">{l.label}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-xs font-medium w-16 text-right ${over ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                {text.length}/{l.limit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaseConverterClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab'>('lower');
  const modes = [
    { key: 'upper', label: 'UPPER' },
    { key: 'lower', label: 'lower' },
    { key: 'title', label: 'Title Case' },
    { key: 'sentence', label: 'Sentence case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
  ] as const;

  function convert(t: string) {
    switch (mode) {
      case 'upper': return t.toUpperCase();
      case 'lower': return t.toLowerCase();
      case 'title': return t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      case 'sentence': return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
      case 'camel': return t.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
      case 'snake': return t.replace(/[\s-]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
      case 'kebab': return t.replace(/[\s_]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors"
      />
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === m.key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Result</div>
        <div className="text-gray-900 dark:text-white font-mono text-sm break-all">
          {convert(text) || <span className="text-gray-400 dark:text-gray-500">Output will appear here...</span>}
        </div>
      </div>
    </div>
  );
}

function Base64Client() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  function run() {
    setError('');
    try {
      if (mode === 'encode') {
        setResult(btoa(unescape(encodeURIComponent(text))));
      } else {
        setResult(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError('Invalid input for Base64 decoding');
      setResult('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setError(''); }}
        placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
      />
      <button
        onClick={run}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Output</div>
          <div className="text-gray-900 dark:text-white font-mono text-sm break-all">{result}</div>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}

function UrlEncodeClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  function run() {
    setError('');
    try {
      if (mode === 'encode') {
        setResult(encodeURIComponent(text));
      } else {
        setResult(decodeURIComponent(text));
      }
    } catch {
      setError('Invalid URL-encoded string');
      setResult('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setError(''); }}
        placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
      />
      <button
        onClick={run}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Output</div>
          <div className="text-gray-900 dark:text-white font-mono text-sm break-all">{result}</div>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}

function JsonFormatterClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  function run() {
    setError('');
    try {
      const parsed = JSON.parse(text);
      if (mode === 'format') {
        setResult(JSON.stringify(parsed, null, 2));
      } else {
        setResult(JSON.stringify(parsed));
      }
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setResult('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['format', 'minify'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'format' ? 'Format' : 'Minify'}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setError(''); }}
        placeholder='{"key": "value"}'
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
      />
      <button
        onClick={run}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-gray-900 dark:text-white font-mono text-xs overflow-x-auto whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}

function ToolUI({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'word-counter': return <WordCounterUI />;
    case 'character-counter': return <CharacterCounterUI />;
    case 'case-converter': return <CaseConverterUI />;
    case 'base64': return <Base64UI />;
    case 'url-encode': return <UrlEncodeUI />;
    case 'json-formatter': return <JsonFormatterUI />;
    default: return <ComingSoon slug={tool.slug} />;
  }
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
      >
        ← All Tools
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
          {tool.category}
        </span>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{tool.description}</p>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <ToolUI tool={tool} />
      </div>
    </div>
  );
}
