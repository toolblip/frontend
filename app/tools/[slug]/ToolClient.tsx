'use client';

import { useState, useMemo } from 'react';
import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

// ─── Imported tool UIs ──────────────────────────────────────────────────────
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import WordCounterClient from '@/components/tools/WordCounterClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import UrlParamsClient from '@/components/tools/UrlParamsClient';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import UnixTimestampConverterClient from '@/components/tools/UnixTimestampConverterClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import TextDiffClient from '@/components/tools/TextDiffClient';
import SquareCropClient from '@/components/tools/SquareCropClient';
import SqlToJsonClient from '@/components/tools/SqlToJsonClient';
import SerpPreviewClient from '@/components/tools/SerpPreviewClient';
import ScreenResolutionTesterClient from '@/components/tools/ScreenResolutionTesterClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';
import PercentageDifferenceClient from '@/components/tools/PercentageDifferenceClient';
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import PasswordGeneratorClient from '@/components/tools/PasswordGeneratorClient';
import NumberBaseConverterClient from '@/components/tools/NumberBaseConverterClient';
import MetaTagGeneratorClient from '@/components/tools/MetaTagGeneratorClient';
import MarkdownToHtmlClient from '@/components/tools/MarkdownToHtmlClient';
import LoremIpsumGeneratorClient from '@/components/tools/LoremIpsumGeneratorClient';
import JwtDecoderClient from '@/components/tools/JwtDecoderClient';
import JsonToYamlClient from '@/components/tools/JsonToYamlClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import GrammarCheckerClient from '@/components/tools/GrammarCheckerClient';
import FaviconGeneratorClient from '@/components/tools/FaviconGeneratorClient';
import CssGradientGeneratorClient from '@/components/tools/CssGradientGeneratorClient';
import CssBorderRadiusGeneratorClient from '@/components/tools/CssBorderRadiusGeneratorClient';
import SassToCssClient from '@/components/tools/SassToCssClient';
import CronParserClient from '@/components/tools/CronParserClient';
import CronGeneratorClient from '@/components/tools/CronGeneratorClient';
import CreditCardValidatorClient from '@/components/tools/CreditCardValidatorClient';
import ContrastCheckerClient from '@/components/tools/ContrastCheckerClient';
import ColorPickerClient from '@/components/tools/ColorPickerClient';
import CircleCropClient from '@/components/tools/CircleCropClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import OxfordCommaClient from '@/components/tools/OxfordCommaClient';
import NotebookToHtmlClient from '@/components/tools/NotebookToHtmlClient';

// ─── Individual tool UIs ────────────────────────────────────────────────────

