'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';

// ─── Shared layout ───────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Tool not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        This tool doesn&rsquo;t exist or may have been renamed.
      </p>
      <Link
        href="/tools"
        className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        Browse all tools
      </Link>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12">
        <span className="text-6xl">🚧</span>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Coming soon</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          This tool is on our roadmap and will be available soon.
        </p>
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preview — paste your input
          </label>
          <textarea
            className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
            rows={5}
            placeholder="Paste your content here..."
            readOnly
          />
        </div>
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400 dark:text-gray-500 text-sm">
          Output will appear here once this tool is built.
        </div>
      </div>
    </div>
  );
}

// ─── Word Counter ─────────────────────────────────────────────────────────────

function WordCounterTool() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    if (!text.trim()) return null;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.split(/\n\n+/).filter(t => t.trim()).length || (text.trim() ? 1 : 0);
    const readingTime = Math.max(1, Math.ceil(words.length / 200));
    return { words: words.length, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [text]);

  const copyStat = (value: number | string, label: string) => {
    navigator.clipboard.writeText(String(value));
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={8}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
        autoFocus
      />
      {stats ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'Words', value: stats.words },
              { label: 'Characters', value: stats.chars },
              { label: 'No Spaces', value: stats.charsNoSpace },
              { label: 'Sentences', value: stats.sentences },
              { label: 'Paragraphs', value: stats.paragraphs },
              { label: 'Read Time', value: `${stats.readingTime} min` },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => copyStat(value, label)}
                title="Click to copy"
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-lg p-3 text-center transition-colors group"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Click any stat to copy · {stats.words > 0 ? Math.ceil(stats.words / 200) : 0} min read at 200 wpm
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          Start typing to see stats
        </p>
      )}
    </div>
  );
}

// ─── Character Counter ────────────────────────────────────────────────────────

function CharacterCounterTool() {
  const [text, setText] = useState('');
  const len = text.length;

  const limits = [
    { label: 'Twitter / X', max: 280, color: 'text-black dark:text-white' },
    { label: 'LinkedIn', max: 3000, color: 'text-blue-700 dark:text-blue-400' },
    { label: 'Meta Description', max: 160, color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Page Title', max: 60, color: 'text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
        autoFocus
      />
      {/* Big count */}
      <div className="text-center py-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className={`text-5xl font-bold ${len > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>
          {len}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">characters</div>
        {!text && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">Start typing to track</div>
        )}
      </div>
      {/* Limit bars */}
      <div className="space-y-3">
        {limits.map(({ label, max, color }) => {
          const pct = Math.min(100, (len / max) * 100);
          const over = len > max;
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">{label}</span>
                <span className={`font-medium ${over ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {len} / {max}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    over ? 'bg-red-500' : pct > 80 ? 'bg-orange-400' : 'bg-green-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Case Converter ───────────────────────────────────────────────────────────

function CaseConverterTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convert = useCallback((fn: (s: string) => string) => {
    setOutput(fn(text));
  }, [text]);

  const variants = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
    { label: 'camelCase', fn: (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, s => s.toLowerCase()) },
    { label: 'PascalCase', fn: (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, s => s.toUpperCase()) },
    { label: 'snake_case', fn: (s: string) => s.trim().replace(/\s+/g, '_').toLowerCase() },
    { label: 'kebab-case', fn: (s: string) => s.trim().replace(/\s+/g, '-').toLowerCase() },
    { label: 'CONSTANT_CASE', fn: (s: string) => s.trim().replace(/\s+/g, '_').toUpperCase() },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
        autoFocus
      />
      <div className="flex flex-wrap gap-2">
        {variants.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => convert(fn)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/40 hover:text-green-700 dark:hover:text-green-300 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-700 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      {output !== undefined && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Result</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono text-sm break-all min-h-[80px]">
            {output || <span className="text-gray-400 dark:text-gray-500">Result will appear here</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Base64 Encode / Decode ───────────────────────────────────────────────────

function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '. Check your text and try again.');
      setOutput('');
    }
  }, [mode, input]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-1">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
        autoFocus
      />
      <button
        onClick={run}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
      >
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono text-sm break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── URL Encode / Decode ───────────────────────────────────────────────────────

function UrlEncodeTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid URL-encoded string.');
      setOutput('');
    }
  }, [mode, input]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-1">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
        autoFocus
      />
      <button
        onClick={run}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
      >
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono text-sm break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter ────────────────────────────────────────────────────────────

function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'parse error'));
      setOutput('');
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'parse error'));
      setOutput('');
    }
  }, [input]);

  const validate = useCallback(() => {
    setError('');
    try {
      JSON.parse(input);
      setOutput('✅ Valid JSON');
    } catch (e) {
      setError('❌ Invalid JSON: ' + (e instanceof Error ? e.message : 'parse error'));
      setOutput('');
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={format}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={validate}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          Validate
        </button>
        <div className="flex items-center gap-1.5 ml-auto text-sm text-gray-500 dark:text-gray-400">
          <label>Indent:</label>
          <select
            value={indent}
            onChange={e => setIndent(Number(e.target.value))}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm"
          >
            {[2, 4].map(n => <option key={n} value={n}>{n} spaces</option>)}
          </select>
        </div>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"name": "Toolblip", "tools": 37, "free": true}'
        rows={8}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
        autoFocus
      />
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm whitespace-pre-wrap">
          {error}
        </div>
      )}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono text-sm overflow-x-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Tool registry & router ───────────────────────────────────────────────────

function ToolRouter({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'word-counter':        return <WordCounterTool />;
    case 'character-counter':    return <CharacterCounterTool />;
    case 'case-converter':       return <CaseConverterTool />;
    case 'base64':               return <Base64Tool />;
    case 'url-encode':           return <UrlEncodeTool />;
    case 'json-formatter':       return <JsonFormatterTool />;
    default:                     return <ComingSoon />;
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ToolDetail({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/tools" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          All Tools
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-5xl">{tool.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</p>
          <span className="inline-block mt-2 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolRouter tool={tool} />
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/tools" className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          ← Browse more tools
        </Link>
      </div>
    </div>
  );
}
