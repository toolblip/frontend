'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

// ─── Tool UIs ────────────────────────────────────────────────────────────────

function WordCounterUI() {
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { words: 0, chars: input.length, charsNoSpaces: input.replace(/\s/g, '').length, sentences: 0, paragraphs: 0, readingTime: 0 };
    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const sentences = (trimmed.match(/[.!?]+/g) || []).length || (trimmed ? 1 : 0);
    const paragraphs = trimmed.split(/\n\n+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [input]);

  const statItems = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: `${stats.readingTime} min` },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-y"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 text-center border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterUI() {
  const [input, setInput] = useState('');

  const limits = [
    { label: 'Twitter (X)', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Facebook', limit: 63206 },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-y"
      />
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Total characters</span>
        <span className="text-2xl font-bold text-green-600 dark:text-green-400">{input.length}</span>
      </div>
      <div className="space-y-2">
        {limits.map(({ label, limit }) => {
          const pct = Math.min((input.length / limit) * 100, 100);
          const over = input.length > limit;
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">{label} ({limit})</span>
                <span className={over ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}>{input.length}/{limit}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<string>('');

  const convert = (text: string, m: string): string => {
    if (!text) return '';
    switch (m) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title': return text.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
      case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      case 'camel': return text.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toLowerCase());
      case 'snake': return text.replace(/[\s-]+/g, '_').toLowerCase();
      case 'kebab': return text.replace(/[\s_]+/g, '-').toLowerCase();
      case 'constant': return text.replace(/[\s-]+/g, '_').toUpperCase();
      case 'dot': return text.replace(/[\s-]+/g, '.').toLowerCase();
      default: return text;
    }
  };

  const modes = [
    { key: 'upper', label: 'UPPER' },
    { key: 'lower', label: 'lower' },
    { key: 'title', label: 'Title Case' },
    { key: 'sentence', label: 'Sentence case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'constant', label: 'CONSTANT_CASE' },
    { key: 'dot', label: 'dot.case' },
  ];

  const result = convert(input, mode);

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-y"
      />
      <div className="flex flex-wrap gap-2">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMode(mode === key ? '' : key)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              mode === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="text-gray-900 dark:text-white text-sm break-all">{result}</div>
        </div>
      )}
    </div>
  );
}

function Base64UI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError('Invalid input for the selected mode.');
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
        className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-y"
      />
      <button
        onClick={run}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="text-gray-900 dark:text-white text-sm break-all">{output}</div>
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

  const run = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid input for the selected mode.');
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL or text to decode...'}
        className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-y"
      />
      <button
        onClick={run}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="text-gray-900 dark:text-white text-sm break-all">{output}</div>
        </div>
      )}
    </div>
  );
}

function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [compact, setCompact] = useState(false);

  const format = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
    } catch (e: unknown) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}`);
    }
  }, [input, compact]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={compact}
            onChange={e => setCompact(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
          />
          Minify (compact)
        </label>
        <button
          onClick={format}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Format &amp; Validate
        </button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'{\n  "name": "Toolblip",\n  "version": "1.0"\n}'}
        className="w-full h-48 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-y font-mono text-sm"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Valid JSON</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}

function ComingSoonUI() {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-10 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Coming Soon</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          This tool is on our roadmap. The input/output shell is ready — real functionality coming soon!
        </p>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Preview input area..."
        className="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 resize-y"
      />
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output</span>
          <button className="text-xs text-gray-400 dark:text-gray-600 cursor-not-allowed">Copy</button>
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-600 italic">Output will appear here...</div>
      </div>
    </div>
  );
}

// ─── Tool router ──────────────────────────────────────────────────────────────

function ToolUI({ slug }: { slug: string }) {
  switch (slug) {
    case 'word-counter': return <WordCounterUI />;
    case 'character-counter': return <CharacterCounterUI />;
    case 'case-converter': return <CaseConverterUI />;
    case 'base64': return <Base64UI />;
    case 'url-encode': return <UrlEncodeUI />;
    case 'json-formatter': return <JsonFormatterUI />;
    default: return <ComingSoonUI />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = tools.find(t => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-8 transition-colors"
      >
        <span>←</span>
        <span>All Tools</span>
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{tool.description}</p>
          <span className="inline-block mt-3 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Share */}
      <div className="mt-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Share this tool</p>
        <ShareButtons toolName={tool.name} />
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <ToolUI slug={tool.slug} />
      </div>

      {/* Privacy note */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
        🔒 100% client-side — your data never leaves your browser.
      </p>
    </div>
  );
}
