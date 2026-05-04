'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';
import { marked } from 'marked';
import Base64EncoderDecoderClient from '@/components/tools/Base64EncoderDecoderClient';
import CircleCropClient from '@/components/tools/CircleCropClient';
import ColorPickerClient from '@/components/tools/ColorPickerClient';
import ContrastCheckerClient from '@/components/tools/ContrastCheckerClient';
import CreditCardValidatorClient from '@/components/tools/CreditCardValidatorClient';
import CronGeneratorClient from '@/components/tools/CronGeneratorClient';
import CronParserClient from '@/components/tools/CronParserClient';
import CssBorderRadiusGeneratorClient from '@/components/tools/CssBorderRadiusGeneratorClient';
import CssGradientGeneratorClient from '@/components/tools/CssGradientGeneratorClient';
import FaviconGeneratorClient from '@/components/tools/FaviconGeneratorClient';
import GrammarCheckerClient from '@/components/tools/GrammarCheckerClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import HexToRgbClient from '@/components/tools/HexToRgbClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import JsonToYamlClient from '@/components/tools/JsonToYamlClient';
import JsonValidatorClient from '@/components/tools/JsonValidatorClient';
import JwtDecoderClient from '@/components/tools/JwtDecoderClient';
import LoremIpsumGeneratorClient from '@/components/tools/LoremIpsumGeneratorClient';
import MarkdownToHtmlClient from '@/components/tools/MarkdownToHtmlClient';
import MetaTagGeneratorClient from '@/components/tools/MetaTagGeneratorClient';
import NumberBaseConverterClient from '@/components/tools/NumberBaseConverterClient';
import PasswordGeneratorClient from '@/components/tools/PasswordGeneratorClient';
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import PercentageDifferenceClient from '@/components/tools/PercentageDifferenceClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';
import RandomStringClient from '@/components/tools/RandomStringClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import RgbToHexClient from '@/components/tools/RgbToHexClient';
import ScreenResolutionTesterClient from '@/components/tools/ScreenResolutionTesterClient';
import SerpPreviewClient from '@/components/tools/SerpPreviewClient';
import Sha256HashClient from '@/components/tools/Sha256HashClient';
import SqlToJsonClient from '@/components/tools/SqlToJsonClient';
import SquareCropClient from '@/components/tools/SquareCropClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import TextDiffClient from '@/components/tools/TextDiffClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';
import UnixTimestampConverterClient from '@/components/tools/UnixTimestampConverterClient';
import UrlParamsClient from '@/components/tools/UrlParamsClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import XmlFormatterClient from '@/components/tools/XmlFormatterClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';

// ─── Shared UI primitives ────────────────────────────────────────────────

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
      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  className = '',
}: {
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
      className={`w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm ${className}`}
    />
  );
}

function OutputArea({ value }: { value: string }) {
  return (
    <div className="relative">
      <pre className="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm overflow-auto">
        {value || <span className="text-gray-400">Output will appear here…</span>}
      </pre>
      {value && <CopyButton text={value} />}
    </div>
  );
}

function ProcessButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Individual Tool UIs ──────────────────────────────────────────────────

