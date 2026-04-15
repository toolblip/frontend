'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = tools.find(t => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
      >
        <span>←</span> All Tools
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-base">{tool.description}</p>
        <span className="inline-block mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
          {tool.category}
        </span>
        <div className="mt-3">
          <ShareButtons toolName={tool.name} />
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <ToolUI tool={tool} />
      </div>
    </div>
  );
}

function ToolUI({ tool }: { tool: typeof tools[0] }) {
  switch (tool.slug) {
    case 'word-counter':
      return <WordCounterUI />;
    case 'character-counter':
      return <CharacterCounterUI />;
    case 'case-converter':
      return <CaseConverterUI />;
    case 'base64':
      return <Base64UI />;
    case 'url-encode':
      return <UrlEncodeUI />;
    case 'json-formatter':
      return <JsonFormatterUI />;
    default:
      return <ComingSoonUI toolName={tool.name} />;
  }
}

function ComingSoonUI({ toolName }: { toolName: string }) {
  const [input, setInput] = useState('');

  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {toolName}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        This tool is coming soon! Try the working tools above.
      </p>

      {/* Placeholder input/output */}
      <div className="space-y-3 text-left max-w-md mx-auto">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Input area (coming soon)..."
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
          rows={4}
        />
        <textarea
          readOnly
          placeholder="Output will appear here..."
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none"
          rows={4}
        />
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm cursor-not-allowed">
          Process
        </button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg text-sm cursor-not-allowed">
          Copy
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Word Counter
──────────────────────────────────────────── */
function WordCounterUI() {
  const [input, setInput] = useState('');

  const stats = {
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, '').length,
    sentences: input.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: input.split(/\n\n+/).filter(Boolean).length,
    readingTime: Math.ceil(input.trim() ? input.trim().split(/\s+/).length / 200 : 0),
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
        rows={6}
        autoFocus
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
          <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Character Counter
──────────────────────────────────────────── */
function CharacterCounterUI() {
  const [input, setInput] = useState('');

  const limits = [
    { label: 'Twitter / X', limit: 280, color: 'text-black dark:text-white' },
    { label: 'LinkedIn', limit: 3000, color: 'text-[#0A66C2]' },
    { label: 'Meta Description', limit: 160, color: 'text-orange-500' },
    { label: 'Page Title', limit: 60, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste your text..."
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
        rows={5}
        autoFocus
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{input.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total characters</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{input.replace(/\s/g, '').length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">No spaces</div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform Limits</h3>
        {limits.map(({ label, limit, color }) => {
          const pct = Math.min((input.length / limit) * 100, 100);
          const over = input.length > limit;
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className={color}>{label}</span>
                <span className={over ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'}>
                  {input.length} / {limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-400' : 'bg-green-500'}`}
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

/* ────────────────────────────────────────────
   Case Converter
──────────────────────────────────────────── */
function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const conversions = [
    { label: 'UPPERCASE', fn: (t: string) => t.toUpperCase() },
    { label: 'lowercase', fn: (t: string) => t.toLowerCase() },
    { label: 'Title Case', fn: (t: string) => t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
    { label: 'camelCase', fn: (t: string) => t.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^(.)/, w => w.toLowerCase()) },
    { label: 'snake_case', fn: (t: string) => t.replace(/[- ]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() },
    { label: 'kebab-case', fn: (t: string) => t.replace(/[- ]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() },
    { label: 'CONSTANT_CASE', fn: (t: string) => t.replace(/[- ]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase() },
  ];

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
        rows={4}
        autoFocus
      />
      {input ? (
        <div className="space-y-2">
          {conversions.map(({ label, fn }) => {
            const result = fn(input);
            return (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0">{label}</span>
                <code className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white break-all">
                  {result || <span className="text-gray-400">—</span>}
                </code>
                <button
                  onClick={() => copy(result, label)}
                  className="shrink-0 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied === label ? '✓' : 'Copy'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
          Enter text above to see all case conversions
        </p>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Base64 Encode / Decode
──────────────────────────────────────────── */
function Base64UI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    setOutput('');
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

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-green-600 text-white'
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
        placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
        rows={4}
        autoFocus
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {output && (
        <div className="space-y-2">
          <textarea
            value={output}
            readOnly
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm resize-none"
            rows={4}
          />
          <button
            onClick={copy}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Copy Output
          </button>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   URL Encode / Decode
──────────────────────────────────────────── */
function UrlEncodeUI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    setOutput('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-green-600 text-white'
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
        placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
        rows={4}
        autoFocus
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {output && (
        <div className="space-y-2">
          <textarea
            value={output}
            readOnly
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm resize-none"
            rows={4}
          />
          <button
            onClick={copy}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Copy Output
          </button>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   JSON Formatter
──────────────────────────────────────────── */
function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [compact, setCompact] = useState(false);

  const format = () => {
    setError('');
    setOutput('');
    try {
      const parsed = JSON.parse(input);
      setOutput(compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
    } catch (e: unknown) {
      setError('Invalid JSON: ' + ((e as Error).message || 'Parse error'));
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input JSON</label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={compact}
            onChange={e => setCompact(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Compact
        </label>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'{\n  "example": "paste JSON here"\n}'}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm font-mono placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
        rows={6}
        autoFocus
      />
      <button
        onClick={format}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        Format & Validate
      </button>
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg px-3 py-2 border border-red-200 dark:border-red-800">{error}</p>
      )}
      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Formatted Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm font-mono resize-none"
            rows={8}
          />
          <button
            onClick={copy}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
