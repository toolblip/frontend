'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Tool } from '@/data/tools';

/* ─── Shared UI components ─────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function OutputCard({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
        </div>
      )}
      {children}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, className = '' }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={5}
      className={`w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors resize-y ${className}`}
    />
  );
}

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-center min-w-[72px]">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-base font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

function TabBar({ tabs, active, onChange }: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-fit mb-4">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            active === t
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function ComingSoon({ toolSlug }: { toolSlug: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-10 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Tool UI Coming Soon
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        This tool&apos;s interactive UI is still being built. The core encoder/decoder logic is ready — functional UI arriving shortly.
      </p>
      <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono">
        /tools/{toolSlug}
      </div>
    </div>
  );
}

/* ─── Tool-specific UIs ─────────────────────────────────────────────── */

function WordCounterUI() {
  const [text, setText] = useState('');
  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    readTime: Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200)),
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste or type your text here..." />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpace },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: `${stats.readTime}m` },
        ].map(s => (
          <StatChip key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  );
}

function CharacterCounterUI() {
  const [text, setText] = useState('');
  const limits = [
    { label: 'Twitter / X', max: 280 },
    { label: 'LinkedIn', max: 3000 },
    { label: 'Meta Description', max: 160 },
    { label: 'Page Title', max: 60 },
  ];
  const remaining = (max: number) => Math.max(0, max - text.length);
  const pct = (max: number) => Math.min(100, (text.length / max) * 100);

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={setText}
        placeholder="Type or paste text to count characters..."
        className="min-h-[160px]"
      />
      <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">
        {text.length} <span className="text-sm font-normal text-gray-500">characters</span>
      </div>
      <div className="space-y-3">
        {limits.map(({ label, max }) => {
          const r = remaining(max);
          const p = pct(max);
          const over = text.length > max;
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{label} ({max})</span>
                <span className={`font-medium ${over ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                  {r} left
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : p > 80 ? 'bg-amber-400' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, p)}%` }}
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
  const [text, setText] = useState('');
  const convert = (fn: (s: string) => string) => {
    setText(fn(text));
    navigator.clipboard.writeText(fn(text));
  };
  const variants: { label: string; fn: (s: string) => string }[] = [
    { label: 'UPPERCASE', fn: s => s.toUpperCase() },
    { label: 'lowercase', fn: s => s.toLowerCase() },
    { label: 'Title Case', fn: s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
    { label: 'camelCase', fn: s => s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toLowerCase()) },
    { label: 'snake_case', fn: s => s.trim().toLowerCase().replace(/[-_\s]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() },
    { label: 'kebab-case', fn: s => s.trim().toLowerCase().replace(/[-_\s]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() },
    { label: 'CONSTANT_CASE', fn: s => s.trim().toUpperCase().replace(/[-_\s]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase() },
    { label: 'Sentence case', fn: s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  ];

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Enter text to convert..." />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {variants.map(({ label, fn }) => {
          const result = text ? fn(text) : '';
          return (
            <button
              key={label}
              onClick={() => convert(fn)}
              className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-lg transition-colors text-center"
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
              <span className="text-sm text-gray-900 dark:text-white font-mono truncate w-full overflow-hidden text-ellipsis">
                {result || '—'}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Click any variant to copy to clipboard</p>
    </div>
  );
}

function Base64UI() {
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
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding'));
      setOutput('');
    }
  }, [mode, input]);

  useEffect(() => { run(); }, [run]);

  return (
    <div className="space-y-4">
      <TabBar tabs={['Encode', 'Decode']} active={mode === 'encode' ? 'Encode' : 'Decode'} onChange={t => { setMode(t === 'Encode' ? 'encode' : 'decode'); setError(''); }} />
      <Textarea value={input} onChange={v => { setInput(v); }} placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'} />
      <button
        onClick={run}
        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
      >
        {mode === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}
      </button>
      {error ? (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
      ) : (
        <OutputCard label="Output">
          <div className="flex items-start justify-between gap-2">
            <pre className="text-sm font-mono text-gray-900 dark:text-white whitespace-pre-wrap break-all flex-1">{output}</pre>
            {output && <CopyButton text={output} />}
          </div>
        </OutputCard>
      )}
    </div>
  );
}

function URLEncodeUI() {
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
      setError('Invalid input for URL ' + (mode === 'encode' ? 'encoding' : 'decoding'));
      setOutput('');
    }
  }, [mode, input]);

  useEffect(() => { run(); }, [run]);

  return (
    <div className="space-y-4">
      <TabBar tabs={['Encode', 'Decode']} active={mode === 'encode' ? 'Encode' : 'Decode'} onChange={t => { setMode(t === 'Encode' ? 'encode' : 'decode'); setError(''); }} />
      <Textarea value={input} onChange={v => { setInput(v); }} placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'} />
      <button
        onClick={run}
        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
      >
        {mode === 'encode' ? 'Encode URL →' : '← Decode URL'}
      </button>
      {error ? (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
      ) : (
        <OutputCard label="Output">
          <div className="flex items-start justify-between gap-2">
            <pre className="text-sm font-mono text-gray-900 dark:text-white whitespace-pre-wrap break-all flex-1">{output}</pre>
            {output && <CopyButton text={output} />}
          </div>
        </OutputCard>
      )}
    </div>
  );
}

function JSONFormatterUI() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const process = useCallback(() => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(input);
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'parse error'));
      setOutput('');
    }
  }, [input, indent, mode]);

  useEffect(() => { process(); }, [process]);

  return (
    <div className="space-y-4">
      <Textarea
        value={input}
        onChange={v => setInput(v)}
        placeholder='{"name": "Toolblip", "tools": 50, "free": true}'
        className="font-mono text-sm"
      />
      <div className="flex items-center gap-4 flex-wrap">
        <TabBar tabs={['Format', 'Minify']} active={mode === 'format' ? 'Format' : 'Minify'} onChange={t => setMode(t === 'Format' ? 'format' : 'minify')} />
        {mode === 'format' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">Indent:</label>
            <select
              value={indent}
              onChange={e => setIndent(Number(e.target.value))}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            >
              {[2, 4, 8].map(n => <option key={n} value={n}>{n} spaces</option>)}
            </select>
          </div>
        )}
        <button onClick={process} className="ml-auto px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
          Process
        </button>
      </div>
      {error ? (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
      ) : (
        <OutputCard label={mode === 'format' ? 'Formatted JSON' : 'Minified JSON'}>
          <div className="flex items-start justify-between gap-2">
            <pre className="text-sm font-mono text-gray-900 dark:text-white whitespace-pre-wrap break-all flex-1">{output}</pre>
            {output && <CopyButton text={output} />}
          </div>
        </OutputCard>
      )}
    </div>
  );
}

/* ─── Router ───────────────────────────────────────────────────────── */

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
  if (!Component) return <ComingSoon toolSlug={tool.slug} />;
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <Component />
    </div>
  );
}
