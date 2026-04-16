'use client';

import { useState, useCallback, useMemo } from 'react';
import { tools } from '@/data/tools';

export default function ToolUI({ tool }: { tool: (typeof tools)[0] }) {
  switch (tool.slug) {
    case 'word-counter':
      return <WordCounter />;
    case 'character-counter':
      return <CharacterCounter />;
    case 'case-converter':
      return <CaseConverter />;
    case 'base64':
      return <Base64Codec />;
    case 'url-encode':
      return <UrlCodec />;
    case 'json-formatter':
      return <JsonFormatter />;
    default:
      return <ComingSoon />;
  }
}

function ComingSoon() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
      <span className="text-4xl mb-4 block">🚧</span>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        This tool&apos;s interactive UI is being built. Check back soon!
      </p>
    </div>
  );
}

/* ─── Word Counter ─── */
function WordCounter() {
  const [input, setInput] = useState('');
  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const sentences = (trimmed.match(/[.!?]+/g) || []).length || (trimmed ? 1 : 0);
    const paragraphs = trimmed ? trimmed.split(/\n\n+/).filter(Boolean).length : 0;
    return {
      words: words.length,
      chars: input.length,
      charsNoSpaces: input.replace(/\s/g, '').length,
      sentences,
      paragraphs,
      readTime: Math.max(1, Math.round(words.length / 200)),
    };
  }, [input]);

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No Spaces', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Read Time', value: `${stats.readTime} min` },
  ];

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 h-40 resize-none focus:outline-none focus:border-green-500 transition-colors"
        aria-label="Text input"
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
        {cards.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Character Counter ─── */
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
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste your text..."
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 h-40 resize-none focus:outline-none focus:border-green-500 transition-colors"
        aria-label="Text input"
      />
      <div className="mt-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-bold text-gray-900 dark:text-white">{len}</span> characters
        </span>
      </div>
      <div className="flex flex-wrap gap-4 mt-3">
        {limits.map(l => {
          const pct = Math.min(100, (len / l.limit) * 100);
          const over = len > l.limit;
          return (
            <div key={l.label} className="flex-1 min-w-32">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{l.label} ({l.limit})</span>
                {over && <span className="text-red-500 font-medium">Over limit</span>}
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

/* ─── Case Converter ─── */
function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const copy = useCallback(async (text: string, label: string) => {
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
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 h-32 resize-none focus:outline-none focus:border-green-500 transition-colors"
        aria-label="Text input"
      />
      <div className="space-y-2 mt-4">
        {cases.map(c => {
          const result = input ? c.fn(input) : '—';
          return (
            <div key={c.label} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-28 shrink-0">{c.label}</span>
              <span className="text-sm text-gray-900 dark:text-white font-mono truncate mx-2">{result}</span>
              <button
                onClick={() => copy(result, c.label)}
                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 shrink-0 ml-2"
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

/* ─── Base64 Encode / Decode ─── */
function Base64Codec() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    try {
      setOutput(mode === 'encode'
        ? btoa(unescape(encodeURIComponent(input)))
        : decodeURIComponent(escape(atob(input))));
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'Base64 encoding' : 'Base64 decoding') + '.');
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
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors capitalize ${mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
          >
            {m}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text to encode to Base64...' : 'Base64 string to decode...'}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 h-32 resize-none focus:outline-none focus:border-green-500 transition-colors"
        aria-label="Base64 input"
      />
      <div className="flex gap-2 mt-3">
        <button onClick={process} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </button>
        <button onClick={swap} className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors">
          ⇄ Swap
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors ml-auto">
          Clear
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {output && !error && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700">Copy</button>
          </div>
          <textarea readOnly value={output} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 h-32 resize-none font-mono text-sm" />
        </div>
      )}
    </div>
  );
}

/* ─── URL Encode / Decode ─── */
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
      setError('Error: invalid input for URL decoding.');
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
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors capitalize ${mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
          >
            {m}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 h-32 resize-none focus:outline-none focus:border-green-500 transition-colors"
        aria-label="URL input"
      />
      <div className="flex gap-2 mt-3">
        <button onClick={process} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </button>
        <button onClick={swap} className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors">
          ⇄ Swap
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors ml-auto">
          Clear
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {output && !error && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700">Copy</button>
          </div>
          <textarea readOnly value={output} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 h-32 resize-none font-mono text-sm" />
        </div>
      )}
    </div>
  );
}

/* ─── JSON Formatter ─── */
function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback((minify = false) => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
    } catch (e: unknown) {
      setError(`JSON Error: ${e instanceof Error ? e.message : String(e)}`);
      setOutput('');
    }
  }, [input, indent]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <button onClick={() => format(false)} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
          Format
        </button>
        <button onClick={() => format(true)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Minify
        </button>
        <label className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-2">
          Indent:
          <select
            value={indent}
            onChange={e => setIndent(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 text-xs"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </label>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'{\n  "name": "Toolblip",\n  "version": "1.0"\n}'}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 h-40 resize-none focus:outline-none focus:border-green-500 transition-colors font-mono text-sm"
        aria-label="JSON input"
      />
      {error && (
        <p className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded px-3 py-2">{error}</p>
      )}
      {output && !error && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Output</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-green-600 dark:text-green-400 hover:text-green-700">Copy</button>
          </div>
          <textarea readOnly value={output} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 h-40 resize-none font-mono text-sm" />
        </div>
      )}
    </div>
  );
}