function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: (text.match(/[.!?]+/g) || []).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    readingTime: Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200)),
  };

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: `${stats.readingTime} min` },
  ];

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Paste or type your text here…" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterCounterTool() {
  const [text, setText] = useState('');
  const limits = [
    { label: 'Twitter / X', max: 280 },
    { label: 'LinkedIn', max: 3000 },
    { label: 'Meta Description', max: 160 },
    { label: 'Google Title', max: 60 },
  ];

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Type or paste your text here…" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {limits.map(l => {
          const pct = Math.min(100, (text.length / l.max) * 100);
          const over = text.length > l.max;
          return (
            <div key={l.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{l.label}</span>
                <span className={`text-xs font-medium ${over ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                  {text.length}/{l.max}
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : pct > 80 ? 'bg-yellow-400' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{text.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">With spaces</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{text.replace(/\s/g, '').length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Without spaces</div>
        </div>
      </div>
    </div>
  );
}

function CaseConverterTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convert = (style: string) => {
    if (!text) { setOutput(''); return; }
    switch (style) {
      case 'upper': setOutput(text.toUpperCase()); break;
      case 'lower': setOutput(text.toLowerCase()); break;
      case 'title': setOutput(text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())); break;
      case 'camel': {
        const w = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
        setOutput(w.charAt(0).toLowerCase() + w.slice(1));
        break;
      }
      case 'snake': setOutput(text.toLowerCase().replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()); break;
      case 'kebab': setOutput(text.toLowerCase().replace(/\s+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()); break;
      case 'pascal': setOutput(text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).replace(/\s/g, '')); break;
      case 'constant': setOutput(text.toUpperCase().replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2')); break;
    }
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
  ];

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={setText} placeholder="Enter text to convert…" />
      <div className="flex flex-wrap gap-2">
        {styles.map(s => (
          <button key={s.key} onClick={() => convert(s.key)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
            {s.label}
          </button>
        ))}
      </div>
      <OutputArea value={output} />
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))));
      else {
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setOutput(decoded);
      }
    } catch {
      setError('Invalid input for the selected mode.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder={mode === 'encode' ? 'Enter text to Base64 encode…' : 'Enter Base64 string to decode…'} />
      <ProcessButton onClick={run}>Convert</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function UrlEncodeTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'encode') setOutput(encodeURIComponent(input));
      else setOutput(decodeURIComponent(input));
    } catch {
      setError('Invalid input for URL decoding.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder={mode === 'encode' ? 'Enter URL or text to encode…' : 'Enter encoded URL to decode…'} />
      <ProcessButton onClick={run}>Convert</ProcessButton>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <OutputArea value={output} />
    </div>
  );
}

function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const process = (minify = false) => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`JSON Error: ${(e as Error).message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-300">Indent:</span>
        {[2, 4].map(n => (
          <button key={n} onClick={() => setIndent(n)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${indent === n ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>
            {n} spaces
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder='Paste JSON here… {"key": "value"}' className="h-32" />
      <div className="flex gap-2">
        <ProcessButton onClick={() => process(false)}>Format</ProcessButton>
        <button onClick={() => process(true)} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
          Minify
        </button>
        <button onClick={() => { try { JSON.parse(input); setOutput(''); setError(''); } catch (e) { setError(`Invalid JSON: ${(e as Error).message}`); } }}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors">
          Validate
        </button>
      </div>
      {error ? <p className="text-red-500 text-sm">{error}</p> : <OutputArea value={output} />}
    </div>
  );
}

// ─── Tool routers ──────────────────────────────────────────────────────────

function NotImplementedTool({ toolName }: { toolName: string }) {
  const [input, setInput] = useState('');
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
          The <strong>{toolName}</strong> tool is being built. Paste some input below to preview the interface when it launches.
        </p>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Input area (active when this tool launches)…"
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      <pre className="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm overflow-auto">
        {'' || <span className="text-gray-400">Output will appear here…</span>}
      </pre>
    </div>
  );
}

function NotebookToHtmlTool() {
  const SAMPLE_NB = {
    nbformat: 4,
    metadata: { kernelspec: { display_name: 'Python 3', language: 'python' } },
    cells: [
      { cell_type: 'markdown', source: '# Welcome to Jupyter\n\nThis is a **markdown** cell with _formatting_.', },
      { cell_type: 'code', execution_count: 1, source: "print('Hello, Jupyter!')", outputs: [{ output_type: 'stream', name: 'stdout', text: 'Hello, Jupyter!\n' }], },
      { cell_type: 'markdown', source: '## Code cells also support multiple lines', },
      { cell_type: 'code', execution_count: 2, source: 'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\n[fib(i) for i in range(8)]', outputs: [{ output_type: 'execute_result', execution_count: 2, data: { 'text/plain': '[0, 1, 1, 2, 3, 5, 8, 13]' } }], },
    ],
  };
  const [input, setInput] = useState(JSON.stringify(SAMPLE_NB, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      const nb = JSON.parse(input);
      if (!Array.isArray(nb.cells)) { setError('Invalid notebook: missing cells array'); return; }
      setError(null);
      // Render cells to HTML string for preview
      const rendered = nb.cells.map((cell: { cell_type: string; source: string | string[] }) => {
        const src = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        if (cell.cell_type === 'markdown') {
          try { return `<div class="nb-cell nb-md">${marked.parse(src)}</div>`; }
          catch { return `<div class="nb-cell nb-md"><p>${src}</p></div>`; }
        }
        if (cell.cell_type === 'code') {
          return `<div class="nb-cell nb-code"><pre><code>${src.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre></div>`;
        }
        return '';
      }).join('\n');
      setOutput(rendered);
    } catch(e) { setError('Invalid JSON: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Paste Jupyter notebook JSON here…'
        className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={process} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
        Render Notebook
      </button>
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Preview</span>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500); }}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
              {copied ? '✓ Copied' : 'Copy HTML'}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 overflow-auto max-h-96 prose dark:prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      )}
    </div>
  );
}

function OxfordCommaTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sep, setSep] = useState<'comma' | 'newline'>('comma');

  const process = () => {
    const items = input.split(sep === 'comma' ? /,\s*/ : /\n/).map(s => s.trim()).filter(Boolean);
    if (items.length === 0) { setOutput(''); return; }
    if (items.length === 1) setOutput(items[0]);
    else if (items.length === 2) setOutput(`${items[0]} and ${items[1]}`);
    else setOutput(items.slice(0,-1).join(', ') + ', and ' + items[items.length-1]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['comma', 'newline'] as const).map(s => (
          <button key={s} onClick={() => setSep(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${sep === s ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {s === 'comma' ? 'Comma-separated' : 'One per line'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={sep === 'comma' ? 'Alice, Bob, Carol, Diana…' : 'Alice\nBob\nCarol\nDiana'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      <button onClick={process} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
        Apply Oxford Comma
      </button>
      {output && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Result</label>
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
              Copy
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white">{output}</div>
        </div>
      )}
    </div>
  );
}

function SassToCssTool() {
  const [input, setInput] = useState('$primary: #333;\nbody { color: $primary; }');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = async () => {
    setError('');
    try {
      const { compileString } = await import('sass');
      const result = compileString(input);
      setOutput(result.css);
    } catch(e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter SCSS or SASS here…"
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-y font-mono text-sm"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={process} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
        Compile to CSS
      </button>
      {output && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">CSS Output</label>
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors">
              Copy
            </button>
          </div>
          <pre className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white overflow-auto max-h-64">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Text Transformation Tools ─────────────────────────────────────────────

function TextToSlugTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const slug = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')        // remove special characters
      .replace(/[\s_-]+/g, '-')         // spaces/underscores to hyphens
      .replace(/^-+|-+$/g, '');        // trim leading/trailing hyphens
    setOutput(slug);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter text to convert to a URL-friendly slug…" />
      <ProcessButton onClick={convert}>Convert to Slug</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SlugToTextTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const text = input
      .replace(/-/g, ' ')              // hyphens to spaces
      .replace(/_/g, ' ')              // underscores to spaces
      .replace(/\s+/g, ' ')            // collapse multiple spaces
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    setOutput(text);
  };

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={setInput} placeholder="Enter a slug to convert to readable text…" />
      <ProcessButton onClick={convert}>Convert to Text</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function SortLinesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [numeric, setNumeric] = useState(false);

  const process = () => {
    const lines = input.split('\n').filter(Boolean);
    const sorted = [...lines].sort((a, b) => {
      if (numeric) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        return order === 'asc' ? numA - numB : numB - numA;
      }
      return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });
    setOutput(sorted.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Order:</span>
          {(['asc', 'desc'] as const).map(o => (
            <button key={o} onClick={() => setOrder(o)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${order === o ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {o === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="numericSort"
            checked={numeric}
            onChange={e => setNumeric(e.target.checked)}
            className="w-4 h-4 accent-red-600"
          />
          <label htmlFor="numericSort" className="text-sm text-gray-600 dark:text-gray-300">Numeric sort</label>
        </div>
      </div>
      <Textarea value={input} onChange={setInput} placeholder="Enter lines to sort…" />
      <ProcessButton onClick={process}>Sort Lines</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function ReverseLinesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'reverse' | 'flip'>('reverse');

  const process = () => {
    const lines = input.split('\n');
    if (mode === 'reverse') {
      setOutput([...lines].reverse().join('\n'));
    } else {
      setOutput(lines.map(line => line.split('').reverse().join('')).join('\n'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['reverse', 'flip'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m === 'reverse' ? 'Reverse Order' : 'Flip Characters'}
          </button>
        ))}
      </div>
      <Textarea value={input} onChange={setInput} placeholder={mode === 'reverse' ? 'Enter lines to reverse their order…' : 'Enter lines to flip characters in each line…'} />
      <ProcessButton onClick={process}>Reverse</ProcessButton>
      <OutputArea value={output} />
    </div>
  );
}

function ToolRouter({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'word-counter':          return <WordCounterTool />;
    case 'character-counter':     return <CharacterCounterTool />;
    case 'case-converter':        return <CaseConverterTool />;
    case 'base64':                return <Base64Tool />;
    case 'url-encode':            return <UrlEncodeTool />;
    case 'json-formatter':        return <JsonFormatterTool />;
    case 'notebook-to-html':      return <NotebookToHtmlTool />;
    case 'oxford-comma':          return <OxfordCommaTool />;
    case 'sass-to-css':           return <SassToCssTool />;
    case 'text-to-slug':          return <TextToSlugTool />;
    case 'slug-to-text':          return <SlugToTextTool />;
    case 'sort-lines':            return <SortLinesTool />;
    case 'reverse-lines':         return <ReverseLinesTool />;
    case 'cron-parser':            return <CronParserClient />;
    case 'cron-generator':         return <CronGeneratorClient />;
    case 'html-encoder':           return <HtmlEncoderClient />;
    case 'json-validator':         return <JsonValidatorClient />;
    case 'jwt-decoder':            return <JwtDecoderClient />;
    case 'text-sorter':            return <TextSorterClient />;
    case 'text-diff':             return <TextDiffClient />;
    case 'remove-duplicate-lines': return <RemoveDuplicateLinesClient />;
    case 'hex-to-rgb':             return <HexToRgbClient />;
    case 'rgb-to-hex':             return <RgbToHexClient />;
    case 'sha-256-hash':          return <Sha256HashClient />;
    case 'hash-generator':         return <HashGeneratorClient />;
    case 'xml-formatter':          return <XmlFormatterClient />;
    case 'xml-to-json':            return <XmlToJsonClient />;
    case 'json-to-yaml':           return <JsonToYamlClient />;
    case 'sql-to-json':            return <SqlToJsonClient />;
    case 'yaml-to-json':           return <YamlToJsonClient />;
    case 'url-slug-generator':     return <UrlSlugGeneratorClient />;
    case 'uuid-generator':         return <UuidGeneratorClient />;
    case 'password-generator':     return <PasswordGeneratorClient />;
    case 'lorem-ipsum-generator':  return <LoremIpsumGeneratorClient />;
    case 'random-string-generator': return <RandomStringClient />;
    case 'regex-tester':          return <RegexTesterClient />;
    case 'grammar-checker':        return <GrammarCheckerClient />;
    case 'unit-converter':         return <UnitConverterClient />;
    case 'number-base-converter':  return <NumberBaseConverterClient />;
    case 'unix-timestamp-converter': return <UnixTimestampConverterClient />;
    case 'image-cropper':          return <ImageCropperClient />;
    case 'image-resizer':          return <ImageResizerClient />;
    case 'image-format-converter':  return <ImageFormatConverterClient />;
    case 'color-picker':           return <ColorPickerClient />;
    case 'contrast-checker':        return <ContrastCheckerClient />;
    case 'credit-card-validator':  return <CreditCardValidatorClient />;
    case 'favicon-generator':       return <FaviconGeneratorClient />;
    case 'css-gradient-generator':  return <CssGradientGeneratorClient />;
    case 'css-border-radius-generator': return <CssBorderRadiusGeneratorClient />;
    case 'js-minifier':            return <JsMinifierClient />;
    case 'http-headers-viewer':     return <HttpHeadersViewerClient />;
    case 'markdown-to-html':        return <MarkdownToHtmlClient />;
    case 'meta-tag-generator':      return <MetaTagGeneratorClient />;
    case 'percentage-calculator':   return <PercentageCalculatorClient />;
    case 'percentage-difference':   return <PercentageDifferenceClient />;
    case 'qr-code-generator':       return <QrCodeGeneratorClient />;
    case 'readability-score':       return <ReadabilityScoreClient />;
    case 'screen-resolution-tester': return <ScreenResolutionTesterClient />;
    case 'serp-preview':            return <SerpPreviewClient />;
    case 'circle-crop':            return <CircleCropClient />;
    case 'square-crop':            return <SquareCropClient />;
    case 'url-params':             return <UrlParamsClient />;
    case 'base64-encoder-decoder': return <Base64EncoderDecoderClient />;
    default:                        return <NotImplementedTool toolName={tool.name} />;
  }
}

// ─── Page layout ─────────────────────────────────────────────────────────

export default function ToolDetailClient({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/tools" className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          ← All Tools
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {tool.category}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">100% client-side · no uploads</span>
        </div>
        {tool.description && (
          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
        )}
        <div className="mt-4">
          <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
        </div>
      </header>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolRouter tool={tool} />
      </div>
    </div>
  );
}
