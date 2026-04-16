'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Tool } from '@/data/tools';

/* ─── Router ─────────────────────────────────────────────────────────────── */

export default function ToolUI({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'word-counter':     return <WordCounter />;
    case 'character-counter': return <CharacterCounter />;
    case 'case-converter':   return <CaseConverter />;
    case 'base64':           return <Base64Codec />;
    case 'url-encode':       return <UrlCodec />;
    case 'json-formatter':   return <JsonFormatter />;
    default:                 return <ComingSoon />;
  }
}

/* ─── Shared input/output shell ───────────────────────────────────────────── */

function InputArea({
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
      aria-label="Input"
    />
  );
}

function OutputArea({
  value,
  copyLabel,
}: {
  value: string;
  copyLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
        <button
          onClick={copy}
          className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
        >
          {copied ? '✓ Copied' : copyLabel ?? 'Copy'}
        </button>
      </div>
      <textarea readOnly value={value} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 h-32 resize-none font-mono text-sm" />
    </div>
  );
}

function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {children}
    </div>
  );
}

function SecondaryButton({
  onClick,
  children,
  className = '',
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-lg transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors font-medium"
    >
      {children}
    </button>
  );
}

/* ─── Word Counter ─────────────────────────────────────────────────────────── */

function WordCounter() {
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const sentences = trimmed
      ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0)
      : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\n+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.round(words.length / 200));
    return {
      words: words.length,
      chars: input.length,
      charsNoSpaces: input.replace(/\s/g, '').length,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [input]);

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No Spaces', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Read Time', value: `${stats.readingTime} min` },
  ];

  return (
    <div>
      <InputArea
        value={input}
        onChange={setInput}
        placeholder="Paste or type your text here..."
        rows={8}
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
        {cards.map(c => (
          <div
            key={c.label}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-center"
          >
            <div className="text-lg font-bold text-gray-900 dark:text-white">{c.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Character Counter ─────────────────────────────────────────────────────── */

function CharacterCounter() {
  const [input, setInput] = useState('');
  const len = input.length;

  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Desc', limit: 160 },
    { label: 'Google Title', limit: 60 },
  ];

  return (
    <div>
      <InputArea
        value={input}
        onChange={setInput}
        placeholder="Type or paste your text..."
        rows={6}
      />
      <div className="mt-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-bold text-gray-900 dark:text-white text-base">{len}</span>{' '}
          characters total
        </span>
      </div>
      <div className="flex flex-wrap gap-5 mt-4">
        {limits.map(l => {
          const pct = Math.min(100, (len / l.limit) * 100);
          const over = len > l.limit;
          const color = over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500';
          return (
            <div key={l.label} className="flex-1 min-w-36">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <span>{l.label} <span className="font-medium">({l.limit})</span></span>
                {over && <span className="text-red-500 font-medium">Over limit</span>}
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${color}`}
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

/* ─── Case Converter ───────────────────────────────────────────────────────── */

function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const copy = useCallback(async (text: string, label: string) => {
    if (!text || text === '—') return;
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  }, []);

  const cases = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) },
    { label: 'camelCase', fn: (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, s => s.toLowerCase()) },
    { label: 'snake_case', fn: (s: string) => s.trim().replace(/\s+/g, '_').toLowerCase() },
    { label: 'kebab-case', fn: (s: string) => s.trim().replace(/\s+/g, '-').toLowerCase() },
    { label: 'CONSTANT_CASE', fn: (s: string) => s.trim().replace(/\s+/g, '_').toUpperCase() },
    { label: 'Sentence case', fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  ];

  return (
    <div>
      <InputArea
        value={input}
        onChange={setInput}
        placeholder="Enter text to convert..."
        rows={5}
      />
      <div className="space-y-2 mt-4">
        {cases.map(c => {
          const result = input ? c.fn(input) : '—';
          return (
            <div
              key={c.label}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 gap-3"
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 w-28 shrink-0 font-medium">
                {c.label}
              </span>
              <span className="text-sm text-gray-900 dark:text-white font-mono truncate">
                {result}
              </span>
              <button
                onClick={() => copy(result, c.label)}
                disabled={!input}
                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 shrink-0 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {copied === c.label ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Base64 Encode / Decode ───────────────────────────────────────────────── */

function Base64Codec() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError('Invalid input. Check that the text is valid for ' + (mode === 'encode' ? 'UTF-8 encoding.' : 'Base64 decoding.'));
      setOutput('');
    }
  }, [input, mode]);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
  }, [output]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 text-sm rounded-lg capitalize transition-colors font-medium ${
              mode === m
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <InputArea
        value={input}
        onChange={v => { setInput(v); setError(''); }}
        placeholder={mode === 'encode' ? 'Text to encode to Base64…' : 'Base64 string to decode…'}
        rows={5}
      />

      <ActionBar>
        <PrimaryButton onClick={process}>
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </PrimaryButton>
        <SecondaryButton onClick={swap} className={!output ? 'opacity-40 cursor-not-allowed' : ''}>
          ⇄ Swap
        </SecondaryButton>
        <SecondaryButton onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          Clear
        </SecondaryButton>
      </ActionBar>

      {error && (
        <p className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {output && !error && (
        <div className="mt-3">
          <OutputArea value={output} />
        </div>
      )}
    </div>
  );
}

/* ─── URL Encode / Decode ──────────────────────────────────────────────────── */

function UrlCodec() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch {
      setError('Error: invalid input for URL decoding. Make sure %-sequences are valid.');
      setOutput('');
    }
  }, [input, mode]);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
  }, [output]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 text-sm rounded-lg capitalize transition-colors font-medium ${
              mode === m
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <InputArea
        value={input}
        onChange={v => { setInput(v); setError(''); }}
        placeholder={mode === 'encode' ? 'URL or text to encode…' : 'Encoded URL to decode…'}
        rows={5}
      />

      <ActionBar>
        <PrimaryButton onClick={process}>
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </PrimaryButton>
        <SecondaryButton onClick={swap} className={!output ? 'opacity-40 cursor-not-allowed' : ''}>
          ⇄ Swap
        </SecondaryButton>
        <SecondaryButton onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          Clear
        </SecondaryButton>
      </ActionBar>

      {error && (
        <p className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {output && !error && (
        <div className="mt-3">
          <OutputArea value={output} />
        </div>
      )}
    </div>
  );
}

/* ─── JSON Formatter ───────────────────────────────────────────────────────── */

function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(
    (minify = false) => {
      setError('');
      try {
        const parsed = JSON.parse(input);
        setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
      } catch (e: unknown) {
        setError(`JSON Error: ${e instanceof Error ? e.message : String(e)}`);
        setOutput('');
      }
    },
    [input, indent],
  );

  const clear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <PrimaryButton onClick={() => format(false)}>Format</PrimaryButton>
        <SecondaryButton onClick={() => format(true)}>Minify</SecondaryButton>
        <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 ml-1">
          Indent:
          <select
            value={indent}
            onChange={e => setIndent(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-1 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </label>
        <SecondaryButton onClick={clear}>Clear</SecondaryButton>
      </div>

      <InputArea
        value={input}
        onChange={v => { setInput(v); setError(''); }}
        placeholder={'{\n  "name": "Toolblip",\n  "version": "1.0",\n  "features": ["fast", "free"]\n}'}
        rows={7}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 font-mono">
          {error}
        </p>
      )}
      {output && !error && (
        <div className="mt-3">
          <OutputArea value={output} />
        </div>
      )}
    </div>
  );
}

/* ─── Coming Soon ───────────────────────────────────────────────────────────── */

function ComingSoon() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-10 text-center">
      <span className="text-5xl">🚧</span>
      <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        Interactive UI coming soon
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
        This tool&rsquo;s interactive interface is on our roadmap and will be available shortly.
      </p>
      <a
        href="/tools"
        className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
      >
        Browse all tools
      </a>
    </div>
  );
}