function WordCounterUI({ output, setOutput }: { output: string; setOutput: (v: string) => void }) {
  const stats = useMemo(() => {
    if (!output.trim()) return null;
    const words = output.trim().split(/\s+/);
    const chars = output.length;
    const charsNoSpaces = output.replace(/\s/g, '').length;
    const sentences = output.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = output.split(/\n\n+/).filter(Boolean).length;
    const readingTime = Math.ceil(words.length / 200);
    return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [output]);

  return (
    <div className="space-y-4">
      <textarea
        value={output}
        onChange={e => setOutput(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-4 resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono text-sm"
      />
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Words', value: stats.words },
            { label: 'Characters', value: stats.chars },
            { label: 'No Spaces', value: stats.charsNoSpaces },
            { label: 'Sentences', value: stats.sentences },
            { label: 'Paragraphs', value: stats.paragraphs },
            { label: 'Reading Time', value: `${stats.readingTime} min` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CharacterCounterUI({ output, setOutput }: { output: string; setOutput: (v: string) => void }) {
  const [includeSpaces, setIncludeSpaces] = useState(true);
  const stats = useMemo(() => {
    const withSpaces = output.length;
    const noSpaces = output.replace(/\s/g, '').length;
    return { withSpaces, noSpaces, twitter: 280 - withSpaces, linkedin: 3000 - withSpaces, meta: 160 - withSpaces };
  }, [output]);

  return (
    <div className="space-y-4">
      <textarea
        value={output}
        onChange={e => setOutput(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-4 resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'With Spaces', value: stats.withSpaces, limit: null },
          { label: 'No Spaces', value: stats.noSpaces, limit: null },
          { label: 'Twitter', value: stats.twitter, limit: 280, over: stats.twitter < 0 },
          { label: 'Meta Desc.', value: stats.meta, limit: 160, over: stats.meta < 0 },
        ].map(({ label, value, limit, over }) => (
          <div key={label} className={`rounded-lg p-3 text-center ${over ? 'bg-red-50 dark:bg-red-950' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className={`text-xl font-bold ${over ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}{limit ? ` / ${limit}` : ''}</div>
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <input type="checkbox" checked={includeSpaces} onChange={e => setIncludeSpaces(e.target.checked)} className="rounded" />
        Include spaces in count
      </label>
    </div>
  );
}

function CaseConverterUI({ output, setOutput }: { output: string; setOutput: (v: string) => void }) {
  const [converted, setConverted] = useState('');
  const transforms = [
    { label: 'UPPERCASE', fn: (t: string) => t.toUpperCase() },
    { label: 'lowercase', fn: (t: string) => t.toLowerCase() },
    { label: 'Title Case', fn: (t: string) => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
    { label: 'camelCase', fn: (t: string) => t.replace(/\s(.)/g, ($1) => $1.toUpperCase()).replace(/\s/g, '').replace(/^(.)/, ($1) => $1.toLowerCase()) },
    { label: 'snake_case', fn: (t: string) => t.toLowerCase().replace(/\s+/g, '_') },
    { label: 'kebab-case', fn: (t: string) => t.toLowerCase().replace(/\s+/g, '-') },
    { label: 'PascalCase', fn: (t: string) => t.replace(/\s(.)/g, ($1) => $1.toUpperCase()).replace(/\s/g, '') },
    { label: 'aLtErNaTiNg', fn: (t: string) => t.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
  ];

  const handleInput = (val: string) => {
    setOutput(val);
    setConverted(val);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={output}
        onChange={e => handleInput(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-4 resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {transforms.map(({ label, fn }) => (
          <button
            key={label}
            onClick={() => setOutput(fn(converted || output))}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Base64UI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleProcess = () => {
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-4 resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono text-sm"
      />
      <button
        onClick={handleProcess}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}
      </button>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</label>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-red-600 dark:text-red-400 hover:underline">Copy</button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono text-sm text-gray-900 dark:text-white break-all">{output}</div>
        </div>
      )}
    </div>
  );
}

function UrlEncodeUI() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleProcess = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'URL or text to encode...' : 'Encoded URL to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-4 resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono text-sm"
      />
      <button
        onClick={handleProcess}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors"
      >
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</label>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-red-600 dark:text-red-400 hover:underline">Copy</button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono text-sm text-gray-900 dark:text-white break-all">{output}</div>
        </div>
      )}
    </div>
  );
}

function JsonFormatterUI() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const handleFormat = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleFormat}
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Minify
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <label>Indent:</label>
          <select
            value={indent}
            onChange={e => setIndent(Number(e.target.value))}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
            <option value={0}>None</option>
          </select>
        </div>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-4 resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 font-mono text-sm"
      />
      {error && <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950 rounded-lg p-3">{error}</p>}
      {output && !error && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Formatted Output</label>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-red-600 dark:text-red-400 hover:underline">Copy</button>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono text-sm text-gray-900 dark:text-white overflow-x-auto whitespace-pre">{output}</pre>
        </div>
      )}
    </div>
  );
}

function ComingSoonUI({ tool }: { tool: Tool }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">{tool.emoji}</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">{tool.description}</p>
      </div>
      <div className="space-y-3">
        <textarea
          disabled
          placeholder="This tool is coming soon..."
          className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-xl p-4 resize-y placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none cursor-not-allowed opacity-60"
        />
        <button
          disabled
          className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl py-3 font-medium cursor-not-allowed opacity-60"
        >
          Coming Soon
        </button>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          This tool&apos;s interactive UI is under development.
        </p>
      </div>
    </div>
  );
}

// ─── Tool routing ────────────────────────────────────────────────────────────

function ToolUI({ tool }: { tool: Tool }) {
  const [text, setText] = useState('');

  switch (tool.slug) {
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'case-converter':
      return <CaseConverterUI output={text} setOutput={setText} />;
    case 'base64':
      return <Base64UI />;
    case 'url-encode':
      return <UrlEncodeClient />;
    case 'json-formatter':
      return <JsonFormatterClient />;
    case 'yaml-to-json':
      return <YamlToJsonClient />;
    case 'xml-to-json':
      return <XmlToJsonClient />;
    case 'uuid-generator':
      return <UuidGeneratorClient />;
    case 'url-slug-generator':
      return <UrlSlugGeneratorClient />;
    case 'url-parameter-extractor':
      return <UrlParamsClient />;
    case 'unix-timestamp-converter':
      return <UnixTimestampConverterClient />;
    case 'unit-converter':
      return <UnitConverterClient />;
    case 'text-sorter':
      return <TextSorterClient />;
    case 'text-diff':
      return <TextDiffClient />;
    case 'square-crop':
      return <SquareCropClient />;
    case 'sql-to-json':
      return <SqlToJsonClient />;
    case 'serp-preview':
      return <SerpPreviewClient />;
    case 'sass-to-css':
      return <SassToCssClient />;
    case 'screen-resolution-tester':
      return <ScreenResolutionTesterClient />;
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesClient />;
    case 'regex-tester':
      return <RegexTesterClient />;
    case 'readability-score':
      return <ReadabilityScoreClient />;
    case 'qr-code-generator':
      return <QrCodeGeneratorClient />;
    case 'percentage-difference':
      return <PercentageDifferenceClient />;
    case 'percentage-calculator':
      return <PercentageCalculatorClient />;
    case 'password-generator':
      return <PasswordGeneratorClient />;
    case 'number-base-converter':
      return <NumberBaseConverterClient />;
    case 'notebook-to-html':
      return <NotebookToHtmlClient />;
    case 'oxford-comma':
      return <OxfordCommaClient />;
    case 'meta-tag-generator':
      return <MetaTagGeneratorClient />;
    case 'markdown-to-html':
      return <MarkdownToHtmlClient />;
    case 'lorem-ipsum-generator':
      return <LoremIpsumGeneratorClient />;
    case 'jwt-decoder':
      return <JwtDecoderClient />;
    case 'json-to-yaml':
      return <JsonToYamlClient />;
    case 'js-minifier':
      return <JsMinifierClient />;
    case 'image-resizer':
      return <ImageResizerClient />;
    case 'image-format-converter':
      return <ImageFormatConverterClient />;
    case 'image-cropper':
      return <ImageCropperClient />;
    case 'http-headers-viewer':
      return <HttpHeadersViewerClient />;
    case 'html-encoder':
      return <HtmlEncoderClient />;
    case 'hash-generator':
      return <HashGeneratorClient />;
    case 'grammar-checker':
      return <GrammarCheckerClient />;
    case 'favicon-generator':
      return <FaviconGeneratorClient />;
    case 'css-gradient-generator':
      return <CssGradientGeneratorClient />;
    case 'css-border-radius-generator':
      return <CssBorderRadiusGeneratorClient />;
    case 'cron-parser':
      return <CronParserClient />;
    case 'cron-generator':
      return <CronGeneratorClient />;
    case 'credit-card-validator':
      return <CreditCardValidatorClient />;
    case 'contrast-checker':
      return <ContrastCheckerClient />;
    case 'color-picker':
      return <ColorPickerClient />;
    case 'circle-crop':
      return <CircleCropClient />;
    default:
      return <ComingSoonUI tool={tool} />;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function ToolClient({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <a href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Home</a>
        <span>/</span>
        <a href="/tools" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Tools</a>
        <span>/</span>
        <a href={`/tools?category=${encodeURIComponent(tool.category)}`} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{tool.category}</a>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <span className="inline-block mt-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2.5 py-0.5 rounded-full font-medium">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{tool.description}</p>
        <div className="mt-4">
          <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
        </div>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolUI tool={tool} />
      </div>
    </div>
  );
}
