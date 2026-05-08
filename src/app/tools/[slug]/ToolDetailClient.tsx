'use client';

import { useMemo, useState } from 'react';
import type { Tool } from '../../../data/tools';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      rows={8}
      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
    />
  );
}

function OutputArea({ value, placeholder = 'Output will appear here…' }: { value: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Output</p>
        <CopyButton value={value} />
      </div>
      <pre className="min-h-40 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white">
        {value || <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>}
      </pre>
    </div>
  );
}

function ProcessButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
    >
      {children}
    </button>
  );
}

function WordCounterUI() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    return [
      ['Words', words],
      ['Characters', text.length],
      ['Characters without spaces', text.replace(/\s/g, '').length],
      ['Sentences', (text.match(/[.!?]+/g) ?? []).length],
      ['Paragraphs', trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0],
      ['Reading time', `${Math.max(1, Math.ceil(words / 200))} min`],
    ];
  }, [text]);

  return (
    <div className="space-y-5">
      <TextArea value={text} onChange={setText} placeholder="Paste or type text to count words…" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{value}</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterUI() {
  const [text, setText] = useState('');
  const limits = [
    ['X / Twitter', 280],
    ['Meta description', 160],
    ['Google title', 60],
    ['LinkedIn post', 3000],
  ] as const;

  return (
    <div className="space-y-5">
      <TextArea value={text} onChange={setText} placeholder="Paste or type text to count characters…" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-950">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{text.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Characters with spaces</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-950">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{text.replace(/\s/g, '').length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Characters without spaces</div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {limits.map(([label, max]) => {
          const percent = Math.min(100, (text.length / max) * 100);
          const over = text.length > max;
          return (
            <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className={over ? 'font-semibold text-red-600' : 'text-gray-700 dark:text-gray-200'}>{text.length}/{max}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className={over ? 'h-full bg-red-600' : 'h-full bg-red-500'} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function words(input: string) {
  return input.trim().split(/[^A-Za-z0-9]+/).filter(Boolean);
}

function CaseConverterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function convert(mode: string) {
    const parts = words(input);
    const lower = parts.map(part => part.toLowerCase());
    const title = lower.map(part => part.charAt(0).toUpperCase() + part.slice(1));

    const result: Record<string, string> = {
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      title: title.join(' '),
      camel: lower.map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))).join(''),
      snake: lower.join('_'),
      kebab: lower.join('-'),
      pascal: title.join(''),
      constant: lower.join('_').toUpperCase(),
    };

    setOutput(result[mode] ?? input);
  }

  const options = [
    ['upper', 'UPPERCASE'],
    ['lower', 'lowercase'],
    ['title', 'Title Case'],
    ['camel', 'camelCase'],
    ['snake', 'snake_case'],
    ['kebab', 'kebab-case'],
    ['pascal', 'PascalCase'],
    ['constant', 'CONSTANT_CASE'],
  ];

  return (
    <div className="space-y-5">
      <TextArea value={input} onChange={setInput} placeholder="Enter text to convert between case styles…" />
      <div className="flex flex-wrap gap-2">
        {options.map(([mode, label]) => (
          <button key={mode} type="button" onClick={() => convert(mode)} className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            {label}
          </button>
        ))}
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function Base64UI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');

  function process() {
    try {
      setOutput(mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setOutput('Invalid Base64 input.');
    }
  }

  return <EncodeDecodeUI input={input} setInput={setInput} mode={mode} setMode={setMode} output={output} process={process} label="Base64" />;
}

function UrlEncodeUI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');

  function process() {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch {
      setOutput('Invalid URL encoded input.');
    }
  }

  return <EncodeDecodeUI input={input} setInput={setInput} mode={mode} setMode={setMode} output={output} process={process} label="URL" />;
}

function EncodeDecodeUI({
  input,
  setInput,
  mode,
  setMode,
  output,
  process,
  label,
}: {
  input: string;
  setInput: (value: string) => void;
  mode: 'encode' | 'decode';
  setMode: (mode: 'encode' | 'decode') => void;
  output: string;
  process: () => void;
  label: string;
}) {
  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(option => (
          <button key={option} type="button" onClick={() => setMode(option)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${mode === option ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}>
            {option === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <TextArea value={input} onChange={setInput} placeholder={`Enter ${label} text to ${mode}…`} />
      <ProcessButton onClick={process}>Process</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);

  function process(mode: 'format' | 'minify' | 'validate') {
    try {
      const parsed = JSON.parse(input);
      if (mode === 'validate') {
        setOutput('Valid JSON');
        return;
      }
      setOutput(JSON.stringify(parsed, null, mode === 'format' ? indent : 0));
    } catch (error) {
      setOutput(`Invalid JSON: ${(error as Error).message}`);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span>Indent:</span>
        {[2, 4].map(value => (
          <button key={value} type="button" onClick={() => setIndent(value)} className={`rounded-lg px-3 py-1.5 font-medium ${indent === value ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}>
            {value} spaces
          </button>
        ))}
      </div>
      <TextArea value={input} onChange={setInput} placeholder='Paste JSON here, e.g. {"hello":"world"}' />
      <div className="flex flex-wrap gap-2">
        <ProcessButton onClick={() => process('format')}>Format</ProcessButton>
        <button type="button" onClick={() => process('minify')} className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">Minify</button>
        <button type="button" onClick={() => process('validate')} className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">Validate</button>
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function ComingSoonUI({ tool }: { tool: Tool }) {
  const [input, setInput] = useState('');
  const preview = input ? `Preview input for ${tool.name}:\n\n${input}` : '';

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-3 text-4xl">🚧</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Coming soon</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          This tool UI is being built. You can still preview the input/output layout below.
        </p>
      </div>
      <TextArea value={input} onChange={setInput} placeholder={`Enter input for ${tool.name}…`} />
      <OutputArea value={preview} placeholder="Placeholder output will appear here…" />
    </div>
  );
}

function ToolUI({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'word-counter':
      return <WordCounterUI />;
    case 'character-counter':
      return <CharacterCounterUI />;
    case 'case-converter':
      return <CaseConverterUI />;
    case 'base64':
    case 'base64-encode':
    case 'base64-encoder-decoder':
      return <Base64UI />;
    case 'url-encode':
    case 'url-encoder':
      return <UrlEncodeUI />;
    case 'json-formatter':
      return <JsonFormatterUI />;
    default:
      return <ComingSoonUI tool={tool} />;
  }
}

export default function ToolDetailClient({ tool }: { tool: Tool }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <a href="/" className="hover:text-red-600 dark:hover:text-red-400">Home</a>
        <span className="mx-2">/</span>
        <a href="/tools" className="hover:text-red-600 dark:hover:text-red-400">Tools</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-4 flex items-start gap-4">
          <span className="text-5xl" aria-hidden="true">{tool.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{tool.name}</h1>
            <span className="mt-3 inline-flex rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">{tool.description}</p>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <ToolUI tool={tool} />
      </section>

      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        Runs in your browser — no upload required.
      </p>
    </main>
  );
}
