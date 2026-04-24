'use client';

import { useState, useCallback } from 'react';
import type { Tool } from '@/data/tools';

// ─── Shared Layout ───────────────────────────────────────────────────────────

function ToolLayout({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
        </div>
        <span className="inline-block text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full mb-3">
          {tool.category}
        </span>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          {tool.description}
        </p>
      </div>
    </div>
  );
}

// ─── Coming Soon Fallback ────────────────────────────────────────────────────

function ComingSoonUI({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <ToolLayout tool={tool} />
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center mt-4">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Coming Soon
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          This tool is on our roadmap and will be available shortly.
        </p>
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
            Preview
          </label>
          <textarea
            readOnly
            placeholder="Enter text here to see a preview..."
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 resize-none h-32"
          />
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Word Counter ───────────────────────────────────────────────────────────

function WordCounterUI() {
  const [input, setInput] = useState('');

  const stats = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: '' };
    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const sentences = (trimmed.match(/[.!?]+/g) || []).length || (trimmed ? 1 : 0);
    const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [input]);

  const s = stats();

  const statCards = [
    { label: 'Words', value: s.words },
    { label: 'Characters', value: s.chars },
    { label: 'No Spaces', value: s.charsNoSpaces },
    { label: 'Sentences', value: s.sentences },
    { label: 'Paragraphs', value: s.paragraphs },
    { label: 'Read Time', value: s.readingTime },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ToolLayout tool={{ name: 'Word Counter', slug: 'word-counter', description: 'Free online word counter. Count words, characters, sentences, paragraphs, and estimate reading time instantly.', emoji: '📝', category: 'Text' }} />
      <div className="max-w-xl mx-auto mt-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-red-500 transition-colors min-h-[180px] font-mono text-sm"
          autoFocus
        />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
          {statCards.map(card => (
            <div key={card.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-3 text-center">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">{card.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setInput('')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(input)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Copy Text
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Character Counter ───────────────────────────────────────────────────────

function CharacterCounterUI() {
  const [input, setInput] = useState('');

  const limits = [
    { label: 'Tweet', max: 280 },
    { label: 'LinkedIn', max: 3000 },
    { label: 'Meta Desc', max: 160 },
    { label: 'SMS', max: 160 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ToolLayout tool={{ name: 'Character Counter', slug: 'character-counter', description: 'Free online character counter with Twitter (280), LinkedIn (3000), and meta description (160) limit indicators.', emoji: '🔢', category: 'Text' }} />
      <div className="max-w-xl mx-auto mt-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-red-500 transition-colors min-h-[180px] font-mono text-sm"
          autoFocus
        />
        <div className="mt-4 space-y-2">
          {limits.map(({ label, max }) => {
            const len = input.length;
            const pct = Math.min(100, (len / max) * 100);
            const over = len > max;
            return (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">{label} ({max})</span>
                  <span className={over ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-300'}>{len}/{max}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-400' : 'bg-red-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            <strong className="text-red-600 dark:text-red-400">{input.length}</strong> characters total
            &nbsp;&bull;&nbsp;
            <strong>{input.replace(/\s/g, '').length}</strong> without spaces
          </span>
          <button
            onClick={() => setInput('')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Case Converter ────────────────────────────────────────────────────────

function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (type: string) => {
    if (!input) { setOutput(''); return; }
    let result = '';
    switch (type) {
      case 'upper': result = input.toUpperCase(); break;
      case 'lower': result = input.toLowerCase(); break;
      case 'title': result = input.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()); break;
      case 'camel': result = input.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toLowerCase()); break;
      case 'snake': result = input.replace(/[\s-]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(); break;
      case 'kebab': result = input.replace(/[\s_]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); break;
      case 'pascal': result = input.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, s => s.toUpperCase()); break;
      default: result = input;
    }
    setOutput(result);
  };

  const cases = [
    { label: 'UPPERCASE', type: 'upper' },
    { label: 'lowercase', type: 'lower' },
    { label: 'Title Case', type: 'title' },
    { label: 'camelCase', type: 'camel' },
    { label: 'snake_case', type: 'snake' },
    { label: 'kebab-case', type: 'kebab' },
    { label: 'PascalCase', type: 'pascal' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ToolLayout tool={{ name: 'Case Converter', slug: 'case-converter', description: 'Free online case converter. Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase instantly.', emoji: '✏️', category: 'Text' }} />
      <div className="max-w-xl mx-auto mt-4 space-y-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter text to convert..."
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-red-500 transition-colors min-h-[120px] font-mono text-sm"
          autoFocus
        />
        <div className="flex flex-wrap gap-2">
          {cases.map(c => (
            <button
              key={c.type}
              onClick={() => convert(c.type)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-mono hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700"
            >
              {c.label}
            </button>
          ))}
        </div>
        {output && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Result</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Copy
              </button>
            </div>
            <pre className="text-gray-900 dark:text-white font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Base64 Encode / Decode ─────────────────────────────────────────────────

function Base64UI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '. Please check your text.');
      setOutput('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ToolLayout tool={{ name: 'Base64 Encode / Decode', slug: 'base64', description: 'Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 strings instantly.', emoji: '🔐', category: 'Encoder' }} />
      <div className="max-w-xl mx-auto mt-4 space-y-4">
        <div className="flex gap-2 mb-2">
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(''); setError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-red-600 text-white'
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
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-red-500 transition-colors min-h-[120px] font-mono text-sm"
          autoFocus
        />
        <button
          onClick={process}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </button>
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {output && !error && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Output</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Copy
              </button>
            </div>
            <pre className="text-gray-900 dark:text-white font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── URL Encode / Decode ─────────────────────────────────────────────────────

function URLEncodeUI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input) { setOutput(''); return; }
    if (mode === 'encode') {
      setOutput(encodeURIComponent(input));
    } else {
      try {
        setOutput(decodeURIComponent(input));
      } catch {
        setOutput('Error: Invalid URL-encoded string');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ToolLayout tool={{ name: 'URL Encode / Decode', slug: 'url-encode', description: 'Encode and decode URLs or URL components for safe use in links.', emoji: '🔗', category: 'Encoder' }} />
      <div className="max-w-xl mx-auto mt-4 space-y-4">
        <div className="flex gap-2 mb-2">
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-red-600 text-white'
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
          placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-red-500 transition-colors min-h-[120px] font-mono text-sm"
          autoFocus
        />
        <button
          onClick={process}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>
        {output && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Output</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Copy
              </button>
            </div>
            <pre className="text-gray-900 dark:text-white font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JSON Formatter ──────────────────────────────────────────────────────────

function JSONFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [tabSize, setTabSize] = useState(2);

  const format = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(input.trim());
      setOutput(JSON.stringify(parsed, null, tabSize));
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'Parse error'));
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input.trim());
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'Parse error'));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ToolLayout tool={{ name: 'JSON Formatter', slug: 'json-formatter', description: 'Free online JSON formatter, validator, and minifier. Pretty-print JSON with syntax highlighting, instantly find errors, and minify for production.', emoji: '📋', category: 'Developer' }} />
      <div className="max-w-xl mx-auto mt-4 space-y-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='{"key": "value", "number": 42}'
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:border-red-500 transition-colors min-h-[140px] font-mono text-sm"
          autoFocus
        />
        <div className="flex items-center gap-3">
          <button
            onClick={format}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Format / Validate
          </button>
          <button
            onClick={minify}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Minify
          </button>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-gray-500 dark:text-gray-400">Indent:</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setTabSize(n)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  tabSize === n
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-300 font-mono">
            {error}
          </div>
        )}
        {output && !error && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Formatted JSON</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 text-gray-800 dark:text-gray-200 font-mono text-xs overflow-x-auto max-h-80">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Router ─────────────────────────────────────────────────────────────────

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'word-counter': WordCounterUI,
  'character-counter': CharacterCounterUI,
  'case-converter': CaseConverterUI,
  'base64': Base64UI,
  'url-encode': URLEncodeUI,
  'json-formatter': JSONFormatterUI,
};

export default function ToolClient({ tool }: { tool: Tool }) {
  const Component = TOOL_COMPONENTS[tool.slug];
  if (!Component) return <ComingSoonUI tool={tool} />;
  return <Component />;
}
