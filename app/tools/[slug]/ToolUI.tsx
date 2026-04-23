'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Tool } from '@/data/tools';

/* ─────────────────────────────────────────────
   Shared layout primitives
   ───────────────────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
      {children}
    </h3>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 min-w-[72px]">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{value}</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={2} />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth={2} />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Word Counter
   ───────────────────────────────────────────── */

function WordCounterUI() {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
    paragraphs: text.split(/\n\n+/).filter(s => s.trim()).length,
    readingTime: Math.ceil(text.trim() ? text.trim().split(/\s+/).length / 200 : 0),
  };

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={6}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
        <StatPill label="Words" value={stats.words} />
        <StatPill label="Chars" value={stats.characters} />
        <StatPill label="Chars (no spaces)" value={stats.charactersNoSpaces} />
        <StatPill label="Sentences" value={stats.sentences} />
        <StatPill label="Paragraphs" value={stats.paragraphs} />
        <StatPill label="Read (min)" value={stats.readingTime} />
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Character Counter
   ───────────────────────────────────────────── */

function CharacterCounterUI() {
  const [text, setText] = useState('');
  const limits = [
    { name: 'Twitter / X', limit: 280 },
    { name: 'LinkedIn', limit: 3000 },
    { name: 'Meta Description', limit: 160 },
    { name: 'Google Title', limit: 60 },
  ];
  const len = text.length;

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text…"
          rows={5}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4 space-y-3">
        {/* Primary counter */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Characters (with spaces)</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{len}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Characters (no spaces)</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{text.replace(/\s/g, '').length}</span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
          {limits.map(l => {
            const pct = Math.min((len / l.limit) * 100, 100);
            const over = len > l.limit;
            return (
              <div key={l.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{l.name} ({l.limit})</span>
                  <span className={`text-xs font-medium tabular-nums ${over ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                    {len}/{l.limit}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Case Converter
   ───────────────────────────────────────────── */

function toWords(s: string) {
  return s.match(/[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z])|\d+/g) || [];
}

const caseFns: { label: string; fn: (s: string) => string }[] = [
  { label: 'UPPERCASE', fn: s => s.toUpperCase() },
  { label: 'lowercase', fn: s => s.toLowerCase() },
  { label: 'Title Case', fn: s => s.replace(/\b\w/g, c => c.toUpperCase()) },
  { label: 'camelCase', fn: s => toWords(s).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
  { label: 'snake_case', fn: s => toWords(s).map(w => w.toLowerCase()).join('_') },
  { label: 'kebab-case', fn: s => toWords(s).map(w => w.toLowerCase()).join('-') },
  { label: 'PascalCase', fn: s => toWords(s).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
];

function CaseConverterUI() {
  const [input, setInput] = useState('');

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text to convert…"
          rows={4}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4 space-y-2">
        <SectionHeader>Converted</SectionHeader>
        {caseFns.map(({ label, fn }) => {
          const result = input ? fn(input) : '';
          return (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 w-28 shrink-0">{label}</span>
              <code className="flex-1 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded px-2 py-1.5 truncate">
                {result || '—'}
              </code>
              {result && <CopyButton text={result} />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Base64 Encode / Decode
   ───────────────────────────────────────────── */

function Base64UI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
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
      setError('Invalid input for the selected mode.');
      setOutput('');
    }
  }, [mode, input]);

  useEffect(() => { process(); }, [process]);

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 mb-3">
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`text-sm px-4 py-1.5 rounded-lg transition-colors font-medium ${
                mode === m
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder={mode === 'encode' ? 'Text to encode…' : 'Base64 string to decode…'}
          rows={4}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader>Output</SectionHeader>
          {output && !error && <CopyButton text={output} />}
        </div>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 whitespace-pre-wrap break-all font-mono leading-relaxed max-h-40 overflow-y-auto">
            {output}
          </pre>
        )}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   URL Encode / Decode
   ───────────────────────────────────────────── */

function URLEncodeUI() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
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

  useEffect(() => { process(); }, [process]);

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 mb-3">
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`text-sm px-4 py-1.5 rounded-lg transition-colors font-medium ${
                mode === m
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m === 'encode' ? 'Encode → URL-safe' : 'Decode ← URL-safe'}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder={mode === 'encode' ? 'Text to URL-encode…' : 'URL-encoded string to decode…'}
          rows={3}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader>Output</SectionHeader>
          {output && !error && <CopyButton text={output} />}
        </div>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 whitespace-pre-wrap break-all font-mono leading-relaxed max-h-40 overflow-y-auto">
            {output}
          </pre>
        )}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   JSON Formatter
   ───────────────────────────────────────────── */

function JSONFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<2 | 4>(2);

  const process = useCallback((raw: string, minify = false) => {
    setError('');
    if (!raw.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(raw);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  }, [indent]);

  const handleInput = (val: string) => {
    setInput(val);
    process(val);
  };

  const handleIndent = (i: 2 | 4) => {
    setIndent(i);
    process(input, false);
  };

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Indent:</span>
          {([2, 4] as const).map(i => (
            <button
              key={i}
              onClick={() => handleIndent(i)}
              className={`text-xs px-3 py-1 rounded-md transition-colors font-mono ${
                indent === i
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {i} spaces
            </button>
          ))}
          <button
            onClick={() => process(input, true)}
            className="ml-auto text-xs px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Minify
          </button>
        </div>
        <textarea
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder='Paste JSON here — {"key": "value"}'
          rows={6}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm font-mono leading-relaxed"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SectionHeader>Formatted Output</SectionHeader>
          {output && !error && <CopyButton text={output} />}
        </div>
        {error ? (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">{error}</p>
        ) : (
          <pre className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 whitespace-pre-wrap break-all font-mono leading-relaxed max-h-64 overflow-y-auto">
            {output || <span className="text-gray-400 italic">Output will appear here…</span>}
          </pre>
        )}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Coming Soon (placeholder for tools without UIs)
   ───────────────────────────────────────────── */

function ComingSoonUI() {
  return (
    <Card>
      <div className="p-12 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Coming Soon</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
            This tool&apos;s interactive UI is on its way. Check back shortly!
          </p>
        </div>
        <div className="w-full max-w-sm mt-4">
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: '45%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">Loading…</p>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Tool router
   ───────────────────────────────────────────── */

const TOOL_UIS: Record<string, React.ComponentType> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': URLEncodeUI,
  'json-formatter': JSONFormatterUI,
};

export default function ToolUI({ tool }: { tool: Tool }) {
  const Component = TOOL_UIS[tool.slug];
  return Component ? <Component /> : <ComingSoonUI />;
}
