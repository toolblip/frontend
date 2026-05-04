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
import DnsLookupClient from '@/components/tools/DnsLookupClient';
import KeywordDensityCheckerClient from '@/components/tools/KeywordDensityCheckerClient';
import MetaDescriptionCheckerClient from '@/components/tools/MetaDescriptionCheckerClient';
import MorseCodeTranslatorClient from '@/components/tools/MorseCodeTranslatorClient';
import NumberToWordsClient from '@/components/tools/NumberToWordsClient';
import PingTestClient from '@/components/tools/PingTestClient';
import RandomIpAddressClient from '@/components/tools/RandomIpAddressClient';
import SslCertificateCheckerClient from '@/components/tools/SslCertificateCheckerClient';
import TextReverserClient from '@/components/tools/TextReverserClient';
import Rot13CipherClient from '@/components/tools/Rot13CipherClient';
import CsvToJsonClient from '@/components/tools/CsvToJsonClient';
import DecimalToBinaryClient from '@/components/tools/DecimalToBinaryClient';
import DecimalToHexClient from '@/components/tools/DecimalToHexClient';
import CronGeneratorClient from '@/components/tools/CronGeneratorClient';
import CurlToPythonClient from '@/components/tools/CurlToPythonClient';
import XmlValidatorClient from '@/components/tools/XmlValidatorClient';
import CronParserClient from '@/components/tools/CronParserClient';
import CssBorderRadiusGeneratorClient from '@/components/tools/CssBorderRadiusGeneratorClient';
import CssGradientGeneratorClient from '@/components/tools/CssGradientGeneratorClient';
import FaviconGeneratorClient from '@/components/tools/FaviconGeneratorClient';
import GrammarCheckerClient from '@/components/tools/GrammarCheckerClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import CorsHeaderGeneratorClient from '@/components/tools/CorsHeaderGeneratorClient';
import HtaccessRedirectGeneratorClient from '@/components/tools/HtaccessRedirectGeneratorClient';
import JsonLdGeneratorClient from '@/components/tools/JsonLdGeneratorClient';
import SecurityHeadersGeneratorClient from '@/components/tools/SecurityHeadersGeneratorClient';
import HexToRgbClient from '@/components/tools/HexToRgbClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import HtmlTableGeneratorClient from '@/components/tools/HtmlTableGeneratorClient';
import HtmlToMarkdownClient from '@/components/tools/HtmlToMarkdownClient';
import JsonToYamlClient from '@/components/tools/JsonToYamlClient';
import JsonValidatorClient from '@/components/tools/JsonValidatorClient';
import JsonToXmlClient from '@/components/tools/JsonToXmlClient';
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
import TomlToJsonClient from '@/components/tools/TomlToJsonClient';
import OpenGraphGeneratorClient from '@/components/tools/OpenGraphGeneratorClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';
import UnixTimestampConverterClient from '@/components/tools/UnixTimestampConverterClient';
import UrlParamsClient from '@/components/tools/UrlParamsClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import XmlFormatterClient from '@/components/tools/XmlFormatterClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import BinaryToTextClient from '@/components/tools/BinaryToTextClient';
import BinaryToDecimalClient from '@/components/tools/BinaryToDecimalClient';
import HexToDecimalClient from '@/components/tools/HexToDecimalClient';
import JsonToCsvClient from '@/components/tools/JsonToCsvClient';
import MarkdownToPdfClient from '@/components/tools/MarkdownToPdfClient';
import OctalToDecimalClient from '@/components/tools/OctalToDecimalClient';
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';
import YamlValidatorClient from '@/components/tools/YamlValidatorClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
// ─── New tool components ─────────────────────────────────────────────────────
import AnagramGeneratorClient from '@/components/tools/AnagramGeneratorClient';
import Base64EncoderDecoderClient from '@/components/tools/Base64EncoderDecoderClient';
import ChineseCharConverterClient from '@/components/tools/ChineseCharConverterClient';
import CssClassGeneratorClient from '@/components/tools/CssClassGeneratorClient';
import CssValidatorClient from '@/components/tools/CssValidatorClient';
import EmailGeneratorClient from '@/components/tools/EmailGeneratorClient';
import EmailValidatorClient from '@/components/tools/EmailValidatorClient';
import EmojiFinderClient from '@/components/tools/EmojiFinderClient';
import EnglishGrammarCheckerClient from '@/components/tools/EnglishGrammarCheckerClient';
import FakeDataGeneratorClient from '@/components/tools/FakeDataGeneratorClient';
import HashFromTextClient from '@/components/tools/HashFromTextClient';
import HashIdentifierClient from '@/components/tools/HashIdentifierClient';
import HtmlValidatorClient from '@/components/tools/HtmlValidatorClient';
import IpWhoisGeneratorClient from '@/components/tools/IpWhoisGeneratorClient';
import JsonPathTesterClient from '@/components/tools/JsonPathTesterClient';
import JsonSchemaValidatorClient from '@/components/tools/JsonSchemaValidatorClient';
import JsonToMarkdownTableClient from '@/components/tools/JsonToMarkdownTableClient';
import JsonToTypescriptClient from '@/components/tools/JsonToTypescriptClient';
import ListComparatorClient from '@/components/tools/ListComparatorClient';
import ListRandomizerClient from '@/components/tools/ListRandomizerClient';
import PalindromeCheckerClient from '@/components/tools/PalindromeCheckerClient';
import PasswordStrengthCheckerClient from '@/components/tools/PasswordStrengthCheckerClient';
import PortScannerClient from '@/components/tools/PortScannerClient';
import PunctuationFixerClient from '@/components/tools/PunctuationFixerClient';
import RandomUuidV7Client from '@/components/tools/RandomUuidV7Client';
import ReadingTimeCalculatorClient from '@/components/tools/ReadingTimeCalculatorClient';
import RobotsTxtGeneratorClient from '@/components/tools/RobotsTxtGeneratorClient';
import RomanNumeralConverterClient from '@/components/tools/RomanNumeralConverterClient';
import SqlPrettifierClient from '@/components/tools/SqlPrettifierClient';
import StickyNotesClient from '@/components/tools/StickyNotesClient';
import SyllableCounterClient from '@/components/tools/SyllableCounterClient';
import TextStatisticsClient from '@/components/tools/TextStatisticsClient';
import TextToSlugClient from '@/components/tools/TextToSlugClient';
import TimeZoneConverterClient from '@/components/tools/TimeZoneConverterClient';
import TypoCheckerClient from '@/components/tools/TypoCheckerClient';
import UnicodeCharacterInspectorClient from '@/components/tools/UnicodeCharacterInspectorClient';
import UptimeCalculatorClient from '@/components/tools/UptimeCalculatorClient';
import UrlParserClient from '@/components/tools/UrlParserClient';
import WordFrequencyAnalyzerClient from '@/components/tools/WordFrequencyAnalyzerClient';
import XmlSitemapGeneratorClient from '@/components/tools/XmlSitemapGeneratorClient';

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
    case 'anagram-generator':
      return <AnagramGeneratorClient />;
    case 'base64':
      return <Base64Client />;
    case 'base-encoder-decoder':
      return <Base64EncoderDecoderClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'chinese-char-converter':
      return <ChineseCharConverterClient />;
    case 'circle-crop':
      return <CircleCropClient />;
    case 'color-picker':
      return <ColorPickerClient />;
    case 'contrast-checker':
      return <ContrastCheckerClient />;
    case 'binary-to-text':
      return <BinaryToTextClient />;
    case 'binary-to-decimal':
      return <BinaryToDecimalClient />;
    case 'credit-card-validator':
      return <CreditCardValidatorClient />;
    case 'cron-expression-generator':
      return <CronGeneratorClient />;
    case 'cron-parser':
    case 'cors-header-generator':
      return <CorsHeaderGeneratorClient />;
      return <CronParserClient />;
    case 'curl-to-python':
      return <CurlToPythonClient />;
    case 'css-border-radius-generator':
      return <CssBorderRadiusGeneratorClient />;
    case 'css-class-generator':
      return <CssClassGeneratorClient />;
    case 'css-gradient-generator':
      return <CssGradientGeneratorClient />;
    case 'csv-to-json':
      return <CsvToJsonClient />;
    case 'css-validator':
      return <CssValidatorClient />;
    case 'decimal-to-binary':
      return <DecimalToBinaryClient />;
    case 'decimal-to-hex':
      return <DecimalToHexClient />;
    case 'email-generator':
      return <EmailGeneratorClient />;
    case 'email-validator':
      return <EmailValidatorClient />;
    case 'emoji-finder':
      return <EmojiFinderClient />;
    case 'english-grammar-checker':
      return <EnglishGrammarCheckerClient />;
    case 'fake-data-generator':
      return <FakeDataGeneratorClient />;
    case 'favicon-generator':
      return <FaviconGeneratorClient />;
    case 'grammar-checker':
      return <GrammarCheckerClient />;
    case 'hash-from-text':
      return <HashFromTextClient />;
    case 'hash-generator':
      return <HashGeneratorClient />;
    case 'hash-identifier':
      return <HashIdentifierClient />;
    case 'hex-to-rgb':
      return <HexToRgbClient />;
    case 'hex-to-decimal':
      return <HexToDecimalClient />;
    case 'html-encoder':
      return <HtmlEncoderClient />;
    case 'html-table-generator':
      return <HtmlTableGeneratorClient />;
    case 'html-validator':
    case 'htaccess-redirect-generator':
      return <HtaccessRedirectGeneratorClient />;
      case 'html-to-markdown':
        return <HtmlToMarkdownClient />;
      return <HtmlValidatorClient />;
    case 'http-headers-viewer':
      return <HttpHeadersViewerClient />;
    case 'image-cropper':
      return <ImageCropperClient />;
    case 'image-format-converter':
      return <ImageFormatConverterClient />;
    case 'image-resizer':
      return <ImageResizerClient />;
    case 'ip-whois-generator':
      return <IpWhoisGeneratorClient />;
    case 'js-minifier':
      return <JsMinifierClient />;
    case 'json-formatter':
    case 'json-ld-generator':
    case 'keyword-density-checker':
      return <KeywordDensityCheckerClient />;
      return <JsonLdGeneratorClient />;
      return <JsonFormatterClient />;
    case 'json-path-tester':
      return <JsonPathTesterClient />;
    case 'json-schema-validator':
      return <JsonSchemaValidatorClient />;
    case 'json-to-csv':
      return <JsonToCsvClient />;
    case 'json-to-markdown-table':
      return <JsonToMarkdownTableClient />;
    case 'json-to-typescript':
      return <JsonToTypescriptClient />;
    case 'json-to-yaml':
      return <JsonToYamlClient />;
    case 'json-validator':
      case 'json-to-xml':
        return <JsonToXmlClient />;
      return <JsonValidatorClient />;
    case 'jwt-decoder':
      return <JwtDecoderClient />;
    case 'list-comparator':
      return <ListComparatorClient />;
    case 'list-randomizer':
      return <ListRandomizerClient />;
    case 'lorem-ipsum-generator':
    case 'dns-lookup':
      return <DnsLookupClient />;
      return <LoremIpsumGeneratorClient />;
    case 'markdown-to-html':
      return <MarkdownToHtmlClient />;
    case 'markdown-to-pdf':
      return <MarkdownToPdfClient />;
    case 'meta-tag-generator':
      return <MetaTagGeneratorClient />;
    case 'notebook-to-html':
      return <NotebookToHtmlClient />;
    case 'open-graph-generator':
      return <OpenGraphGeneratorClient />;
    case 'number-base-converter':
      return <NumberBaseConverterClient />;
    case 'octal-to-decimal':
      return <OctalToDecimalClient />;
    case 'oxford-comma':
      return <OxfordCommaClient />;
    case 'palindrome-checker':
      return <PalindromeCheckerClient />;
    case 'password-generator':
      return <PasswordGeneratorClient />;
    case 'password-strength-checker':
      return <PasswordStrengthCheckerClient />;
    case 'percentage-calculator':
      return <PercentageCalculatorClient />;
    case 'percentage-difference':
      return <PercentageDifferenceClient />;
    case 'port-scanner':
      return <PortScannerClient />;
    case 'punctuation-fixer':
      return <PunctuationFixerClient />;
    case 'qr-code-generator':
      return <QrCodeGeneratorClient />;
    case 'random-string-generator':
      return <RandomStringClient />;
    case 'random-uuid-v7':
      return <RandomUuidV7Client />;
    case 'reading-time-calculator':
      return <ReadingTimeCalculatorClient />;
    case 'readability-score':
      return <ReadabilityScoreClient />;
    case 'regex-tester':
      return <RegexTesterClient />;
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesClient />;
    case 'rgb-to-hex':
      return <RgbToHexClient />;
    case 'robots-txt-generator':
      return <RobotsTxtGeneratorClient />;
    case 'roman-numeral-converter':
      return <RomanNumeralConverterClient />;
    case 'sass-to-css':
    case 'ssl-certificate-checker':
      return <SslCertificateCheckerClient />;
    case 'security-headers-generator':
      return <SecurityHeadersGeneratorClient />;
      return <SassToCssClient />;
    case 'screen-resolution-tester':
      return <ScreenResolutionTesterClient />;
    case 'serp-preview':
      return <SerpPreviewClient />;
    case 'sha-256-hash':
      return <Sha256HashClient />;
    case 'sql-prettifier':
      return <SqlPrettifierClient />;
    case 'sql-to-json':
      return <SqlToJsonClient />;
    case 'square-crop':
      return <SquareCropClient />;
    case 'sticky-notes':
      return <StickyNotesClient />;
    case 'syllable-counter':
      return <SyllableCounterClient />;
    case 'text-diff':
      return <TextDiffClient />;
    case 'toml-to-json':
      return <TomlToJsonClient />;
    case 'text-sorter':
      return <TextSorterClient />;
    case 'text-statistics':
    case 'text-reverser':
      return <TextReverserClient />;
      return <TextStatisticsClient />;
    case 'text-to-slug':
      return <TextToSlugClient />;
    case 'time-zone-converter':
      return <TimeZoneConverterClient />;
    case 'typo-checker':
      return <TypoCheckerClient />;
    case 'unicode-character-inspector':
      return <UnicodeCharacterInspectorClient />;
    case 'unit-converter':
      return <UnitConverterClient />;
    case 'unix-timestamp-converter':
      return <UnixTimestampConverterClient />;
    case 'uptime-calculator':
      return <UptimeCalculatorClient />;
    case 'url-encode':
      return <UrlEncodeClient />;
    case 'url-parameter-extractor':
      return <UrlParamsClient />;
    case 'url-parser':
      return <UrlParserClient />;
    case 'url-slug-generator':
      return <UrlSlugGeneratorClient />;
    case 'uuid-generator':
      return <UuidGeneratorClient />;
    case 'word-counter':
      return <WordCounterClient />;
    case 'word-frequency-analyzer':
      return <WordFrequencyAnalyzerClient />;
    case 'xml-formatter':
      return <XmlFormatterClient />;
    case 'xml-validator':
      return <XmlValidatorClient />;
    case 'xml-sitemap-generator':
      return <XmlSitemapGeneratorClient />;
    case 'xml-to-json':
      return <XmlToJsonClient />;
    case 'yaml-to-json':
      case 'yaml-validator':
        return <YamlValidatorClient />;
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
