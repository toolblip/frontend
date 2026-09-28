'use client';
import dynamic from 'next/dynamic';
const MediaConversionImageClient = dynamic(() => import('@/components/tools/MediaConversionImageClient'));
const MediaConversionMarkdownClient = dynamic(() => import('@/components/tools/MediaConversionMarkdownClient'));

import { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';


// ─── Imported tool UIs ──────────────────────────────────────────────────────
const DataSizeConverterClient = dynamic(() => import('@/components/tools/DataSizeConverterClient'));
const CronHumanReadableClient = dynamic(() => import('@/components/tools/CronHumanReadableClient'));
const CronScheduleGeneratorClient = dynamic(() => import('@/components/tools/CronScheduleGeneratorClient'));
const CronScheduleValidatorClient = dynamic(() => import('@/components/tools/CronScheduleValidatorClient'));
const EnergyConverterClient = dynamic(() => import('@/components/tools/EnergyConverterClient'));
const FaviconFromEmojiClient = dynamic(() => import('@/components/tools/FaviconFromEmojiClient'));
const CssNamingConventionClient = dynamic(() => import('@/components/tools/CssNamingConventionClient'));
const FrequencyConverterClient = dynamic(() => import('@/components/tools/FrequencyConverterClient'));
const ForceConverterClient = dynamic(() => import('@/components/tools/ForceConverterClient'));
const IconFaviconCreatorClient = dynamic(() => import('@/components/tools/IconFaviconCreatorClient'));
const CronGeneratorCompleteClient = dynamic(() => import('@/components/tools/CronGeneratorCompleteClient'));
const CronScheduleExplainerClient = dynamic(() => import('@/components/tools/CronScheduleExplainerClient'));
const CssAnimationGeneratorClient = dynamic(() => import('@/components/tools/CssAnimationGeneratorClient'));
const CssCursorGeneratorClient = dynamic(() => import('@/components/tools/CssCursorGeneratorClient'));
const YamlToJsonClient = dynamic(() => import('@/components/tools/YamlToJsonClient'));
const XmlToJsonClient = dynamic(() => import('@/components/tools/XmlToJsonClient'));
const XmlFormatterClient = dynamic(() => import('@/components/tools/XmlFormatterClient'));
const WordCounterClient = dynamic(() => import('@/components/tools/WordCounterClient'));
const UuidGeneratorClient = dynamic(() => import('@/components/tools/UuidGeneratorClient'));
const UrlSlugGeneratorClient = dynamic(() => import('@/components/tools/UrlSlugGeneratorClient'));
const UrlParamsClient = dynamic(() => import('@/components/tools/UrlParamsClient'));
const UrlEncodeClient = dynamic(() => import('@/components/tools/UrlEncodeClient'));
const UnixTimestampConverterClient = dynamic(() => import('@/components/tools/UnixTimestampConverterClient'));
const UnitConverterClient = dynamic(() => import('@/components/tools/UnitConverterClient'));
const TextSorterClient = dynamic(() => import('@/components/tools/TextSorterClient'));
const TextDiffClient = dynamic(() => import('@/components/tools/TextDiffClient'));
const SquareCropClient = dynamic(() => import('@/components/tools/SquareCropClient'));
const SqlToJsonClient = dynamic(() => import('@/components/tools/SqlToJsonClient'));
const SerpPreviewClient = dynamic(() => import('@/components/tools/SerpPreviewClient'));
const ScreenResolutionTesterClient = dynamic(() => import('@/components/tools/ScreenResolutionTesterClient'));
const SSHKeyGeneratorClient = dynamic(() => import('@/components/tools/SSHKeyGeneratorClient'));
const RemoveDuplicateLinesClient = dynamic(() => import('@/components/tools/RemoveDuplicateLinesClient'));
const RegexTesterClient = dynamic(() => import('@/components/tools/RegexTesterClient'));
const ReadabilityScoreClient = dynamic(() => import('@/components/tools/ReadabilityScoreClient'));
const QrCodeGeneratorClient = dynamic(() => import('@/components/tools/QrCodeGeneratorClient'));
const PercentageDifferenceClient = dynamic(() => import('@/components/tools/PercentageDifferenceClient'));
const PercentageCalculatorClient = dynamic(() => import('@/components/tools/PercentageCalculatorClient'));
const TipCalculatorClient = dynamic(() => import('@/components/tools/TipCalculatorClient'));
const PasswordGeneratorClient = dynamic(() => import('@/components/tools/PasswordGeneratorClient'));
const NumberBaseConverterClient = dynamic(() => import('@/components/tools/NumberBaseConverterClient'));
const MetaTagGeneratorClient = dynamic(() => import('@/components/tools/MetaTagGeneratorClient'));
const MarkdownToHtmlClient = dynamic(() => import('@/components/tools/MarkdownToHtmlClient'));
const LoremIpsumGeneratorClient = dynamic(() => import('@/components/tools/LoremIpsumGeneratorClient'));
const LoremIpsumDetectorClient = dynamic(() => import('@/components/tools/LoremIpsumDetectorClient'));
const JwtDecoderClient = dynamic(() => import('@/components/tools/JwtDecoderClient'));
const JsonToYamlClient = dynamic(() => import('@/components/tools/JsonToYamlClient'));
const JsonFormatterClient = dynamic(() => import('@/components/tools/JsonFormatterClient'));
const JsonValidatorClient = dynamic(() => import('@/components/tools/JsonValidatorClient'));
const JsonGraphVisualizerClient = dynamic(() => import('@/components/tools/JsonGraphVisualizerClient'));
const JsMinifierClient = dynamic(() => import('@/components/tools/JsMinifierClient'));
const ImageResizerClient = dynamic(() => import('@/components/tools/ImageResizerClient'));
const ImageAspectRatioCalculatorClient = dynamic(() => import('@/components/tools/ImageAspectRatioCalculatorClient'));
const ImageDpiResizerClient = dynamic(() => import('@/components/tools/ImageDpiResizerClient'));
const ImageFormatConverterClient = dynamic(() => import('@/components/tools/ImageFormatConverterClient'));
const ImageCropperClient = dynamic(() => import('@/components/tools/ImageCropperClient'));
const ImageTrimmerClient = dynamic(() => import('@/components/tools/ImageTrimmerClient'));
const EraseColorClient = dynamic(() => import('@/components/tools/EraseColorClient'));
const HtmlEncoderClient = dynamic(() => import('@/components/tools/HtmlEncoderClient'));
const HashGeneratorClient = dynamic(() => import('@/components/tools/HashGeneratorClient'));
const Sha256HashClient = dynamic(() => import('@/components/tools/Sha256HashClient'));
const GrammarCheckerClient = dynamic(() => import('@/components/tools/GrammarCheckerClient'));
const FaviconGeneratorClient = dynamic(() => import('@/components/tools/FaviconGeneratorClient'));
const CssGradientGeneratorClient = dynamic(() => import('@/components/tools/CssGradientGeneratorClient'));
const CssBorderRadiusGeneratorClient = dynamic(() => import('@/components/tools/CssBorderRadiusGeneratorClient'));
const SassToCssClient = dynamic(() => import('@/components/tools/SassToCssClient'));
const CronParserClient = dynamic(() => import('@/components/tools/CronParserClient'));
const CronGeneratorClient = dynamic(() => import('@/components/tools/CronGeneratorClient'));
const CreditCardValidatorClient = dynamic(() => import('@/components/tools/CreditCardValidatorClient'));
const ContrastCheckerClient = dynamic(() => import('@/components/tools/ContrastCheckerClient'));
const ColorPickerClient = dynamic(() => import('@/components/tools/ColorPickerClient'));
const CircleCropClient = dynamic(() => import('@/components/tools/CircleCropClient'));
const CharacterCounterClient = dynamic(() => import('@/components/tools/CharacterCounterClient'));
const CharacterFrequencyCounterClient = dynamic(() => import('@/components/tools/CharacterFrequencyCounterClient'));
const CharacterVarietyCheckerClient = dynamic(() => import('@/components/tools/CharacterVarietyCheckerClient'));
const OxfordCommaClient = dynamic(() => import('@/components/tools/OxfordCommaClient'));
const NotebookToHtmlClient = dynamic(() => import('@/components/tools/NotebookToHtmlClient'));
const OgImageGeneratorClient = dynamic(() => import('@/components/tools/OgImageGeneratorClient'));
const TweetToImageClient = dynamic(() => import('@/components/tools/TweetToImageClient'));
const HexToRgbClient = dynamic(() => import('@/components/tools/HexToRgbClient'));
const RgbToHexClient = dynamic(() => import('@/components/tools/RgbToHexClient'));
const RandomStringClient = dynamic(() => import('@/components/tools/RandomStringClient'));
const Base64EncoderDecoderClient = dynamic(() => import('@/components/tools/Base64EncoderDecoderClient'));
const Base64FileEncoderClient = dynamic(() => import('@/components/tools/Base64FileEncoderClient'));
const Base64ImageDecoderClient = dynamic(() => import('@/components/tools/Base64ImageDecoderClient'));
const Base64ImageEncoderClient = dynamic(() => import('@/components/tools/Base64ImageEncoderClient'));
const Base64ImageViewerClient = dynamic(() => import('@/components/tools/Base64ImageViewerClient'));
const Base64ImageConverterClient = dynamic(() => import('@/components/tools/Base64ImageConverterClient'));
const CaseConverterClient = dynamic(() => import('@/components/tools/CaseConverterClient'));
const AgeCalculatorClient = dynamic(() => import('@/components/tools/AgeCalculatorClient'));
const AnagramGeneratorClient = dynamic(() => import('@/components/tools/AnagramGeneratorClient'));
const BacklinkCheckerClient = dynamic(() => import('@/components/tools/BacklinkCheckerClient'));
const Base64Client = dynamic(() => import('@/components/tools/Base64Client'));
const BashCommandGeneratorClient = dynamic(() => import('@/components/tools/BashCommandGeneratorClient'));
const BinaryToDecimalClient = dynamic(() => import('@/components/tools/BinaryToDecimalClient'));
const BinaryToTextClient = dynamic(() => import('@/components/tools/BinaryToTextClient'));
const BrokenLinkCheckerClient = dynamic(() => import('@/components/tools/BrokenLinkCheckerClient'));
const BrokenImageCheckerClient = dynamic(() => import('@/components/tools/BrokenImageCheckerClient'));
const BrokenLinkCheckerExpressClient = dynamic(() => import('@/components/tools/BrokenLinkCheckerExpressClient'));
const BrokenLinkCheckerV2Client = dynamic(() => import('@/components/tools/BrokenLinkCheckerV2Client'));
const BrowserImageResizerClient = dynamic(() => import('@/components/tools/BrowserImageResizerClient'));
const BusinessPlanGeneratorClient = dynamic(() => import('@/components/tools/BusinessPlanGeneratorClient'));
const ByteConverterClient = dynamic(() => import('@/components/tools/ByteConverterClient'));
const CanonicalUrlGeneratorClient = dynamic(() => import('@/components/tools/CanonicalUrlGeneratorClient'));
const ChineseCharConverterClient = dynamic(() => import('@/components/tools/ChineseCharConverterClient'));
const CidrCalculatorClient = dynamic(() => import('@/components/tools/CidrCalculatorClient'));
const CmykToRgbConverterClient = dynamic(() => import('@/components/tools/CmykToRgbConverterClient'));
const CmykToRgbClient = dynamic(() => import('@/components/tools/CmykToRgbClient'));
const CmykToRgbToolClient = dynamic(() => import('@/components/tools/CmykToRgbToolClient'));
const CorsHeaderGeneratorClient = dynamic(() => import('@/components/tools/CorsHeaderGeneratorClient'));
const CountdownTimerClient = dynamic(() => import('@/components/tools/CountdownTimerClient'));
const CrontabGeneratorClient = dynamic(() => import('@/components/tools/CrontabGeneratorClient'));
const CssClassGeneratorClient = dynamic(() => import('@/components/tools/CssClassGeneratorClient'));
const CssPreprocessorClient = dynamic(() => import('@/components/tools/CssPreprocessorClient'));
const CssToScssConverterClient = dynamic(() => import('@/components/tools/CssToScssConverterClient'));
const CssValidatorClient = dynamic(() => import('@/components/tools/CssValidatorClient'));
const CsvToJsonClient = dynamic(() => import('@/components/tools/CsvToJsonClient'));
const CsvToTsvClient = dynamic(() => import('@/components/tools/CsvToTsvClient'));
const CurlGeneratorClient = dynamic(() => import('@/components/tools/CurlGeneratorClient'));
const CurlToPythonClient = dynamic(() => import('@/components/tools/CurlToPythonClient'));
const DecimalToBinaryClient = dynamic(() => import('@/components/tools/DecimalToBinaryClient'));
const DecimalToHexClient = dynamic(() => import('@/components/tools/DecimalToHexClient'));
const DecodeToolClient = dynamic(() => import('@/components/tools/DecodeToolClient'));
const DiffToolClient = dynamic(() => import('@/components/tools/DiffToolClient'));
const DuplicateLineFinderClient = dynamic(() => import('@/components/tools/DuplicateLineFinderClient'));
const DuplicateLineRemovalClient = dynamic(() => import('@/components/tools/DuplicateLineRemovalClient'));
const EmailGeneratorClient = dynamic(() => import('@/components/tools/EmailGeneratorClient'));
const EmailValidatorClient = dynamic(() => import('@/components/tools/EmailValidatorClient'));
const EmojiFinderClient = dynamic(() => import('@/components/tools/EmojiFinderClient'));
const EncodeToolClient = dynamic(() => import('@/components/tools/EncodeToolClient'));
const EnglishGrammarCheckerClient = dynamic(() => import('@/components/tools/EnglishGrammarCheckerClient'));
const FakeDataGeneratorClient = dynamic(() => import('@/components/tools/FakeDataGeneratorClient'));
const FakeTextGeneratorClient = dynamic(() => import('@/components/tools/FakeTextGeneratorClient'));
const FormattersToolClient = dynamic(() => import('@/components/tools/FormattersToolClient'));
const FractionToDecimalClient = dynamic(() => import('@/components/tools/FractionToDecimalClient'));
const GitignoreGeneratorClient = dynamic(() => import('@/components/tools/GitignoreGeneratorClient'));
const HashFromTextClient = dynamic(() => import('@/components/tools/HashFromTextClient'));
const HashIdentifierClient = dynamic(() => import('@/components/tools/HashIdentifierClient'));
const HexToDecimalClient = dynamic(() => import('@/components/tools/HexToDecimalClient'));
const HslToRgbClient = dynamic(() => import('@/components/tools/HslToRgbClient'));
const HtaccessRedirectGeneratorClient = dynamic(() => import('@/components/tools/HtaccessRedirectGeneratorClient'));
const HtmlEntityEncoderClient = dynamic(() => import('@/components/tools/HtmlEntityEncoderClient'));
const HtmlOptimizerClient = dynamic(() => import('@/components/tools/HtmlOptimizerClient'));
const HtmlTableGeneratorClient = dynamic(() => import('@/components/tools/HtmlTableGeneratorClient'));
const HtmlToMarkdownClient = dynamic(() => import('@/components/tools/HtmlToMarkdownClient'));
const HtmlToPlainTextClient = dynamic(() => import('@/components/tools/HtmlToPlainTextClient'));
const HtmlValidatorClient = dynamic(() => import('@/components/tools/HtmlValidatorClient'));
const ImageMetadataViewerClient = dynamic(() => import('@/components/tools/ImageMetadataViewerClient'));
const IpRangeCalculatorClient = dynamic(() => import('@/components/tools/IpRangeCalculatorClient'));
const IpWhoisGeneratorClient = dynamic(() => import('@/components/tools/IpWhoisGeneratorClient'));
const Ipv6GeneratorClient = dynamic(() => import('@/components/tools/Ipv6GeneratorClient'));
const JavascriptObfuscatorClient = dynamic(() => import('@/components/tools/JavascriptObfuscatorClient'));
const JavascriptPlaygroundClient = dynamic(() => import('@/components/tools/JavascriptPlaygroundClient'));
const JsonLdGeneratorClient = dynamic(() => import('@/components/tools/JsonLdGeneratorClient'));
const JsonPathTesterClient = dynamic(() => import('@/components/tools/JsonPathTesterClient'));
const JsonSchemaValidatorClient = dynamic(() => import('@/components/tools/JsonSchemaValidatorClient'));
const JsonToCsvClient = dynamic(() => import('@/components/tools/JsonToCsvClient'));
const JsonToHtmlTableClient = dynamic(() => import('@/components/tools/JsonToHtmlTableClient'));
const JsonToMarkdownTableClient = dynamic(() => import('@/components/tools/JsonToMarkdownTableClient'));
const JsonToPythonClient = dynamic(() => import('@/components/tools/JsonToPythonClient'));
const JsonToTypescriptClient = dynamic(() => import('@/components/tools/JsonToTypescriptClient'));
const JsonToXmlClient = dynamic(() => import('@/components/tools/JsonToXmlClient'));
const KeywordDensityCheckerClient = dynamic(() => import('@/components/tools/KeywordDensityCheckerClient'));
const LengthConverterClient = dynamic(() => import('@/components/tools/LengthConverterClient'));
const LineCounterClient = dynamic(() => import('@/components/tools/LineCounterClient'));
const LineNumberRemoverClient = dynamic(() => import('@/components/tools/LineNumberRemoverClient'));
const ListComparatorClient = dynamic(() => import('@/components/tools/ListComparatorClient'));
const ListRandomizerClient = dynamic(() => import('@/components/tools/ListRandomizerClient'));
const MacAddressGeneratorClient = dynamic(() => import('@/components/tools/MacAddressGeneratorClient'));
const MarkdownToPdfClient = dynamic(() => import('@/components/tools/MarkdownToPdfClient'));
const MetaDescriptionCheckerClient = dynamic(() => import('@/components/tools/MetaDescriptionCheckerClient'));
const MorseCodeTranslatorClient = dynamic(() => import('@/components/tools/MorseCodeTranslatorClient'));
const NpmDependencyCheckerClient = dynamic(() => import('@/components/tools/NpmDependencyCheckerClient'));
const NumberToWordsClient = dynamic(() => import('@/components/tools/NumberToWordsClient'));
const OctalToDecimalClient = dynamic(() => import('@/components/tools/OctalToDecimalClient'));
const OpenGraphGeneratorClient = dynamic(() => import('@/components/tools/OpenGraphGeneratorClient'));
const PalindromeCheckerClient = dynamic(() => import('@/components/tools/PalindromeCheckerClient'));
const PasswordStrengthCheckerClient = dynamic(() => import('@/components/tools/PasswordStrengthCheckerClient'));
const PingTestClient = dynamic(() => import('@/components/tools/PingTestClient'));
const PlainTextCounterClient = dynamic(() => import('@/components/tools/PlainTextCounterClient'));
const PngToJpgClient = dynamic(() => import('@/components/tools/PngToJpgClient'));
const PunctuationFixerClient = dynamic(() => import('@/components/tools/PunctuationFixerClient'));
const RandomFractionGeneratorClient = dynamic(() => import('@/components/tools/RandomFractionGeneratorClient'));
const SecureRandomGeneratorClient = dynamic(() => import('@/components/tools/SecureRandomGeneratorClient'));
const RandomPinGeneratorClient = dynamic(() => import('@/components/tools/RandomPinGeneratorClient'));
const RandomIdGeneratorClient = dynamic(() => import('@/components/tools/RandomIdGeneratorClient'));
const RandomIpAddressClient = dynamic(() => import('@/components/tools/RandomIpAddressClient'));
const RandomNumberGeneratorClient = dynamic(() => import('@/components/tools/RandomNumberGeneratorClient'));
const RandomParagraphGeneratorClient = dynamic(() => import('@/components/tools/RandomParagraphGeneratorClient'));
const RandomSentenceGeneratorClient = dynamic(() => import('@/components/tools/RandomSentenceGeneratorClient'));
const RandomStringGeneratorToolClient = dynamic(() => import('@/components/tools/RandomStringGeneratorToolClient'));
const RandomUuidV7Client = dynamic(() => import('@/components/tools/RandomUuidV7Client'));
const UlidGeneratorClient = dynamic(() => import('@/components/tools/UlidGeneratorClient'));
const UuidV1GeneratorClient = dynamic(() => import('@/components/tools/UuidV1GeneratorClient'));
const ReadingTimeCalculatorClient = dynamic(() => import('@/components/tools/ReadingTimeCalculatorClient'));
const TimeDurationCalculatorClient = dynamic(() => import('@/components/tools/TimeDurationCalculatorClient'));
const RegexVisualizerClient = dynamic(() => import('@/components/tools/RegexVisualizerClient'));
const RgbaToHslConverterClient = dynamic(() => import('@/components/tools/RgbaToHslConverterClient'));
const RobotsTxtGeneratorClient = dynamic(() => import('@/components/tools/RobotsTxtGeneratorClient'));
const RomanNumeralConverterClient = dynamic(() => import('@/components/tools/RomanNumeralConverterClient'));
const Rot13CipherClient = dynamic(() => import('@/components/tools/Rot13CipherClient'));
const Rot47CipherClient = dynamic(() => import('@/components/tools/Rot47CipherClient'));
const SecurityHeadersGeneratorClient = dynamic(() => import('@/components/tools/SecurityHeadersGeneratorClient'));
const SemanticVersioningClient = dynamic(() => import('@/components/tools/SemanticVersioningClient'));
const SemverCheckerClient = dynamic(() => import('@/components/tools/SemverCheckerClient'));
const SlugGeneratorClient = dynamic(() => import('@/components/tools/SlugGeneratorClient'));
const SqlPrettifierClient = dynamic(() => import('@/components/tools/SqlPrettifierClient'));
const StickyNotesClient = dynamic(() => import('@/components/tools/StickyNotesClient'));
const SvgCleanerClient = dynamic(() => import('@/components/tools/SvgCleanerClient'));
const SyllableCounterClient = dynamic(() => import('@/components/tools/SyllableCounterClient'));
const TemperatureConverterClient = dynamic(() => import('@/components/tools/TemperatureConverterClient'));
const TextPermutationGeneratorClient = dynamic(() => import('@/components/tools/TextPermutationGeneratorClient'));
const TextRedundancyCheckerClient = dynamic(() => import('@/components/tools/TextRedundancyCheckerClient'));
const TextReverserClient = dynamic(() => import('@/components/tools/TextReverserClient'));
const TextStatisticsClient = dynamic(() => import('@/components/tools/TextStatisticsClient'));
const TextToSlugClient = dynamic(() => import('@/components/tools/TextToSlugClient'));
const TextToSpeechClient = dynamic(() => import('@/components/tools/TextToSpeechClient'));
const TimeZoneConverterClient = dynamic(() => import('@/components/tools/TimeZoneConverterClient'));
const TimestampConverterClient = dynamic(() => import('@/components/tools/TimestampConverterClient'));
const TomlToJsonClient = dynamic(() => import('@/components/tools/TomlToJsonClient'));
const TsvToCsvClient = dynamic(() => import('@/components/tools/TsvToCsvClient'));
const TypoCheckerClient = dynamic(() => import('@/components/tools/TypoCheckerClient'));
const UnicodeCharacterInspectorClient = dynamic(() => import('@/components/tools/UnicodeCharacterInspectorClient'));
const UptimeCalculatorClient = dynamic(() => import('@/components/tools/UptimeCalculatorClient'));
const UrlParserClient = dynamic(() => import('@/components/tools/UrlParserClient'));
const UserAgentParserClient = dynamic(() => import('@/components/tools/UserAgentParserClient'));
const UuidValidatorClient = dynamic(() => import('@/components/tools/UuidValidatorClient'));
const WebpackConfigGeneratorClient = dynamic(() => import('@/components/tools/WebpackConfigGeneratorClient'));
const WeightConverterClient = dynamic(() => import('@/components/tools/WeightConverterClient'));
const WordFrequencyAnalyzerClient = dynamic(() => import('@/components/tools/WordFrequencyAnalyzerClient'));
const WordFrequencyCounterClient = dynamic(() => import('@/components/tools/WordFrequencyCounterClient'));
const VsdxToDocxClient = dynamic(() => import('@/components/tools/VsdxToDocxClient'));
const VsdxToPptxClient = dynamic(() => import('@/components/tools/VsdxToPptxClient'));
const WordCombinationsGeneratorClient = dynamic(() => import('@/components/tools/WordCombinationsGeneratorClient'));
const XmlSitemapGeneratorClient = dynamic(() => import('@/components/tools/XmlSitemapGeneratorClient'));
const XmlValidatorClient = dynamic(() => import('@/components/tools/XmlValidatorClient'));
const AiRephraserClient = dynamic(() => import('@/components/tools/AiRephraserClient'));
const ApiAuthHeaderGeneratorClient = dynamic(() => import('@/components/tools/ApiAuthHeaderGeneratorClient'));
const ApiDocGeneratorClient = dynamic(() => import('@/components/tools/ApiDocGeneratorClient'));
const AacToWavClient = dynamic(() => import('@/components/tools/AacToWavClient'));
const AddSubtitlesClient = dynamic(() => import('@/components/tools/AddSubtitlesClient'));
const AlgorithmVisualizerClient = dynamic(() => import('@/components/tools/AlgorithmVisualizerClient'));
const AnnotateClient = dynamic(() => import('@/components/tools/AnnotateClient'));
const AsciiArtGeneratorClient = dynamic(() => import('@/components/tools/AsciiArtGeneratorClient'));
const AllInOneUnitConverterClient = dynamic(() => import('@/components/tools/AllInOneUnitConverterClient'));
const AngleUnitConverterClient = dynamic(() => import('@/components/tools/AngleUnitConverterClient'));
const ApiEndpointDebuggerClient = dynamic(() => import('@/components/tools/ApiEndpointDebuggerClient'));
const ApiEndpointDocumenterClient = dynamic(() => import('@/components/tools/ApiEndpointDocumenterClient'));
const ApiSpecGeneratorClient = dynamic(() => import('@/components/tools/ApiSpecGeneratorClient'));
const AccessibilityCheckerClient = dynamic(() => import('@/components/tools/AccessibilityCheckerClient'));
const AreaConverterClient = dynamic(() => import('@/components/tools/AreaConverterClient'));
const ArticleTitleGenClient = dynamic(() => import('@/components/tools/ArticleTitleGenClient'));
const ArticleTitleGeneratorClient = dynamic(() => import('@/components/tools/ArticleTitleGeneratorClient'));
const AudioToTextClient = dynamic(() => import('@/components/tools/AudioToTextClient'));
const TextToHandwritingClient = dynamic(() => import('@/components/tools/TextToHandwritingClient'));
const AutomationWizardClient = dynamic(() => import('@/components/tools/AutomationWizardClient'));
const AviToGifClient = dynamic(() => import('@/components/tools/AviToGifClient'));
const BackslashEscapeUnescapeClient = dynamic(() => import('@/components/tools/BackslashEscapeUnescapeClient'));
const BaseConvertToolClient = dynamic(() => import('@/components/tools/BaseConvertToolClient'));
const BcryptHashGeneratorClient = dynamic(() => import('@/components/tools/BcryptHashGeneratorClient'));
const BillSaleGeneratorClient = dynamic(() => import('@/components/tools/BillSaleGeneratorClient'));
const BillSplitterClient = dynamic(() => import('@/components/tools/BillSplitterClient'));
const BaseConverterClient = dynamic(() => import('@/components/tools/BaseConverterClient'));
const BaseConverterQuickClient = dynamic(() => import('@/components/tools/BaseConverterQuickClient'));
const BaseNumberConverterClient = dynamic(() => import('@/components/tools/BaseNumberConverterClient'));
const BaseToolblipClient = dynamic(() => import('@/components/tools/BaseToolblipClient'));
const BinHexDecConverterClient = dynamic(() => import('@/components/tools/BinHexDecConverterClient'));
const BinaryConverterClient = dynamic(() => import('@/components/tools/BinaryConverterClient'));
const BinaryDecimalHexConverterClient = dynamic(() => import('@/components/tools/BinaryDecimalHexConverterClient'));
const BinaryTextExpressClient = dynamic(() => import('@/components/tools/BinaryTextExpressClient'));
const BinaryToTextV2Client = dynamic(() => import('@/components/tools/BinaryToTextV2Client'));
const BmiCalculatorClient = dynamic(() => import('@/components/tools/BmiCalculatorClient'));
const BatchFaviconDownloaderClient = dynamic(() => import('@/components/tools/BatchFaviconDownloaderClient'));
const BatchImageResizerClient = dynamic(() => import('@/components/tools/BatchImageResizerClient'));
const ColorBlindnessSimulatorClient = dynamic(() => import('@/components/tools/ColorBlindnessSimulatorClient'));
const ColorContrastAuditorClient = dynamic(() => import('@/components/tools/ColorContrastAuditorClient'));
const ColorContrastCheckerClient = dynamic(() => import('@/components/tools/ColorContrastCheckerClient'));
const ColorContrastMatrixClient = dynamic(() => import('@/components/tools/ColorContrastMatrixClient'));
const ColorContrastRatioCheckerClient = dynamic(() => import('@/components/tools/ColorContrastRatioCheckerClient'));
const ColorFormatConverterClient = dynamic(() => import('@/components/tools/ColorFormatConverterClient'));
const ColorFormatConverterV2Client = dynamic(() => import('@/components/tools/ColorFormatConverterV2Client'));
const ColorFormatPickerClient = dynamic(() => import('@/components/tools/ColorFormatPickerClient'));
const ColorHarmonyExpressClient = dynamic(() => import('@/components/tools/ColorHarmonyExpressClient'));
const ColorHarmonyGeneratorClient = dynamic(() => import('@/components/tools/ColorHarmonyGeneratorClient'));
const RandomColorGeneratorClient = dynamic(() => import('@/components/tools/RandomColorGeneratorClient'));
const ColorHarmonyNewClient = dynamic(() => import('@/components/tools/ColorHarmonyNewClient'));
const ColorLuminanceCalculatorClient = dynamic(() => import('@/components/tools/ColorLuminanceCalculatorClient'));
const ColorLuminanceCheckerClient = dynamic(() => import('@/components/tools/ColorLuminanceCheckerClient'));
const ColorMixerClient = dynamic(() => import('@/components/tools/ColorMixerClient'));
const ColorMixerV2Client = dynamic(() => import('@/components/tools/ColorMixerV2Client'));
const ColorNameFinderClient = dynamic(() => import('@/components/tools/ColorNameFinderClient'));
const ColorNameFinderV2Client = dynamic(() => import('@/components/tools/ColorNameFinderV2Client'));
const ColorNameToolClient = dynamic(() => import('@/components/tools/ColorNameToolClient'));
const ColorOpacityGeneratorClient = dynamic(() => import('@/components/tools/ColorOpacityGeneratorClient'));
const ColorPaletteExtractorClient = dynamic(() => import('@/components/tools/ColorPaletteExtractorClient'));
const ColorPaletteFromImageClient = dynamic(() => import('@/components/tools/ColorPaletteFromImageClient'));
const ColorPaletteGeneratorClient = dynamic(() => import('@/components/tools/ColorPaletteGeneratorClient'));
const ColorPickAllClient = dynamic(() => import('@/components/tools/ColorPickAllClient'));
const ColorPickToolClient = dynamic(() => import('@/components/tools/ColorPickToolClient'));
const ColorPickToolblipClient = dynamic(() => import('@/components/tools/ColorPickToolblipClient'));
const ColorPicker2025Client = dynamic(() => import('@/components/tools/ColorPicker2025Client'));
const ColorPickerAdvClient = dynamic(() => import('@/components/tools/ColorPickerAdvClient'));
const ColorPickerAdvancedClient = dynamic(() => import('@/components/tools/ColorPickerAdvancedClient'));
const ColorPickerApiClient = dynamic(() => import('@/components/tools/ColorPickerApiClient'));
const ColorPickerBrowserClient = dynamic(() => import('@/components/tools/ColorPickerBrowserClient'));
const ColorPickerClassicClient = dynamic(() => import('@/components/tools/ColorPickerClassicClient'));
const ColorPickerCompleteClient = dynamic(() => import('@/components/tools/ColorPickerCompleteClient'));
const ColorPickerDgClient = dynamic(() => import('@/components/tools/ColorPickerDgClient'));
const ColorPickerEasyClient = dynamic(() => import('@/components/tools/ColorPickerEasyClient'));
const ColorPickerEnhancedClient = dynamic(() => import('@/components/tools/ColorPickerEnhancedClient'));
const ColorPickerExpanderClient = dynamic(() => import('@/components/tools/ColorPickerExpanderClient'));
const ColorPickerExpressClient = dynamic(() => import('@/components/tools/ColorPickerExpressClient'));
const ColorPickerFinalClient = dynamic(() => import('@/components/tools/ColorPickerFinalClient'));
const ColorPickerFreshClient = dynamic(() => import('@/components/tools/ColorPickerFreshClient'));
const ColorPickerFullClient = dynamic(() => import('@/components/tools/ColorPickerFullClient'));
const ColorPickerHandyClient = dynamic(() => import('@/components/tools/ColorPickerHandyClient'));
const ColorPickerHexRgbHslClient = dynamic(() => import('@/components/tools/ColorPickerHexRgbHslClient'));
const ColorPickerNewClient = dynamic(() => import('@/components/tools/ColorPickerNewClient'));
const ColorPickerPrimeClient = dynamic(() => import('@/components/tools/ColorPickerPrimeClient'));
const ColorPickerProClient = dynamic(() => import('@/components/tools/ColorPickerProClient'));
const ColorPickerQuickClient = dynamic(() => import('@/components/tools/ColorPickerQuickClient'));
const ColorPickerSmartClient = dynamic(() => import('@/components/tools/ColorPickerSmartClient'));
const ColorPickerStdClient = dynamic(() => import('@/components/tools/ColorPickerStdClient'));
const ColorPickerToolClient = dynamic(() => import('@/components/tools/ColorPickerToolClient'));
const ColorPickerUltimateClient = dynamic(() => import('@/components/tools/ColorPickerUltimateClient'));
const ColorPickerUltraClient = dynamic(() => import('@/components/tools/ColorPickerUltraClient'));
const ColorPickerV3Client = dynamic(() => import('@/components/tools/ColorPickerV3Client'));
const ColorPickerV4Client = dynamic(() => import('@/components/tools/ColorPickerV4Client'));
const ColorPickerV5Client = dynamic(() => import('@/components/tools/ColorPickerV5Client'));
const ColorPickerV6Client = dynamic(() => import('@/components/tools/ColorPickerV6Client'));
const ColorPickerWebClient = dynamic(() => import('@/components/tools/ColorPickerWebClient'));
const ColorPickerWheelClient = dynamic(() => import('@/components/tools/ColorPickerWheelClient'));
const ColorPickerXClient = dynamic(() => import('@/components/tools/ColorPickerXClient'));
const ColorPickerXLClient = dynamic(() => import('@/components/tools/ColorPickerXLClient'));
const ColorQuickClient = dynamic(() => import('@/components/tools/ColorQuickClient'));
const ColorSaturationAdjusterClient = dynamic(() => import('@/components/tools/ColorSaturationAdjusterClient'));
const ColorSelectToolClient = dynamic(() => import('@/components/tools/ColorSelectToolClient'));
const ColorShadeGenClient = dynamic(() => import('@/components/tools/ColorShadeGenClient'));
const ColorShadeGeneratorClient = dynamic(() => import('@/components/tools/ColorShadeGeneratorClient'));
const ColorShadeGeneratorV2Client = dynamic(() => import('@/components/tools/ColorShadeGeneratorV2Client'));
const ColorShadeTintsClient = dynamic(() => import('@/components/tools/ColorShadeTintsClient'));
const ColorShadeToolClient = dynamic(() => import('@/components/tools/ColorShadeToolClient'));
const ColorTintGeneratorClient = dynamic(() => import('@/components/tools/ColorTintGeneratorClient'));
const ColorToneGeneratorClient = dynamic(() => import('@/components/tools/ColorToneGeneratorClient'));
const ColorToolblipClient = dynamic(() => import('@/components/tools/ColorToolblipClient'));
const ContentSummarizerClient = dynamic(() => import('@/components/tools/ContentSummarizerClient'));
const ContrastBrowserClient = dynamic(() => import('@/components/tools/ContrastBrowserClient'));
const ContrastCheckAllClient = dynamic(() => import('@/components/tools/ContrastCheckAllClient'));
const ContrastCheckToolClient = dynamic(() => import('@/components/tools/ContrastCheckToolClient'));
const ContrastCheckToolblipClient = dynamic(() => import('@/components/tools/ContrastCheckToolblipClient'));
const ContrastChecker2025Client = dynamic(() => import('@/components/tools/ContrastChecker2025Client'));
const ContrastCheckerAdvClient = dynamic(() => import('@/components/tools/ContrastCheckerAdvClient'));
const ContrastCheckerAdvancedClient = dynamic(() => import('@/components/tools/ContrastCheckerAdvancedClient'));
const ContrastCheckerApiClient = dynamic(() => import('@/components/tools/ContrastCheckerApiClient'));
const ContrastCheckerBrowserClient = dynamic(() => import('@/components/tools/ContrastCheckerBrowserClient'));
const ContrastCheckerClassicClient = dynamic(() => import('@/components/tools/ContrastCheckerClassicClient'));
const ContrastCheckerCompleteClient = dynamic(() => import('@/components/tools/ContrastCheckerCompleteClient'));
const ContrastCheckerDgClient = dynamic(() => import('@/components/tools/ContrastCheckerDgClient'));
const ContrastCheckerEasyClient = dynamic(() => import('@/components/tools/ContrastCheckerEasyClient'));
const ContrastCheckerEnhancedClient = dynamic(() => import('@/components/tools/ContrastCheckerEnhancedClient'));
const ContrastCheckerExpanderClient = dynamic(() => import('@/components/tools/ContrastCheckerExpanderClient'));
const ContrastCheckerExpressClient = dynamic(() => import('@/components/tools/ContrastCheckerExpressClient'));
const ContrastCheckerFinalClient = dynamic(() => import('@/components/tools/ContrastCheckerFinalClient'));
const ContrastCheckerFreshClient = dynamic(() => import('@/components/tools/ContrastCheckerFreshClient'));
const ContrastCheckerFullClient = dynamic(() => import('@/components/tools/ContrastCheckerFullClient'));
const ContrastCheckerHandyClient = dynamic(() => import('@/components/tools/ContrastCheckerHandyClient'));
const ContrastCheckerNewClient = dynamic(() => import('@/components/tools/ContrastCheckerNewClient'));
const ContrastCheckerPrimeClient = dynamic(() => import('@/components/tools/ContrastCheckerPrimeClient'));
const ContrastCheckerProClient = dynamic(() => import('@/components/tools/ContrastCheckerProClient'));
const ContrastCheckerQuickClient = dynamic(() => import('@/components/tools/ContrastCheckerQuickClient'));
const ContrastCheckerSmartClient = dynamic(() => import('@/components/tools/ContrastCheckerSmartClient'));
const ContrastCheckerStdClient = dynamic(() => import('@/components/tools/ContrastCheckerStdClient'));
const ContrastCheckerToolClient = dynamic(() => import('@/components/tools/ContrastCheckerToolClient'));
const ContrastCheckerUltimateClient = dynamic(() => import('@/components/tools/ContrastCheckerUltimateClient'));
const ContrastCheckerUltraClient = dynamic(() => import('@/components/tools/ContrastCheckerUltraClient'));
const ContrastCheckerV2Client = dynamic(() => import('@/components/tools/ContrastCheckerV2Client'));
const ContrastCheckerV3Client = dynamic(() => import('@/components/tools/ContrastCheckerV3Client'));
const ContrastCheckerV4Client = dynamic(() => import('@/components/tools/ContrastCheckerV4Client'));
const ContrastCheckerV5Client = dynamic(() => import('@/components/tools/ContrastCheckerV5Client'));
const ContrastCheckerV6Client = dynamic(() => import('@/components/tools/ContrastCheckerV6Client'));
const ContrastCheckerWcagClient = dynamic(() => import('@/components/tools/ContrastCheckerWcagClient'));
const ContrastCheckerXClient = dynamic(() => import('@/components/tools/ContrastCheckerXClient'));
const ContrastCheckerXlClient = dynamic(() => import('@/components/tools/ContrastCheckerXlClient'));
const ContrastFreshClient = dynamic(() => import('@/components/tools/ContrastFreshClient'));
const ContrastQuickClient = dynamic(() => import('@/components/tools/ContrastQuickClient'));
const ContrastToolblipClient = dynamic(() => import('@/components/tools/ContrastToolblipClient'));
const CookingUnitConverterClient = dynamic(() => import('@/components/tools/CookingUnitConverterClient'));
const CronBuilderClient = dynamic(() => import('@/components/tools/CronBuilderClient'));
const CronExpanderClient = dynamic(() => import('@/components/tools/CronExpanderClient'));
const CronExpressionGeneratorClient = dynamic(() => import('@/components/tools/CronExpressionGeneratorClient'));
const CronExpressionParserClient = dynamic(() => import('@/components/tools/CronExpressionParserClient'));
const CronValidatorClient = dynamic(() => import('@/components/tools/CronValidatorClient'));
const CropCircleClient = dynamic(() => import('@/components/tools/CropCircleClient'));
const CssFlexboxGeneratorClient = dynamic(() => import('@/components/tools/CssFlexboxGeneratorClient'));
const CssGridGeneratorClient = dynamic(() => import('@/components/tools/CssGridGeneratorClient'));
const CssToStyledComponentsClient = dynamic(() => import('@/components/tools/CssToStyledComponentsClient'));
const CssToTailwindClient = dynamic(() => import('@/components/tools/CssToTailwindClient'));
const CsvGeneratorClient = dynamic(() => import('@/components/tools/CsvGeneratorClient'));
const CsvJsonExpressClient = dynamic(() => import('@/components/tools/CsvJsonExpressClient'));
const CsvToExcelClient = dynamic(() => import('@/components/tools/CsvToExcelClient'));
const CsvToJsonV2Client = dynamic(() => import('@/components/tools/CsvToJsonV2Client'));
const CsvToTsvV2Client = dynamic(() => import('@/components/tools/CsvToTsvV2Client'));
const CsvToXmlClient = dynamic(() => import('@/components/tools/CsvToXmlClient'));
const CurlCommandBuilderClient = dynamic(() => import('@/components/tools/CurlCommandBuilderClient'));
const CurlGenExpressClient = dynamic(() => import('@/components/tools/CurlGenExpressClient'));
const CurlToJavascriptClient = dynamic(() => import('@/components/tools/CurlToJavascriptClient'));
const CutterClient = dynamic(() => import('@/components/tools/CutterClient'));
const DataUriGeneratorClient = dynamic(() => import('@/components/tools/DataUriGeneratorClient'));
const DbQueryFormatterClient = dynamic(() => import('@/components/tools/DbQueryFormatterClient'));
const DetectClient = dynamic(() => import('@/components/tools/DetectClient'));
const DiscountCalculatorClient = dynamic(() => import('@/components/tools/DiscountCalculatorClient'));
const DnsLookupExpressClient = dynamic(() => import('@/components/tools/DnsLookupExpressClient'));
const DnsLookupToolClient = dynamic(() => import('@/components/tools/DnsLookupToolClient'));
const DnsLookupV2Client = dynamic(() => import('@/components/tools/DnsLookupV2Client'));
const DockerComposeGeneratorClient = dynamic(() => import('@/components/tools/DockerComposeGeneratorClient'));
const DomainAgeCheckerClient = dynamic(() => import('@/components/tools/DomainAgeCheckerClient'));
const DominantColorExtractorClient = dynamic(() => import('@/components/tools/DominantColorExtractorClient'));
const DpiPpiCalculatorClient = dynamic(() => import('@/components/tools/DpiPpiCalculatorClient'));
const DummyTextDetectorClient = dynamic(() => import('@/components/tools/DummyTextDetectorClient'));
const DuplicatePhraseDetectorClient = dynamic(() => import('@/components/tools/DuplicatePhraseDetectorClient'));
const DuplicateUrlDetectorClient = dynamic(() => import('@/components/tools/DuplicateUrlDetectorClient'));
const EditClient = dynamic(() => import('@/components/tools/EditClient'));
const EncodingsRefClient = dynamic(() => import('@/components/tools/EncodingsRefClient'));
const EncodingsReferenceClient = dynamic(() => import('@/components/tools/EncodingsReferenceClient'));
const CollocationsCheckerClient = dynamic(() => import('@/components/tools/CollocationsCheckerClient'));
const EnglishCollocationsCheckerClient = dynamic(() => import('@/components/tools/EnglishCollocationsCheckerClient'));
const EnglishCollocationsUniqueClient = dynamic(() => import('@/components/tools/EnglishCollocationsUniqueClient'));
const EnglishDictionaryClient = dynamic(() => import('@/components/tools/EnglishDictionaryClient'));
const EnvParserClient = dynamic(() => import('@/components/tools/EnvParserClient'));
const ExcelToCsvClient = dynamic(() => import('@/components/tools/ExcelToCsvClient'));
const ExcelToPdfClient = dynamic(() => import('@/components/tools/ExcelToPdfClient'));
const ExcelToXmlClient = dynamic(() => import('@/components/tools/ExcelToXmlClient'));
const ExifRemoverClient = dynamic(() => import('@/components/tools/ExifRemoverClient'));
const ExtractAudioClient = dynamic(() => import('@/components/tools/ExtractAudioClient'));
const ExtractImgClient = dynamic(() => import('@/components/tools/ExtractImgClient'));
const FontToPngClient = dynamic(() => import('@/components/tools/FontToPngClient'));
const FractionCalculatorClient = dynamic(() => import('@/components/tools/FractionCalculatorClient'));
const GifToApngClient = dynamic(() => import('@/components/tools/GifToApngClient'));
const GifToJpgClient = dynamic(() => import('@/components/tools/GifToJpgClient'));
const GifToPngClient = dynamic(() => import('@/components/tools/GifToPngClient'));
const GoogleAlgorithmTrackerClient = dynamic(() => import('@/components/tools/GoogleAlgorithmTrackerClient'));
const GoogleSerpPreviewClient = dynamic(() => import('@/components/tools/GoogleSerpPreviewClient'));
const GoogleSerpSimulatorClient = dynamic(() => import('@/components/tools/GoogleSerpSimulatorClient'));
const GradientGeneratorClient = dynamic(() => import('@/components/tools/GradientGeneratorClient'));
const GrammarCheckToolClient = dynamic(() => import('@/components/tools/GrammarCheckToolClient'));
const GrammarChecker2025Client = dynamic(() => import('@/components/tools/GrammarChecker2025Client'));
const GrammarCheckerAdvClient = dynamic(() => import('@/components/tools/GrammarCheckerAdvClient'));
const GrammarCheckerAdvancedClient = dynamic(() => import('@/components/tools/GrammarCheckerAdvancedClient'));
const GrammarCheckerAiClient = dynamic(() => import('@/components/tools/GrammarCheckerAiClient'));
const GrammarCheckerApiClient = dynamic(() => import('@/components/tools/GrammarCheckerApiClient'));
const GrammarCheckerBrowserClient = dynamic(() => import('@/components/tools/GrammarCheckerBrowserClient'));
const GrammarCheckerClassicClient = dynamic(() => import('@/components/tools/GrammarCheckerClassicClient'));
const GrammarCheckerCompleteClient = dynamic(() => import('@/components/tools/GrammarCheckerCompleteClient'));
const GrammarCheckerDgClient = dynamic(() => import('@/components/tools/GrammarCheckerDgClient'));
const GrammarCheckerEasyClient = dynamic(() => import('@/components/tools/GrammarCheckerEasyClient'));
const GrammarCheckerEnhancedClient = dynamic(() => import('@/components/tools/GrammarCheckerEnhancedClient'));
const GrammarCheckerExpanderClient = dynamic(() => import('@/components/tools/GrammarCheckerExpanderClient'));
const GrammarCheckerExpressClient = dynamic(() => import('@/components/tools/GrammarCheckerExpressClient'));
const GrammarCheckerFinalClient = dynamic(() => import('@/components/tools/GrammarCheckerFinalClient'));
const GrammarCheckerFreshClient = dynamic(() => import('@/components/tools/GrammarCheckerFreshClient'));
const GrammarCheckerFullClient = dynamic(() => import('@/components/tools/GrammarCheckerFullClient'));
const GrammarCheckerInstantClient = dynamic(() => import('@/components/tools/GrammarCheckerInstantClient'));
const GrammarCheckerLiteClient = dynamic(() => import('@/components/tools/GrammarCheckerLiteClient'));
const GrammarCheckerNewClient = dynamic(() => import('@/components/tools/GrammarCheckerNewClient'));
const GrammarCheckerPrimeClient = dynamic(() => import('@/components/tools/GrammarCheckerPrimeClient'));
const GrammarCheckerProClient = dynamic(() => import('@/components/tools/GrammarCheckerProClient'));
const GrammarCheckerQuickClient = dynamic(() => import('@/components/tools/GrammarCheckerQuickClient'));
const GrammarCheckerSmartClient = dynamic(() => import('@/components/tools/GrammarCheckerSmartClient'));
const GrammarCheckerStdClient = dynamic(() => import('@/components/tools/GrammarCheckerStdClient'));
const GrammarCheckerToolClient = dynamic(() => import('@/components/tools/GrammarCheckerToolClient'));
const GrammarCheckerToolblipClient = dynamic(() => import('@/components/tools/GrammarCheckerToolblipClient'));
const GrammarCheckerUltimateClient = dynamic(() => import('@/components/tools/GrammarCheckerUltimateClient'));
const GrammarCheckerUltraClient = dynamic(() => import('@/components/tools/GrammarCheckerUltraClient'));
const GrammarCheckerV2Client = dynamic(() => import('@/components/tools/GrammarCheckerV2Client'));
const GrammarCheckerV3Client = dynamic(() => import('@/components/tools/GrammarCheckerV3Client'));
const GrammarCheckerV4Client = dynamic(() => import('@/components/tools/GrammarCheckerV4Client'));
const GrammarCheckerV5Client = dynamic(() => import('@/components/tools/GrammarCheckerV5Client'));
const GrammarCheckerV6Client = dynamic(() => import('@/components/tools/GrammarCheckerV6Client'));
const GrammarCheckerWebClient = dynamic(() => import('@/components/tools/GrammarCheckerWebClient'));
const GrammarCheckerXClient = dynamic(() => import('@/components/tools/GrammarCheckerXClient'));
const GrammarCheckerXlClient = dynamic(() => import('@/components/tools/GrammarCheckerXlClient'));
const GrammarFixToolClient = dynamic(() => import('@/components/tools/GrammarFixToolClient'));
const GrammarFixerClient = dynamic(() => import('@/components/tools/GrammarFixerClient'));
const GrammarScoreCheckerClient = dynamic(() => import('@/components/tools/GrammarScoreCheckerClient'));
const GraphqlPlaygroundClient = dynamic(() => import('@/components/tools/GraphqlPlaygroundClient'));
const HashCollisionFinderClient = dynamic(() => import('@/components/tools/HashCollisionFinderClient'));
const HashDiffCheckerClient = dynamic(() => import('@/components/tools/HashDiffCheckerClient'));
const HeadingTagAnalyzerClient = dynamic(() => import('@/components/tools/HeadingTagAnalyzerClient'));
const JpgToPngClient = dynamic(() => import('@/components/tools/JpgToPngClient'));
const ImageToSvgConverterClient = dynamic(() => import('@/components/tools/ImageToSvgConverterClient'));
const SeoMetaTagAnalyzerClient = dynamic(() => import('@/components/tools/SeoMetaTagAnalyzerClient'));
const LoremIpsumGeneratorProClient = dynamic(() => import('@/components/tools/LoremIpsumGeneratorProClient'));
const LdapFilterGeneratorClient = dynamic(() => import('@/components/tools/LdapFilterGeneratorClient'));
const KeywordGeneratorExpressClient = dynamic(() => import('@/components/tools/KeywordGeneratorExpressClient'));
const MetaGenToolblipClient = dynamic(() => import('@/components/tools/MetaGenToolblipClient'));
const MetaTagGenAdvClient = dynamic(() => import('@/components/tools/MetaTagGenAdvClient'));
const MetaTagGenPrimeClient = dynamic(() => import('@/components/tools/MetaTagGenPrimeClient'));
const MetaTagGenProClient = dynamic(() => import('@/components/tools/MetaTagGenProClient'));
const MetaTagGenToolClient = dynamic(() => import('@/components/tools/MetaTagGenToolClient'));
const MetaTagGenUltraClient = dynamic(() => import('@/components/tools/MetaTagGenUltraClient'));
const ShellCommandGenExpressClient = dynamic(() => import('@/components/tools/ShellCommandGenExpressClient'));
const TempConverterExpressClient = dynamic(() => import('@/components/tools/TempConverterExpressClient'));
const LoremIpsumGenToolClient = dynamic(() => import('@/components/tools/LoremIpsumGenToolClient'));
const JsonCsvExpressClient = dynamic(() => import('@/components/tools/JsonCsvExpressClient'));
const JsonEditorClient = dynamic(() => import('@/components/tools/JsonEditorClient'));
const JsonPathEvaluatorExpressClient = dynamic(() => import('@/components/tools/JsonPathEvaluatorExpressClient'));
const JsonSchemaGenExpressClient = dynamic(() => import('@/components/tools/JsonSchemaGenExpressClient'));
const HeadlineAnalyzerClient = dynamic(() => import('@/components/tools/HeadlineAnalyzerClient'));
const HeicToJpgClient = dynamic(() => import('@/components/tools/HeicToJpgClient'));
const HeicToPngClient = dynamic(() => import('@/components/tools/HeicToPngClient'));
const HexColorPickerClient = dynamic(() => import('@/components/tools/HexColorPickerClient'));
const HexRgbHslColorPickerClient = dynamic(() => import('@/components/tools/HexRgbHslColorPickerClient'));
const HexToCmykClient = dynamic(() => import('@/components/tools/HexToCmykClient'));
const HexToDecimalConverterClient = dynamic(() => import('@/components/tools/HexToDecimalConverterClient'));
const HexToHslClient = dynamic(() => import('@/components/tools/HexToHslClient'));
const HexToHsvClient = dynamic(() => import('@/components/tools/HexToHsvClient'));
const HexToNamedColorClient = dynamic(() => import('@/components/tools/HexToNamedColorClient'));
const HexToRgbaClient = dynamic(() => import('@/components/tools/HexToRgbaClient'));
const HmacGeneratorClient = dynamic(() => import('@/components/tools/HmacGeneratorClient'));
const HomoglyphDetectorClient = dynamic(() => import('@/components/tools/HomoglyphDetectorClient'));
const HreflangTagGeneratorClient = dynamic(() => import('@/components/tools/HreflangTagGeneratorClient'));
const HslToHexClient = dynamic(() => import('@/components/tools/HslToHexClient'));
const HsvToHexClient = dynamic(() => import('@/components/tools/HsvToHexClient'));
const HtmlAttributeEncoderClient = dynamic(() => import('@/components/tools/HtmlAttributeEncoderClient'));
const HtmlEncoderDecoderClient = dynamic(() => import('@/components/tools/HtmlEncoderDecoderClient'));
const HtmlLivePreviewClient = dynamic(() => import('@/components/tools/HtmlLivePreviewClient'));
const HtmlMarkdownExpressClient = dynamic(() => import('@/components/tools/HtmlMarkdownExpressClient'));
const HtmlTableToJsonClient = dynamic(() => import('@/components/tools/HtmlTableToJsonClient'));
const HtmlToJsxClient = dynamic(() => import('@/components/tools/HtmlToJsxClient'));
const HtmlToMarkdownV2Client = dynamic(() => import('@/components/tools/HtmlToMarkdownV2Client'));
const HttpHeaders2025Client = dynamic(() => import('@/components/tools/HttpHeaders2025Client'));
const HttpHeadersAnalyzerClient = dynamic(() => import('@/components/tools/HttpHeadersAnalyzerClient'));
const HttpHeadersBrowserClient = dynamic(() => import('@/components/tools/HttpHeadersBrowserClient'));
const HttpHeadersCheckClient = dynamic(() => import('@/components/tools/HttpHeadersCheckClient'));
const HttpHeadersCheckerClient = dynamic(() => import('@/components/tools/HttpHeadersCheckerClient'));
const HttpHeadersDgClient = dynamic(() => import('@/components/tools/HttpHeadersDgClient'));
const HttpHeadersEasyClient = dynamic(() => import('@/components/tools/HttpHeadersEasyClient'));
const HttpHeadersExpanderClient = dynamic(() => import('@/components/tools/HttpHeadersExpanderClient'));
const HttpHeadersFreshClient = dynamic(() => import('@/components/tools/HttpHeadersFreshClient'));
const HttpHeadersFullClient = dynamic(() => import('@/components/tools/HttpHeadersFullClient'));
const HttpHeadersInspectorClient = dynamic(() => import('@/components/tools/HttpHeadersInspectorClient'));
const HttpHeadersQuickClient = dynamic(() => import('@/components/tools/HttpHeadersQuickClient'));
const ColorTemperatureAdjusterClient = dynamic(() => import('@/components/tools/ColorTemperatureAdjusterClient'));
const ChartMakerClient = dynamic(() => import('@/components/tools/ChartMakerClient'));
const CodeBeautifierClient = dynamic(() => import('@/components/tools/CodeBeautifierClient'));
const CodeDiffClient = dynamic(() => import('@/components/tools/CodeDiffClient'));
const CodeDiffToolClient = dynamic(() => import('@/components/tools/CodeDiffToolClient'));
const CodeToDiagramGeneratorClient = dynamic(() => import('@/components/tools/CodeToDiagramGeneratorClient'));
const CollageMakerClient = dynamic(() => import('@/components/tools/CollageMakerClient'));
const CombineImagesClient = dynamic(() => import('@/components/tools/CombineImagesClient'));
const CropClient = dynamic(() => import('@/components/tools/CropClient'));
const CssMinifierClient = dynamic(() => import('@/components/tools/CssMinifierClient'));
const CurrencyConverterClient = dynamic(() => import('@/components/tools/CurrencyConverterClient'));
const DockerCommandGeneratorClient = dynamic(() => import('@/components/tools/DockerCommandGeneratorClient'));
const FakeAddressGeneratorClient = dynamic(() => import('@/components/tools/FakeAddressGeneratorClient'));
const FillerWordCounterClient = dynamic(() => import('@/components/tools/FillerWordCounterClient'));
const FleschKincaidCalculatorClient = dynamic(() => import('@/components/tools/FleschKincaidCalculatorClient'));
const GifMakerClient = dynamic(() => import('@/components/tools/GifMakerClient'));
const GrayscaleClient = dynamic(() => import('@/components/tools/GrayscaleClient'));
const HomophoneCheckerClient = dynamic(() => import('@/components/tools/HomophoneCheckerClient'));
const HtmlMinifierClient = dynamic(() => import('@/components/tools/HtmlMinifierClient'));
const HttpStatusCheckerClient = dynamic(() => import('@/components/tools/HttpStatusCheckerClient'));
const ImageBackgroundRemoverClient = dynamic(() => import('@/components/tools/ImageBackgroundRemoverClient'));
const ImageBorderAdderClient = dynamic(() => import('@/components/tools/ImageBorderAdderClient'));
const ImageCompressorClient = dynamic(() => import('@/components/tools/ImageCompressorClient'));
const ImageFlipToolClient = dynamic(() => import('@/components/tools/ImageFlipToolClient'));
const ImageOptimizerClient = dynamic(() => import('@/components/tools/ImageOptimizerClient'));
const ImageRotateToolClient = dynamic(() => import('@/components/tools/ImageRotateToolClient'));
const ImageShadowGeneratorClient = dynamic(() => import('@/components/tools/ImageShadowGeneratorClient'));
const MergeClient = dynamic(() => import('@/components/tools/MergeClient'));
const PdfPasswordRemoverClient = dynamic(() => import('@/components/tools/PdfPasswordRemoverClient'));
const PdfPageDeleterClient = dynamic(() => import('@/components/tools/PdfPageDeleterClient'));
const PdfPageAdderClient = dynamic(() => import('@/components/tools/PdfPageAdderClient'));
const MemeMakerClient = dynamic(() => import('@/components/tools/MemeMakerClient'));
const OgTagDebuggerClient = dynamic(() => import('@/components/tools/OgTagDebuggerClient'));
const OpenGraphPreviewClient = dynamic(() => import('@/components/tools/OpenGraphPreviewClient'));
const ParagraphCounterClient = dynamic(() => import('@/components/tools/ParagraphCounterClient'));
const PassiveVoiceDetectorClient = dynamic(() => import('@/components/tools/PassiveVoiceDetectorClient'));
const PixelateClient = dynamic(() => import('@/components/tools/PixelateClient'));
const ReadabilityCheckerClient = dynamic(() => import('@/components/tools/ReadabilityCheckerClient'));
const RobotsTxtEditorClient = dynamic(() => import('@/components/tools/RobotsTxtEditorClient'));
const SentenceCounterClient = dynamic(() => import('@/components/tools/SentenceCounterClient'));
const SharpenClient = dynamic(() => import('@/components/tools/SharpenClient'));
const SitemapAnalyzerClient = dynamic(() => import('@/components/tools/SitemapAnalyzerClient'));
const SqlFormatterClient = dynamic(() => import('@/components/tools/SqlFormatterClient'));
const TemperatureUnitConverterClient = dynamic(() => import('@/components/tools/TemperatureUnitConverterClient'));
const TextUniquenessCheckerClient = dynamic(() => import('@/components/tools/TextUniquenessCheckerClient'));
const AddWatermarkToPDFClient = dynamic(() => import('@/components/tools/AddWatermarkToPDFClient'));
const CreateZipFileClient = dynamic(() => import('@/components/tools/CreateZipFileClient'));
const TsvToJsonClient = dynamic(() => import('@/components/tools/TsvToJsonClient'));
const UrlRedirectCheckerClient = dynamic(() => import('@/components/tools/UrlRedirectCheckerClient'));
const WebpConverterClient = dynamic(() => import('@/components/tools/WebpConverterClient'));
const ImageScaleCalculatorClient = dynamic(() => import('@/components/tools/ImageScaleCalculatorClient'));
const ImageSquareFitClient = dynamic(() => import('@/components/tools/ImageSquareFitClient'));
const IPynbFormatterClient = dynamic(() => import('@/components/tools/IPynbFormatterClient'));
const JwtTokenInspectorClient = dynamic(() => import('@/components/tools/JwtTokenInspectorClient'));
const JwtTokenTesterClient = dynamic(() => import('@/components/tools/JwtTokenTesterClient'));
const KeywordDifficultyToolClient = dynamic(() => import('@/components/tools/KeywordDifficultyToolClient'));
const KeywordExtractorClient = dynamic(() => import('@/components/tools/KeywordExtractorClient'));
const KeywordGeneratorClient = dynamic(() => import('@/components/tools/KeywordGeneratorClient'));
const ListDifferenceFinderClient = dynamic(() => import('@/components/tools/ListDifferenceFinderClient'));
const MetaTagsToolClient = dynamic(() => import('@/components/tools/MetaTagsToolClient'));
const MetricImperialConverterClient = dynamic(() => import('@/components/tools/MetricImperialConverterClient'));
const MIMETypesReferenceClient = dynamic(() => import('@/components/tools/MIMETypesReferenceClient'));
const MP4ToMP3Client = dynamic(() => import('@/components/tools/MP4ToMP3Client'));
const MkvToMp3Client = dynamic(() => import('@/components/tools/MkvToMp3Client'));
const NDAGeneratorClient = dynamic(() => import('@/components/tools/NDAGeneratorClient'));
const PageTitleCheckerClient = dynamic(() => import('@/components/tools/PageTitleCheckerClient'));
const PhotoMetadataRemoverClient = dynamic(() => import('@/components/tools/PhotoMetadataRemoverClient'));
const PhotoResizeToolClient = dynamic(() => import('@/components/tools/PhotoResizeToolClient'));
const PhysicsConstantsReferenceClient = dynamic(() => import('@/components/tools/PhysicsConstantsReferenceClient'));
const PollGeneratorClient = dynamic(() => import('@/components/tools/PollGeneratorClientV2'));
const PressureConverterClient = dynamic(() => import('@/components/tools/PressureConverterClient'));
const ProfilePhotoEditorClient = dynamic(() => import('@/components/tools/ProfilePhotoEditorClient'));
const PurchaseAgreementGeneratorClient = dynamic(() => import('@/components/tools/PurchaseAgreementGeneratorClient'));
const PunycodeEncoderClient = dynamic(() => import('@/components/tools/PunycodeEncoderClient'));
const QuoteOfTheDayClient = dynamic(() => import('@/components/tools/QuoteOfTheDayClient'));
const RandomChoicePickerClient = dynamic(() => import('@/components/tools/RandomChoicePickerClient'));
const RandomChoiceWheelClient = dynamic(() => import('@/components/tools/RandomChoiceWheelClient'));
const ReadingLevelEstimatorClient = dynamic(() => import('@/components/tools/ReadingLevelEstimatorClient'));
const RearrangePDFPagesClient = dynamic(() => import('@/components/tools/RearrangePDFPagesClient'));
const RegexDescriptionGeneratorClient = dynamic(() => import('@/components/tools/RegexDescriptionGeneratorClient'));
const RegexEscapeClient = dynamic(() => import('@/components/tools/RegexEscapeClient'));
const RegexExplainerClient = dynamic(() => import('@/components/tools/RegexExplainerClient'));
const RegexPatternBuilderClient = dynamic(() => import('@/components/tools/RegexPatternBuilderClient'));
const RegexPatternGeneratorClient = dynamic(() => import('@/components/tools/RegexPatternGeneratorClient'));
const RemoveExtraSpacesClient = dynamic(() => import('@/components/tools/RemoveExtraSpacesClient'));
const ScreenDensitySimulatorClient = dynamic(() => import('@/components/tools/ScreenDensitySimulatorClient'));
const ScientificNotationConverterClient = dynamic(() => import('@/components/tools/ScientificNotationConverterClient'));
const SentenceExtractorClient = dynamic(() => import('@/components/tools/SentenceExtractorClient'));
const SentimentAnalyzerClient = dynamic(() => import('@/components/tools/SentimentAnalyzerClient'));
const SEOMetaBuilderClient = dynamic(() => import('@/components/tools/SEOMetaBuilderClient'));
const SEOTitleAnalyzerClient = dynamic(() => import('@/components/tools/SEOTitleAnalyzerClient'));
const SERPQuickClient = dynamic(() => import('@/components/tools/SERPQuickClient'));
const SERPSnippetViewerClient = dynamic(() => import('@/components/tools/SERPSnippetViewerClient'));
const ShellCommandReferenceClient = dynamic(() => import('@/components/tools/ShellCommandReferenceClient'));
const SignPDFClient = dynamic(() => import('@/components/tools/SignPDFClient'));
const SitemapHTMLNewClient = dynamic(() => import('@/components/tools/SitemapHTMLNewClient'));
const SlugHealthCheckerClient = dynamic(() => import('@/components/tools/SlugHealthCheckerClient'));
const SlugPermalinkCheckerClient = dynamic(() => import('@/components/tools/SlugPermalinkCheckerClient'));
const SlideshowGeneratorClient = dynamic(() => import('@/components/tools/SlideshowGeneratorClient'));
const TextComplexityAnalyzerClient = dynamic(() => import('@/components/tools/TextComplexityAnalyzerClient'));
const TextDeduplicatorClient = dynamic(() => import('@/components/tools/TextDeduplicatorClient'));
const TextHighlighterClient = dynamic(() => import('@/components/tools/TextHighlighterClient'));
const TextLineDeduplicatorClient = dynamic(() => import('@/components/tools/TextLineDeduplicatorClient'));
const TextSentenceShufflerClient = dynamic(() => import('@/components/tools/TextSentenceShufflerClient'));
const TextSortToolClient = dynamic(() => import('@/components/tools/TextSortToolClient'));
const TextStructureValidatorClient = dynamic(() => import('@/components/tools/TextStructureValidatorClient'));
const TimestampDiffCalculatorClient = dynamic(() => import('@/components/tools/TimestampDiffCalculatorClient'));
const LogoTraceConverterClient = dynamic(() => import('@/components/tools/LogoTraceConverterClient'));
const TwitterCardPreviewClient = dynamic(() => import('@/components/tools/TwitterCardPreviewClient'));
const UAParserExpressClient = dynamic(() => import('@/components/tools/UAParserExpressClient'));
const UnicodeEscapeEncoderClient = dynamic(() => import('@/components/tools/UnicodeEscapeEncoderClient'));
const UnitConversionToolClient = dynamic(() => import('@/components/tools/UnitConversionToolClient'));
const UUIDCompareClient = dynamic(() => import('@/components/tools/UUIDCompareClient'));
const UUIDComparatorClient = dynamic(() => import('@/components/tools/UUIDComparatorClient'));
const UUIDNormalizerClient = dynamic(() => import('@/components/tools/UUIDNormalizerClient'));
const WebSocketTesterClient = dynamic(() => import('@/components/tools/WebSocketTesterClient'));
const WhatIfScenarioCalculatorClient = dynamic(() => import('@/components/tools/WhatIfScenarioCalculatorClient'));
const WordAlphabetizerClient = dynamic(() => import('@/components/tools/WordAlphabetizerClient'));
const WordFinderClient = dynamic(() => import('@/components/tools/WordFinderClient'));
const WordFreqExpressClient = dynamic(() => import('@/components/tools/WordFreqExpressClient'));
const WordScrambleGeneratorClient = dynamic(() => import('@/components/tools/WordScrambleGeneratorClient'));
const JupyterCleanerClient = dynamic(() => import('@/components/tools/JupyterCleanerClient'));
const JsonTreeViewClient = dynamic(() => import('@/components/tools/JsonTreeViewClient'));
const JSONToURLEncodedV2Client = dynamic(() => import('@/components/tools/JSONToURLEncodedV2Client'));
const SearchConsoleInsightsClient = dynamic(() => import('@/components/tools/SearchConsoleInsightsClient'));
const SplitCSVFileClient = dynamic(() => import('@/components/tools/SplitCSVFileClient'));
const SplitExcelFileClient = dynamic(() => import('@/components/tools/SplitExcelFileClient'));
const MockPortCheckClient = dynamic(() => import('@/components/tools/MockPortCheckClient'));
const MetaToolClient = dynamic(() => import('@/components/tools/MetaToolClient'));
const PortToolClient = dynamic(() => import('@/components/tools/PortToolClient'));
const SerpToolClient = dynamic(() => import('@/components/tools/SerpToolClient'));
const RegexToolClient = dynamic(() => import('@/components/tools/RegexToolClient'));
const JwtToolClient = dynamic(() => import('@/components/tools/JwtToolClient'));

const WordCloudGeneratorClient = dynamic(() => import('@/components/tools/WordCloudGeneratorClient'));
const PressReleaseGeneratorClient = dynamic(() => import('@/components/tools/PressReleaseGeneratorClient'));
const PrivacyPolicyGeneratorClient = dynamic(() => import('@/components/tools/PrivacyPolicyGeneratorClient'));
const TokenBuilderClient = dynamic(() => import('@/components/tools/TokenBuilderClient'));
const PixelDensityCalculatorClient = dynamic(() => import('@/components/tools/PixelDensityCalculatorClient'));

// ─── Tool routing ────────────────────────────────────────────────────────────

export function ToolUI({ tool }: { tool: Tool }) {

  switch (tool.slug) {
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'character-frequency-counter':
      return <CharacterFrequencyCounterClient />;
    case 'character-variety-checker':
      return <CharacterVarietyCheckerClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'base64-image-converter':
      return <Base64ImageConverterClient />;
    case 'url-encode':
      return <UrlEncodeClient />;
    case 'json-formatter':
      return <JsonFormatterClient />;
    case 'json-validator':
      return <JsonValidatorClient />;
    case 'json-yaml-converter':
    case 'json-to-yaml':
    case 'yaml-to-json':
      return <YamlToJsonClient />;
    case 'json-xml-converter':
    case 'json-to-xml':
    case 'xml-to-json':
      return <XmlToJsonClient />;
    case 'json-csv-converter':
    case 'json-to-csv':
    case 'csv-to-json':
    case 'tsv-json':
    case 'json-to-tsv':
      return <CsvToJsonClient />;
    case 'csv-tsv-converter':
    case 'csv-to-tsv':
    case 'tsv-to-csv':
      return <TsvToCsvClient />;
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
    case 'js-minifier':
      return <JsMinifierClient />;
    case 'image-resizer':
      return <ImageResizerClient />;
    case 'image-format-converter':
      return <ImageFormatConverterClient />;
    case 'image-cropper':
      return <ImageCropperClient />;
    case 'image-trimmer':
      return <ImageTrimmerClient />;
    case 'erase-color':
      return <EraseColorClient />;
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
    case 'chart-maker':
      return <ChartMakerClient />;
    case 'hex-to-rgb':
    case 'hex-to-rgb-express':
    case 'hex-to-rgb-new':
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
    case 'json-toml-converter':
    case 'json-to-toml':
    case 'toml-to-json':
    case 'toml-to-json-v2':
      return <TomlToJsonClient />;
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
    case 'word-frequency-analyzer':
      return <WordFrequencyAnalyzerClient />;
    case 'word-frequency-counter':
      return <WordFrequencyCounterClient />;
    case 'xml-sitemap-generator':
      return <XmlSitemapGeneratorClient />;
    case 'xml-validator':
      return <XmlValidatorClient />;
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
    case 'base64-file-encoder':
      return <Base64FileEncoderClient />;
    case 'base64-image-decoder':
      return <Base64ImageDecoderClient />;
    case 'base64-image-viewer':
      return <Base64ImageViewerClient />;
    case 'base-number-converter':
      return <BaseNumberConverterClient />;
    case 'base-toolblip':
      return <BaseToolblipClient />;
    case 'batch-favicon-downloader':
      return <BatchFaviconDownloaderClient />;
    case 'batch-image-resizer':
      return <BatchImageResizerClient />;
    case 'bcrypt-hash-generator':
      return <BcryptHashGeneratorClient />;
    case 'bill-sale-generator':
      return <BillSaleGeneratorClient />;
    case 'bill-splitter':
      return <BillSplitterClient />;
    case 'bin-hex-dec-converter':
      return <BinHexDecConverterClient />;
    case 'binary-converter':
      return <BinaryConverterClient />;
    case 'binary-decimal-hex-converter':
      return <BinaryDecimalHexConverterClient />;
    case 'binary-text-express':
      return <BinaryTextExpressClient />;
    case 'binary-to-decimal':
      return <BinaryToDecimalClient />;
    case 'binary-to-text':
      return <BinaryToTextClient />;
    case 'binary-to-text-v2':
      return <BinaryToTextV2Client />;
    case 'border':
      return <ImageBorderAdderClient live={true} />;
    case 'bmi-calculator':
      return <BmiCalculatorClient />;
    case 'bash-command-generator':
      return <BashCommandGeneratorClient />;
    case 'broken-link-checker':
      return <BrokenLinkCheckerClient />;
    case 'broken-image-checker':
      return <BrokenImageCheckerClient />;
    case 'broken-link-checker-express':
      return <BrokenLinkCheckerExpressClient />;
    case 'broken-link-checker-v2':
      return <BrokenLinkCheckerV2Client />;
    case 'browser-image-resizer':
      return <BrowserImageResizerClient />;
    case 'business-plan-generator':
      return <BusinessPlanGeneratorClient />;
    case 'byte-converter':
      return <ByteConverterClient />;
    case 'canonical-url-generator':
      return <CanonicalUrlGeneratorClient />;
    case 'chinese-char-converter':
      return <ChineseCharConverterClient />;
    case 'cidr-calculator':
      return <CidrCalculatorClient />;
    case 'cmyk-to-rgb':
      return <CmykToRgbClient />;
    case 'cmyk-to-rgb-converter':
      return <CmykToRgbConverterClient />;
    case 'cmyk-to-rgb-tool':
      return <CmykToRgbToolClient />;
    case 'code-beautifier':
      return <CodeBeautifierClient />;
    case 'code-diff':
      return <CodeDiffClient />;
    case 'code-diff-tool':
      return <CodeDiffToolClient />;
    case 'code-to-diagram-generator':
      return <CodeToDiagramGeneratorClient />;
    case 'collocations-checker':
      return <CollocationsCheckerClient />;
    case 'color-blindness-simulator':
      return <ColorBlindnessSimulatorClient />;
    case 'color-contrast-auditor':
      return <ColorContrastAuditorClient />;
    case 'color-contrast-matrix':
      return <ColorContrastMatrixClient />;
    case 'color-contrast-ratio-checker':
      return <ColorContrastRatioCheckerClient />;
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
    case 'curl-generator':
      return <CurlGeneratorClient />;
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
      return <DnsLookupV2Client />;
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
    case 'hsl-to-rgb-express':
    case 'hsl-to-rgb-new':
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
    case 'html-validator':
      return <HtmlValidatorClient />;
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
    case 'json-to-html-table':
      return <JsonToHtmlTableClient />;
    case 'json-to-markdown-table':
      return <JsonToMarkdownTableClient />;
    case 'json-to-python':
      return <JsonToPythonClient />;
    case 'json-to-typescript':
      return <JsonToTypescriptClient />;
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
    case 'ai-rephraser':
      return <AiRephraserClient />;
    case 'api-auth-header-generator':
      return <ApiAuthHeaderGeneratorClient />;
    case 'api-doc-generator':
      return <ApiDocGeneratorClient />;
    case 'accessibility-checker':
      return <AccessibilityCheckerClient />;
    case 'aac-to-wav':
      return <AacToWavClient />;
    case 'add-pages-to-pdf':
      return <PdfPageAdderClient />;
    case 'add-subtitles':
      return <AddSubtitlesClient />;
    case 'algorithm-visualizer':
      return <AlgorithmVisualizerClient />;
    case 'annotate-pdf':
      return <AnnotateClient />;
    case 'ascii-art-generator':
      return <AsciiArtGeneratorClient />;
    case 'all-in-one-unit-converter':
      return <AllInOneUnitConverterClient />;
    case 'angle-unit-converter':
      return <AngleUnitConverterClient />;
    case 'api-endpoint-debugger':
      return <ApiEndpointDebuggerClient />;
    case 'api-endpoint-documenter':
      return <ApiEndpointDocumenterClient />;
    case 'api-spec-generator':
      return <ApiSpecGeneratorClient />;
    case 'area-converter':
      return <AreaConverterClient />;
    case 'article-title-gen':
      return <ArticleTitleGenClient />;
    case 'article-title-generator':
      return <ArticleTitleGeneratorClient />;
    case 'audio-to-text':
      return <AudioToTextClient />;
    case 'automation-wizard':
      return <AutomationWizardClient />;
    case 'avi-to-gif':
      return <AviToGifClient />;
    case 'backslash-escape-unescape':
      return <BackslashEscapeUnescapeClient />;
    case 'base-convert-tool':
      return <BaseConvertToolClient />;
    case 'base-converter':
      return <BaseConverterClient />;
    case 'base-converter-quick':
      return <BaseConverterQuickClient />;
    case 'color-contrast-checker':
      return <ColorContrastCheckerClient />;
    case 'color-format-converter-v2': return <ColorFormatConverterV2Client />; // legacy alias, redirected via next.config.mjs
    case 'color-format-converter': return <ColorFormatConverterV2Client />; // matches the promised CMYK support; the older ColorFormatConverterClient doesn't have it
    case 'color-format-picker':
      return <ColorFormatPickerClient />;
    case 'color-harmony-express':
      return <ColorHarmonyExpressClient />;
    case 'color-harmony-generator':
      return <ColorHarmonyGeneratorClient />;
    case 'color-harmony-new':
      return <ColorHarmonyNewClient />;
    case 'color-luminance-calculator':
      return <ColorLuminanceCalculatorClient />;
    case 'color-luminance-checker':
      return <ColorLuminanceCheckerClient />;
    case 'color-mixer':
      return <ColorMixerClient />;
    case 'color-mixer-v2':
      return <ColorMixerV2Client />;
    case 'color-name-finder':
      return <ColorNameFinderClient />;
    case 'color-name-finder-v2':
      return <ColorNameFinderV2Client />;
    case 'color-name-tool':
      return <ColorNameToolClient />;
    case 'color-opacity-generator':
      return <ColorOpacityGeneratorClient />;
    case 'color-palette-extractor':
      return <ColorPaletteExtractorClient />;
    case 'color-palette-from-image':
      return <ColorPaletteFromImageClient />;
    case 'color-palette-generator':
      return <ColorPaletteGeneratorClient />;
    case 'color-pick-all':
      return <ColorPickAllClient />;
    case 'color-pick-tool':
      return <ColorPickToolClient />;
    case 'color-pick-toolblip':
      return <ColorPickToolblipClient />;
    case 'color-picker-2025':
      return <ColorPicker2025Client />;
    case 'color-picker-adv':
      return <ColorPickerAdvClient />;
    case 'color-picker-advanced':
      return <ColorPickerAdvancedClient />;
    case 'color-picker-api':
      return <ColorPickerApiClient />;
    case 'color-picker-browser':
      return <ColorPickerBrowserClient />;
    case 'color-picker-classic':
      return <ColorPickerClassicClient />;
    case 'color-picker-complete':
      return <ColorPickerCompleteClient />;
    case 'color-picker-dg':
      return <ColorPickerDgClient />;
    case 'color-picker-easy':
      return <ColorPickerEasyClient />;
    case 'color-picker-enhanced':
      return <ColorPickerEnhancedClient />;
    case 'color-picker-expander':
      return <ColorPickerExpanderClient />;
    case 'color-picker-express':
      return <ColorPickerExpressClient />;
    case 'color-picker-final':
      return <ColorPickerFinalClient />;
    case 'color-picker-fresh':
      return <ColorPickerFreshClient />;
    case 'color-picker-full':
      return <ColorPickerFullClient />;
    case 'color-picker-handy':
      return <ColorPickerHandyClient />;
    case 'color-picker-hex-rgb-hsl':
      return <ColorPickerHexRgbHslClient />;
    case 'color-picker-new':
      return <ColorPickerNewClient />;
    case 'color-picker-prime':
      return <ColorPickerPrimeClient />;
    case 'color-picker-pro':
      return <ColorPickerProClient />;
    case 'color-picker-quick':
      return <ColorPickerQuickClient />;
    case 'color-picker-smart':
      return <ColorPickerSmartClient />;
    case 'color-picker-std':
      return <ColorPickerStdClient />;
    case 'color-picker-tool':
      return <ColorPickerToolClient />;
    case 'color-picker-ultimate':
      return <ColorPickerUltimateClient />;
    case 'color-picker-ultra':
      return <ColorPickerUltraClient />;
    case 'color-picker-v3':
      return <ColorPickerV3Client />;
    case 'color-picker-v4':
      return <ColorPickerV4Client />;
    case 'color-picker-v5':
      return <ColorPickerV5Client />;
    case 'color-picker-v6':
      return <ColorPickerV6Client />;
    case 'color-picker-web':
      return <ColorPickerWebClient />;
    case 'color-picker-wheel':
      return <ColorPickerWheelClient />;
    case 'color-picker-x':
      return <ColorPickerXClient />;
    case 'color-picker-xl':
      return <ColorPickerXLClient />;
    case 'color-quick':
      return <ColorQuickClient />;
    case 'color-saturation-adjuster':
      return <ColorSaturationAdjusterClient />;
    case 'color-select-tool':
      return <ColorSelectToolClient />;
    case 'color-shade-gen':
      return <ColorShadeGenClient />;
    case 'color-shade-generator':
      return <ColorShadeGeneratorClient />;
    case 'color-shade-generator-v2':
      return <ColorShadeGeneratorV2Client />;
    case 'color-shade-tints':
      return <ColorShadeTintsClient />;
    case 'color-shade-tool':
      return <ColorShadeToolClient />;
    case 'color-tint-generator':
      return <ColorTintGeneratorClient />;
    case 'color-tone-generator':
      return <ColorToneGeneratorClient />;
    case 'color-toolblip':
      return <ColorToolblipClient />;
    case 'delete-pages-from-pdf':
      return <PdfPageDeleterClient />;
    case 'content-summarizer':
      return <ContentSummarizerClient />;
    case 'contrast-browser':
      return <ContrastBrowserClient />;
    case 'contrast-check-all':
      return <ContrastCheckAllClient />;
    case 'contrast-check-tool':
      return <ContrastCheckToolClient />;
    case 'contrast-check-toolblip':
      return <ContrastCheckToolblipClient />;
    case 'contrast-checker-2025':
      return <ContrastChecker2025Client />;
    case 'contrast-checker-adv':
      return <ContrastCheckerAdvClient />;
    case 'contrast-checker-advanced':
      return <ContrastCheckerAdvancedClient />;
    case 'contrast-checker-api':
      return <ContrastCheckerApiClient />;
    case 'contrast-checker-browser':
      return <ContrastCheckerBrowserClient />;
    case 'contrast-checker-classic':
      return <ContrastCheckerClassicClient />;
    case 'contrast-checker-complete':
      return <ContrastCheckerCompleteClient />;
    case 'contrast-checker-dg':
      return <ContrastCheckerDgClient />;
    case 'contrast-checker-easy':
      return <ContrastCheckerEasyClient />;
    case 'contrast-checker-enhanced':
      return <ContrastCheckerEnhancedClient />;
    case 'contrast-checker-expander':
      return <ContrastCheckerExpanderClient />;
    case 'contrast-checker-express':
      return <ContrastCheckerExpressClient />;
    case 'contrast-checker-final':
      return <ContrastCheckerFinalClient />;
    case 'contrast-checker-fresh':
      return <ContrastCheckerFreshClient />;
    case 'contrast-checker-full':
      return <ContrastCheckerFullClient />;
    case 'contrast-checker-handy':
      return <ContrastCheckerHandyClient />;
    case 'contrast-checker-new':
      return <ContrastCheckerNewClient />;
    case 'contrast-checker-prime':
      return <ContrastCheckerPrimeClient />;
    case 'contrast-checker-pro':
      return <ContrastCheckerProClient />;
    case 'contrast-checker-quick':
      return <ContrastCheckerQuickClient />;
    case 'contrast-checker-smart':
      return <ContrastCheckerSmartClient />;
    case 'contrast-checker-std':
      return <ContrastCheckerStdClient />;
    case 'contrast-checker-tool':
      return <ContrastCheckerToolClient />;
    case 'contrast-checker-ultimate':
      return <ContrastCheckerUltimateClient />;
    case 'contrast-checker-ultra':
      return <ContrastCheckerUltraClient />;
    case 'contrast-checker-v2':
      return <ContrastCheckerV2Client />;
    case 'contrast-checker-v3':
      return <ContrastCheckerV3Client />;
    case 'contrast-checker-v4':
      return <ContrastCheckerV4Client />;
    case 'contrast-checker-v5':
      return <ContrastCheckerV5Client />;
    case 'contrast-checker-v6':
      return <ContrastCheckerV6Client />;
    case 'contrast-checker-wcag':
      return <ContrastCheckerWcagClient />;
    case 'contrast-checker-x':
      return <ContrastCheckerXClient />;
    case 'contrast-checker-xl':
      return <ContrastCheckerXlClient />;
    case 'contrast-fresh':
      return <ContrastFreshClient />;
    case 'contrast-quick':
      return <ContrastQuickClient />;
    case 'contrast-toolblip':
      return <ContrastToolblipClient />;
    case 'cooking-unit-converter':
      return <CookingUnitConverterClient />;
    case 'cron-builder':
      return <CronBuilderClient />;
    case 'cron-expander':
      return <CronExpanderClient />;
    case 'cron-expr-gen':
    case 'cron-expr-gen-adv':
    case 'cron-expr-gen-prime':
    case 'cron-expr-gen-pro':
    case 'cron-expr-gen-ultra':
      return <CronGeneratorClient />;
    case 'cron-expression-builder':
      return <CronBuilderClient />;
    case 'cron-expression-generator':
      return <CronExpressionGeneratorClient />;
    case 'cron-expression-parser':
      return <CronExpressionParserClient />;
    case 'cron-generator-2025':
    case 'cron-generator-advanced':
    case 'cron-generator-api':
    case 'cron-generator-browser':
    case 'cron-generator-classic':
    case 'cron-generator-complete':
    case 'cron-generator-easy':
    case 'cron-generator-enhanced':
    case 'cron-generator-express':
    case 'cron-generator-final':
    case 'cron-generator-fresh':
    case 'cron-generator-full':
    case 'cron-generator-handy':
    case 'cron-generator-new':
    case 'cron-generator-prime':
    case 'cron-generator-pro':
    case 'cron-generator-quick':
    case 'cron-generator-smart':
    case 'cron-generator-std':
    case 'cron-generator-tool':
    case 'cron-generator-toolblip':
    case 'cron-generator-ultimate':
    case 'cron-generator-ultra':
    case 'cron-generator-v2':
    case 'cron-generator-v3':
    case 'cron-generator-v4':
    case 'cron-generator-v5':
    case 'cron-generator-v6':
    case 'cron-generator-x':
    case 'cron-generator-xl':
      return <CronGeneratorClient />;
    case 'cron-schedule-builder':
    case 'cron-schedule-checker':
    case 'cron-toolblip':
    case 'cron-visual-builder':
      return <CronExpressionParserClient />;
    case 'crop-circle':
      return <CropCircleClient />;
    case 'css-filter-generator':
      return <CssGradientGeneratorClient />;
    case 'css-flexbox-generator':
      return <CssFlexboxGeneratorClient />;
    case 'css-grid-generator':
      return <CssGridGeneratorClient />;
    case 'css-variable-generator':
      return <CssClassGeneratorClient />;
    case 'css-preview':
      return <CssMinifierClient />;
    case 'css-to-scss':
      return <CssToScssConverterClient />;
    case 'css-to-styled-components':
      return <CssToStyledComponentsClient />;
    case 'css-to-tailwind':
      return <CssToTailwindClient />;
    case 'css-units-converter':
    case 'css-units-converter-new': return <CssValidatorClient />; // legacy alias, redirected via next.config.mjs
    case 'csv-generator':
      return <CsvGeneratorClient />;
    case 'csv-json-express':
      return <CsvJsonExpressClient />;
    case 'csv-to-excel':
      return <CsvToExcelClient />;
    case 'csv-to-json-v2':
      return <CsvToJsonV2Client />;
    case 'csv-to-tsv-v2':
      return <CsvToTsvV2Client />;
    case 'csv-to-xml':
      return <CsvToXmlClient />;
    case 'curl-command-builder':
      return <CurlCommandBuilderClient />;
    case 'curl-gen-express': return <CurlGenExpressClient />; // legacy alias, redirected via next.config.mjs
    case 'curl-gen': return <CurlGenExpressClient />;
    case 'curl-to-javascript':
      return <CurlToJavascriptClient />;
    case 'currency-converter-v2':
      return <CurrencyConverterClient />;
    case 'cutter':
      return <CutterClient />;
    case 'data-size-converter-express':
      return <ByteConverterClient />;
    case 'data-uri-generator':
      return <DataUriGeneratorClient />;
    case 'db-query-formatter':
      return <DbQueryFormatterClient />;
    case 'decimal-to-hex-converter':
      return <DecimalToHexClient />;
    case 'detect':
      return <DetectClient />;
    case 'discount-calculator':
      return <DiscountCalculatorClient />;
    case 'dns-lookup-express':
      return <DnsLookupExpressClient />;
    case 'dns-lookup-tool':
      return <DnsLookupToolClient />;
    case 'dns-lookup-v2':
      return <DnsLookupV2Client />;
    case 'docker-compose-generator':
      return <DockerComposeGeneratorClient />;
    case 'domain-age-checker':
      return <DomainAgeCheckerClient />;
    case 'dominant-color-extractor':
      return <DominantColorExtractorClient />;
    case 'dpi-ppi-calculator':
      return <DpiPpiCalculatorClient />;
    case 'dummy-text-detector':
      return <DummyTextDetectorClient />;
    case 'duplicate-phrase-detector':
      return <DuplicatePhraseDetectorClient />;
    case 'duplicate-url-detector':
      return <DuplicateUrlDetectorClient />;
    case 'edit-pdf':
      return <EditClient />;
    case 'encodings-ref':
      return <EncodingsRefClient />;
    case 'encodings-reference':
      return <EncodingsReferenceClient />;
    case 'english-collocations-checker':
      return <EnglishCollocationsCheckerClient />;
    case 'english-collocations-unique':
      return <EnglishCollocationsUniqueClient />;
    case 'english-dictionary':
      return <EnglishDictionaryClient />;
    case 'env-parser':
      return <EnvParserClient />;
    case 'excel-to-csv':
      return <ExcelToCsvClient />;
    case 'excel-to-pdf':
      return <ExcelToPdfClient />;
    case 'excel-to-xml':
      return <ExcelToXmlClient />;
    case 'exif-remover':
      return <ExifRemoverClient />;
    case 'extract-audio':
      return <ExtractAudioClient />;
    case 'extract-images-from-pdf':
      return <ExtractImgClient />;
    case 'favicon-browser':
    case 'favicon-checker-express':
    case 'favicon-checker-tool':
    case 'favicon-creator':
    case 'favicon-creator-tool':
    case 'favicon-fresh':
    case 'favicon-full':
    case 'favicon-gen-adv':
    case 'favicon-gen-prime':
    case 'favicon-gen-pro':
    case 'favicon-gen-tool':
    case 'favicon-gen-toolblip':
    case 'favicon-gen-ultra':
    case 'favicon-generator-2025':
    case 'favicon-generator-advanced':
    case 'favicon-generator-api':
    case 'favicon-generator-browser':
    case 'favicon-generator-classic':
    case 'favicon-generator-complete':
    case 'favicon-generator-dg':
    case 'favicon-generator-easy':
    case 'favicon-generator-enhanced':
    case 'favicon-generator-expander':
    case 'favicon-generator-express':
    case 'favicon-generator-final':
    case 'favicon-generator-fresh':
    case 'favicon-generator-full':
    case 'favicon-generator-new':
    case 'favicon-generator-prime':
    case 'favicon-generator-pro':
    case 'favicon-generator-quick':
    case 'favicon-generator-smart':
    case 'favicon-generator-std':
    case 'favicon-generator-tool':
    case 'favicon-generator-ultimate':
    case 'favicon-generator-ultra':
    case 'favicon-generator-v2':
    case 'favicon-generator-v3':
    case 'favicon-generator-v4':
    case 'favicon-generator-v5':
    case 'favicon-generator-v6':
    case 'favicon-generator-x':
    case 'favicon-generator-xl':
    case 'favicon-make-tool':
    case 'favicon-png-generator':
    case 'favicon-preview-tool':
    case 'favicon-quick':
    case 'favicon-quick-generator':
    case 'favicon-simple':
    case 'favicon-tool':
    case 'favicon-toolblip':
      return <FaviconGeneratorClient />;
    case 'font-to-png':
      return <FontToPngClient />;
    case 'fraction-calculator':
      return <FractionCalculatorClient />;
    case 'fraction-to-decimal-express':
    case 'fraction-to-decimal-v2':
      return <FractionToDecimalClient />;
    case 'gif-to-apng':
      return <GifToApngClient />;
    case 'gif-to-jpg':
      return <GifToJpgClient />;
    case 'gif-to-png':
      return <GifToPngClient />;
    case 'google-algorithm-tracker':
      return <GoogleAlgorithmTrackerClient />;
    case 'google-serp-preview':
      return <GoogleSerpPreviewClient />;
    case 'google-serp-simulator':
      return <GoogleSerpSimulatorClient />;
    case 'gradient-generator':
      return <GradientGeneratorClient />;
    case 'grammar-check-tool':
      return <GrammarCheckToolClient />;
    case 'grammar-checker-2025':
      return <GrammarChecker2025Client />;
    case 'grammar-checker-adv':
      return <GrammarCheckerAdvClient />;
    case 'grammar-checker-advanced':
      return <GrammarCheckerAdvancedClient />;
    case 'grammar-checker-ai':
      return <GrammarCheckerAiClient />;
    case 'grammar-checker-api':
      return <GrammarCheckerApiClient />;
    case 'grammar-checker-browser':
      return <GrammarCheckerBrowserClient />;
    case 'grammar-checker-classic':
      return <GrammarCheckerClassicClient />;
    case 'grammar-checker-complete':
      return <GrammarCheckerCompleteClient />;
    case 'grammar-checker-dg':
      return <GrammarCheckerDgClient />;
    case 'grammar-checker-easy':
      return <GrammarCheckerEasyClient />;
    case 'grammar-checker-enhanced':
      return <GrammarCheckerEnhancedClient />;
    case 'grammar-checker-expander':
      return <GrammarCheckerExpanderClient />;
    case 'grammar-checker-express':
      return <GrammarCheckerExpressClient />;
    case 'grammar-checker-final':
      return <GrammarCheckerFinalClient />;
    case 'grammar-checker-fresh':
      return <GrammarCheckerFreshClient />;
    case 'grammar-checker-full':
      return <GrammarCheckerFullClient />;
    case 'grammar-checker-instant':
      return <GrammarCheckerInstantClient />;
    case 'grammar-checker-lite':
      return <GrammarCheckerLiteClient />;
    case 'grammar-checker-new':
      return <GrammarCheckerNewClient />;
    case 'grammar-checker-prime':
      return <GrammarCheckerPrimeClient />;
    case 'grammar-checker-pro':
      return <GrammarCheckerProClient />;
    case 'grammar-checker-quick':
      return <GrammarCheckerQuickClient />;
    case 'grammar-checker-smart':
      return <GrammarCheckerSmartClient />;
    case 'grammar-checker-std':
      return <GrammarCheckerStdClient />;
    case 'grammar-checker-tool':
      return <GrammarCheckerToolClient />;
    case 'grammar-checker-toolblip':
      return <GrammarCheckerToolblipClient />;
    case 'grammar-checker-ultimate':
      return <GrammarCheckerUltimateClient />;
    case 'grammar-checker-ultra':
      return <GrammarCheckerUltraClient />;
    case 'grammar-checker-v2':
      return <GrammarCheckerV2Client />;
    case 'grammar-checker-v3':
      return <GrammarCheckerV3Client />;
    case 'grammar-checker-v4':
      return <GrammarCheckerV4Client />;
    case 'grammar-checker-v5':
      return <GrammarCheckerV5Client />;
    case 'grammar-checker-v6':
      return <GrammarCheckerV6Client />;
    case 'grammar-checker-web':
      return <GrammarCheckerWebClient />;
    case 'grammar-checker-x':
      return <GrammarCheckerXClient />;
    case 'grammar-checker-xl':
      return <GrammarCheckerXlClient />;
    case 'grammar-fix-tool':
      return <GrammarFixToolClient />;
    case 'grammar-fixer':
      return <GrammarFixerClient />;
    case 'grammar-score-checker':
      return <GrammarScoreCheckerClient />;
    case 'graphql-playground':
      return <GraphqlPlaygroundClient />;
    case 'hash-collision-finder':
      return <HashCollisionFinderClient />;
    case 'hash-diff-checker':
      return <HashDiffCheckerClient />;
    case 'heading-tag-analyzer':
      return <HeadingTagAnalyzerClient />;
    case 'headline-analyzer':
      return <HeadlineAnalyzerClient />;
    case 'heic-to-jpg':
      return <HeicToJpgClient />;
    case 'heic-to-png':
      return <HeicToPngClient />;
    case 'hex-color-picker':
      return <HexColorPickerClient />;
    case 'hex-rgb-hsl-color-picker':
      return <HexRgbHslColorPickerClient />;
    case 'hex-to-cmyk':
      return <HexToCmykClient />;
    case 'hex-to-decimal-converter':
      return <HexToDecimalConverterClient />;
    case 'hex-to-hsl':
      return <HexToHslClient />;
    case 'hex-to-hsv':
      return <HexToHsvClient />;
    case 'hex-named-color-converter':
    case 'hex-to-named-color':
    case 'named-to-hex':
      return <HexToNamedColorClient />;
    case 'hex-to-rgba':
      return <HexToRgbaClient />;
    case 'hmac-generator':
      return <HmacGeneratorClient />;
    case 'homoglyph-detector':
      return <HomoglyphDetectorClient />;
    case 'hreflang-tag-generator':
      return <HreflangTagGeneratorClient />;
    case 'hsl-to-hex':
      return <HslToHexClient />;
    case 'hsv-to-hex':
      return <HsvToHexClient />;
    case 'html-attribute-encoder':
      return <HtmlAttributeEncoderClient />;
    case 'html-encoder-decoder':
      return <HtmlEncoderDecoderClient />;
    case 'html-live-preview':
      return <HtmlLivePreviewClient />;
    case 'html-markdown-express':
      return <HtmlMarkdownExpressClient />;
    case 'html-plaintext-express':
    case 'html-plaintext':
    case 'html-to-plain-text-tool':
    case 'html-to-plain-text-v2':
    case 'html-to-plain-text':
      return <HtmlToPlainTextClient />;
    case 'html-table-to-json':
      return <HtmlTableToJsonClient />;
    case 'html-to-jsx':
      return <HtmlToJsxClient />;
    case 'html-to-markdown-v2':
      return <HtmlToMarkdownV2Client />;
    case 'http-headers-2025':
      return <HttpHeaders2025Client />;
    case 'http-headers-analyzer':
      return <HttpHeadersAnalyzerClient />;
    case 'http-headers-browser':
      return <HttpHeadersBrowserClient />;
    case 'http-headers-check':
      return <HttpHeadersCheckClient />;
    case 'http-headers-checker':
      return <HttpHeadersCheckerClient />;
    case 'http-headers-dg':
      return <HttpHeadersDgClient />;
    case 'http-headers-easy':
      return <HttpHeadersEasyClient />;
    case 'http-headers-expander':
      return <HttpHeadersExpanderClient />;
    case 'http-headers-fresh':
      return <HttpHeadersFreshClient />;
    case 'http-headers-full':
      return <HttpHeadersFullClient />;
    case 'http-headers-inspector':
      return <HttpHeadersInspectorClient />;
    case 'http-headers-quick':
      return <HttpHeadersQuickClient />;
    case 'color-temperature-adjuster':
      return <ColorTemperatureAdjusterClient />;
    case 'collage-maker':
      return <CollageMakerClient />;
    case 'combine-images':
      return <CombineImagesClient />;
    case 'crop':
      return <CropClient />;
    case 'css-minifier':
      return <CssMinifierClient />;
    case 'currency-converter':
      return <CurrencyConverterClient />;
    case 'docker-command-generator':
      return <DockerCommandGeneratorClient />;
    case 'fake-address-generator':
      return <FakeAddressGeneratorClient />;
    case 'filler-word-counter':
      return <FillerWordCounterClient />;
    case 'flesch-kincaid-calculator':
      return <FleschKincaidCalculatorClient />;
    case 'gif-maker':
      return <GifMakerClient />;
    case 'grayscale':
      return <GrayscaleClient />;
    case 'homophone-checker':
      return <HomophoneCheckerClient />;
    case 'html-minifier':
      return <HtmlMinifierClient />;
    case 'http-status-checker':
      return <HttpStatusCheckerClient />;
    case 'image-background-remover':
      return <ImageBackgroundRemoverClient />;
    case 'image-compressor':
      return <ImageCompressorClient />;
    case 'image-flip-tool': return <ImageFlipToolClient />; // legacy alias, redirected via next.config.mjs
    case 'image-flip': return <ImageFlipToolClient />;
    case 'image-optimizer':
      return <ImageOptimizerClient />;
    case 'image-rotate-tool': return <ImageRotateToolClient />; // legacy alias, redirected via next.config.mjs
    case 'image-rotate': return <ImageRotateToolClient />;
    case 'image-shadow-generator':
      return <ImageShadowGeneratorClient />;
    case 'merge-pdfs':
      return <MergeClient />;
    case 'meme-maker':
      return <MemeMakerClient />;
    case 'og-tag-debugger':
      return <OgTagDebuggerClient />;
    case 'open-graph-preview':
      return <OpenGraphPreviewClient />;
    case 'paragraph-counter':
      return <ParagraphCounterClient />;
    case 'passive-voice-detector':
      return <PassiveVoiceDetectorClient />;
    case 'pixelate':
      return <PixelateClient />;
    case 'readability-checker':
      return <ReadabilityCheckerClient />;
    case 'sentence-counter':
      return <SentenceCounterClient />;
    case 'sharpen':
      return <SharpenClient />;
    case 'sitemap-analyzer':
      return <SitemapAnalyzerClient />;
    case 'sql-formatter':
      return <SqlFormatterClient />;
    case 'temperature-unit-converter':
      return <TemperatureUnitConverterClient />;
    case 'text-uniqueness-checker':
      return <TextUniquenessCheckerClient />;
    case 'tsv-to-json':
      return <TsvToJsonClient />;
    case 'url-redirect-checker':
      return <UrlRedirectCheckerClient />;
    case 'webp-converter':
      return <WebpConverterClient />;
    case 'humanizer-ai':
      return <AiRephraserClient />;
    case 'image-aspect-ratio-calculator':
      return <ImageAspectRatioCalculatorClient />;
    case 'image-resizer-adv':
      return <ImageResizerClient />;
    case 'image-resizer-complete':
      return <ImageResizerClient />;
    case 'image-resizer-enhanced':
      return <ImageResizerClient />;
    case 'image-resizer-fresh':
      return <ImageResizerClient />;
    case 'image-resizer-new':
      return <ImageResizerClient />;
    case 'image-resizer-prime':
      return <ImageResizerClient />;
    case 'image-resizer-quick':
      return <ImageResizerClient />;
    case 'image-resizer-smart':
      return <ImageResizerClient />;
    case 'image-resizer-v2':
      return <ImageResizerClient />;
    case 'image-resizer-v3':
      return <ImageResizerClient />;
    case 'image-clipper':
      return <ImageCropperClient />;
    case 'image-blur-hash-generator':
      return <ImageCropperClient />;
    case 'image-brightness-adjuster':
      return <ImageCropperClient />;
    case 'image-dpi-resizer':
      return <ImageDpiResizerClient />;
    case 'image-enlarger':
      return <ImageCropperClient />;
    case 'image-metadata-remover':
      return <ImageCropperClient />;
    case 'image-orientation-fixer':
      return <ImageCropperClient />;
    case 'image-blur':
      return <ImageCropperClient />;
    case 'image-bw':
      return <ImageCropperClient />;
    case 'image-grayscale':
      return <ImageCropperClient />;
    case 'image-watermark':
      return <ImageCropperClient />;
    case 'image-effects':
      return <ImageCropperClient />;
    case 'image-styler':
      return <ImageCropperClient />;
    case 'image-background-changer':
      return <ImageCropperClient />;
    case 'image-compressor-v2':
      return <ImageCompressorClient />;
    case 'image-compressor-adv':
      return <ImageCompressorClient />;
    case 'image-compressor-new':
      return <ImageCompressorClient />;
    case 'image-compressor-pro':
      return <ImageCompressorClient />;
    case 'png-to-jpg':
      return <PngToJpgClient />;
    case 'png-to-webp':
      return <MediaConversionImageClient source="png" output="webp" />;
    case 'jpg-to-png':
      return <JpgToPngClient />;
    case 'image-to-svg-converter':
      return <ImageToSvgConverterClient />;
    case 'jpg-to-webp':
      return <MediaConversionImageClient source="jpeg" output="webp" />;
    case 'webp-to-png':
      return <MediaConversionImageClient source="webp" output="png" />;
    case 'webp-to-jpg':
      return <MediaConversionImageClient source="webp" output="jpeg" />;
    case 'avif-converter':
      return <ImageFormatConverterClient />;
    case 'heic-converter':
      return <ImageFormatConverterClient />;
    case 'heif-converter':
      return <ImageFormatConverterClient />;
    case 'svg-to-png':
      return <MediaConversionImageClient source="svg" output="png" />;
    case 'svg-to-jpg':
      return <MediaConversionImageClient source="svg" output="jpeg" />;
    case 'svg-to-webp':
      return <MediaConversionImageClient source="svg" output="webp" />;
    case 'favicon-ico-generator':
      return <FaviconGeneratorClient />;
    case 'favicon-from-image':
      return <FaviconGeneratorClient />;
    case 'favicon-from-text':
      return <FaviconGeneratorClient />;
    case 'favicon-generator-adv':
      return <FaviconGeneratorClient />;
    case 'favicon-generator-premium':
      return <FaviconGeneratorClient />;
    case 'ico-generator':
      return <FaviconGeneratorClient />;
    case 'ico-file-generator':
      return <FaviconGeneratorClient />;
    case 'icon-favicon-creator':
      return <FaviconGeneratorClient />;
    case 'color-from-image':
      return <ColorPaletteGeneratorClient />;
    case 'color-harmony':
      return <ColorHarmonyGeneratorClient />;
    case 'color-contrast-ratio':
      return <ContrastCheckerClient />;
    case 'wcag-contrast-checker':
      return <ContrastCheckerClient title="WCAG Contrast Checker" />;
    case 'accessibility-contrast-checker':
      return <ContrastCheckerClient />;
    case 'contrast-tool':
      return <ContrastCheckerClient />;
    case 'contrast-2025':
      return <ContrastCheckerClient />;
    case 'json-formatter-v2':
      return <JsonFormatterClient />;
    case 'json-formatter-new':
      return <JsonFormatterClient />;
    case 'json-formatter-adv':
      return <JsonFormatterClient />;
    case 'json-formatter-pro':
      return <JsonFormatterClient />;
    case 'json-beautifier':
      return <JsonFormatterClient />;
    case 'json-prettifier':
      return <JsonFormatterClient />;
    case 'json-pretty-print':
      return <JsonFormatterClient />;
    case 'json-validator-v2':
      return <JsonValidatorClient />;
    case 'json-validate':
      return <JsonValidatorClient />;
    case 'json-lint':
      return <JsonValidatorClient />;
    case 'json-graph-visualizer':
      return <JsonGraphVisualizerClient />;
    case 'json-to-html':
      return <JsonToHtmlTableClient />;
    case 'json-to-markdown':
      return <JsonToMarkdownTableClient />;
    case 'yaml-formatter':
      return <YamlToJsonClient />;
    case 'xml-formatter-v2':
      return <XmlFormatterClient />;
    case 'xml-beautifier':
      return <XmlFormatterClient />;
    case 'xml-prettifier':
      return <XmlFormatterClient />;
    case 'xml-to-yaml':
      return <XmlToJsonClient />;
    case 'yaml-to-xml':
      return <YamlToJsonClient />;
    case 'toml-to-yaml':
      return <YamlToJsonClient />;
    case 'base64-encode':
      return <Base64EncoderDecoderClient />;
    case 'base64-decode':
      return <Base64EncoderDecoderClient />;
    case 'base64-encoder':
      return <Base64EncoderDecoderClient />;
    case 'base64-decoder':
      return <Base64EncoderDecoderClient />;
    case 'base64-file-decoder':
      return <Base64FileEncoderClient />;
    case 'base64-image-encoder':
      return <Base64ImageEncoderClient />;
    case 'url-decoder':
      return <UrlEncodeClient />;
    case 'url-encode-decode':
      return <UrlEncodeClient />;
    case 'percent-encoding':
      return <UrlEncodeClient />;
    case 'html-decoder':
      return <HtmlEncoderClient />;
    case 'html-entity-decoder':
      return <HtmlEncoderClient />;
    case 'html-escape':
      return <HtmlEncoderClient />;
    case 'html-unescape':
      return <HtmlEncoderClient />;
    case 'markdown-to-markdown':
      return <MarkdownToHtmlClient />;
    case 'css-beautifier':
      return <CssMinifierClient />;
    case 'css-prettifier':
      return <CssMinifierClient />;
    case 'js-beautifier':
      return <JsMinifierClient />;
    case 'javascript-minifier':
      return <JsMinifierClient />;
    case 'javascript-beautifier':
      return <JsMinifierClient />;
    case 'regex-builder':
      return <RegexTesterClient />;
    case 'regex-generator':
      return <RegexTesterClient />;
    case 'regex-cheatsheet':
      return <RegexTesterClient />;
    case 'regex-101':
      return <RegexTesterClient />;
    case 'regex-playground':
      return <RegexTesterClient />;
    case 'jwt-encoder':
      return <JwtDecoderClient />;
    case 'jwt-generator':
      return <JwtDecoderClient />;
    case 'jwt-creator':
      return <JwtDecoderClient />;
    case 'jwt-verifier':
      return <JwtDecoderClient />;
    case 'hash-generator-v2':
      return <HashGeneratorClient />;
    case 'hash-generator-pro':
      return <HashGeneratorClient />;
    case 'hash-from-text-v2':
      return <HashGeneratorClient />;
    case 'md5-generator':
      return <HashGeneratorClient />;
    case 'sha1-generator':
      return <HashGeneratorClient />;
    case 'sha256-generator':
      return <HashGeneratorClient />;
    case 'sha512-generator':
      return <HashGeneratorClient />;
    case 'bcrypt-generator':
      return <HashGeneratorClient />;
    case 'argon2-generator':
      return <HashGeneratorClient />;
    case 'word-counter-v2':
      return <WordCounterClient />;
    case 'word-counter-new':
      return <WordCounterClient />;
    case 'word-count':
      return <WordCounterClient />;
    case 'character-count':
      return <CharacterCounterClient />;
    case 'char-counter':
      return <CharacterCounterClient />;
    case 'letter-counter':
      return <WordCounterClient />;
    case 'sentence-count':
      return <SentenceCounterClient />;
    case 'paragraph-count':
      return <ParagraphCounterClient />;
    case 'sentence-counter-v2':
      return <SentenceCounterClient />;
    case 'paragraph-counter-v2':
      return <ParagraphCounterClient />;
    case 'text-stats':
      return <TextStatisticsClient />;
    case 'text-analyzer':
      return <TextStatisticsClient />;
    case 'readability-scorer':
      return <ReadabilityScoreClient />;
    case 'flesch-kincaid':
      return <ReadabilityScoreClient />;
    case 'grammar-check':
      return <GrammarCheckerClient />;
    case 'grammar-checker-handy':
      return <GrammarCheckerClient />;
    case 'grammar-fix':
      return <GrammarCheckerClient />;
    case 'grammar-score':
      return <GrammarCheckerClient />;
    case 'spell-check':
      return <GrammarCheckerClient />;
    case 'speller':
      return <GrammarCheckerClient />;
    case 'typo-finder':
      return <TypoCheckerClient />;
    case 'case-converter-v2':
      return <CaseConverterClient />;
    case 'case-converter-new':
      return <CaseConverterClient />;
    case 'case-changer':
      return <CaseConverterClient />;
    case 'text-to-case':
      return <CaseConverterClient />;
    case 'slugify':
      return <UrlSlugGeneratorClient />;
    case 'url-slug':
      return <UrlSlugGeneratorClient />;
    case 'lorem-ipsum-v2':
      return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-generator-v2':
      return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-new':
      return <LoremIpsumGeneratorClient />;
    case 'lorem-generator':
      return <LoremIpsumGeneratorClient />;
    case 'placeholder-text':
      return <LoremIpsumGeneratorClient />;
    case 'dummy-text':
      return <LoremIpsumGeneratorClient />;
    case 'fake-text':
      return <LoremIpsumGeneratorClient />;
    case 'random-text':
      return <RandomStringGeneratorToolClient />;
    case 'random-sentence':
      return <RandomSentenceGeneratorClient />;
    case 'random-paragraph':
      return <RandomParagraphGeneratorClient />;
    case 'random-word':
      return <RandomStringGeneratorToolClient />;
    case 'uuid-v4-generator':
      return <UuidGeneratorClient />;
    case 'uuid-generator-v2':
      return <UuidGeneratorClient />;
    case 'uuid-v7-generator':
      return <UuidGeneratorClient />;
    case 'ulid-generator':
      return <UlidGeneratorClient />;
    case 'nanoid-generator':
      return <UuidGeneratorClient />;
    case 'hashids':
      return <UuidGeneratorClient />;
    case 'cuid-generator':
      return <UuidGeneratorClient />;
    case 'hashid-encoder':
      return <UuidGeneratorClient />;
    case 'unix-timestamp-converter-v2':
      return <UnixTimestampConverterClient />;
    case 'unix-timestamp-generator':
      return <UnixTimestampConverterClient />;
    case 'epoch-converter':
      return <UnixTimestampConverterClient />;
    case 'epoch-time':
      return <UnixTimestampConverterClient />;
    case 'date-from-timestamp':
      return <UnixTimestampConverterClient />;
    case 'timestamp-to-date':
      return <UnixTimestampConverterClient />;
    case 'unit-converter-v2':
      return <UnitConverterClient />;
    case 'unit-converter-new':
      return <UnitConverterClient />;
    case 'unit-converter-adv':
      return <UnitConverterClient />;
    case 'speed-converter':
      return <UnitConverterClient />;
    case 'volume-converter':
      return <UnitConverterClient />;
    case 'time-converter':
      return <UnitConverterClient />;
    case 'data-converter':
      return <UnitConverterClient />;
    case 'number-base-converter-v2':
      return <NumberBaseConverterClient />;
    case 'binary-decimal-converter':
      return <NumberBaseConverterClient />;
    case 'hex-decimal-converter':
      return <NumberBaseConverterClient />;
    case 'octal-converter':
      return <NumberBaseConverterClient />;
    case 'hex-converter':
      return <NumberBaseConverterClient />;
    case 'decimal-converter':
      return <NumberBaseConverterClient />;
    case 'percentage-calculator-v2':
      return <PercentageCalculatorClient />;
    case 'percentage-calculator-new':
      return <PercentageCalculatorClient />;
    case 'percentage-change':
      return <PercentageCalculatorClient />;
    case 'percentage-difference-v2':
      return <PercentageDifferenceClient />;
    case 'percentage-increase':
      return <PercentageCalculatorClient />;
    case 'percentage-decrease':
      return <PercentageCalculatorClient />;
    case 'tip-calculator':
      return <TipCalculatorClient />;
    case 'markup-calculator':
      return <PercentageCalculatorClient />;
    case 'password-generator-v2':
      return <PasswordGeneratorClient />;
    case 'password-generator-new':
      return <PasswordGeneratorClient />;
    case 'password-generator-adv':
      return <PasswordGeneratorClient />;
    case 'password-generator-pro':
      return <PasswordGeneratorClient />;
    case 'random-password':
      return <PasswordGeneratorClient />;
    case 'password-strength':
      return <PasswordStrengthCheckerClient />;
    case 'qr-code-generator-v2':
      return <QrCodeGeneratorClient />;
    case 'qr-code-generator-new':
      return <QrCodeGeneratorClient />;
    case 'qr-code-generator-adv':
      return <QrCodeGeneratorClient />;
    case 'qr-code-generator-pro':
      return <QrCodeGeneratorClient />;
    case 'qr-code-from-url':
      return <QrCodeGeneratorClient />;
    case 'qr-code-from-text':
      return <QrCodeGeneratorClient />;
    case 'wifi-qr-code':
      return <QrCodeGeneratorClient />;
    case 'meta-tags':
      return <MetaTagGeneratorClient />;
    case 'meta-description-generator':
      return <MetaTagGeneratorClient />;
    case 'twitter-card-generator':
      return <MetaTagGeneratorClient />;
    case 'og-tags':
      return <MetaTagGeneratorClient />;
    case 'serp-preview-v2':
      return <SerpPreviewClient />;
    case 'screen-resolution':
      return <ScreenResolutionTesterClient />;
    case 'viewport-tester':
      return <ScreenResolutionTesterClient />;
    case 'responsive-checker':
      return <ScreenResolutionTesterClient />;
    case 'device-viewport':
      return <ScreenResolutionTesterClient />;
    case 'robots-txt-v2':
      return <RobotsTxtEditorClient />;
    case 'robots-txt-generator-v2':
      return <RobotsTxtEditorClient />;
    case 'robots-txt-create':
      return <RobotsTxtEditorClient />;
    case 'robots-txt-checker':
      return <RobotsTxtEditorClient />;
    case 'sitemap-xml':
      return <XmlSitemapGeneratorClient />;
    case 'xml-sitemap-v2':
      return <XmlSitemapGeneratorClient />;
    case 'sitemap-generator-v2':
      return <XmlSitemapGeneratorClient />;
    case 'html-sitemap':
      return <XmlSitemapGeneratorClient />;
    case 'cron-parser-v2':
      return <CronParserClient />;
    case 'cron-validator':
      return <CronValidatorClient />;
    case 'cron-explainer':
      return <CronParserClient />;
    case 'cors-configuration':
      return <CorsHeaderGeneratorClient />;
    case 'cors-options':
      return <CorsHeaderGeneratorClient />;
    case 'cors Origins':
      return <CorsHeaderGeneratorClient />;
    case 'sql-to-json-v2':
      return <SqlToJsonClient />;
    case 'sql-to-yaml':
      return <SqlToJsonClient />;
    case 'tsv-to-yaml':
      return <TsvToJsonClient />;
    case 'text-diff-v2':
      return <TextDiffClient />;
    case 'text-compare':
      return <TextDiffClient />;
    case 'text-comparison':
      return <TextDiffClient />;
    case 'string-diff':
      return <TextDiffClient />;
    case 'json-diff':
      return <TextDiffClient />;
    case 'remove-duplicates':
      return <RemoveDuplicateLinesClient />;
    case 'dedupe':
      return <RemoveDuplicateLinesClient />;
    case 'remove-duplicate-lines-v2':
      return <RemoveDuplicateLinesClient />;
    case 'duplicate-line-remover':
      return <RemoveDuplicateLinesClient />;
    case 'sort-lines':
      return <TextSorterClient />;
    case 'text-sorter-v2':
      return <TextSorterClient />;
    case 'alphabetize':
      return <TextSorterClient />;
    case 'randomize-lines':
      return <ListRandomizerClient />;
    case 'shuffle-list':
      return <ListRandomizerClient />;
    case 'list-randomizer-v2':
      return <ListRandomizerClient />;
    case 'image-compression-tool': return <ImageFlipToolClient />; // legacy alias, redirected via next.config.mjs
    case 'image-compression': return <ImageFlipToolClient />;
    case 'image-metadata-express': return <ImageMetadataViewerClient />;
    case 'image-metadata-tool': return <ImageFlipToolClient />;
    case 'image-resizer-advanced': return <ImageResizerClient />;
    case 'image-resizer-browser': return <BrowserImageResizerClient />;
    case 'image-resizer-classic': return <ImageResizerClient />;
    case 'image-resizer-pro': return <ImageResizerClient />;
    case 'image-resizer-tool': return <ImageResizerClient />;
    case 'image-resizer-ultimate': return <ImageResizerClient />;
    case 'image-resizer-ultra': return <ImageResizerClient />;
    case 'ip-address-info': return <RandomIpAddressClient />;
    case 'ip-address-info-express': return <RandomIpAddressClient />; // legacy alias, redirected via next.config.mjs
    case 'ip-address-info': return <RandomIpAddressClient />;
    case 'ip-address-info-v2': return <RandomIpAddressClient />;
    case 'json-csv-express': return <JsonCsvExpressClient />;
    case 'json-patch-generator': return <JsonLdGeneratorClient />;
    // 'json-path-evaluator' renders JsonPathTesterClient, not
    // JsonPathEvaluatorExpressClient below — the "express" component just
    // pretty-prints JSON, it doesn't evaluate a JSONPath expression at all,
    // which is what the tool's own description promises.
    case 'json-path-evaluator-express': return <JsonPathEvaluatorExpressClient />; // legacy alias, redirected via next.config.mjs
    case 'json-path-tester-new': return <JsonPathTesterClient />;
    case 'json-schema-editor': return <JsonSchemaValidatorClient />;
    case 'json-schema-gen-express': return <JsonSchemaGenExpressClient />;
    case 'json-schema-generator': return <JsonLdGeneratorClient />;
    case 'json-schema-viewer': return <JsonSchemaValidatorClient />;
    case 'json-to-go-struct': return <CsvToJsonClient />;
    case 'json-to-php-array': return <CsvToJsonClient />;
    case 'json-to-url-encoded': return <CsvToJsonClient />;
    case 'jwt-decode-tool': return <DecodeToolClient />;
    case 'jwt-decoder-2025': return <JwtDecoderClient />;
    case 'jwt-decoder-adv': return <JwtDecoderClient />;
    case 'jwt-decoder-advanced': return <JwtDecoderClient />;
    case 'jwt-decoder-api': return <JwtDecoderClient />;
    case 'jwt-decoder-browser': return <JwtDecoderClient />;
    case 'jwt-decoder-classic': return <JwtDecoderClient />;
    case 'jwt-decoder-complete': return <JwtDecoderClient />;
    case 'jwt-decoder-dg': return <JwtDecoderClient />;
    case 'jwt-decoder-easy': return <JwtDecoderClient />;
    case 'jwt-decoder-enhanced': return <JwtDecoderClient />;
    case 'jwt-decoder-expander': return <JwtDecoderClient />;
    case 'jwt-decoder-express': return <JwtDecoderClient />;
    case 'jwt-decoder-final': return <JwtDecoderClient />;
    case 'jwt-decoder-fresh': return <JwtDecoderClient />;
    case 'jwt-decoder-full': return <JwtDecoderClient />;
    case 'jwt-decoder-new': return <JwtDecoderClient />;
    case 'jwt-decoder-prime': return <JwtDecoderClient />;
    case 'jwt-decoder-pro': return <JwtDecoderClient />;
    case 'jwt-decoder-quick': return <JwtDecoderClient />;
    case 'jwt-decoder-simple': return <JwtDecoderClient />;
    case 'jwt-decoder-smart': return <JwtDecoderClient />;
    case 'jwt-decoder-std': return <JwtDecoderClient />;
    case 'jwt-decoder-tool': return <JwtDecoderClient />;
    case 'jwt-decoder-toolblip': return <JwtDecoderClient />;
    case 'jwt-decoder-ultimate': return <JwtDecoderClient />;
    case 'jwt-decoder-ultra': return <JwtDecoderClient />;
    case 'jwt-decoder-v2': return <JwtDecoderClient />;
    case 'jwt-decoder-v3': return <JwtDecoderClient />;
    case 'jwt-decoder-v4': return <JwtDecoderClient />;
    case 'jwt-decoder-v5': return <JwtDecoderClient />;
    case 'jwt-decoder-v6': return <JwtDecoderClient />;
    case 'jwt-decoder-web': return <JwtDecoderClient />;
    case 'jwt-decoder-x': return <JwtDecoderClient />;
    case 'jwt-decoder-xl': return <JwtDecoderClient />;
    case 'keyword-density-analyzer-new': return <KeywordDensityCheckerClient />; // legacy alias, redirected via next.config.mjs
    case 'keyword-difficulty-checker': return <KeywordDensityCheckerClient />;
    case 'keyword-generator-express': return <KeywordGeneratorExpressClient />; // legacy alias, redirected via next.config.mjs
    case 'keyword-generator': return <KeywordGeneratorExpressClient />;
    case 'ldap-filter-generator': return <LdapFilterGeneratorClient />;
    case 'length-converter-express': return <LengthConverterClient />;
    case 'length-weight-converter': return <LengthConverterClient />;
    case 'lorem-ipsum-adv': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-advanced': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-api': return <LoremIpsumGeneratorClient />; // legacy alias, redirected via next.config.mjs
    case 'lorem-ipsum': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-api-tool': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-browser': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-bytes': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-classic': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-complete': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-design': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-detector': return <LoremIpsumDetectorClient />; // real detector (word-list density check), not the generator
    case 'lorem-ipsum-dg': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-easy': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-enhanced': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-expander': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-express': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-final': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-fresh': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-full': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-gen': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-gen-tool': return <LoremIpsumGenToolClient />;
    case 'lorem-ipsum-generator-pro': return <LoremIpsumGeneratorProClient />;
    case 'lorem-ipsum-generator-v3': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-generator-v4': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-generator-v5': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-generator-v6': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-paragraphs': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-placeholder': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-prime': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-pro': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-quick': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-simple': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-smart': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-std': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-tool': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-toolblip': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-toolbox': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-ultimate': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-ultra': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-x': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-xl': return <LoremIpsumGeneratorClient />;
    case 'm4a-to-wav': return <AacToWavClient />;
    case 'md5-hash-generator': return <HashGeneratorClient />;
    case 'meta-gen-toolblip': return <MetaGenToolblipClient />;
    case 'meta-tag-browser': return <MetaTagGeneratorClient />;
    case 'meta-tag-fresh': return <MetaTagGeneratorClient />;
    case 'meta-tag-full': return <MetaTagGeneratorClient />;
    case 'meta-tag-gen-adv': return <MetaTagGenAdvClient />;
    case 'meta-tag-gen-prime': return <MetaTagGenPrimeClient />;
    case 'meta-tag-gen-pro': return <MetaTagGenProClient />;
    case 'meta-tag-gen-tool': return <MetaTagGenToolClient />;
    case 'meta-tag-gen-ultra': return <MetaTagGenUltraClient />;
    case 'meta-tag-generator-2025': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-advanced': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-api': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-browser': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-classic': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-complete': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-dg': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-easy': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-enhanced': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-expander': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-express': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-final': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-fresh': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-full': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-handy': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-new': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-prime': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-pro': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-quick': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-smart': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-std': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-tool': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-ultimate': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-ultra': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-v2': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-v3': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-v4': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-v5': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-v6': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-x': return <MetaTagGeneratorClient />;
    case 'meta-tag-generator-xl': return <MetaTagGeneratorClient />;
    case 'meta-tag-quick': return <MetaTagGeneratorClient />;
    case 'meta-tags-gen-tool': return <MetaTagGeneratorClient />;
    case 'mkv-to-gif': return <AviToGifClient />;
    case 'mkv-to-mp3': return <MkvToMp3Client />;
    case 'mock-api-generator': return <ApiDocGeneratorClient />;
    case 'morse-code-express': return <MorseCodeTranslatorClient />;
    case 'morse-code-translator-v2': return <MorseCodeTranslatorClient />;
    case 'mov-to-wav': return <AacToWavClient />;
    case 'mp4-to-avi': return <AviToGifClient />;
    case 'mp4-to-gif': return <AviToGifClient />;
    case 'mp4-to-wav': return <AacToWavClient />;
    case 'number-base-browser': return <BaseNumberConverterClient />;
    case 'number-base-convert': return <BaseConvertToolClient />;
    case 'number-base-converter-2025': return <BaseNumberConverterClient />;
    case 'number-base-converter-advanced': return <BaseNumberConverterClient />;
    case 'number-base-converter-bin-hex': return <BaseNumberConverterClient />;
    case 'number-base-converter-browser': return <BaseNumberConverterClient />;
    case 'number-base-converter-classic': return <BaseNumberConverterClient />;
    case 'number-base-converter-complete': return <BaseNumberConverterClient />;
    case 'number-base-converter-dg': return <BaseNumberConverterClient />;
    case 'number-base-converter-enhanced': return <BaseNumberConverterClient />;
    case 'number-base-converter-expander': return <BaseNumberConverterClient />;
    case 'number-base-converter-express': return <BaseNumberConverterClient />;
    case 'number-base-converter-final': return <BaseNumberConverterClient />;
    case 'number-base-converter-fresh': return <BaseNumberConverterClient />;
    case 'number-base-converter-full': return <BaseNumberConverterClient />;
    case 'number-base-converter-new': return <BaseNumberConverterClient />;
    case 'number-base-converter-prime': return <BaseNumberConverterClient />;
    case 'number-base-converter-pro': return <BaseNumberConverterClient />;
    case 'number-base-converter-quick': return <BaseConverterQuickClient />;
    case 'number-base-converter-smart': return <BaseNumberConverterClient />;
    case 'number-base-converter-std': return <BaseNumberConverterClient />;
    case 'number-base-converter-tool': return <BaseNumberConverterClient />;
    case 'number-base-converter-ultimate': return <BaseNumberConverterClient />;
    case 'number-base-converter-ultra': return <BaseNumberConverterClient />;
    case 'number-base-converter-v3': return <BaseNumberConverterClient />;
    case 'number-base-converter-v4': return <BaseNumberConverterClient />;
    case 'number-base-converter-v5': return <BaseNumberConverterClient />;
    case 'number-base-converter-x': return <BaseNumberConverterClient />;
    case 'number-base-converter-xl': return <BaseNumberConverterClient />;
    case 'number-base-easy': return <BaseNumberConverterClient />;
    case 'number-base-encoder': return <Base64EncoderDecoderClient />;
    case 'number-base-fresh': return <BaseNumberConverterClient />;
    case 'number-base-full': return <BaseNumberConverterClient />;
    case 'number-base-simple': return <BaseNumberConverterClient />;
    case 'number-base-tool': return <BaseConvertToolClient />;
    case 'number-base-toolblip': return <BaseToolblipClient />;
    case 'number-to-words-express': return <NumberToWordsClient />;
    case 'number-to-words-tool': return <NumberToWordsClient />;
    case 'banner-generator': return <OgImageGeneratorClient />;
    case 'tweet-to-image-converter': return <TweetToImageClient />;
    case 'ogg-to-wav': return <AacToWavClient />;
    case 'palindrome-checker-express': return <PalindromeCheckerClient />;
    case 'paragraph-generator': return <RandomParagraphGeneratorClient />;
    case 'paragraph-lorem-ipsum': return <LoremIpsumGeneratorClient />;
    case 'percentage-off-calculator': return <PercentageCalculatorClient />;
    case 'ping-test-v2': return <PingTestClient />;
    case 'placeholder-image-generator': return <ImageShadowGeneratorClient />;
    case 'plain-text-formatter': return <PlainTextCounterClient />;
    case 'png-to-ico': return <FaviconGeneratorClient />;
    case 'port-check-tool': return <ContrastCheckToolClient />;
    case 'port-checker-tool': return <ContrastCheckerToolClient />;
    case 'pressure-unit-converter': return <UnitConverterClient />;
    case 'qr-code': return <QrCodeGeneratorClient />;
    case 'random-color-generator': return <RandomColorGeneratorClient />;
    case 'random-id-generator': return <RandomIdGeneratorClient />; // real alphanumeric ID generator, not the fraction tool
    case 'random-pin-generator': return <RandomPinGeneratorClient />; // real numeric PIN generator, not the fraction tool
    case 'readability-check-tool': return <ContrastCheckToolClient />;
    case 'readability-checker-pro': return <ReadabilityCheckerClient />;
    case 'readability-checker-tool': return <ReadabilityCheckerClient />;
    case 'readability-score-2025': return <ReadabilityScoreClient />;
    case 'readability-score-adv': return <ReadabilityScoreClient />;
    case 'readability-score-advanced': return <ReadabilityScoreClient />;
    case 'readability-score-api': return <ReadabilityScoreClient />;
    case 'readability-score-browser': return <ReadabilityScoreClient />;
    case 'readability-score-checker': return <ReadabilityCheckerClient />;
    case 'readability-score-classic': return <ReadabilityScoreClient />;
    case 'readability-score-complete': return <ReadabilityScoreClient />;
    case 'readability-score-easy': return <ReadabilityScoreClient />;
    case 'readability-score-enhanced': return <ReadabilityScoreClient />;
    case 'readability-score-express': return <ReadabilityScoreClient />;
    case 'readability-score-final': return <ReadabilityScoreClient />;
    case 'readability-score-fresh': return <ReadabilityScoreClient />;
    case 'readability-score-full': return <ReadabilityScoreClient />;
    case 'readability-score-handy': return <ReadabilityScoreClient />;
    case 'readability-score-new': return <ReadabilityScoreClient />;
    case 'readability-score-prime': return <ReadabilityScoreClient />;
    case 'readability-score-pro': return <ReadabilityScoreClient />;
    case 'readability-score-quick': return <ReadabilityScoreClient />;
    case 'readability-score-smart': return <ReadabilityScoreClient />;
    case 'readability-score-std': return <ReadabilityScoreClient />;
    case 'readability-score-tool': return <ReadabilityScoreClient />;
    case 'readability-score-toolblip': return <ReadabilityScoreClient />;
    case 'readability-score-ultimate': return <ReadabilityScoreClient />;
    case 'readability-score-ultra': return <ReadabilityScoreClient />;
    case 'readability-score-v2': return <ReadabilityScoreClient />;
    case 'readability-score-v3': return <ReadabilityScoreClient />;
    case 'readability-score-v4': return <ReadabilityScoreClient />;
    case 'readability-score-v5': return <ReadabilityScoreClient />;
    case 'readability-score-v6': return <ReadabilityScoreClient />;
    case 'readability-score-x': return <ReadabilityScoreClient />;
    case 'readability-score-xl': return <ReadabilityScoreClient />;
    case 'reading-time-express': return <ReadingTimeCalculatorClient />;
    case 'regex-live-tester': return <RegexTesterClient />;
    case 'regex-match-visualizer': return <RegexVisualizerClient />;
    case 'regex-tester-2025': return <RegexTesterClient />;
    case 'regex-tester-adv': return <RegexTesterClient />;
    case 'regex-tester-advanced': return <RegexTesterClient />;
    case 'regex-tester-api': return <RegexTesterClient />;
    case 'regex-tester-browser': return <RegexTesterClient />;
    case 'regex-tester-classic': return <RegexTesterClient />;
    case 'regex-tester-complete': return <RegexTesterClient />;
    case 'regex-tester-dg': return <RegexTesterClient />;
    case 'regex-tester-easy': return <RegexTesterClient />;
    case 'regex-tester-enhanced': return <RegexTesterClient />;
    case 'regex-tester-expander': return <RegexTesterClient />;
    case 'regex-tester-express': return <RegexTesterClient />;
    case 'regex-tester-final': return <RegexTesterClient />;
    case 'regex-tester-fresh': return <RegexTesterClient />;
    case 'regex-tester-full': return <RegexTesterClient />;
    case 'regex-tester-new': return <RegexTesterClient />;
    case 'regex-tester-prime': return <RegexTesterClient />;
    case 'regex-tester-pro': return <RegexTesterClient />;
    case 'regex-tester-quick': return <RegexTesterClient />;
    case 'regex-tester-smart': return <RegexTesterClient />;
    case 'regex-tester-std': return <RegexTesterClient />;
    case 'regex-tester-tool': return <RegexTesterClient />;
    case 'regex-tester-toolblip': return <RegexTesterClient />;
    case 'regex-tester-ultimate': return <RegexTesterClient />;
    case 'regex-tester-ultra': return <RegexTesterClient />;
    case 'regex-tester-v2': return <RegexTesterClient />;
    case 'regex-tester-v3': return <RegexTesterClient />;
    case 'regex-tester-v4': return <RegexTesterClient />;
    case 'regex-tester-v5': return <RegexTesterClient />;
    case 'regex-tester-v6': return <RegexTesterClient />;
    case 'regex-tester-web': return <RegexTesterClient />;
    case 'regex-tester-x': return <RegexTesterClient />;
    case 'regex-tester-xl': return <RegexTesterClient />;
    case 'rgb-hsl-color-picker': return <ColorPickerHexRgbHslClient />;
    case 'rgb-to-hex-express':
    case 'rgb-to-hex-new':
      return <RgbToHexClient />;
    case 'rgba-color-picker': return <ColorPicker2025Client />;
    case 'rgba-to-hex': return <HexToRgbaClient />;
    case 'rgba-to-hsl': return <RgbaToHslConverterClient />;
    case 'robots-txt-builder': return <RobotsTxtEditorClient />;
    case 'robots-txt-simulator': return <RobotsTxtEditorClient />;
    case 'robots-txt-tester': return <RobotsTxtEditorClient />;
    case 'roman-numeral-converter-v2': return <RomanNumeralConverterClient />;
    case 'roman-numeral-express': return <RomanNumeralConverterClient />;
    case 'scrypt-hash-generator': return <HashGeneratorClient />;
    case 'secure-random-generator': return <SecureRandomGeneratorClient />; // real crypto.getRandomValues-based generator, not the fraction tool
    case 'sentence-lorem-ipsum': return <LoremIpsumGeneratorClient />;
    case 'seo-meta-generator': return <MetaTagGeneratorClient />;
    case 'seo-meta-tag-analyzer': return <SeoMetaTagAnalyzerClient />;
    case 'seo-meta-tag-builder': return <MetaTagGeneratorClient />;
    case 'seo-meta-tag-creator': return <MetaTagGeneratorClient />;
    case 'seo-tag-analyzer': return <SeoMetaTagAnalyzerClient />;
    case 'seo-title-tag-generator': return <ArticleTitleGeneratorClient />;
    case 'serp-preview-2025': return <SerpPreviewClient />;
    case 'serp-preview-adv': return <SerpPreviewClient />;
    case 'serp-preview-advanced': return <SerpPreviewClient />;
    case 'serp-preview-api': return <SerpPreviewClient />;
    case 'serp-preview-browser': return <SerpPreviewClient />;
    case 'serp-preview-classic': return <SerpPreviewClient />;
    case 'serp-preview-complete': return <SerpPreviewClient />;
    case 'serp-preview-dg': return <SerpPreviewClient />;
    case 'serp-preview-easy': return <SerpPreviewClient />;
    case 'serp-preview-enhanced': return <SerpPreviewClient />;
    case 'serp-preview-expander': return <SerpPreviewClient />;
    case 'serp-preview-express': return <SerpPreviewClient />;
    case 'serp-preview-final': return <SerpPreviewClient />;
    case 'serp-preview-fresh': return <SerpPreviewClient />;
    case 'serp-preview-full': return <SerpPreviewClient />;
    case 'serp-preview-handy': return <SerpPreviewClient />;
    case 'serp-preview-new': return <SerpPreviewClient />;
    case 'serp-preview-prime': return <SerpPreviewClient />;
    case 'serp-preview-pro': return <SerpPreviewClient />;
    case 'serp-preview-quick': return <SerpPreviewClient />;
    case 'serp-preview-smart': return <SerpPreviewClient />;
    case 'serp-preview-std': return <SerpPreviewClient />;
    case 'serp-preview-tool': return <SerpPreviewClient />;
    case 'serp-preview-toolblip': return <SerpPreviewClient />;
    case 'serp-preview-ultimate': return <SerpPreviewClient />;
    case 'serp-preview-ultra': return <SerpPreviewClient />;
    case 'serp-preview-v3': return <SerpPreviewClient />;
    case 'serp-preview-v4': return <SerpPreviewClient />;
    case 'serp-preview-v5': return <SerpPreviewClient />;
    case 'serp-preview-v6': return <SerpPreviewClient />;
    case 'serp-preview-x': return <SerpPreviewClient />;
    case 'serp-preview-xl': return <SerpPreviewClient />;
    case 'serp-result-preview': return <SerpPreviewClient />;
    case 'sha1-hash-generator': return <HashGeneratorClient />;
    case 'sha256-hash-generator': return <HashGeneratorClient />;
    case 'shell-command-gen-express': return <ShellCommandGenExpressClient />;
    case 'shell-command-generator': return <BashCommandGeneratorClient />;
    case 'shell-command-generator-new': return <BashCommandGeneratorClient />; // legacy alias, redirected via next.config.mjs
    case 'shell-command-generator': return <BashCommandGeneratorClient />;
    case 'sitemap-html-generator': return <HtmlTableGeneratorClient />;
    case 'sitemap-xml-validator': return <XmlValidatorClient />;
    case 'sitemap-xml-validator-express': return <XmlValidatorClient />;
    case 'speech-to-text': return <AudioToTextClient />;
    case 'spelling-checker-tool': return <GrammarCheckerClient />; // legacy alias, redirected via next.config.mjs
    case 'srt-to-json': return <CsvToJsonClient />;
    case 'srt-to-json-v2': return <CsvToJsonClient />;
    case 'summarizer': return <ContentSummarizerClient />;
    case 'syllable-counter-express': return <SyllableCounterClient />;
    case 'syllable-word-counter': return <SyllableCounterClient />;
    case 'table-to-markdown': return <JsonToMarkdownTableClient />;
    case 'temp-converter-express': return <TempConverterExpressClient />; // legacy alias, redirected via next.config.mjs
    case 'temp-converter': return <TempConverterExpressClient />;
    case 'text-combinations-generator': return <FakeTextGeneratorClient />;
    case 'text-diff-checker': return <TextDiffClient />;
    case 'text-diff-express': return <TextDiffClient />;
    case 'text-difference-checker': return <TextRedundancyCheckerClient />;
    case 'text-fluency-checker': return <TextRedundancyCheckerClient />;
    case 'text-line-sorter': return <TextSorterClient />;
    case 'text-sorter-2025': return <TextSorterClient />;
    case 'text-sorter-adv': return <TextSorterClient />;
    case 'text-sorter-advanced': return <TextSorterClient />;
    case 'text-sorter-alpha': return <TextSorterClient />;
    case 'text-sorter-api': return <TextSorterClient />;
    case 'text-sorter-browser': return <TextSorterClient />;
    case 'text-sorter-classic': return <TextSorterClient />;
    case 'text-sorter-complete': return <TextSorterClient />;
    case 'text-sorter-dg': return <TextSorterClient />;
    case 'text-sorter-easy': return <TextSorterClient />;
    case 'text-sorter-enhanced': return <TextSorterClient />;
    case 'text-sorter-expander': return <TextSorterClient />;
    case 'text-sorter-express': return <TextSorterClient />;
    case 'text-sorter-final': return <TextSorterClient />;
    case 'text-sorter-fresh': return <TextSorterClient />;
    case 'text-sorter-full': return <TextSorterClient />;
    case 'text-sorter-handy': return <TextSorterClient />;
    case 'text-sorter-instant': return <TextSorterClient />;
    case 'text-sorter-new': return <TextSorterClient />;
    case 'text-sorter-prime': return <TextSorterClient />;
    case 'text-sorter-pro': return <TextSorterClient />;
    case 'text-sorter-quick': return <TextSorterClient />;
    case 'text-sorter-smart': return <TextSorterClient />;
    case 'text-sorter-std': return <TextSorterClient />;
    case 'text-sorter-tool': return <TextSorterClient />;
    case 'text-sorter-toolblip': return <TextSorterClient />;
    case 'text-sorter-ultimate': return <TextSorterClient />;
    case 'text-sorter-ultra': return <TextSorterClient />;
    case 'text-sorter-v3': return <TextSorterClient />;
    case 'text-sorter-v4': return <TextSorterClient />;
    case 'text-sorter-v5': return <TextSorterClient />;
    case 'text-sorter-v6': return <TextSorterClient />;
    case 'text-sorter-x': return <TextSorterClient />;
    case 'text-sorter-xl': return <TextSorterClient />;
    case 'text-statistics-advanced': return <TextStatisticsClient />;
    case 'text-to-handwriting': return <TextToHandwritingClient />; // real cursive-font renderer, not the speech-to-text mic tool
    case 'text-to-image': return <AudioToTextClient />;
    case 'tiff-to-text': return <AudioToTextClient />;
    case 'time-duration-calculator': return <TimeDurationCalculatorClient />; // real time arithmetic, not a reading-speed estimator
    case 'time-zone-tool': return <TimeZoneConverterClient />;
    case 'unit-converter-2025': return <UnitConverterClient />;
    case 'unit-converter-advanced': return <UnitConverterClient />;
    case 'unit-converter-browser': return <UnitConverterClient />;
    case 'unit-converter-classic': return <UnitConverterClient />;
    case 'unit-converter-complete': return <UnitConverterClient />;
    case 'unit-converter-dg': return <UnitConverterClient />;
    case 'unit-converter-easy': return <UnitConverterClient />;
    case 'unit-converter-enhanced': return <UnitConverterClient />;
    case 'unit-converter-expander': return <UnitConverterClient />;
    case 'unit-converter-express': return <UnitConverterClient />;
    case 'unit-converter-final': return <UnitConverterClient />;
    case 'unit-converter-fresh': return <UnitConverterClient />;
    case 'unit-converter-full': return <UnitConverterClient />;
    case 'unit-converter-handy': return <UnitConverterClient />;
    case 'unit-converter-length-weight': return <LengthConverterClient />;
    case 'unit-converter-prime': return <UnitConverterClient />;
    case 'unit-converter-pro': return <UnitConverterClient />;
    case 'unit-converter-quick': return <UnitConverterClient />;
    case 'unit-converter-smart': return <UnitConverterClient />;
    case 'unit-converter-std': return <UnitConverterClient />;
    case 'unit-converter-tool': return <UnitConverterClient />;
    case 'unit-converter-toolbox': return <UnitConverterClient />;
    case 'unit-converter-ultimate': return <UnitConverterClient />;
    case 'unit-converter-ultra': return <UnitConverterClient />;
    case 'unit-converter-v3': return <UnitConverterClient />;
    case 'unit-converter-v4': return <UnitConverterClient />;
    case 'unit-converter-v5': return <UnitConverterClient />;
    case 'unit-converter-x': return <UnitConverterClient />;
    case 'unit-converter-xl': return <UnitConverterClient />;
    case 'unit-measurement-converter': return <UnitConverterClient />;
    case 'units-convert-tool': return <BaseConvertToolClient />;
    case 'unix-timestamp-express': return <UnixTimestampConverterClient />;
    case 'url-encoder-decoder': return <Base64EncoderDecoderClient />;
    case 'url-similarity-checker': return <UrlRedirectCheckerClient />;
    case 'user-agent-parser-v2': return <UserAgentParserClient />;
    case 'uuid-v1-generator': return <UuidV1GeneratorClient />;
    case 'vcard-qr-generator': return <QrCodeGeneratorClient />;
    case 'volume-unit-converter': return <UnitConverterClient />;
    case 'vsd-to-pdf': return <ExcelToPdfClient />;
    case 'vsdx-to-pdf': return <ExcelToPdfClient />;
    case 'wcag-contrast-auditor': return <ColorContrastAuditorClient title="WCAG Contrast Auditor" />;
    case 'webp-to-gif': return <AviToGifClient />;
    case 'weight-converter-express': return <WeightConverterClient />;
    case 'wifi-qr-code-generator': return <QrCodeGeneratorClient />;
    case 'word-complexity-analyzer': return <WordFrequencyAnalyzerClient />;
    case 'word-frequency-table': return <WordFrequencyAnalyzerClient />;
    case 'xml-sitemap-parser': return <XmlSitemapGeneratorClient />;
    case 'xml-to-excel': return <ExcelToXmlClient />;
    case 'yaml-to-toml': return <JsonToYamlClient />;
    case 'yaml-to-toml-v2': return <JsonToYamlClient />;
    case 'youtube-to-text': return <AudioToTextClient />;
    case 'jwt-quick': return <JwtDecoderClient />;
    case 'jwt-tool': return <JwtDecoderClient />;
    case 'metadata': return <ImageMetadataViewerClient />;
    case 'pdf-password-remover': return <PdfPasswordRemoverClient />;
    case 'percentage-change-calc': return <PercentageCalculatorClient initialMode="change" />;
    case 'readability-dg': return <ReadabilityScoreClient />;
    case 'readability-expander': return <ReadabilityScoreClient />;
    case 'readability-grade-tool': return <ReadabilityScoreClient />;
    case 'readability-quick': return <ReadabilityScoreClient />;
    case 'readability-toolblip': return <ReadabilityScoreClient />;
    case 'regex-match-tool': return <RegexTesterClient />;
    case 'regex-quick': return <RegexTesterClient />;
    case 'regex-test-tool': return <RegexTesterClient />;
    case 'regex-tool': return <RegexTesterClient />;
    case 'rot13-express': return <Rot13CipherClient />;
    case 'serp-browser': return <SerpPreviewClient />;
    case 'serp-fresh': return <SerpPreviewClient />;
    case 'ssh-key-gen': return <SSHKeyGeneratorClient />;
    case 'text-sorting-tool': return <TextSorterClient />;
    case 'unit-convert-toolblip': return <UnitConverterClient />;
    case 'unit-fresh': return <UnitConverterClient />;
    case 'unit-quick': return <UnitConverterClient />;
    case 'unit-toolblip': return <UnitConverterClient />;
    case 'vsd-to-docx': return <VsdxToDocxClient />;
    case 'image-scale-calculator': return <ImageScaleCalculatorClient />;
    case 'image-square-fit': return <ImageSquareFitClient />;
    case 'ipynb-formatter': return <IPynbFormatterClient />;
    case 'jupyter-cleaner': return <JupyterCleanerClient />;
    case 'json-editor': return <JsonEditorClient />;
    case 'json-tree-view': return <JsonTreeViewClient />;
    case 'jwt-token-inspector': return <JwtTokenInspectorClient />;
    case 'jwt-token-tester': return <JwtTokenTesterClient />;
    case 'keyword-difficulty-tool': return <KeywordDifficultyToolClient />;
    case 'keyword-extractor': return <KeywordExtractorClient />;
    // 'keyword-generator' itself is defined earlier (~line 2854) as
    // KeywordGeneratorExpressClient, which is what the current
    // data/tools.ts entry (renamed from 'keyword-generator-express') was
    // written against; this duplicate case for the same slug was dead code.
    case 'keyword-generator-v2': return <KeywordGeneratorClient />;
    case 'list-difference-finder': return <ListDifferenceFinderClient />;
    case 'meta-tags-tool': return <MetaTagsToolClient />;
    case 'metric-imperial-converter': return <MetricImperialConverterClient />;
    case 'mime-types-reference': return <MIMETypesReferenceClient />;
    case 'mp4-to-mp3': return <MP4ToMP3Client />;
    case 'nda-generator': return <NDAGeneratorClient />;
    case 'page-title-checker': return <PageTitleCheckerClient />;
    case 'photo-metadata-remover': return <PhotoMetadataRemoverClient />;
    case 'photo-resize-tool': return <PhotoResizeToolClient />; // legacy alias, redirected via next.config.mjs
    case 'photo-resize': return <PhotoResizeToolClient />;
    case 'physics-constants-reference': return <PhysicsConstantsReferenceClient />;
    case 'poll-generator': return <PollGeneratorClient />;
    case 'pressure-converter': return <PressureConverterClient />;
    case 'profile-photo': return <ProfilePhotoEditorClient />;
    case 'purchase-agreement-generator': return <PurchaseAgreementGeneratorClient />;
    case 'punycode-encoder': return <PunycodeEncoderClient />;
    case 'quote-of-the-day': return <QuoteOfTheDayClient />;
    case 'random-choice-picker': return <RandomChoicePickerClient />;
    case 'random-choice-wheel': return <RandomChoiceWheelClient />;
    case 'reading-level-estimator': return <ReadingLevelEstimatorClient />;
    case 'pdf-rearrange': return <RearrangePDFPagesClient />;
    case 'regex-description-generator': return <RegexDescriptionGeneratorClient />;
    case 'regex-escape': return <RegexEscapeClient />;
    case 'regex-explainer': return <RegexExplainerClient />;
    case 'regex-pattern-builder': return <RegexPatternBuilderClient />;
    case 'regex-pattern-generator': return <RegexPatternGeneratorClient />;
    case 'regex-pattern-generator-v2': return <RegexPatternGeneratorClient />;
    case 'remove-extra-spaces': return <RemoveExtraSpacesClient />;
    case 'rot13-cipher-v2': return <Rot13CipherClient />;
    case 'screen-density-simulator': return <ScreenDensitySimulatorClient />;
    case 'scientific-notation-converter': return <ScientificNotationConverterClient />;
    case 'search-console-insights': return <SearchConsoleInsightsClient />;
    case 'sentence-extractor': return <SentenceExtractorClient />;
    case 'sentiment-analyzer': return <SentimentAnalyzerClient />;
    case 'seo-meta-builder': return <SEOMetaBuilderClient />;
    case 'seo-title-analyzer': return <SEOTitleAnalyzerClient />;
    case 'serp-quick': return <SERPQuickClient />;
    case 'serp-snippet-viewer': return <SERPSnippetViewerClient />;
    case 'shell-command-reference': return <ShellCommandReferenceClient />;
    case 'sign-pdf': return <SignPDFClient />;
    case 'sitemap-html-new': return <SitemapHTMLNewClient />;
    case 'slug-health-checker': return <SlugHealthCheckerClient />;
    case 'slug-permalink-checker': return <SlugPermalinkCheckerClient />;
    case 'slideshow-generator': return <SlideshowGeneratorClient />;
    case 'split': return <BillSplitterClient />;
    case 'split-csv': return <SplitCSVFileClient />;
    case 'split-excel': return <SplitExcelFileClient />;
    case 'text-complexity-analyzer': return <TextComplexityAnalyzerClient />;
    case 'text-deduplicator': return <TextDeduplicatorClient />;
    case 'text-highlighter': return <TextHighlighterClient />;
    case 'text-line-deduplicator': return <TextDeduplicatorClient />;
    case 'text-sentence-shuffler': return <TextSentenceShufflerClient />;
    case 'text-sort-tool': return <TextSortToolClient />;
    case 'text-structure-validator': return <TextStructureValidatorClient />;
    case 'timestamp-diff-calculator': return <TimestampDiffCalculatorClient />;
    case 'trace': return <LogoTraceConverterClient />;
    case 'twitter-card-preview': return <TwitterCardPreviewClient />;
    case 'ua-parser-express': return <UAParserExpressClient />;
    case 'unicode-escape-encoder': return <UnicodeEscapeEncoderClient />;
    case 'unit-conversion-tool': return <UnitConversionToolClient />;
    case 'uuid-compare': return <UUIDCompareClient />;
    case 'uuid-comparator': return <UUIDComparatorClient />;
    case 'uuid-normalizer': return <UUIDNormalizerClient />;
    case 'visio-to-powerpoint': return <VsdxToPptxClient />;
    case 'visio-to-word': return <VsdxToDocxClient />;
    case 'vsd-to-pptx': return <VsdxToPptxClient />;
    case 'vsdx-to-docx': return <VsdxToDocxClient />;
    case 'vsdx-to-pptx': return <VsdxToPptxClient />;
    case 'add-watermark-to-pdf': return <AddWatermarkToPDFClient />;
    case 'websocket-tester': return <WebSocketTesterClient />;
    case 'what-if-scenario-calculator': return <WhatIfScenarioCalculatorClient />;
    case 'word-alphabetizer': return <WordAlphabetizerClient />;
    case 'word-finder': return <WordFinderClient />;
    case 'word-freq-express': return <WordFreqExpressClient />; // legacy alias, redirected via next.config.mjs
    case 'word-freq': return <WordFreqExpressClient />;
    case 'word-scramble-generator': return <WordScrambleGeneratorClient />;
    case 'zip': return <CreateZipFileClient />;
    case 'regex-toolblip': return <RegexToolClient />;
    case 'jwt-toolblip': return <JwtToolClient />;
    case 'port-toolblip': return <PortToolClient />;
    case 'meta-toolblip': return <MetaToolClient />;
    case 'serp-toolblip': return <SerpToolClient />;
    case 'mock-port-check': return <MockPortCheckClient />;
    case 'word-cloud-generator': return <WordCloudGeneratorClient />;
    case 'word-combinations-generator': return <WordCombinationsGeneratorClient />;
    case 'json-to-url-encoded-v2': return <JSONToURLEncodedV2Client />;
    case 'ssh-key-generator': return <SSHKeyGeneratorClient />;
    case 'press-release-generator': return <PressReleaseGeneratorClient />;
    case 'privacy-policy-generator': return <PrivacyPolicyGeneratorClient />;
    case 'token-builder': return <TokenBuilderClient />;
    case 'pixel-density-calculator': return <PixelDensityCalculatorClient />;
    case 'url-encode': return <UrlEncodeClient />;
    case 'data-size-converter': return <DataSizeConverterClient />;
    case 'cron-human-readable': return <CronHumanReadableClient />;
    case 'cron-schedule-generator': return <CronScheduleGeneratorClient />;
    case 'cron-schedule-validator': return <CronScheduleValidatorClient />;
    case 'energy-converter': return <EnergyConverterClient />;
    case 'favicon-from-emoji': return <FaviconFromEmojiClient />;
    case 'css-naming-convention': return <CssNamingConventionClient />;
    case 'frequency-converter': return <FrequencyConverterClient />;
    case 'force-converter': return <ForceConverterClient />;
    case 'favicon-maker': return <IconFaviconCreatorClient />;
    case 'favicon-preview-tool': return <FaviconGeneratorClient />; // legacy alias, redirected via next.config.mjs
    case 'favicon-preview': return <FaviconGeneratorClient />;
    case 'cron-generator-dg': return <CronGeneratorCompleteClient />;
    case 'cron-schedule-explainer': return <CronScheduleExplainerClient />;
    case 'css-animation-generator': return <CssAnimationGeneratorClient />;
    case 'css-cursor-generator': return <CssCursorGeneratorClient />;
    case 'favicon-png-creator': return <IconFaviconCreatorClient />;
    case 'favicon-checker': return <BatchFaviconDownloaderClient />;

    default:
      return null;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function ToolClient({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Tools</Link>
        <span>/</span>
        <Link href={tool.category === 'Image' ? '/tools/images' : `/tools?category=${encodeURIComponent(tool.category)}`} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{tool.category}</Link>
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
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolUI tool={tool} />
      </div>
    </div>
  );
}
