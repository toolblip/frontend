'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';

// ─── Tool UI Components ────────────────────────────────────────────────────

function WordCounterTool() {
  const [input, setInput] = useState('');

  const stats = {
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    chars: input.length,
    charsNoSpace: input.replace(/\s/g, '').length,
    sentences: (input.match(/[.!?]+/g) || []).length,
    paragraphs: input.trim() ? input.split(/\n\n+/).filter(Boolean).length : 0,
    readingTime: Math.ceil(input.trim() ? input.trim().split(/\s+/).length / 200 : 0),
  };

  const statItems = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpace },
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
        rows={6}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterTool() {
  const [input, setInput] = useState('');

  const limits = [
    { label: 'Twitter / X', limit: 280, color: 'text-black dark:text-white' },
    { label: 'LinkedIn', limit: 3000, color: 'text-[#0A66C2]' },
    { label: 'Meta description', limit: 155, color: 'text-gray-900 dark:text-gray-100' },
    { label: 'Meta title', limit: 60, color: 'text-gray-900 dark:text-gray-100' },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={5}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="space-y-2">
        {limits.map(({ label, limit, color }) => {
          const pct = Math.min((input.length / limit) * 100, 100);
          const over = input.length > limit;
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-medium ${over ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'} ${color}`}>{label}</span>
                <span className={over ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'}>
                  {input.length} / {limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-orange-400' : 'bg-green-500'}`}
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

function CaseConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (fn: (s: string) => string) => {
    if (!input) { setOutput(''); return; }
    setOutput(fn(input));
  };

  const toCamel = (s: string) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
  const toSnake = (s: string) => s.replace(/[\s-]+/g, '_').toLowerCase();
  const toKebab = (s: string) => s.replace(/[\s_]+/g, '-').toLowerCase();
  const toPascal = (s: string) => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
  const toTitle = (s: string) => s.replace(/\w\S*/g, c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase());

  const cases = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'camelCase', fn: toCamel },
    { label: 'snake_case', fn: toSnake },
    { label: 'kebab-case', fn: toKebab },
    { label: 'PascalCase', fn: toPascal },
    { label: 'Title Case', fn: toTitle },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {cases.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => convert(fn)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-300 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-900 dark:text-white font-mono text-sm break-all">{output}</p>
        </div>
      )}
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
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
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
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
              mode === m
                ? 'bg-green-600 text-white dark:bg-green-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-900 dark:text-white font-mono text-sm break-all">{output}</p>
        </div>
      )}
    </div>
  );
}

function URLEncodeTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-green-600 text-white dark:bg-green-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-900 dark:text-white font-mono text-sm break-all">{output}</p>
        </div>
      )}
    </div>
  );
}

function JSONFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{\n  "name": "Toolblip",\n  "version": "1.0"\n}'
        rows={6}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={format}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          Minify
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-gray-900 dark:text-white font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
        </div>
      )}
    </div>
  );
}

function ComingSoonTool({ slug }: { slug: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Coming Soon</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{slug}</code> tool is on our roadmap.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Check back soon — we ship fast.
        </p>
      </div>
      <textarea
        placeholder="Meanwhile, paste something here to preview the layout..."
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Output preview</span>
        <p className="text-gray-400 dark:text-gray-600 font-mono text-sm mt-2 italic">Your output will appear here...</p>
      </div>
    </div>
  );
}

// ─── Tool Registry ─────────────────────────────────────────────────────────

type ToolComponent = () => JSX.Element;

const toolComponents: Record<string, ToolComponent> = {
  'word-counter': WordCounterTool,
  'character-counter': CharacterCounterTool,
  'case-converter': CaseConverterTool,
  'base64': Base64Tool,
  'url-encode': URLEncodeTool,
  'json-formatter': JSONFormatterTool,
};

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = tools.find(t => t.slug === params.slug);

  if (!tool) notFound();

  const ToolComponent = toolComponents[tool.slug];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/tools" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          All Tools
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <span className="inline-block mt-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        {ToolComponent ? <ToolComponent /> : <ComingSoonTool slug={params.slug} />}
      </div>
    </div>
  );
}
