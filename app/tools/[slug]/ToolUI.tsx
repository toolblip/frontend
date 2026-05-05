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
import AgeCalculatorClient from '@/components/tools/AgeCalculatorClient';
import AnagramGeneratorClient from '@/components/tools/AnagramGeneratorClient';
import BacklinkCheckerClient from '@/components/tools/BacklinkCheckerClient';
import Base64Client from '@/components/tools/Base64Client';
import BashCommandGeneratorClient from '@/components/tools/BashCommandGeneratorClient';
import BinaryToDecimalClient from '@/components/tools/BinaryToDecimalClient';
import BinaryToTextClient from '@/components/tools/BinaryToTextClient';
import BrokenLinkCheckerClient from '@/components/tools/BrokenLinkCheckerClient';
import ChineseCharConverterClient from '@/components/tools/ChineseCharConverterClient';
import CidrCalculatorClient from '@/components/tools/CidrCalculatorClient';
import CmykToRgbConverterClient from '@/components/tools/CmykToRgbConverterClient';
import CorsHeaderGeneratorClient from '@/components/tools/CorsHeaderGeneratorClient';
import CountdownTimerClient from '@/components/tools/CountdownTimerClient';
import CrontabGeneratorClient from '@/components/tools/CrontabGeneratorClient';
import CssClassGeneratorClient from '@/components/tools/CssClassGeneratorClient';
import CssPreprocessorClient from '@/components/tools/CssPreprocessorClient';
import CssToScssConverterClient from '@/components/tools/CssToScssConverterClient';
import CssValidatorClient from '@/components/tools/CssValidatorClient';
import CsvToJsonClient from '@/components/tools/CsvToJsonClient';
import CsvToTsvClient from '@/components/tools/CsvToTsvClient';
import CurlToPythonClient from '@/components/tools/CurlToPythonClient';
import DecimalToBinaryClient from '@/components/tools/DecimalToBinaryClient';
import DecimalToHexClient from '@/components/tools/DecimalToHexClient';
import DecodeToolClient from '@/components/tools/DecodeToolClient';
import DiffToolClient from '@/components/tools/DiffToolClient';
import DnsLookupClient from '@/components/tools/DnsLookupClient';
import DuplicateLineFinderClient from '@/components/tools/DuplicateLineFinderClient';
import DuplicateLineRemovalClient from '@/components/tools/DuplicateLineRemovalClient';
import EmailGeneratorClient from '@/components/tools/EmailGeneratorClient';
import EmailValidatorClient from '@/components/tools/EmailValidatorClient';
import EmojiFinderClient from '@/components/tools/EmojiFinderClient';
import EncodeToolClient from '@/components/tools/EncodeToolClient';
import EnglishGrammarCheckerClient from '@/components/tools/EnglishGrammarCheckerClient';
import FakeDataGeneratorClient from '@/components/tools/FakeDataGeneratorClient';
import FakeTextGeneratorClient from '@/components/tools/FakeTextGeneratorClient';
import FormattersToolClient from '@/components/tools/FormattersToolClient';
import FractionToDecimalClient from '@/components/tools/FractionToDecimalClient';
import GitignoreGeneratorClient from '@/components/tools/GitignoreGeneratorClient';
import HashFromTextClient from '@/components/tools/HashFromTextClient';
import HashIdentifierClient from '@/components/tools/HashIdentifierClient';
import HexToDecimalClient from '@/components/tools/HexToDecimalClient';
import HslToRgbClient from '@/components/tools/HslToRgbClient';
import HtaccessRedirectGeneratorClient from '@/components/tools/HtaccessRedirectGeneratorClient';
import HtmlEntityEncoderClient from '@/components/tools/HtmlEntityEncoderClient';
import HtmlOptimizerClient from '@/components/tools/HtmlOptimizerClient';
import HtmlTableGeneratorClient from '@/components/tools/HtmlTableGeneratorClient';
import HtmlToMarkdownClient from '@/components/tools/HtmlToMarkdownClient';
import HtmlToPlainTextClient from '@/components/tools/HtmlToPlainTextClient';
import HtmlValidatorClient from '@/components/tools/HtmlValidatorClient';
import ImageColorPickerClient from '@/components/tools/ImageColorPickerClient';
import ImageMetadataViewerClient from '@/components/tools/ImageMetadataViewerClient';
import IpRangeCalculatorClient from '@/components/tools/IpRangeCalculatorClient';
import IpWhoisGeneratorClient from '@/components/tools/IpWhoisGeneratorClient';
import Ipv6GeneratorClient from '@/components/tools/Ipv6GeneratorClient';
import JavascriptObfuscatorClient from '@/components/tools/JavascriptObfuscatorClient';
import JavascriptPlaygroundClient from '@/components/tools/JavascriptPlaygroundClient';
import JsonLdGeneratorClient from '@/components/tools/JsonLdGeneratorClient';
import JsonPathTesterClient from '@/components/tools/JsonPathTesterClient';
import JsonSchemaValidatorClient from '@/components/tools/JsonSchemaValidatorClient';
import JsonToCsvClient from '@/components/tools/JsonToCsvClient';
import JsonToHtmlTableClient from '@/components/tools/JsonToHtmlTableClient';
import JsonToMarkdownTableClient from '@/components/tools/JsonToMarkdownTableClient';
import JsonToPythonClient from '@/components/tools/JsonToPythonClient';
import JsonToTypescriptClient from '@/components/tools/JsonToTypescriptClient';
import JsonToXmlClient from '@/components/tools/JsonToXmlClient';
import KeywordDensityCheckerClient from '@/components/tools/KeywordDensityCheckerClient';
import LengthConverterClient from '@/components/tools/LengthConverterClient';
import LineCounterClient from '@/components/tools/LineCounterClient';
import LineNumberRemoverClient from '@/components/tools/LineNumberRemoverClient';
import ListComparatorClient from '@/components/tools/ListComparatorClient';
import ListRandomizerClient from '@/components/tools/ListRandomizerClient';
import MacAddressGeneratorClient from '@/components/tools/MacAddressGeneratorClient';
import MarkdownToPdfClient from '@/components/tools/MarkdownToPdfClient';
import MetaDescriptionCheckerClient from '@/components/tools/MetaDescriptionCheckerClient';
import MorseCodeTranslatorClient from '@/components/tools/MorseCodeTranslatorClient';
import NpmDependencyCheckerClient from '@/components/tools/NpmDependencyCheckerClient';
import NumberToWordsClient from '@/components/tools/NumberToWordsClient';
import OctalToDecimalClient from '@/components/tools/OctalToDecimalClient';
import OpenGraphGeneratorClient from '@/components/tools/OpenGraphGeneratorClient';
import PalindromeCheckerClient from '@/components/tools/PalindromeCheckerClient';
import PasswordStrengthCheckerClient from '@/components/tools/PasswordStrengthCheckerClient';
import PingTestClient from '@/components/tools/PingTestClient';
import PlainTextCounterClient from '@/components/tools/PlainTextCounterClient';
import PortScannerClient from '@/components/tools/PortScannerClient';
import PunctuationFixerClient from '@/components/tools/PunctuationFixerClient';
import RandomFractionGeneratorClient from '@/components/tools/RandomFractionGeneratorClient';
import RandomIpAddressClient from '@/components/tools/RandomIpAddressClient';
import RandomNumberGeneratorClient from '@/components/tools/RandomNumberGeneratorClient';
import RandomParagraphGeneratorClient from '@/components/tools/RandomParagraphGeneratorClient';
import RandomSentenceGeneratorClient from '@/components/tools/RandomSentenceGeneratorClient';
import RandomStringGeneratorToolClient from '@/components/tools/RandomStringGeneratorToolClient';
import RandomUuidV7Client from '@/components/tools/RandomUuidV7Client';
import ReadingTimeCalculatorClient from '@/components/tools/ReadingTimeCalculatorClient';
import RegexVisualizerClient from '@/components/tools/RegexVisualizerClient';
import RgbaToHslConverterClient from '@/components/tools/RgbaToHslConverterClient';
import RobotsTxtGeneratorClient from '@/components/tools/RobotsTxtGeneratorClient';
import RomanNumeralConverterClient from '@/components/tools/RomanNumeralConverterClient';
import Rot13CipherClient from '@/components/tools/Rot13CipherClient';
import Rot47CipherClient from '@/components/tools/Rot47CipherClient';
import SecurityHeadersGeneratorClient from '@/components/tools/SecurityHeadersGeneratorClient';
import SemanticVersioningClient from '@/components/tools/SemanticVersioningClient';
import SemverCheckerClient from '@/components/tools/SemverCheckerClient';
import SlugGeneratorClient from '@/components/tools/SlugGeneratorClient';
import SqlPrettifierClient from '@/components/tools/SqlPrettifierClient';
import SslCertificateCheckerClient from '@/components/tools/SslCertificateCheckerClient';
import StickyNotesClient from '@/components/tools/StickyNotesClient';
import SvgCleanerClient from '@/components/tools/SvgCleanerClient';
import SyllableCounterClient from '@/components/tools/SyllableCounterClient';
import TemperatureConverterClient from '@/components/tools/TemperatureConverterClient';
import TextPermutationGeneratorClient from '@/components/tools/TextPermutationGeneratorClient';
import TextRedundancyCheckerClient from '@/components/tools/TextRedundancyCheckerClient';
import TextReverserClient from '@/components/tools/TextReverserClient';
import TextStatisticsClient from '@/components/tools/TextStatisticsClient';
import TextToSlugClient from '@/components/tools/TextToSlugClient';
import TextToSpeechClient from '@/components/tools/TextToSpeechClient';
import TimeZoneConverterClient from '@/components/tools/TimeZoneConverterClient';
import TimestampConverterClient from '@/components/tools/TimestampConverterClient';
import TomlToJsonClient from '@/components/tools/TomlToJsonClient';
import TsvToCsvClient from '@/components/tools/TsvToCsvClient';
import TypoCheckerClient from '@/components/tools/TypoCheckerClient';
import UnicodeCharacterInspectorClient from '@/components/tools/UnicodeCharacterInspectorClient';
import UptimeCalculatorClient from '@/components/tools/UptimeCalculatorClient';
import UrlParserClient from '@/components/tools/UrlParserClient';
import UserAgentParserClient from '@/components/tools/UserAgentParserClient';
import UuidValidatorClient from '@/components/tools/UuidValidatorClient';
import WebpackConfigGeneratorClient from '@/components/tools/WebpackConfigGeneratorClient';
import WeightConverterClient from '@/components/tools/WeightConverterClient';
import WhoisLookupClient from '@/components/tools/WhoisLookupClient';
import WordAssociationClient from '@/components/tools/WordAssociationClient';
import WordFrequencyAnalyzerClient from '@/components/tools/WordFrequencyAnalyzerClient';
import WordFrequencyCounterClient from '@/components/tools/WordFrequencyCounterClient';
import XmlSitemapGeneratorClient from '@/components/tools/XmlSitemapGeneratorClient';
import XmlValidatorClient from '@/components/tools/XmlValidatorClient';
import YamlValidatorClient from '@/components/tools/YamlValidatorClient';

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
    case 'random-uuid-v7':
      return <RandomUuidV7Client />;
    case 'reading-time-calculator':
      return <ReadingTimeCalculatorClient />;
    case 'regex-visualizer':
      return <RegexVisualizerClient />;
    case 'rgba-to-hsl-converter':
      return <RgbaToHslConverterClient />;
    case 'robots-txt-generator':
      return <RobotsTxtGeneratorClient />;
    case 'roman-numeral-converter':
      return <RomanNumeralConverterClient />;
    case 'rot13-cipher':
      return <Rot13CipherClient />;
    case 'rot47-cipher':
      return <Rot47CipherClient />;
    case 'security-headers-generator':
      return <SecurityHeadersGeneratorClient />;
    case 'semantic-versioning':
      return <SemanticVersioningClient />;
    case 'semver-checker':
      return <SemverCheckerClient />;
    case 'slug-generator':
      return <SlugGeneratorClient />;
    case 'sql-prettifier':
      return <SqlPrettifierClient />;
    case 'ssl-certificate-checker':
      return <SslCertificateCheckerClient />;
    case 'sticky-notes':
      return <StickyNotesClient />;
    case 'svg-cleaner':
      return <SvgCleanerClient />;
    case 'syllable-counter':
      return <SyllableCounterClient />;
    case 'temperature-converter':
      return <TemperatureConverterClient />;
    case 'text-permutation-generator':
      return <TextPermutationGeneratorClient />;
    case 'text-redundancy-checker':
      return <TextRedundancyCheckerClient />;
    case 'text-reverser':
      return <TextReverserClient />;
    case 'text-statistics':
      return <TextStatisticsClient />;
    case 'text-to-slug':
      return <TextToSlugClient />;
    case 'text-to-speech':
      return <TextToSpeechClient />;
    case 'time-zone-converter':
      return <TimeZoneConverterClient />;
    case 'timestamp-converter':
      return <TimestampConverterClient />;
    case 'toml-to-json':
      return <TomlToJsonClient />;
    case 'tsv-to-csv':
      return <TsvToCsvClient />;
    case 'typo-checker':
      return <TypoCheckerClient />;
    case 'unicode-character-inspector':
      return <UnicodeCharacterInspectorClient />;
    case 'uptime-calculator':
      return <UptimeCalculatorClient />;
    case 'url-parser':
      return <UrlParserClient />;
    case 'user-agent-parser':
      return <UserAgentParserClient />;
    case 'uuid-validator':
      return <UuidValidatorClient />;
    case 'webpack-config-generator':
      return <WebpackConfigGeneratorClient />;
    case 'weight-converter':
      return <WeightConverterClient />;
    case 'whois-lookup':
      return <WhoisLookupClient />;
    case 'word-association':
      return <WordAssociationClient />;
    case 'word-frequency-analyzer':
      return <WordFrequencyAnalyzerClient />;
    case 'word-frequency-counter':
      return <WordFrequencyCounterClient />;
    case 'xml-sitemap-generator':
      return <XmlSitemapGeneratorClient />;
    case 'xml-validator':
      return <XmlValidatorClient />;
    case 'yaml-validator':
      return <YamlValidatorClient />;
    case 'age-calculator':
      return <AgeCalculatorClient />;
    case 'anagram-generator':
      return <AnagramGeneratorClient />;
    case 'backlink-checker':
      return <BacklinkCheckerClient />;
    case 'base64':
      return <Base64Client />;
    case 'base64-encoder-decoder':
      return <Base64EncoderDecoderClient />;
    case 'bash-command-generator':
      return <BashCommandGeneratorClient />;
    case 'binary-to-decimal':
      return <BinaryToDecimalClient />;
    case 'binary-to-text':
      return <BinaryToTextClient />;
    case 'broken-link-checker':
      return <BrokenLinkCheckerClient />;
    case 'chinese-char-converter':
      return <ChineseCharConverterClient />;
    case 'cidr-calculator':
      return <CidrCalculatorClient />;
    case 'cmyk-to-rgb-converter':
      return <CmykToRgbConverterClient />;
    case 'cors-header-generator':
      return <CorsHeaderGeneratorClient />;
    case 'countdown-timer':
      return <CountdownTimerClient />;
    case 'crontab-generator':
      return <CrontabGeneratorClient />;
    case 'css-class-generator':
      return <CssClassGeneratorClient />;
    case 'css-preprocessor':
      return <CssPreprocessorClient />;
    case 'css-to-scss-converter':
      return <CssToScssConverterClient />;
    case 'css-validator':
      return <CssValidatorClient />;
    case 'csv-to-json':
      return <CsvToJsonClient />;
    case 'csv-to-tsv':
      return <CsvToTsvClient />;
    case 'curl-to-python':
      return <CurlToPythonClient />;
    case 'decimal-to-binary':
      return <DecimalToBinaryClient />;
    case 'decimal-to-hex':
      return <DecimalToHexClient />;
    case 'decode-tool':
      return <DecodeToolClient />;
    case 'diff-tool':
      return <DiffToolClient />;
    case 'dns-lookup':
      return <DnsLookupClient />;
    case 'duplicate-line-finder':
      return <DuplicateLineFinderClient />;
    case 'duplicate-line-removal':
      return <DuplicateLineRemovalClient />;
    case 'email-generator':
      return <EmailGeneratorClient />;
    case 'email-validator':
      return <EmailValidatorClient />;
    case 'emoji-finder':
      return <EmojiFinderClient />;
    case 'encode-tool':
      return <EncodeToolClient />;
    case 'english-grammar-checker':
      return <EnglishGrammarCheckerClient />;
    case 'fake-data-generator':
      return <FakeDataGeneratorClient />;
    case 'fake-text-generator':
      return <FakeTextGeneratorClient />;
    case 'formatters-tool':
      return <FormattersToolClient />;
    case 'fraction-to-decimal':
      return <FractionToDecimalClient />;
    case 'gitignore-generator':
      return <GitignoreGeneratorClient />;
    case 'hash-from-text':
      return <HashFromTextClient />;
    case 'hash-identifier':
      return <HashIdentifierClient />;
    case 'hex-to-decimal':
      return <HexToDecimalClient />;
    case 'hsl-to-rgb':
      return <HslToRgbClient />;
    case 'htaccess-redirect-generator':
      return <HtaccessRedirectGeneratorClient />;
    case 'html-entity-encoder':
      return <HtmlEntityEncoderClient />;
    case 'html-optimizer':
      return <HtmlOptimizerClient />;
    case 'html-table-generator':
      return <HtmlTableGeneratorClient />;
    case 'html-to-markdown':
      return <HtmlToMarkdownClient />;
    case 'html-to-plain-text':
      return <HtmlToPlainTextClient />;
    case 'html-validator':
      return <HtmlValidatorClient />;
    case 'image-color-picker':
      return <ImageColorPickerClient />;
    case 'image-metadata-viewer':
      return <ImageMetadataViewerClient />;
    case 'ip-range-calculator':
      return <IpRangeCalculatorClient />;
    case 'ip-whois-generator':
      return <IpWhoisGeneratorClient />;
    case 'ipv6-generator':
      return <Ipv6GeneratorClient />;
    case 'javascript-obfuscator':
      return <JavascriptObfuscatorClient />;
    case 'javascript-playground':
      return <JavascriptPlaygroundClient />;
    case 'json-ld-generator':
      return <JsonLdGeneratorClient />;
    case 'json-path-tester':
      return <JsonPathTesterClient />;
    case 'json-schema-validator':
      return <JsonSchemaValidatorClient />;
    case 'json-to-csv':
      return <JsonToCsvClient />;
    case 'json-to-html-table':
      return <JsonToHtmlTableClient />;
    case 'json-to-markdown-table':
      return <JsonToMarkdownTableClient />;
    case 'json-to-python':
      return <JsonToPythonClient />;
    case 'json-to-typescript':
      return <JsonToTypescriptClient />;
    case 'json-to-xml':
      return <JsonToXmlClient />;
    case 'keyword-density-checker':
      return <KeywordDensityCheckerClient />;
    case 'length-converter':
      return <LengthConverterClient />;
    case 'line-counter':
      return <LineCounterClient />;
    case 'line-number-remover':
      return <LineNumberRemoverClient />;
    case 'list-comparator':
      return <ListComparatorClient />;
    case 'list-randomizer':
      return <ListRandomizerClient />;
    case 'mac-address-generator':
      return <MacAddressGeneratorClient />;
    case 'markdown-to-pdf':
      return <MarkdownToPdfClient />;
    case 'meta-description-checker':
      return <MetaDescriptionCheckerClient />;
    case 'morse-code-translator':
      return <MorseCodeTranslatorClient />;
    case 'npm-dependency-checker':
      return <NpmDependencyCheckerClient />;
    case 'number-to-words':
      return <NumberToWordsClient />;
    case 'octal-to-decimal':
      return <OctalToDecimalClient />;
    case 'open-graph-generator':
      return <OpenGraphGeneratorClient />;
    case 'palindrome-checker':
      return <PalindromeCheckerClient />;
    case 'password-strength-checker':
      return <PasswordStrengthCheckerClient />;
    case 'ping-test':
      return <PingTestClient />;
    case 'plain-text-counter':
      return <PlainTextCounterClient />;
    case 'port-scanner':
      return <PortScannerClient />;
    case 'punctuation-fixer':
      return <PunctuationFixerClient />;
    case 'random-fraction-generator':
      return <RandomFractionGeneratorClient />;
    case 'random-ip-address':
      return <RandomIpAddressClient />;
    case 'random-number-generator':
      return <RandomNumberGeneratorClient />;
    case 'random-paragraph-generator':
      return <RandomParagraphGeneratorClient />;
    case 'random-sentence-generator':
      return <RandomSentenceGeneratorClient />;
    case 'random-string-generator-tool':
      return <RandomStringGeneratorToolClient />;
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
