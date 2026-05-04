'use client';

import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

// ─── Imported tool UIs ──────────────────────────────────────────────────────
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import XmlFormatterClient from '@/components/tools/XmlFormatterClient';
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
import JsonValidatorClient from '@/components/tools/JsonValidatorClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import Sha256HashClient from '@/components/tools/Sha256HashClient';
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
import HexToRgbClient from '@/components/tools/HexToRgbClient';
import RgbToHexClient from '@/components/tools/RgbToHexClient';
import RandomStringClient from '@/components/tools/RandomStringClient';
import Base64EncoderDecoderClient from '@/components/tools/Base64EncoderDecoderClient';
import Base64ImageEncoderClient from '@/components/tools/Base64ImageEncoderClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';

// ─── Individual tool UIs ────────────────────────────────────────────────────

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

  switch (tool.slug) {
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'base64-image-converter':
      return <Base64ImageEncoderClient />;
    case 'url-encode':
    case 'url-encoder':
      return <UrlEncodeClient />;
    case 'json-formatter':
      return <JsonFormatterClient />;
    case 'json-validator':
      return <JsonValidatorClient />;
    case 'yaml-to-json':
      return <YamlToJsonClient />;
    case 'xml-to-json':
      return <XmlToJsonClient />;
    case 'xml-formatter':
      return <XmlFormatterClient />;
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
    case 'sha-256-hash':
      return <Sha256HashClient />;
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
    case 'hex-to-rgb':
      return <HexToRgbClient />;
    case 'rgb-to-hex':
      return <RgbToHexClient />;
    case 'random-string-generator':
      return <RandomStringClient />;
    case 'base64-encoder-decoder':
      return <Base64EncoderDecoderClient />;
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
