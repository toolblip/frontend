'use client';

import React, { useState, useCallback } from 'react';
import { tools } from '@/data/tools';

// ─── Word Counter ───────────────────────────────────────────────────────────
function WordCounterUI() {
  const [text, setText] = useState('');
  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    readingTime: Math.ceil(text.trim() ? text.trim().split(/\s+/).length / 200 : 0),
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
          { label: 'Read Time', value: `${stats.readingTime} min` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Character Counter ────────────────────────────────────────────────────
function CharacterCounterUI() {
  const [text, setText] = useState('');
  const len = text.length;

  const limits = [
    { name: 'Twitter / X', limit: 280, color: 'border-black' },
    { name: 'LinkedIn', limit: 3000, color: 'border-blue-600' },
    { name: 'Meta Description', limit: 160, color: 'border-green-600' },
    { name: 'Google Title', limit: 60, color: 'border-orange-500' },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-center">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{len}</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">characters</span>
      </div>
      <div className="space-y-2">
        {limits.map(({ name, limit, color }) => {
          const pct = Math.min((len / limit) * 100, 100);
          const over = len > limit;
          return (
            <div key={name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-300">{name}</span>
                <span className={over ? 'text-red-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}>
                  {len} / {limit}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-orange-400' : 'bg-green-500'}`}
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

// ─── Case Converter ────────────────────────────────────────────────────────
function CaseConverterUI() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const convert = useCallback((style: string) => {
    if (!text) { setResult(''); return; }
    let out = '';
    switch (style) {
      case 'upper': out = text.toUpperCase(); break;
      case 'lower': out = text.toLowerCase(); break;
      case 'title': out = text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()); break;
      case 'sentence': out = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
      case 'camel': {
        const s = text.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/);
        out = s[0].toLowerCase() + s.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      }
      case 'snake': out = text.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/).join('_').toLowerCase(); break;
      case 'kebab': out = text.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/).join('-').toLowerCase(); break;
      case 'constant': out = text.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/).join('_').toUpperCase(); break;
      case 'swap': out = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
      default: out = text;
    }
    setResult(out);
  }, [text]);

  const cases = [
    { label: 'UPPERCASE', key: 'upper' },
    { label: 'lowercase', key: 'lower' },
    { label: 'Title Case', key: 'title' },
    { label: 'Sentence case', key: 'sentence' },
    { label: 'camelCase', key: 'camel' },
    { label: 'snake_case', key: 'snake' },
    { label: 'kebab-case', key: 'kebab' },
    { label: 'CONSTANT_CASE', key: 'constant' },
    { label: 'sWAP cASE', key: 'swap' },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <div className="flex flex-wrap gap-2">
        {cases.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => convert(key)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-200 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Result</span>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-gray-900 dark:text-white text-sm break-all whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Base64 Encode / Decode ────────────────────────────────────────────────
function Base64UI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

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
            {m === 'encode' ? 'Encode ↑' : 'Decode ↓'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-3 font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-gray-900 dark:text-white text-sm break-all whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── URL Encode / Decode ──────────────────────────────────────────────────
function UrlEncodeUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

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
            {m === 'encode' ? 'Encode ↑' : 'Decode ↓'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text or URL to encode...' : 'Encoded URL to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-3 font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-gray-900 dark:text-white text-sm break-all whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter ────────────────────────────────────────────────────────
function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
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
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-y font-mono text-sm"
      />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">Indent:</label>
          <select
            value={indent}
            onChange={e => setIndent(Number(e.target.value))}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-green-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
          </select>
        </div>
        <button onClick={format} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2 font-medium transition-colors text-sm">
          Format
        </button>
        <button onClick={minify} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl px-4 py-2 font-medium transition-colors text-sm">
          Minify
        </button>
      </div>
      {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Output</span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-gray-900 dark:text-white text-sm overflow-x-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Coming Soon ───────────────────────────────────────────────────────────
function ComingSoonUI({ toolName }: { toolName: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The <strong>{toolName}</strong> tool is on our roadmap and will be available soon.
        </p>
        <div className="max-w-sm mx-auto">
          <textarea
            placeholder="Placeholder input (coming soon)..."
            disabled
            rows={4}
            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-xl px-4 py-3 resize-none cursor-not-allowed opacity-60"
          />
          <div className="mt-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
            Output will appear here...
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Router ────────────────────────────────────────────────────────────────
const toolMap: Record<string, () => React.ReactNode> = {
  'word-counter': () => <WordCounterUI />,
  'character-counter': () => <CharacterCounterUI />,
  'case-converter': () => <CaseConverterUI />,
  'base64': () => <Base64UI />,
  'url-encode': () => <UrlEncodeUI />,
  'json-formatter': () => <JsonFormatterUI />,
};

export default function ToolUI({ slug }: { slug: string }) {
  const Component = toolMap[slug];
  if (Component) return Component();

  const tool = tools.find(t => t.slug === slug);
  return <ComingSoonUI toolName={tool?.name ?? slug} />;
}
