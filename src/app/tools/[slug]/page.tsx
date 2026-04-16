'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';

// ─── Tool UI Components ───────────────────────────────────────────────────

function WordCounterTool() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, '').length;
    const sentences = (trimmed.match(/[.!?]+/g) || []).length;
    const paragraphs = trimmed ? trimmed.split(/\n\n+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.round(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [input]);

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No Spaces', value: stats.charsNoSpace },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Read Time', value: `${stats.readingTime} min` },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center border border-gray-200 dark:border-gray-800">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterTool() {
  const [input, setInput] = useState('');
  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Google Title', limit: 60 },
    { label: 'SMS', limit: 160 },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text to count characters..."
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total characters</span>
          <span className={`text-2xl font-bold ${input.length > 280 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
            {input.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${input.length > 280 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, (input.length / 280) * 100)}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        {limits.map(({ label, limit }) => {
          const pct = Math.min(100, (input.length / limit) * 100);
          const over = input.length > limit;
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-28 shrink-0">{label}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-xs font-medium w-16 text-right ${over ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                {input.length}/{limit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaseConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const conversions = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'Title Case', fn: (s: string) => s.replace(/\S/g, (c, i) => (i === 0 || /\s|-/.test(s[i - 1])) ? c.toUpperCase() : c.toLowerCase()) },
    { label: 'camelCase', fn: (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toLowerCase()) },
    { label: 'snake_case', fn: (s: string) => s.replace(/[\s-]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() },
    { label: 'kebab-case', fn: (s: string) => s.replace(/[\s_]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() },
  ];

  const apply = useCallback((fn: (s: string) => string) => {
    setOutput(fn(input));
  }, [input]);

  const copy = useCallback(() => navigator.clipboard.writeText(output), [output]);

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="flex flex-wrap gap-2">
        {conversions.map(({ label, fn }) => (
          <button key={label} onClick={() => apply(fn)} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors">
            {label}
          </button>
        ))}
      </div>
      {output && (
        <div className="relative">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white whitespace-pre-wrap break-all text-sm">
            {output}
          </div>
          <button onClick={copy} className="absolute top-2 right-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
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
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  }, [input, mode]);

  const copy = useCallback(() => navigator.clipboard.writeText(output), [output]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          Encode
        </button>
        <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          Decode
        </button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <button onClick={run} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
        {mode === 'encode' ? 'Encode' : 'Decode'} →
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all">
            {output}
          </div>
          <button onClick={copy} className="absolute top-2 right-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

function URLEncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const run = useCallback(() => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput('Error: invalid input');
    }
  }, [input, mode]);

  const copy = useCallback(() => navigator.clipboard.writeText(output), [output]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => { setMode('encode'); setOutput(''); }} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          Encode
        </button>
        <button onClick={() => { setMode('decode'); setOutput(''); }} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          Decode
        </button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <button onClick={run} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
        {mode === 'encode' ? 'Encode' : 'Decode'} →
      </button>
      {output && output !== 'Error: invalid input' && (
        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all">
            {output}
          </div>
          <button onClick={copy} className="absolute top-2 right-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
            Copy
          </button>
        </div>
      )}
      {output === 'Error: invalid input' && <p className="text-red-500 text-sm">{output}</p>}
    </div>
  );
}

function JSONFormatterTool() {
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
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const copy = useCallback(() => navigator.clipboard.writeText(output), [output]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={format} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
          Format
        </button>
        <button onClick={minify} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors">
          Minify
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Indent:</span>
          <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 text-sm">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
            <option value={0}>Tab</option>
          </select>
        </label>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 text-sm text-red-600 dark:text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}
      {output && (
        <div className="relative">
          <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white overflow-x-auto whitespace-pre-wrap">
            <code>{output}</code>
          </pre>
          <button onClick={copy} className="absolute top-2 right-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

function ComingSoonTool({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        This tool is on our roadmap and will be available soon.
      </p>
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
          Preview input
        </label>
        <textarea
          disabled
          placeholder="This tool will have a real UI — input area shown here as a preview."
          className="w-full h-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-y opacity-60 cursor-not-allowed"
        />
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400 dark:text-gray-500 italic">
          Output will appear here when this tool is built.
        </div>
      </div>
    </div>
  );
}

// ─── Tool Router ───────────────────────────────────────────────────────────

function ToolUI({ slug }: { slug: string }) {
  switch (slug) {
    case 'word-counter':       return <WordCounterTool />;
    case 'character-counter':  return <CharacterCounterTool />;
    case 'case-converter':     return <CaseConverterTool />;
    case 'base64':             return <Base64Tool />;
    case 'url-encode':         return <URLEncodeTool />;
    case 'json-formatter':     return <JSONFormatterTool />;
    default:                   return <ComingSoonTool slug={slug} />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────

interface Props {
  params: { slug: string };
}

export default function ToolDetailPage({ params }: Props) {
  const tool = tools.find(t => t.slug === params.slug);
  if (!tool) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Tools
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
            {tool.description}
          </p>
          <span className="inline-block mt-3 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <ToolUI slug={tool.slug} />
      </div>

      {/* Privacy note */}
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
        🔒 100% client-side — your text never leaves your browser.
      </p>
    </div>
  );
}
