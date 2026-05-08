'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Tool } from '@/data/tools';

// ─── Shared UI primitives ─────────────────────────────────────────────────

function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y font-mono text-sm ${className}`}
    />
  );
}

function OutputArea({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all min-h-[80px]">
        {value || <span className="text-gray-400 dark:text-gray-500 italic">Output will appear here…</span>}
      </div>
    </div>
  );
}

function ActionRow({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 flex-wrap">{children}</div>;
}

function Button({
  onClick,
  variant = 'primary',
  children,
}: {
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}) {
  const base =
    'px-4 py-2 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500';
  const variants = {
    primary:
      'bg-green-600 hover:bg-green-700 text-white',
    secondary:
      'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      {label ? (
        <>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </>
      ) : (
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      )}
    </div>
  );
}

// ─── Tool-specific UIs ─────────────────────────────────────────────────────

function WordCounterUI() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<{
    words: number;
    chars: number;
    charsNoSpaces: number;
    sentences: number;
    paragraphs: number;
    readingTime: number;
  } | null>(null);

  const analyze = () => {
    if (!text.trim()) {
      setStats(null);
      return;
    }
    const words = text.trim().split(/\s+/).filter(Boolean);
    setStats({
      words: words.length,
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, '').length,
      sentences: (text.match(/[.!?]+/g) || []).length || 1,
      paragraphs: text.split(/\n\n+/).filter(t => t.trim()).length || 1,
      readingTime: Math.max(1, Math.round(words.length / 200)),
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={v => { setText(v); setStats(null); }}
        placeholder="Paste or type your text here…"
        rows={8}
      />
      <Button onClick={analyze}>Count words</Button>
      {stats ? (
        <Card>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            <Stat label="Words" value={stats.words} />
            <Stat label="Characters" value={stats.chars} />
            <Stat label="No Spaces" value={stats.charsNoSpaces} />
            <Stat label="Sentences" value={stats.sentences} />
            <Stat label="Paragraphs" value={stats.paragraphs} />
            <Stat label="Min Read" value={`${stats.readingTime}m`} />
          </div>
        </Card>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          Start typing to see stats…
        </p>
      )}
    </div>
  );
}

function CharacterCounterUI() {
  const [text, setText] = useState('');
  const [counts, setCounts] = useState<{ chars: number; charsNoSpaces: number } | null>(null);

  const limits = [
    { label: 'Twitter / X', max: 280 },
    { label: 'LinkedIn', max: 3000 },
    { label: 'Meta Description', max: 160 },
    { label: 'Reddit Title', max: 300 },
    { label: 'Reddit Body', max: 40000 },
    { label: 'SMS', max: 160 },
  ];

  const analyze = () => {
    setCounts({
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, '').length,
    });
  };

  const chars = counts?.chars ?? 0;
  const charsNoSpaces = counts?.charsNoSpaces ?? 0;

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={v => { setText(v); setCounts(null); }}
        placeholder="Type or paste your text here…"
        rows={6}
      />
      <Button onClick={analyze}>Count characters</Button>
      <Card>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Stat label="With Spaces" value={chars} />
          <Stat label="Without Spaces" value={charsNoSpaces} />
        </div>
        <Divider label="Platform Limits" />
        <div className="space-y-2">
          {limits.map(l => {
            const pct = Math.min(100, (chars / l.max) * 100);
            const over = chars > l.max;
            return (
              <div key={l.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{l.label}</span>
                  <span className={over ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                    {chars} / {l.max}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-400' : 'bg-green-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function CaseConverterUI() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convert = (style: string) => {
    if (!text) { setOutput(''); return; }
    let result = '';
    switch (style) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': result = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()); break;
      case 'camel': {
        const words = text.trim().split(/[\s_-]+/);
        result = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      }
      case 'snake': result = text.trim().toLowerCase().replace(/[\s]+/g, '_').replace(/[^\w_]/g, ''); break;
      case 'kebab': result = text.trim().toLowerCase().replace(/[\s]+/g, '-').replace(/[^\w-]/g, ''); break;
      case 'pascal': {
        const words = text.trim().split(/[\s_-]+/);
        result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      }
      case 'constant': result = text.trim().toUpperCase().replace(/[\s]+/g, '_').replace(/[^\w_]/g, ''); break;
      case 'sentence': result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
      default: result = text;
    }
    setOutput(result);
  };

  const styles = [
    { key: 'upper', label: 'UPPERCASE' },
    { key: 'lower', label: 'lowercase' },
    { key: 'title', label: 'Title Case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'pascal', label: 'PascalCase' },
    { key: 'constant', label: 'CONSTANT_CASE' },
    { key: 'sentence', label: 'Sentence case' },
  ];

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={v => { setText(v); setOutput(''); }}
        placeholder="Enter text to convert…"
        rows={5}
      />
      <ActionRow>
        {styles.map(s => (
          <Button key={s.key} onClick={() => convert(s.key)} variant="secondary">{s.label}</Button>
        ))}
      </ActionRow>
      <OutputArea value={output} label="Result" />
    </div>
  );
}

function Base64UI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.replace(/\s/g, '')))));
      }
    } catch {
      setError('Invalid Base64 string for decoding.');
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
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <Textarea
        value={input}
        onChange={v => { setInput(v); setError(''); }}
        placeholder={mode === 'encode' ? 'Enter text to encode…' : 'Enter Base64 string to decode…'}
        rows={5}
      />
      <Button onClick={process}>{mode === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}</Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <OutputArea value={output} label="Output" />
    </div>
  );
}

function URLEncodeUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid percent-encoded string for decoding.');
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
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${mode === m ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <Textarea
        value={input}
        onChange={v => { setInput(v); setError(''); }}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode…' : 'Enter percent-encoded string to decode…'}
        rows={5}
      />
      <Button onClick={process}>{mode === 'encode' ? 'Encode → URL' : 'Decode ← URL'}</Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <OutputArea value={output} label="Output" />
    </div>
  );
}

function JSONFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const minify = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const validate = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setOutput('✓ Valid JSON');
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={input}
        onChange={v => { setInput(v); setError(''); }}
        placeholder='Paste your JSON here…&#10;&#10;{"name": "Toolblip", "tools": 27}'
        rows={8}
      />
      <ActionRow>
        <Button onClick={format}>Format</Button>
        <Button onClick={minify} variant="secondary">Minify</Button>
        <Button onClick={validate} variant="secondary">Validate</Button>
      </ActionRow>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && output !== '✓ Valid JSON' && <OutputArea value={output} label="Output" />}
      {output === '✓ Valid JSON' && (
        <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          ✓ Valid JSON
        </div>
      )}
    </div>
  );
}

function ComingSoonUI({ tool }: { tool: Tool }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const preview = () => {
    setOutput(input.trim()
      ? `Preview received for ${tool.name}:\n\n${input}`
      : `The ${tool.name} interface is coming soon. Paste sample input above to reserve this space for the result.`);
  };

  return (
    <Card>
      <div className="text-center py-8 space-y-3">
        <span className="text-5xl">{tool.emoji}</span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
          This tool is coming soon! The input and output shell is ready while the full interactive UI is being built.
        </p>
      </div>
      <Divider label="Preview" />
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium uppercase tracking-wide">
        Placeholder input
      </p>
      <Textarea
        value={input}
        onChange={v => { setInput(v); setOutput(''); }}
        placeholder="Enter input to preview…"
        rows={4}
      />
      <div className="mt-4">
        <Button onClick={preview}>Process preview</Button>
      </div>
      <div className="mt-4">
        <OutputArea value={output} label="Placeholder output" />
      </div>
    </Card>
  );
}

// ─── Router ─────────────────────────────────────────────────────────────────

const TOOL_UIS: Record<string, (tool: Tool) => React.ReactNode> = {
  'word-counter': () => <WordCounterUI />,
  'character-counter': () => <CharacterCounterUI />,
  'case-converter': () => <CaseConverterUI />,
  'base64': () => <Base64UI />,
  'base64-encode': () => <Base64UI />,
  'base64-encoder-decoder': () => <Base64UI />,
  'url-encode': () => <URLEncodeUI />,
  'url-encoder': () => <URLEncodeUI />,
  'json-formatter': () => <JSONFormatterUI />,
};

export function ToolUI({ tool }: { tool: Tool }) {
  const render = TOOL_UIS[tool.slug];
  if (render) return <>{render(tool)}</>;
  return <ComingSoonUI tool={tool} />;
}
