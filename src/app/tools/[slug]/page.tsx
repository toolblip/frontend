'use client';

import { useState, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tools } from '@/data/tools';

// ─── Tool UIs ───────────────────────────────────────────────────────────────

function WordCounterUI() {
  const [input, setInput] = useState('');

  const stats = {
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, '').length,
    sentences: input.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: input.split(/\n\n+/).filter(Boolean).length,
    readingTime: Math.ceil(input.trim().split(/\s+/).length / 200),
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.characters },
          { label: 'No Spaces', value: stats.charactersNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: `${stats.readingTime} min` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
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
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Google Title', limit: 60 },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text here..."
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total characters</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{input.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {limits.map(({ label, limit }) => {
            const pct = Math.min((input.length / limit) * 100, 100);
            const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-green-500';
            return (
              <div key={label} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                  <span className={`text-xs font-medium ${input.length > limit ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {input.length}/{limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const convert = useCallback((type: string) => {
    if (!input) { setResult(''); return; }
    switch (type) {
      case 'upper': setResult(input.toUpperCase()); break;
      case 'lower': setResult(input.toLowerCase()); break;
      case 'title': setResult(input.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1).toLowerCase())); break;
      case 'camel': {
        const w = input.trim().split(/[\s_-]+/);
        setResult(w[0].toLowerCase() + w.slice(1).map(t => t[0].toUpperCase() + t.slice(1).toLowerCase()).join(''));
        break;
      }
      case 'snake': setResult(input.trim().toLowerCase().replace(/[\s-]+/g, '_')); break;
      case 'kebab': setResult(input.trim().toLowerCase().replace(/[\s_]+/g, '-')); break;
      case 'constant': setResult(input.trim().toUpperCase().replace(/[\s-]+/g, '_')); break;
      case 'sentence': {
        const low = input.toLowerCase();
        setResult(low[0]?.toUpperCase() + low.slice(1));
        break;
      }
      default: break;
    }
  }, [input]);

  const cases = [
    { key: 'upper', label: 'UPPERCASE' },
    { key: 'lower', label: 'lowercase' },
    { key: 'title', label: 'Title Case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'constant', label: 'CONSTANT_CASE' },
    { key: 'sentence', label: 'Sentence case' },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="flex flex-wrap gap-2">
        {cases.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => convert(key)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 text-sm rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            {label}
          </button>
        ))}
      </div>
      {result && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Result</span>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white break-all">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

function Base64UI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
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
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding'));
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
        placeholder={mode === 'encode' ? 'Enter text to Base64 encode...' : 'Enter Base64 string to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

function URLEncodeUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
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
      setError('Invalid input for URL ' + (mode === 'encode' ? 'encoding' : 'decoding'));
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
        placeholder={mode === 'encode' ? 'Enter text or URL to encode...' : 'Enter encoded URL string to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white break-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

function JSONFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Paste JSON here, e.g. {"name": "Toolblip", "version": 1}'
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={format}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Format / Pretty Print
        </button>
        <button
          onClick={minify}
          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
        >
          Minify
        </button>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {output && !error && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white overflow-x-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

function ComingSoonUI({ toolName }: { toolName: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Coming Soon</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The <strong>{toolName}</strong> tool is in the works. Check back soon!
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preview input</label>
        <textarea
          rows={4}
          placeholder="This is a placeholder — the real tool will be here soon."
          disabled
          className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-600 resize-y cursor-not-allowed opacity-60"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Output</label>
        <div className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-400 dark:text-gray-600">
          Output will appear here...
        </div>
      </div>
    </div>
  );
}

// ─── Tool registry ────────────────────────────────────────────────────────────

const TOOL_UIS: Record<string, React.ComponentType> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': URLEncodeUI,
  'json-formatter': JSONFormatterUI,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = tools.find(t => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  const ToolUI = TOOL_UIS[params.slug];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-6"
      >
        ← All Tools
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          {tool.description}
        </p>
        <span className="inline-block text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
          {tool.category}
        </span>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        {ToolUI ? <ToolUI /> : <ComingSoonUI toolName={tool.name} />}
      </div>
    </div>
  );
}
