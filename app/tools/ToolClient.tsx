'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

// ─── Real tool UI components ─────────────────────────────────────────────────
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import NotebookToHtmlClient from '@/components/tools/NotebookToHtmlClient';
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
import OxfordCommaClient from '@/components/tools/OxfordCommaClient';
import PasswordGeneratorClient from '@/components/tools/PasswordGeneratorClient';
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import PercentageDifferenceClient from '@/components/tools/PercentageDifferenceClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';
import RandomStringClient from '@/components/tools/RandomStringClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import RgbToHexClient from '@/components/tools/RgbToHexClient';
import SassToCssClient from '@/components/tools/SassToCssClient';
import ScreenResolutionTesterClient from '@/components/tools/ScreenResolutionTesterClient';
import SerpPreviewClient from '@/components/tools/SerpPreviewClient';
import Sha256HashClient from '@/components/tools/Sha256HashClient';
import SqlToJsonClient from '@/components/tools/SqlToJsonClient';
import SquareCropClient from '@/components/tools/SquareCropClient';
import TextDiffClient from '@/components/tools/TextDiffClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';
import UnixTimestampConverterClient from '@/components/tools/UnixTimestampConverterClient';
import UrlParamsClient from '@/components/tools/UrlParamsClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import XmlFormatterClient from '@/components/tools/XmlFormatterClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';

// ─── Coming Soon placeholder ────────────────────────────────────────────────
function ComingSoonPlaceholder({ tool }: { tool: Tool }) {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        This tool is being built. The UI below is a preview of how it will work.
      </p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter input..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-8 text-center">
        <span className="text-3xl block mb-2">{tool.emoji}</span>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {tool.name} - Coming Soon
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          Full UI is under construction
        </p>
      </div>
    </div>
  );
}

// ─── Tool renderer ───────────────────────────────────────────────────────────
function ToolRenderer({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    // ── Wired tools ──────────────────────────────────────────────────────────
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'base64':
      return <Base64Client />;
    case 'url-encode':
      return <UrlEncodeClient />;
    case 'json-formatter':
      return <JsonFormatterClient />;
    case 'notebook-to-html':
      return <NotebookToHtmlClient />;

    // ── Additional wired tools ───────────────────────────────────────────────
    case 'circle-crop':
      return <CircleCropClient />;
    case 'color-picker':
      return <ColorPickerClient />;
    case 'contrast-checker':
      return <ContrastCheckerClient />;
    case 'credit-card-validator':
      return <CreditCardValidatorClient />;
    case 'cron-expression-generator':
      return <CronGeneratorClient />;
    case 'cron-parser':
      return <CronParserClient />;
    case 'css-border-radius-generator':
      return <CssBorderRadiusGeneratorClient />;
    case 'css-gradient-generator':
      return <CssGradientGeneratorClient />;
    case 'favicon-generator':
      return <FaviconGeneratorClient />;
    case 'grammar-checker':
      return <GrammarCheckerClient />;
    case 'hash-generator':
      return <HashGeneratorClient />;
    case 'hex-to-rgb':
      return <HexToRgbClient />;
    case 'html-encoder':
      return <HtmlEncoderClient />;
    case 'http-headers-viewer':
      return <HttpHeadersViewerClient />;
    case 'image-cropper':
      return <ImageCropperClient />;
    case 'image-format-converter':
      return <ImageFormatConverterClient />;
    case 'image-resizer':
      return <ImageResizerClient />;
    case 'js-minifier':
      return <JsMinifierClient />;
    case 'json-to-yaml':
      return <JsonToYamlClient />;
    case 'json-validator':
      return <JsonValidatorClient />;
    case 'jwt-decoder':
      return <JwtDecoderClient />;
    case 'lorem-ipsum-generator':
      return <LoremIpsumGeneratorClient />;
    case 'markdown-to-html':
      return <MarkdownToHtmlClient />;
    case 'meta-tag-generator':
      return <MetaTagGeneratorClient />;
    case 'number-base-converter':
      return <NumberBaseConverterClient />;
    case 'oxford-comma':
      return <OxfordCommaClient />;
    case 'password-generator':
      return <PasswordGeneratorClient />;
    case 'percentage-calculator':
      return <PercentageCalculatorClient />;
    case 'percentage-difference':
      return <PercentageDifferenceClient />;
    case 'qr-code-generator':
      return <QrCodeGeneratorClient />;
    case 'random-string-generator':
      return <RandomStringClient />;
    case 'readability-score':
      return <ReadabilityScoreClient />;
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesClient />;
    case 'rgb-to-hex':
      return <RgbToHexClient />;
    case 'sass-to-css':
      return <SassToCssClient />;
    case 'screen-resolution-tester':
      return <ScreenResolutionTesterClient />;
    case 'serp-preview':
      return <SerpPreviewClient />;
    case 'sha-256-hash':
      return <Sha256HashClient />;
    case 'sql-to-json':
      return <SqlToJsonClient />;
    case 'square-crop':
      return <SquareCropClient />;
    case 'text-diff':
      return <TextDiffClient />;
    case 'text-sorter':
      return <TextSorterClient />;
    case 'unit-converter':
      return <UnitConverterClient />;
    case 'unix-timestamp-converter':
      return <UnixTimestampConverterClient />;
    case 'url-parameter-extractor':
      return <UrlParamsClient />;
    case 'url-slug-generator':
      return <UrlSlugGeneratorClient />;
    case 'uuid-generator':
      return <UuidGeneratorClient />;
    case 'xml-formatter':
      return <XmlFormatterClient />;
    case 'xml-to-json':
      return <XmlToJsonClient />;
    case 'yaml-to-json':
      return <YamlToJsonClient />;

    // ── Unwired ─────────────────────────────────────────────────────────────
    default:
      return <ComingSoonPlaceholder tool={tool} />;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function ToolClient({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href="/tools" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Tools
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
            {tool.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-5xl">{tool.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {tool.name}
            </h1>
            <span className="inline-block mt-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* tool UI */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolRenderer tool={tool} />
      </div>

      {/* Share */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-wide">Share this tool</p>
        <ShareButtons toolName={tool.name} />
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
        100% client-side - nothing is sent to any server
      </p>
    </div>
  );
}
