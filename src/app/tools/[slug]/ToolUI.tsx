'use client';

import { useState, useCallback } from 'react';

// ─── Word Counter ───────────────────────────────────────────────────────────
function WordCounter() {
  const [text, setText] = useState('');
  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: (text.match(/[.!?]+/g) || []).length,
    paragraphs: text.trim() ? text.split(/\n\n+/).length : 0,
    readingTime: Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200)),
  };

  const Stat = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3 min-w-[80px]">
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={8}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No Spaces" value={stats.charsNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Min Read" value={stats.readingTime} />
      </div>
    </div>
  );
}

// ─── Character Counter ──────────────────────────────────────────────────────
function CharacterCounter() {
  const [text, setText] = useState('');

  const limits = [
    { label: 'Twitter / X', limit: 280 },
    { label: 'LinkedIn', limit: 3000 },
    { label: 'Meta Description', limit: 160 },
    { label: 'Google Title', limit: 60 },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste text here..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="space-y-2">
        {limits.map(({ label, limit }) => {
          const len = text.length;
          const pct = Math.min((len / limit) * 100, 100);
          const over = len > limit;
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 dark:text-gray-400 w-36 shrink-0">{label}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-xs font-mono w-16 text-right ${over ? 'text-red-500 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                {len}/{limit}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Total characters: <strong className="text-gray-900 dark:text-white">{text.length}</strong>
      </p>
    </div>
  );
}

// ─── Case Converter ────────────────────────────────────────────────────────
function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('camel');

  const convert = (str: string, m: string): string => {
    const s = str.trim();
    if (!s) return '';
    switch (m) {
      case 'upper': return s.toUpperCase();
      case 'lower': return s.toLowerCase();
      case 'sentence': return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      case 'title': return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
      case 'camel': return s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
      case 'pascal': return s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toUpperCase());
      case 'snake': return s.replace(/[\s-]+/g, '_').toLowerCase();
      case 'kebab': return s.replace(/[\s_]+/g, '-').toLowerCase();
      case 'constant': return s.replace(/[\s-]+/g, '_').toUpperCase();
      case 'dot': return s.replace(/[\s-]+/g, '.').toLowerCase();
      default: return s;
    }
  };

  const modes = [
    { key: 'upper', label: 'UPPERCASE' },
    { key: 'lower', label: 'lowercase' },
    { key: 'sentence', label: 'Sentence case' },
    { key: 'title', label: 'Title Case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'pascal', label: 'PascalCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'constant', label: 'CONSTANT_CASE' },
    { key: 'dot', label: 'dot.case' },
  ];

  const result = convert(text, mode);

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to convert..."
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              mode === m.key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white min-h-[60px] break-all">
          {result || <span className="text-gray-400 dark:text-gray-500">Result will appear here</span>}
        </div>
        {result && (
          <button
            onClick={copy}
            className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Base64 Encode / Decode ─────────────────────────────────────────────────
function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setResult(btoa(unescape(encodeURIComponent(input))));
      } else {
        setResult(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError('Invalid input for decoding');
      setResult('');
    }
  }, [input, mode]);

  const swap = () => {
    setInput(result);
    setResult('');
    setMode(m => m === 'encode' ? 'decode' : 'encode');
    setError('');
  };

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); setResult(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
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
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={process}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          {mode === 'encode' ? 'Encode →' : 'Decode →'}
        </button>
        <button
          onClick={swap}
          className="px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Swap input & result, flip mode"
        >
          ⇄
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {result && (
        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white min-h-[60px] break-all">
            {result}
          </div>
          <button
            onClick={copy}
            className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

// ─── URL Encode / Decode ────────────────────────────────────────────────────
function URLEncodeTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    try {
      if (mode === 'encode') {
        setResult(encodeURIComponent(input));
      } else {
        setResult(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid URL-encoded string');
      setResult('');
    }
  }, [input, mode]);

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); setResult(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text or URL to encode...' : 'Encoded URL string to decode...'}
        rows={4}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode →' : 'Decode →'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {result && (
        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white min-h-[60px] break-all">
            {result}
          </div>
          <button
            onClick={copy}
            className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter ─────────────────────────────────────────────────────────
function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState(2);

  const process = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode, indent]);

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2">
          {(['format', 'minify'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {m === 'format' ? 'Format' : 'Minify'}
            </button>
          ))}
        </div>
        {mode === 'format' && (
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Indent:</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`px-2 py-1 rounded text-xs ${indent === n ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                {n} spaces
              </button>
            ))}
          </div>
        )}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"example": "paste JSON here"}'
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
      />
      <button
        onClick={process}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
      >
        {mode === 'format' ? 'Format JSON' : 'Minify JSON'}
      </button>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {output && (
        <div className="relative">
          <pre className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white overflow-x-auto max-h-80 overflow-y-auto">
            {output}
          </pre>
          <button
            onClick={copy}
            className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Coming Soon ────────────────────────────────────────────────────────────
function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">🚧</span>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Coming Soon
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        This tool is still being built. Check back soon — it will be ready before you know it.
      </p>
      <div className="mt-6 w-full max-w-sm">
        <textarea
          placeholder="While you wait, paste something here..."
          rows={4}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none font-mono text-sm"
        />
        <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400 dark:text-gray-500 italic">
          Output will appear here when the tool is ready.
        </div>
      </div>
    </div>
  );
}

// ─── Tool Registry ──────────────────────────────────────────────────────────
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'word-counter': WordCounter,
  'character-counter': CharacterCounter,
  'case-converter': CaseConverter,
  'base64': Base64Tool,
  'url-encode': URLEncodeTool,
  'json-formatter': JSONFormatter,
};

export default function ToolUI({ slug }: { slug: string }) {
  const Component = TOOL_COMPONENTS[slug];
  if (!Component) return <ComingSoon />;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <Component />
    </div>
  );
}
