'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';

type ToolSlug = string;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={copy} className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

// ── Word Counter ─────────────────────────────────────────────────────────────
function WordCounterUI() {
  const [input, setInput] = useState('');
  const stats = {
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, '').length,
    sentences: (input.match(/[.!?]+/g) || []).length,
    paragraphs: input.trim() ? input.split(/\n\n+/).filter(Boolean).length : 0,
    readingTime: Math.ceil(input.trim() ? input.trim().split(/\s+/).length / 200 : 0),
  };
  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.characters },
          { label: 'No Spaces', value: stats.charactersNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: `${stats.readingTime} min` },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Character Counter ────────────────────────────────────────────────────────
function CharacterCounterUI() {
  const [input, setInput] = useState('');
  const len = input.length;
  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total characters</span>
          <span className="font-medium text-gray-900 dark:text-white">{len}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min((len / 280) * 100, 100)}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: 'Twitter / X', limit: 280 },
            { label: 'LinkedIn', limit: 3000 },
            { label: 'Meta Description', limit: 160 },
          ].map(s => {
            const pct = (len / s.limit) * 100;
            const color = pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500';
            return (
              <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</div>
                <div className={`text-sm font-bold ${pct > 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{Math.min(len, s.limit)} / {s.limit}</div>
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1.5 overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Case Converter ────────────────────────────────────────────────────────────
function CaseConverterUI() {
  const [input, setInput] = useState('');
  const cases = {
    UPPERCASE: input.toUpperCase(),
    lowercase: input.toLowerCase(),
    TitleCase: input.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1).toLowerCase()),
    camelCase: input.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^[A-Z]/, c => c.toLowerCase()),
    snake_case: input.replace(/[\s-]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
    'kebab-case': input.replace(/[\s_]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
  };
  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(cases).map(([name, value]) => (
          <div key={name} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{name}</div>
            <div className="text-sm text-gray-900 dark:text-white break-all leading-relaxed">
              {value || <span className="text-gray-400 dark:text-gray-600 italic">—</span>}
            </div>
            {value && <CopyButton text={value} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Base64 Encode / Decode ───────────────────────────────────────────────────
function Base64UI() {
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
        setOutput(decodeURIComponent(escape(atob(input))));
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
          <button key={m} onClick={() => { setMode(m); setInput(''); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y" />
      <button onClick={process} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <CopyButton text={output} />
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ── URL Encode / Decode ──────────────────────────────────────────────────────
function UrlEncodeUI() {
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
      setError('Invalid URL-encoded string.');
      setOutput('');
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(''); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y" />
      <button onClick={process} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <CopyButton text={output} />
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ── JSON Formatter ────────────────────────────────────────────────────────────
function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [compact, setCompact] = useState(false);
  const format = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };
  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };
  return (
    <div className="space-y-4">
      <textarea value={input} onChange={e => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors font-mono text-sm resize-y" />
      <div className="flex gap-2 flex-wrap">
        <button onClick={format} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">Format</button>
        <button onClick={minify} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">Minify</button>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ml-2">
          <input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)} className="rounded" />
          Compact
        </label>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <CopyButton text={output} />
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ── Coming Soon ──────────────────────────────────────────────────────────────
function ComingSoonUI({ name }: { name: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          The <strong>{name}</strong> tool is being built. Check back soon!
        </p>
      </div>
      <textarea
        placeholder="In the meantime, paste your input here..."
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
        <span className="text-sm text-gray-400 dark:text-gray-600 italic">Output will appear here</span>
      </div>
    </div>
  );
}

// ── Tool Registry ────────────────────────────────────────────────────────────
const toolUIs: Partial<Record<ToolSlug, React.ComponentType>> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': UrlEncodeUI,
  'json-formatter': JsonFormatterUI,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();

  const ToolUI = toolUIs[slug];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/tools" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">All Tools</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl">{tool.emoji}</span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{tool.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
        {ToolUI ? <ToolUI /> : <ComingSoonUI name={tool.name} />}
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/tools" className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          ← Browse all tools
        </Link>
      </div>
    </div>
  );
}
