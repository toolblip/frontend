'use client';

import { useState, useCallback, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tools } from '@/data/tools';

// ─── Tool registry ─────────────────────────────────────────────────────────────

function WordCounterUI() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, '').length;
    const sentences = (trimmed.match(/[.!?]+/g) || []).length || (trimmed ? 1 : 0);
    const paragraphs = trimmed ? trimmed.split(/\n\n+/).filter(Boolean).length : 0;
    const readingTime = Math.ceil(words.length / 200);
    return { words: words.length, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [input]);

  const statCards = [
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
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
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
    { label: 'Google Title', limit: 60 },
    { label: 'SMS', limit: 160 },
    { label: 'Reddit Title', limit: 300 },
  ];
  const len = input.length;

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text here..."
        rows={5}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl font-bold text-green-600 dark:text-green-400">{len}</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">characters</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {limits.map(({ label, limit }) => {
          const pct = Math.min((len / limit) * 100, 100);
          const over = len > limit;
          return (
            <div key={label} className="border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
                <span className={`text-xs font-medium ${over ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {len}/{limit}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
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

function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('uppercase');
  const modes = [
    { key: 'uppercase', label: 'UPPERCASE' },
    { key: 'lowercase', label: 'lowercase' },
    { key: 'titlecase', label: 'Title Case' },
    { key: 'camelcase', label: 'camelCase' },
    { key: 'snakecase', label: 'snake_case' },
    { key: 'kebabcase', label: 'kebab-case' },
    { key: 'pascalcase', label: 'PascalCase' },
    { key: 'sentencecase', label: 'Sentence case' },
  ];

  const convert = useCallback(() => {
    if (!input) { setResult(''); return; }
    let out = '';
    switch (mode) {
      case 'uppercase': out = input.toUpperCase(); break;
      case 'lowercase': out = input.toLowerCase(); break;
      case 'titlecase': out = input.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); break;
      case 'camelcase': out = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break;
      case 'snakecase': out = input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, ''); break;
      case 'kebabcase': out = input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, ''); break;
      case 'pascalcase': out = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase()); break;
      case 'sentencecase': out = input.toLowerCase().replace(/(^\s*|\.\s+)(\w)/g, (_, a, b) => (a || '') + b.toUpperCase()); break;
      default: out = input;
    }
    setResult(out);
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setTimeout(convert, 0); }}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              mode === m.key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <button
        onClick={convert}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
      >
        Convert
      </button>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all font-mono">{result}</pre>
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

  const run = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))));
      else setOutput(decodeURIComponent(escape(atob(input))));
    } catch {
      setError('Invalid Base64 string for decoding.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-1">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); setOutput(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {m === 'encode' ? 'Encode ↑' : 'Decode ↓'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to Base64 encode...' : 'Paste Base64 string to decode...'}
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <button
        onClick={run}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
      >
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Result</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all font-mono">{output}</pre>
        </div>
      )}
    </div>
  );
}

function UrlEncodeUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const run = () => {
    if (!input) { setOutput(''); return; }
    if (mode === 'encode') setOutput(encodeURIComponent(input));
    else {
      try { setOutput(decodeURIComponent(input)); }
      catch { setOutput('Error: invalid encoded string'); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-1">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {m === 'encode' ? 'Encode ↑' : 'Decode ↓'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Paste encoded URL to decode...'}
        rows={4}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <button
        onClick={run}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
      >
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Result</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all font-mono">{output}</pre>
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

  const format = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(`JSON Error: ${e.message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Paste JSON here, e.g. {"key": "value"}'
        rows={6}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={compact}
            onChange={e => setCompact(e.target.checked)}
            className="accent-green-600"
          />
          Minify (compact)
        </label>
        <button
          onClick={format}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          Format &amp; Validate
        </button>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm font-mono">
          {error}
        </div>
      )}
      {output && !error && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Valid JSON</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono overflow-x-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}

function ComingSoonUI({ toolName }: { toolName: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Coming Soon</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The <strong>{toolName}</strong> tool is on our roadmap and will be available shortly.
        </p>
      </div>
      <textarea
        placeholder="Preview input (coming soon)..."
        rows={4}
        disabled
        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-600 font-mono text-sm resize-y cursor-not-allowed"
      />
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
        <span className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">Output</span>
        <p className="text-sm text-gray-400 dark:text-gray-600 mt-1 italic">—</p>
      </div>
    </div>
  );
}

// ─── Tool router ──────────────────────────────────────────────────────────────

const TOOL_UI: Record<string, React.ComponentType<{ toolName: string }>> = {
  'word-counter': () => <WordCounterUI />,
  'character-counter': () => <CharacterCounterUI />,
  'case-converter': () => <CaseConverterUI />,
  'base64': () => <Base64UI />,
  'url-encode': () => <UrlEncodeUI />,
  'json-formatter': () => <JsonFormatterUI />,
};

function getToolUI(slug: string) {
  if (TOOL_UI[slug]) {
    const Component = TOOL_UI[slug];
    return <Component toolName="" />;
  }
  return null;
}

// ─── Page component ───────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) notFound();

  const ToolUI = getToolUI(slug);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/directory"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Tools
      </Link>

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{tool.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
            <span className="inline-block mt-3 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        {ToolUI ?? <ComingSoonUI toolName={tool.name} />}
      </div>
    </div>
  );
}
