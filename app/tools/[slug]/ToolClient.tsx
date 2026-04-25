'use client';

import React from 'react';
import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

// Text tools
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import LoremIpsumGeneratorClient from '@/components/tools/LoremIpsumGeneratorClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import TextDiffClient from '@/components/tools/TextDiffClient';
import GrammarCheckerClient from '@/components/tools/GrammarCheckerClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';

// Developer / Encoder tools
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import JsonToYamlClient from '@/components/tools/JsonToYamlClient';
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';
import SqlToJsonClient from '@/components/tools/SqlToJsonClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import JwtDecoderClient from '@/components/tools/JwtDecoderClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import PasswordGeneratorClient from '@/components/tools/PasswordGeneratorClient';
import CreditCardValidatorClient from '@/components/tools/CreditCardValidatorClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
import UrlParamsClient from '@/components/tools/UrlParamsClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import UnixTimestampConverterClient from '@/components/tools/UnixTimestampConverterClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import MarkdownToHtmlClient from '@/components/tools/MarkdownToHtmlClient';
import MetaTagGeneratorClient from '@/components/tools/MetaTagGeneratorClient';
import SerpPreviewClient from '@/components/tools/SerpPreviewClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import ScreenResolutionTesterClient from '@/components/tools/ScreenResolutionTesterClient';
import CronParserClient from '@/components/tools/CronParserClient';
import CronGeneratorClient from '@/components/tools/CronGeneratorClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import NumberBaseConverterClient from '@/components/tools/NumberBaseConverterClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';

// Image tools
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import SquareCropClient from '@/components/tools/SquareCropClient';
import CircleCropClient from '@/components/tools/CircleCropClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import FaviconGeneratorClient from '@/components/tools/FaviconGeneratorClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';

// Color tools
import ColorPickerClient from '@/components/tools/ColorPickerClient';
import ContrastCheckerClient from '@/components/tools/ContrastCheckerClient';

// CSS tools
import CssBorderRadiusGeneratorClient from '@/components/tools/CssBorderRadiusGeneratorClient';
import CssGradientGeneratorClient from '@/components/tools/CssGradientGeneratorClient';

// Percentage / Math tools
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import PercentageDifferenceClient from '@/components/tools/PercentageDifferenceClient';

interface ToolClientProps {
  tool: Tool;
}

// Map of slug → React component for tools with dedicated UIs
const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  // Text
  'word-counter': WordCounterClient,
  'character-counter': CharacterCounterClient,
  'case-converter': CaseConverterClient,
  'lorem-ipsum-generator': LoremIpsumGeneratorClient,
  'remove-duplicate-lines': RemoveDuplicateLinesClient,
  'text-sorter': TextSorterClient,
  'text-diff': TextDiffClient,
  'grammar-checker': GrammarCheckerClient,
  'readability-score': ReadabilityScoreClient,

  // Developer / Encoder
  'base64': Base64Client,
  'url-encode': UrlEncodeClient,
  'html-encoder': HtmlEncoderClient,
  'json-formatter': JsonFormatterClient,
  'json-to-yaml': JsonToYamlClient,
  'yaml-to-json': YamlToJsonClient,
  'sql-to-json': SqlToJsonClient,
  'xml-to-json': XmlToJsonClient,
  'jwt-decoder': JwtDecoderClient,
  'hash-generator': HashGeneratorClient,
  'password-generator': PasswordGeneratorClient,
  'credit-card-validator': CreditCardValidatorClient,
  'regex-tester': RegexTesterClient,
  'url-parameter-extractor': UrlParamsClient,
  'url-slug-generator': UrlSlugGeneratorClient,
  'unix-timestamp-converter': UnixTimestampConverterClient,
  'js-minifier': JsMinifierClient,
  'markdown-to-html': MarkdownToHtmlClient,
  'meta-tag-generator': MetaTagGeneratorClient,
  'serp-preview': SerpPreviewClient,
  'http-headers-viewer': HttpHeadersViewerClient,
  'screen-resolution-tester': ScreenResolutionTesterClient,
  'cron-parser': CronParserClient,
  'cron-generator': CronGeneratorClient,
  'uuid-generator': UuidGeneratorClient,
  'number-base-converter': NumberBaseConverterClient,
  'unit-converter': UnitConverterClient,

  // Image
  'image-cropper': ImageCropperClient,
  'square-crop': SquareCropClient,
  'circle-crop': CircleCropClient,
  'image-format-converter': ImageFormatConverterClient,
  'image-resizer': ImageResizerClient,
  'favicon-generator': FaviconGeneratorClient,
  'qr-code-generator': QrCodeGeneratorClient,

  // Color
  'color-picker': ColorPickerClient,
  'contrast-checker': ContrastCheckerClient,

  // CSS
  'css-border-radius-generator': CssBorderRadiusGeneratorClient,
  'css-gradient-generator': CssGradientGeneratorClient,

  // Math
  'percentage-calculator': PercentageCalculatorClient,
  'percentage-difference': PercentageDifferenceClient,
};

function ComingSoonPlaceholder({ tool }: { tool: Tool }) {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  return (
    <div className="space-y-4">
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        This tool is coming soon. You can preview the interface below.
      </p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="flex gap-3">
        <button
          disabled
          className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium opacity-50 cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>
      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Output
          </label>
          <textarea
            value={output}
            readOnly
            rows={6}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          />
        </div>
      )}
    </div>
  );
}

export default function ToolClient({ tool }: ToolClientProps) {
  const ToolComponent = TOOL_COMPONENTS[tool.slug];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {tool.description}
        </p>
        <span className="inline-block mt-3 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {tool.category}
        </span>
        <div className="mt-4">
          <ShareButtons toolName={tool.name} />
        </div>
      </div>

      {/* Tool UI or placeholder */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          <ComingSoonPlaceholder tool={tool} />
        )}
      </div>
    </div>
  );
}
