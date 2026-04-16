import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {tool.name}
            </h1>
            <span className="inline-block mt-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <ToolUI slug={tool.slug} />
      </div>

      {/* Back link */}
      <div className="mt-6">
        <a
          href="/tools"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          ← All Tools
        </a>
      </div>
    </div>
  );
}

function ToolUI({ slug }: { slug: string }) {
  switch (slug) {
    case 'word-counter':
      return <WordCounterUI />;
    case 'character-counter':
      return <CharacterCounterUI />;
    case 'case-converter':
      return <CaseConverterUI />;
    case 'base64':
      return <Base64UI />;
    case 'url-encode':
      return <URLEncodeUI />;
    case 'json-formatter':
      return <JSONFormatterUI />;
    default:
      return <ComingSoonUI />;
  }
}

// ─── Word Counter ─────────────────────────────────────────────────────────────

function WordCounterUI() {
  'use client';
  return <WordCounterClient />;
}

import { useState } from 'react';

function WordCounterClient() {
  const [text, setText] = useState('');

  const stats = (() => {
    if (!text.trim()) return null;
    const words = text.trim().split(/\s+/);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+/g) || []).length || (chars > 0 ? 1 : 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length || (chars > 0 ? 1 : 0);
    const readingTime = Math.max(1, Math.round(words.length / 200));
    return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  })();

  return (
    <div className="p-6">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors text-sm"
      />
      {stats ? (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Words', value: stats.words },
            { label: 'Characters', value: stats.chars },
            { label: 'No spaces', value: stats.charsNoSpaces },
            { label: 'Sentences', value: stats.sentences },
            { label: 'Paragraphs', value: stats.paragraphs },
            { label: 'Read time', value: `${stats.readingTime} min` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          Start typing to see stats
        </p>
      )}
    </div>
  );
}

// ─── Character Counter ────────────────────────────────────────────────────────

function CharacterCounterUI() {
  'use client';
  return <CharacterCounterClient />;
}

function CharacterCounterClient() {
  const [text, setText] = useState('');

  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta description', limit: 160 },
    { label: 'Google title', limit: 60 },
  ];

  return (
    <div className="p-6">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-40 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors text-sm"
      />
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold text-lg text-gray-900 dark:text-white">{text.length}</span>{' '}
          characters
        </span>
        {text.length > 0 && (
          <button
            onClick={() => setText('')}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {limits.map(({ label, limit }) => {
          const pct = Math.min(100, (text.length / limit) * 100);
          const over = text.length > limit;
          return (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className={over ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                  {text.length}/{limit}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-400' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Case Converter ──────────────────────────────────────────────────────────

function CaseConverterUI() {
  'use client';
  return <CaseConverterClient />;
}

function CaseConverterClient() {
  const [text, setText] = useState('');

  const convert = (style: string) => {
    if (!text) return;
    let result = '';
    switch (style) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': result = text.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()); break;
      case 'sentence': result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
      case 'camel': {
        const w = text.trim().split(/[\s_-]+/);
        result = w[0].toLowerCase() + w.slice(1).map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join('');
        break;
      }
      case 'snake': result = text.trim().toLowerCase().replace(/\s+/g, '_'); break;
      case 'kebab': result = text.trim().toLowerCase().replace(/\s+/g, '-'); break;
      case 'constant': result = text.trim().toUpperCase().replace(/\s+/g, '_'); break;
      default: result = text;
    }
    navigator.clipboard.writeText(result);
  };

  const styles = [
    { key: 'upper', label: 'UPPERCASE' },
    { key: 'lower', label: 'lowercase' },
    { key: 'title', label: 'Title Case' },
    { key: 'sentence', label: 'Sentence case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'constant', label: 'CONSTANT_CASE' },
  ];

  return (
    <div className="p-6">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full h-32 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors text-sm"
      />
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {styles.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => convert(key)}
            disabled={!text}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-lg transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">Click a style to copy it to clipboard</p>
    </div>
  );
}

// ─── Base64 Encode/Decode ────────────────────────────────────────────────────

function Base64UI() {
  'use client';
  return <Base64Client />;
}

function Base64Client() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
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

  const swap = () => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(m => m === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 to decode...'}
          className="w-full h-28 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors text-sm"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={process}
            disabled={!input}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {mode === 'encode' ? 'Encode →' : 'Decode →'}
          </button>
          <button onClick={swap} disabled={!output} className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-40 transition-colors">
            Swap ↔
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {output && !error && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">Result</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
              >
                Copy
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full h-28 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 resize-none text-sm cursor-default"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── URL Encode/Decode ───────────────────────────────────────────────────────

function URLEncodeUI() {
  'use client';
  return <URLEncodeClient />;
}

function URLEncodeClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
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
      setError('Invalid input for decoding.');
      setOutput('');
    }
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(m => m === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Text or URL to encode...' : 'Encoded URL to decode...'}
          className="w-full h-28 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors text-sm"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={process}
            disabled={!input}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {mode === 'encode' ? 'Encode →' : 'Decode →'}
          </button>
          <button onClick={swap} disabled={!output} className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-40 transition-colors">
            Swap ↔
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {output && !error && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">Result</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
              >
                Copy
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full h-28 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 resize-none text-sm cursor-default"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JSON Formatter ──────────────────────────────────────────────────────────

function JSONFormatterUI() {
  'use client';
  return <JSONFormatterClient />;
}

function JSONFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState(2);

  const process = () => {
    setError('');
    try {
      const parsed = JSON.parse(input.trim());
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-2">
          {(['format', 'minify'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                mode === m
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {m === 'format' ? 'Format' : 'Minify'}
            </button>
          ))}
        </div>
        {mode === 'format' && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>Indent:</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`px-2 py-0.5 rounded ${indent === n ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Paste JSON here, e.g. {"name":"Toolblip","version":1}'
        className="w-full h-32 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors text-sm font-mono"
      />
      <button
        onClick={process}
        disabled={!input}
        className="mt-3 px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
      </button>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
      {output && !error && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-40 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 resize-none text-sm font-mono cursor-default"
          />
        </div>
      )}
    </div>
  );
}

// ─── Coming Soon ─────────────────────────────────────────────────────────────

function ComingSoonUI() {
  return (
    <div className="p-12 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Coming Soon
      </h2>
      <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs mx-auto">
        This tool is still being built. Check back soon — it&apos;ll be worth the wait.
      </p>
    </div>
  );
}
