'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';


// ─── Imported tool UIs ──────────────────────────────────────────────────────
import DataSizeConverterClient from '@/components/tools/DataSizeConverterClient';
import CronHumanReadableClient from '@/components/tools/CronHumanReadableClient';
import CronScheduleGeneratorClient from '@/components/tools/CronScheduleGeneratorClient';
import CronScheduleValidatorClient from '@/components/tools/CronScheduleValidatorClient';
import EnergyConverterClient from '@/components/tools/EnergyConverterClient';
import FaviconFromEmojiClient from '@/components/tools/FaviconFromEmojiClient';
import CssNamingConventionClient from '@/components/tools/CssNamingConventionClient';
import FrequencyConverterClient from '@/components/tools/FrequencyConverterClient';
import ForceConverterClient from '@/components/tools/ForceConverterClient';
import IconFaviconCreatorClient from '@/components/tools/IconFaviconCreatorClient';
import CronGeneratorCompleteClient from '@/components/tools/CronGeneratorCompleteClient';
import CronScheduleExplainerClient from '@/components/tools/CronScheduleExplainerClient';
import CssAnimationGeneratorClient from '@/components/tools/CssAnimationGeneratorClient';
import CssCursorGeneratorClient from '@/components/tools/CssCursorGeneratorClient';
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
import SSHKeyGeneratorClient from '@/components/tools/SSHKeyGeneratorClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';
import PercentageDifferenceClient from '@/components/tools/PercentageDifferenceClient';
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import TipCalculatorClient from '@/components/tools/TipCalculatorClient';
import PasswordGeneratorClient from '@/components/tools/PasswordGeneratorClient';
import NumberBaseConverterClient from '@/components/tools/NumberBaseConverterClient';
import MetaTagGeneratorClient from '@/components/tools/MetaTagGeneratorClient';
import MarkdownToHtmlClient from '@/components/tools/MarkdownToHtmlClient';
import LoremIpsumGeneratorClient from '@/components/tools/LoremIpsumGeneratorClient';
import LoremIpsumDetectorClient from '@/components/tools/LoremIpsumDetectorClient';
import JwtDecoderClient from '@/components/tools/JwtDecoderClient';
import JsonToYamlClient from '@/components/tools/JsonToYamlClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import JsonValidatorClient from '@/components/tools/JsonValidatorClient';
import JsonGraphVisualizerClient from '@/components/tools/JsonGraphVisualizerClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import ImageAspectRatioCalculatorClient from '@/components/tools/ImageAspectRatioCalculatorClient';
import ImageDpiResizerClient from '@/components/tools/ImageDpiResizerClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import ImageTrimmerClient from '@/components/tools/ImageTrimmerClient';
import EraseColorClient from '@/components/tools/EraseColorClient';
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
import CharacterFrequencyCounterClient from '@/components/tools/CharacterFrequencyCounterClient';
import CharacterVarietyCheckerClient from '@/components/tools/CharacterVarietyCheckerClient';
import OxfordCommaClient from '@/components/tools/OxfordCommaClient';
import NotebookToHtmlClient from '@/components/tools/NotebookToHtmlClient';
import OgImageGeneratorClient from '@/components/tools/OgImageGeneratorClient';
import TweetToImageClient from '@/components/tools/TweetToImageClient';
import HexToRgbClient from '@/components/tools/HexToRgbClient';
import RgbToHexClient from '@/components/tools/RgbToHexClient';
import RandomStringClient from '@/components/tools/RandomStringClient';
import Base64EncoderDecoderClient from '@/components/tools/Base64EncoderDecoderClient';
import Base64FileEncoderClient from '@/components/tools/Base64FileEncoderClient';
import Base64ImageDecoderClient from '@/components/tools/Base64ImageDecoderClient';
import Base64ImageEncoderClient from '@/components/tools/Base64ImageEncoderClient';
import Base64ImageViewerClient from '@/components/tools/Base64ImageViewerClient';
import Base64ImageConverterClient from '@/components/tools/Base64ImageConverterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import AgeCalculatorClient from '@/components/tools/AgeCalculatorClient';
import AnagramGeneratorClient from '@/components/tools/AnagramGeneratorClient';
import BacklinkCheckerClient from '@/components/tools/BacklinkCheckerClient';
import Base64Client from '@/components/tools/Base64Client';
import BashCommandGeneratorClient from '@/components/tools/BashCommandGeneratorClient';
import BinaryToDecimalClient from '@/components/tools/BinaryToDecimalClient';
import BinaryToTextClient from '@/components/tools/BinaryToTextClient';
import BrokenLinkCheckerClient from '@/components/tools/BrokenLinkCheckerClient';
import BrokenImageCheckerClient from '@/components/tools/BrokenImageCheckerClient';
import BrokenLinkCheckerExpressClient from '@/components/tools/BrokenLinkCheckerExpressClient';
import BrokenLinkCheckerV2Client from '@/components/tools/BrokenLinkCheckerV2Client';
import BrowserImageResizerClient from '@/components/tools/BrowserImageResizerClient';
import BusinessPlanGeneratorClient from '@/components/tools/BusinessPlanGeneratorClient';
import ByteConverterClient from '@/components/tools/ByteConverterClient';
import CanonicalUrlGeneratorClient from '@/components/tools/CanonicalUrlGeneratorClient';
import ChineseCharConverterClient from '@/components/tools/ChineseCharConverterClient';
import CidrCalculatorClient from '@/components/tools/CidrCalculatorClient';
import CmykToRgbConverterClient from '@/components/tools/CmykToRgbConverterClient';
import CmykToRgbClient from '@/components/tools/CmykToRgbClient';
import CmykToRgbToolClient from '@/components/tools/CmykToRgbToolClient';
import CorsHeaderGeneratorClient from '@/components/tools/CorsHeaderGeneratorClient';
import CountdownTimerClient from '@/components/tools/CountdownTimerClient';
import CrontabGeneratorClient from '@/components/tools/CrontabGeneratorClient';
import CssClassGeneratorClient from '@/components/tools/CssClassGeneratorClient';
import CssPreprocessorClient from '@/components/tools/CssPreprocessorClient';
import CssToScssConverterClient from '@/components/tools/CssToScssConverterClient';
import CssValidatorClient from '@/components/tools/CssValidatorClient';
import CsvToJsonClient from '@/components/tools/CsvToJsonClient';
import CsvToTsvClient from '@/components/tools/CsvToTsvClient';
import CurlGeneratorClient from '@/components/tools/CurlGeneratorClient';
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
import PunctuationFixerClient from '@/components/tools/PunctuationFixerClient';
import RandomFractionGeneratorClient from '@/components/tools/RandomFractionGeneratorClient';
import SecureRandomGeneratorClient from '@/components/tools/SecureRandomGeneratorClient';
import RandomPinGeneratorClient from '@/components/tools/RandomPinGeneratorClient';
import RandomIdGeneratorClient from '@/components/tools/RandomIdGeneratorClient';
import RandomIpAddressClient from '@/components/tools/RandomIpAddressClient';
import RandomNumberGeneratorClient from '@/components/tools/RandomNumberGeneratorClient';
import RandomParagraphGeneratorClient from '@/components/tools/RandomParagraphGeneratorClient';
import RandomSentenceGeneratorClient from '@/components/tools/RandomSentenceGeneratorClient';
import RandomStringGeneratorToolClient from '@/components/tools/RandomStringGeneratorToolClient';
import RandomUuidV7Client from '@/components/tools/RandomUuidV7Client';
import UlidGeneratorClient from '@/components/tools/UlidGeneratorClient';
import UuidV1GeneratorClient from '@/components/tools/UuidV1GeneratorClient';
import ReadingTimeCalculatorClient from '@/components/tools/ReadingTimeCalculatorClient';
import TimeDurationCalculatorClient from '@/components/tools/TimeDurationCalculatorClient';
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
import WordFrequencyAnalyzerClient from '@/components/tools/WordFrequencyAnalyzerClient';
import WordFrequencyCounterClient from '@/components/tools/WordFrequencyCounterClient';
import VsdxToDocxClient from '@/components/tools/VsdxToDocxClient';
import VsdxToPptxClient from '@/components/tools/VsdxToPptxClient';
import WordCombinationsGeneratorClient from '@/components/tools/WordCombinationsGeneratorClient';
import XmlSitemapGeneratorClient from '@/components/tools/XmlSitemapGeneratorClient';
import XmlValidatorClient from '@/components/tools/XmlValidatorClient';
import AiRephraserClient from '@/components/tools/AiRephraserClient';
import ApiAuthHeaderGeneratorClient from '@/components/tools/ApiAuthHeaderGeneratorClient';
import ApiDocGeneratorClient from '@/components/tools/ApiDocGeneratorClient';
import AacToWavClient from '@/components/tools/AacToWavClient';
import AddSubtitlesClient from '@/components/tools/AddSubtitlesClient';
import AlgorithmVisualizerClient from '@/components/tools/AlgorithmVisualizerClient';
import AnnotateClient from '@/components/tools/AnnotateClient';
import AsciiArtGeneratorClient from '@/components/tools/AsciiArtGeneratorClient';
import AllInOneUnitConverterClient from '@/components/tools/AllInOneUnitConverterClient';
import AngleUnitConverterClient from '@/components/tools/AngleUnitConverterClient';
import ApiEndpointDebuggerClient from '@/components/tools/ApiEndpointDebuggerClient';
import ApiEndpointDocumenterClient from '@/components/tools/ApiEndpointDocumenterClient';
import ApiSpecGeneratorClient from '@/components/tools/ApiSpecGeneratorClient';
import AccessibilityCheckerClient from '@/components/tools/AccessibilityCheckerClient';
import AreaConverterClient from '@/components/tools/AreaConverterClient';
import ArticleTitleGenClient from '@/components/tools/ArticleTitleGenClient';
import ArticleTitleGeneratorClient from '@/components/tools/ArticleTitleGeneratorClient';
import AudioToTextClient from '@/components/tools/AudioToTextClient';
import TextToHandwritingClient from '@/components/tools/TextToHandwritingClient';
import AutomationWizardClient from '@/components/tools/AutomationWizardClient';
import AviToGifClient from '@/components/tools/AviToGifClient';
import BackslashEscapeUnescapeClient from '@/components/tools/BackslashEscapeUnescapeClient';
import BaseConvertToolClient from '@/components/tools/BaseConvertToolClient';
import BcryptHashGeneratorClient from '@/components/tools/BcryptHashGeneratorClient';
import BillSaleGeneratorClient from '@/components/tools/BillSaleGeneratorClient';
import BillSplitterClient from '@/components/tools/BillSplitterClient';
import BaseConverterClient from '@/components/tools/BaseConverterClient';
import BaseConverterQuickClient from '@/components/tools/BaseConverterQuickClient';
import BaseNumberConverterClient from '@/components/tools/BaseNumberConverterClient';
import BaseToolblipClient from '@/components/tools/BaseToolblipClient';
import BinHexDecConverterClient from '@/components/tools/BinHexDecConverterClient';
import BinaryConverterClient from '@/components/tools/BinaryConverterClient';
import BinaryDecimalHexConverterClient from '@/components/tools/BinaryDecimalHexConverterClient';
import BinaryTextExpressClient from '@/components/tools/BinaryTextExpressClient';
import BinaryToTextV2Client from '@/components/tools/BinaryToTextV2Client';
import BmiCalculatorClient from '@/components/tools/BmiCalculatorClient';
import BatchFaviconDownloaderClient from '@/components/tools/BatchFaviconDownloaderClient';
import BatchImageResizerClient from '@/components/tools/BatchImageResizerClient';
import ColorBlindnessSimulatorClient from '@/components/tools/ColorBlindnessSimulatorClient';
import ColorContrastAuditorClient from '@/components/tools/ColorContrastAuditorClient';
import ColorContrastCheckerClient from '@/components/tools/ColorContrastCheckerClient';
import ColorContrastMatrixClient from '@/components/tools/ColorContrastMatrixClient';
import ColorContrastRatioCheckerClient from '@/components/tools/ColorContrastRatioCheckerClient';
import ColorFormatConverterClient from '@/components/tools/ColorFormatConverterClient';
import ColorFormatConverterV2Client from '@/components/tools/ColorFormatConverterV2Client';
import ColorFormatPickerClient from '@/components/tools/ColorFormatPickerClient';
import ColorHarmonyExpressClient from '@/components/tools/ColorHarmonyExpressClient';
import ColorHarmonyGeneratorClient from '@/components/tools/ColorHarmonyGeneratorClient';
import RandomColorGeneratorClient from '@/components/tools/RandomColorGeneratorClient';
import ColorHarmonyNewClient from '@/components/tools/ColorHarmonyNewClient';
import ColorLuminanceCalculatorClient from '@/components/tools/ColorLuminanceCalculatorClient';
import ColorLuminanceCheckerClient from '@/components/tools/ColorLuminanceCheckerClient';
import ColorMixerClient from '@/components/tools/ColorMixerClient';
import ColorMixerV2Client from '@/components/tools/ColorMixerV2Client';
import ColorNameFinderClient from '@/components/tools/ColorNameFinderClient';
import ColorNameFinderV2Client from '@/components/tools/ColorNameFinderV2Client';
import ColorNameToolClient from '@/components/tools/ColorNameToolClient';
import ColorOpacityGeneratorClient from '@/components/tools/ColorOpacityGeneratorClient';
import ColorPaletteExtractorClient from '@/components/tools/ColorPaletteExtractorClient';
import ColorPaletteFromImageClient from '@/components/tools/ColorPaletteFromImageClient';
import ColorPaletteGeneratorClient from '@/components/tools/ColorPaletteGeneratorClient';
import ColorPickAllClient from '@/components/tools/ColorPickAllClient';
import ColorPickToolClient from '@/components/tools/ColorPickToolClient';
import ColorPickToolblipClient from '@/components/tools/ColorPickToolblipClient';
import ColorPicker2025Client from '@/components/tools/ColorPicker2025Client';
import ColorPickerAdvClient from '@/components/tools/ColorPickerAdvClient';
import ColorPickerAdvancedClient from '@/components/tools/ColorPickerAdvancedClient';
import ColorPickerApiClient from '@/components/tools/ColorPickerApiClient';
import ColorPickerBrowserClient from '@/components/tools/ColorPickerBrowserClient';
import ColorPickerClassicClient from '@/components/tools/ColorPickerClassicClient';
import ColorPickerCompleteClient from '@/components/tools/ColorPickerCompleteClient';
import ColorPickerDgClient from '@/components/tools/ColorPickerDgClient';
import ColorPickerEasyClient from '@/components/tools/ColorPickerEasyClient';
import ColorPickerEnhancedClient from '@/components/tools/ColorPickerEnhancedClient';
import ColorPickerExpanderClient from '@/components/tools/ColorPickerExpanderClient';
import ColorPickerExpressClient from '@/components/tools/ColorPickerExpressClient';
import ColorPickerFinalClient from '@/components/tools/ColorPickerFinalClient';
import ColorPickerFreshClient from '@/components/tools/ColorPickerFreshClient';
import ColorPickerFullClient from '@/components/tools/ColorPickerFullClient';
import ColorPickerHandyClient from '@/components/tools/ColorPickerHandyClient';
import ColorPickerHexRgbHslClient from '@/components/tools/ColorPickerHexRgbHslClient';
import ColorPickerNewClient from '@/components/tools/ColorPickerNewClient';
import ColorPickerPrimeClient from '@/components/tools/ColorPickerPrimeClient';
import ColorPickerProClient from '@/components/tools/ColorPickerProClient';
import ColorPickerQuickClient from '@/components/tools/ColorPickerQuickClient';
import ColorPickerSmartClient from '@/components/tools/ColorPickerSmartClient';
import ColorPickerStdClient from '@/components/tools/ColorPickerStdClient';
import ColorPickerToolClient from '@/components/tools/ColorPickerToolClient';
import ColorPickerUltimateClient from '@/components/tools/ColorPickerUltimateClient';
import ColorPickerUltraClient from '@/components/tools/ColorPickerUltraClient';
import ColorPickerV3Client from '@/components/tools/ColorPickerV3Client';
import ColorPickerV4Client from '@/components/tools/ColorPickerV4Client';
import ColorPickerV5Client from '@/components/tools/ColorPickerV5Client';
import ColorPickerV6Client from '@/components/tools/ColorPickerV6Client';
import ColorPickerWebClient from '@/components/tools/ColorPickerWebClient';
import ColorPickerWheelClient from '@/components/tools/ColorPickerWheelClient';
import ColorPickerXClient from '@/components/tools/ColorPickerXClient';
import ColorPickerXLClient from '@/components/tools/ColorPickerXLClient';
import ColorQuickClient from '@/components/tools/ColorQuickClient';
import ColorSaturationAdjusterClient from '@/components/tools/ColorSaturationAdjusterClient';
import ColorSelectToolClient from '@/components/tools/ColorSelectToolClient';
import ColorShadeGenClient from '@/components/tools/ColorShadeGenClient';
import ColorShadeGeneratorClient from '@/components/tools/ColorShadeGeneratorClient';
import ColorShadeGeneratorV2Client from '@/components/tools/ColorShadeGeneratorV2Client';
import ColorShadeTintsClient from '@/components/tools/ColorShadeTintsClient';
import ColorShadeToolClient from '@/components/tools/ColorShadeToolClient';
import ColorTintGeneratorClient from '@/components/tools/ColorTintGeneratorClient';
import ColorToneGeneratorClient from '@/components/tools/ColorToneGeneratorClient';
import ColorToolblipClient from '@/components/tools/ColorToolblipClient';
import ContentSummarizerClient from '@/components/tools/ContentSummarizerClient';
import ContrastBrowserClient from '@/components/tools/ContrastBrowserClient';
import ContrastCheckAllClient from '@/components/tools/ContrastCheckAllClient';
import ContrastCheckToolClient from '@/components/tools/ContrastCheckToolClient';
import ContrastCheckToolblipClient from '@/components/tools/ContrastCheckToolblipClient';
import ContrastChecker2025Client from '@/components/tools/ContrastChecker2025Client';
import ContrastCheckerAdvClient from '@/components/tools/ContrastCheckerAdvClient';
import ContrastCheckerAdvancedClient from '@/components/tools/ContrastCheckerAdvancedClient';
import ContrastCheckerApiClient from '@/components/tools/ContrastCheckerApiClient';
import ContrastCheckerBrowserClient from '@/components/tools/ContrastCheckerBrowserClient';
import ContrastCheckerClassicClient from '@/components/tools/ContrastCheckerClassicClient';
import ContrastCheckerCompleteClient from '@/components/tools/ContrastCheckerCompleteClient';
import ContrastCheckerDgClient from '@/components/tools/ContrastCheckerDgClient';
import ContrastCheckerEasyClient from '@/components/tools/ContrastCheckerEasyClient';
import ContrastCheckerEnhancedClient from '@/components/tools/ContrastCheckerEnhancedClient';
import ContrastCheckerExpanderClient from '@/components/tools/ContrastCheckerExpanderClient';
import ContrastCheckerExpressClient from '@/components/tools/ContrastCheckerExpressClient';
import ContrastCheckerFinalClient from '@/components/tools/ContrastCheckerFinalClient';
import ContrastCheckerFreshClient from '@/components/tools/ContrastCheckerFreshClient';
import ContrastCheckerFullClient from '@/components/tools/ContrastCheckerFullClient';
import ContrastCheckerHandyClient from '@/components/tools/ContrastCheckerHandyClient';
import ContrastCheckerNewClient from '@/components/tools/ContrastCheckerNewClient';
import ContrastCheckerPrimeClient from '@/components/tools/ContrastCheckerPrimeClient';
import ContrastCheckerProClient from '@/components/tools/ContrastCheckerProClient';
import ContrastCheckerQuickClient from '@/components/tools/ContrastCheckerQuickClient';
import ContrastCheckerSmartClient from '@/components/tools/ContrastCheckerSmartClient';
import ContrastCheckerStdClient from '@/components/tools/ContrastCheckerStdClient';
import ContrastCheckerToolClient from '@/components/tools/ContrastCheckerToolClient';
import ContrastCheckerUltimateClient from '@/components/tools/ContrastCheckerUltimateClient';
import ContrastCheckerUltraClient from '@/components/tools/ContrastCheckerUltraClient';
import ContrastCheckerV2Client from '@/components/tools/ContrastCheckerV2Client';
import ContrastCheckerV3Client from '@/components/tools/ContrastCheckerV3Client';
import ContrastCheckerV4Client from '@/components/tools/ContrastCheckerV4Client';
import ContrastCheckerV5Client from '@/components/tools/ContrastCheckerV5Client';
import ContrastCheckerV6Client from '@/components/tools/ContrastCheckerV6Client';
import ContrastCheckerWcagClient from '@/components/tools/ContrastCheckerWcagClient';
import ContrastCheckerXClient from '@/components/tools/ContrastCheckerXClient';
import ContrastCheckerXlClient from '@/components/tools/ContrastCheckerXlClient';
import ContrastFreshClient from '@/components/tools/ContrastFreshClient';
import ContrastQuickClient from '@/components/tools/ContrastQuickClient';
import ContrastToolblipClient from '@/components/tools/ContrastToolblipClient';
import CookingUnitConverterClient from '@/components/tools/CookingUnitConverterClient';
import CronBuilderClient from '@/components/tools/CronBuilderClient';
import CronExpanderClient from '@/components/tools/CronExpanderClient';
import CronExpressionGeneratorClient from '@/components/tools/CronExpressionGeneratorClient';
import CronExpressionParserClient from '@/components/tools/CronExpressionParserClient';
import CronValidatorClient from '@/components/tools/CronValidatorClient';
import CropCircleClient from '@/components/tools/CropCircleClient';
import CssFlexboxGeneratorClient from '@/components/tools/CssFlexboxGeneratorClient';
import CssGridGeneratorClient from '@/components/tools/CssGridGeneratorClient';
import CssToStyledComponentsClient from '@/components/tools/CssToStyledComponentsClient';
import CssToTailwindClient from '@/components/tools/CssToTailwindClient';
import CsvGeneratorClient from '@/components/tools/CsvGeneratorClient';
import CsvJsonExpressClient from '@/components/tools/CsvJsonExpressClient';
import CsvToExcelClient from '@/components/tools/CsvToExcelClient';
import CsvToJsonV2Client from '@/components/tools/CsvToJsonV2Client';
import CsvToTsvV2Client from '@/components/tools/CsvToTsvV2Client';
import CsvToXmlClient from '@/components/tools/CsvToXmlClient';
import CurlCommandBuilderClient from '@/components/tools/CurlCommandBuilderClient';
import CurlGenExpressClient from '@/components/tools/CurlGenExpressClient';
import CurlToJavascriptClient from '@/components/tools/CurlToJavascriptClient';
import CutterClient from '@/components/tools/CutterClient';
import DataUriGeneratorClient from '@/components/tools/DataUriGeneratorClient';
import DbQueryFormatterClient from '@/components/tools/DbQueryFormatterClient';
import DetectClient from '@/components/tools/DetectClient';
import DiscountCalculatorClient from '@/components/tools/DiscountCalculatorClient';
import DnsLookupExpressClient from '@/components/tools/DnsLookupExpressClient';
import DnsLookupToolClient from '@/components/tools/DnsLookupToolClient';
import DnsLookupV2Client from '@/components/tools/DnsLookupV2Client';
import DockerComposeGeneratorClient from '@/components/tools/DockerComposeGeneratorClient';
import DomainAgeCheckerClient from '@/components/tools/DomainAgeCheckerClient';
import DominantColorExtractorClient from '@/components/tools/DominantColorExtractorClient';
import DpiPpiCalculatorClient from '@/components/tools/DpiPpiCalculatorClient';
import DummyTextDetectorClient from '@/components/tools/DummyTextDetectorClient';
import DuplicatePhraseDetectorClient from '@/components/tools/DuplicatePhraseDetectorClient';
import DuplicateUrlDetectorClient from '@/components/tools/DuplicateUrlDetectorClient';
import EditClient from '@/components/tools/EditClient';
import EncodingsRefClient from '@/components/tools/EncodingsRefClient';
import EncodingsReferenceClient from '@/components/tools/EncodingsReferenceClient';
import CollocationsCheckerClient from '@/components/tools/CollocationsCheckerClient';
import EnglishCollocationsCheckerClient from '@/components/tools/EnglishCollocationsCheckerClient';
import EnglishCollocationsUniqueClient from '@/components/tools/EnglishCollocationsUniqueClient';
import EnglishDictionaryClient from '@/components/tools/EnglishDictionaryClient';
import EnvParserClient from '@/components/tools/EnvParserClient';
import ExcelToCsvClient from '@/components/tools/ExcelToCsvClient';
import ExcelToPdfClient from '@/components/tools/ExcelToPdfClient';
import ExcelToXmlClient from '@/components/tools/ExcelToXmlClient';
import ExifRemoverClient from '@/components/tools/ExifRemoverClient';
import ExtractAudioClient from '@/components/tools/ExtractAudioClient';
import ExtractImgClient from '@/components/tools/ExtractImgClient';
import FontToPngClient from '@/components/tools/FontToPngClient';
import FractionCalculatorClient from '@/components/tools/FractionCalculatorClient';
import GifToApngClient from '@/components/tools/GifToApngClient';
import GifToJpgClient from '@/components/tools/GifToJpgClient';
import GifToPngClient from '@/components/tools/GifToPngClient';
import GoogleAlgorithmTrackerClient from '@/components/tools/GoogleAlgorithmTrackerClient';
import GoogleSerpPreviewClient from '@/components/tools/GoogleSerpPreviewClient';
import GoogleSerpSimulatorClient from '@/components/tools/GoogleSerpSimulatorClient';
import GradientGeneratorClient from '@/components/tools/GradientGeneratorClient';
import GrammarCheckToolClient from '@/components/tools/GrammarCheckToolClient';
import GrammarChecker2025Client from '@/components/tools/GrammarChecker2025Client';
import GrammarCheckerAdvClient from '@/components/tools/GrammarCheckerAdvClient';
import GrammarCheckerAdvancedClient from '@/components/tools/GrammarCheckerAdvancedClient';
import GrammarCheckerAiClient from '@/components/tools/GrammarCheckerAiClient';
import GrammarCheckerApiClient from '@/components/tools/GrammarCheckerApiClient';
import GrammarCheckerBrowserClient from '@/components/tools/GrammarCheckerBrowserClient';
import GrammarCheckerClassicClient from '@/components/tools/GrammarCheckerClassicClient';
import GrammarCheckerCompleteClient from '@/components/tools/GrammarCheckerCompleteClient';
import GrammarCheckerDgClient from '@/components/tools/GrammarCheckerDgClient';
import GrammarCheckerEasyClient from '@/components/tools/GrammarCheckerEasyClient';
import GrammarCheckerEnhancedClient from '@/components/tools/GrammarCheckerEnhancedClient';
import GrammarCheckerExpanderClient from '@/components/tools/GrammarCheckerExpanderClient';
import GrammarCheckerExpressClient from '@/components/tools/GrammarCheckerExpressClient';
import GrammarCheckerFinalClient from '@/components/tools/GrammarCheckerFinalClient';
import GrammarCheckerFreshClient from '@/components/tools/GrammarCheckerFreshClient';
import GrammarCheckerFullClient from '@/components/tools/GrammarCheckerFullClient';
import GrammarCheckerInstantClient from '@/components/tools/GrammarCheckerInstantClient';
import GrammarCheckerLiteClient from '@/components/tools/GrammarCheckerLiteClient';
import GrammarCheckerNewClient from '@/components/tools/GrammarCheckerNewClient';
import GrammarCheckerPrimeClient from '@/components/tools/GrammarCheckerPrimeClient';
import GrammarCheckerProClient from '@/components/tools/GrammarCheckerProClient';
import GrammarCheckerQuickClient from '@/components/tools/GrammarCheckerQuickClient';
import GrammarCheckerSmartClient from '@/components/tools/GrammarCheckerSmartClient';
import GrammarCheckerStdClient from '@/components/tools/GrammarCheckerStdClient';
import GrammarCheckerToolClient from '@/components/tools/GrammarCheckerToolClient';
import GrammarCheckerToolblipClient from '@/components/tools/GrammarCheckerToolblipClient';
import GrammarCheckerUltimateClient from '@/components/tools/GrammarCheckerUltimateClient';
import GrammarCheckerUltraClient from '@/components/tools/GrammarCheckerUltraClient';
import GrammarCheckerV2Client from '@/components/tools/GrammarCheckerV2Client';
import GrammarCheckerV3Client from '@/components/tools/GrammarCheckerV3Client';
import GrammarCheckerV4Client from '@/components/tools/GrammarCheckerV4Client';
import GrammarCheckerV5Client from '@/components/tools/GrammarCheckerV5Client';
import GrammarCheckerV6Client from '@/components/tools/GrammarCheckerV6Client';
import GrammarCheckerWebClient from '@/components/tools/GrammarCheckerWebClient';
import GrammarCheckerXClient from '@/components/tools/GrammarCheckerXClient';
import GrammarCheckerXlClient from '@/components/tools/GrammarCheckerXlClient';
import GrammarFixToolClient from '@/components/tools/GrammarFixToolClient';
import GrammarFixerClient from '@/components/tools/GrammarFixerClient';
import GrammarScoreCheckerClient from '@/components/tools/GrammarScoreCheckerClient';
import GraphqlPlaygroundClient from '@/components/tools/GraphqlPlaygroundClient';
import HashCollisionFinderClient from '@/components/tools/HashCollisionFinderClient';
import HashDiffCheckerClient from '@/components/tools/HashDiffCheckerClient';
import HeadingTagAnalyzerClient from '@/components/tools/HeadingTagAnalyzerClient';
import JpgToPngClient from '@/components/tools/JpgToPngClient';
import ImageToSvgConverterClient from '@/components/tools/ImageToSvgConverterClient';
import SeoMetaTagAnalyzerClient from '@/components/tools/SeoMetaTagAnalyzerClient';
import LoremIpsumGeneratorProClient from '@/components/tools/LoremIpsumGeneratorProClient';
import LdapFilterGeneratorClient from '@/components/tools/LdapFilterGeneratorClient';
import KeywordGeneratorExpressClient from '@/components/tools/KeywordGeneratorExpressClient';
import MetaGenToolblipClient from '@/components/tools/MetaGenToolblipClient';
import MetaTagGenAdvClient from '@/components/tools/MetaTagGenAdvClient';
import MetaTagGenPrimeClient from '@/components/tools/MetaTagGenPrimeClient';
import MetaTagGenProClient from '@/components/tools/MetaTagGenProClient';
import MetaTagGenToolClient from '@/components/tools/MetaTagGenToolClient';
import MetaTagGenUltraClient from '@/components/tools/MetaTagGenUltraClient';
import ShellCommandGenExpressClient from '@/components/tools/ShellCommandGenExpressClient';
import TempConverterExpressClient from '@/components/tools/TempConverterExpressClient';
import LoremIpsumGenToolClient from '@/components/tools/LoremIpsumGenToolClient';
import JsonCsvExpressClient from '@/components/tools/JsonCsvExpressClient';
import JsonEditorClient from '@/components/tools/JsonEditorClient';
import JsonPathEvaluatorExpressClient from '@/components/tools/JsonPathEvaluatorExpressClient';
import JsonSchemaGenExpressClient from '@/components/tools/JsonSchemaGenExpressClient';
import HeadlineAnalyzerClient from '@/components/tools/HeadlineAnalyzerClient';
import HeicToJpgClient from '@/components/tools/HeicToJpgClient';
import HeicToPngClient from '@/components/tools/HeicToPngClient';
import HexColorPickerClient from '@/components/tools/HexColorPickerClient';
import HexRgbHslColorPickerClient from '@/components/tools/HexRgbHslColorPickerClient';
import HexToCmykClient from '@/components/tools/HexToCmykClient';
import HexToDecimalConverterClient from '@/components/tools/HexToDecimalConverterClient';
import HexToHslClient from '@/components/tools/HexToHslClient';
import HexToHsvClient from '@/components/tools/HexToHsvClient';
import HexToNamedColorClient from '@/components/tools/HexToNamedColorClient';
import HexToRgbaClient from '@/components/tools/HexToRgbaClient';
import HmacGeneratorClient from '@/components/tools/HmacGeneratorClient';
import HomoglyphDetectorClient from '@/components/tools/HomoglyphDetectorClient';
import HreflangTagGeneratorClient from '@/components/tools/HreflangTagGeneratorClient';
import HslToHexClient from '@/components/tools/HslToHexClient';
import HsvToHexClient from '@/components/tools/HsvToHexClient';
import HtmlAttributeEncoderClient from '@/components/tools/HtmlAttributeEncoderClient';
import HtmlEncoderDecoderClient from '@/components/tools/HtmlEncoderDecoderClient';
import HtmlLivePreviewClient from '@/components/tools/HtmlLivePreviewClient';
import HtmlMarkdownExpressClient from '@/components/tools/HtmlMarkdownExpressClient';
import HtmlTableToJsonClient from '@/components/tools/HtmlTableToJsonClient';
import HtmlToJsxClient from '@/components/tools/HtmlToJsxClient';
import HtmlToMarkdownV2Client from '@/components/tools/HtmlToMarkdownV2Client';
import HttpHeaders2025Client from '@/components/tools/HttpHeaders2025Client';
import HttpHeadersAnalyzerClient from '@/components/tools/HttpHeadersAnalyzerClient';
import HttpHeadersBrowserClient from '@/components/tools/HttpHeadersBrowserClient';
import HttpHeadersCheckClient from '@/components/tools/HttpHeadersCheckClient';
import HttpHeadersCheckerClient from '@/components/tools/HttpHeadersCheckerClient';
import HttpHeadersDgClient from '@/components/tools/HttpHeadersDgClient';
import HttpHeadersEasyClient from '@/components/tools/HttpHeadersEasyClient';
import HttpHeadersExpanderClient from '@/components/tools/HttpHeadersExpanderClient';
import HttpHeadersFreshClient from '@/components/tools/HttpHeadersFreshClient';
import HttpHeadersFullClient from '@/components/tools/HttpHeadersFullClient';
import HttpHeadersInspectorClient from '@/components/tools/HttpHeadersInspectorClient';
import HttpHeadersQuickClient from '@/components/tools/HttpHeadersQuickClient';
import ColorTemperatureAdjusterClient from '@/components/tools/ColorTemperatureAdjusterClient';
import ChartMakerClient from '@/components/tools/ChartMakerClient';
import CodeBeautifierClient from '@/components/tools/CodeBeautifierClient';
import CodeDiffClient from '@/components/tools/CodeDiffClient';
import CodeDiffToolClient from '@/components/tools/CodeDiffToolClient';
import CodeToDiagramGeneratorClient from '@/components/tools/CodeToDiagramGeneratorClient';
import CollageMakerClient from '@/components/tools/CollageMakerClient';
import CombineImagesClient from '@/components/tools/CombineImagesClient';
import CropClient from '@/components/tools/CropClient';
import CssMinifierClient from '@/components/tools/CssMinifierClient';
import CurrencyConverterClient from '@/components/tools/CurrencyConverterClient';
import DockerCommandGeneratorClient from '@/components/tools/DockerCommandGeneratorClient';
import FakeAddressGeneratorClient from '@/components/tools/FakeAddressGeneratorClient';
import FillerWordCounterClient from '@/components/tools/FillerWordCounterClient';
import FleschKincaidCalculatorClient from '@/components/tools/FleschKincaidCalculatorClient';
import GifMakerClient from '@/components/tools/GifMakerClient';
import GrayscaleClient from '@/components/tools/GrayscaleClient';
import HomophoneCheckerClient from '@/components/tools/HomophoneCheckerClient';
import HtmlMinifierClient from '@/components/tools/HtmlMinifierClient';
import HttpStatusCheckerClient from '@/components/tools/HttpStatusCheckerClient';
import ImageBackgroundRemoverClient from '@/components/tools/ImageBackgroundRemoverClient';
import ImageBorderAdderClient from '@/components/tools/ImageBorderAdderClient';
import ImageCompressorClient from '@/components/tools/ImageCompressorClient';
import ImageFlipToolClient from '@/components/tools/ImageFlipToolClient';
import ImageOptimizerClient from '@/components/tools/ImageOptimizerClient';
import ImageRotateToolClient from '@/components/tools/ImageRotateToolClient';
import ImageShadowGeneratorClient from '@/components/tools/ImageShadowGeneratorClient';
import MergeClient from '@/components/tools/MergeClient';
import PdfPasswordRemoverClient from '@/components/tools/PdfPasswordRemoverClient';
import PdfPageDeleterClient from '@/components/tools/PdfPageDeleterClient';
import PdfPageAdderClient from '@/components/tools/PdfPageAdderClient';
import MemeMakerClient from '@/components/tools/MemeMakerClient';
import OgTagDebuggerClient from '@/components/tools/OgTagDebuggerClient';
import OpenGraphPreviewClient from '@/components/tools/OpenGraphPreviewClient';
import ParagraphCounterClient from '@/components/tools/ParagraphCounterClient';
import PassiveVoiceDetectorClient from '@/components/tools/PassiveVoiceDetectorClient';
import PixelateClient from '@/components/tools/PixelateClient';
import ReadabilityCheckerClient from '@/components/tools/ReadabilityCheckerClient';
import RobotsTxtEditorClient from '@/components/tools/RobotsTxtEditorClient';
import SentenceCounterClient from '@/components/tools/SentenceCounterClient';
import SharpenClient from '@/components/tools/SharpenClient';
import SitemapAnalyzerClient from '@/components/tools/SitemapAnalyzerClient';
import SqlFormatterClient from '@/components/tools/SqlFormatterClient';
import TemperatureUnitConverterClient from '@/components/tools/TemperatureUnitConverterClient';
import TextUniquenessCheckerClient from '@/components/tools/TextUniquenessCheckerClient';
import AddWatermarkToPDFClient from '@/components/tools/AddWatermarkToPDFClient';
import CreateZipFileClient from '@/components/tools/CreateZipFileClient';
import TsvToJsonClient from '@/components/tools/TsvToJsonClient';
import UrlRedirectCheckerClient from '@/components/tools/UrlRedirectCheckerClient';
import WebpConverterClient from '@/components/tools/WebpConverterClient';
import ImageScaleCalculatorClient from '@/components/tools/ImageScaleCalculatorClient';
import ImageSquareFitClient from '@/components/tools/ImageSquareFitClient';
import IPynbFormatterClient from '@/components/tools/IPynbFormatterClient';
import JwtTokenInspectorClient from '@/components/tools/JwtTokenInspectorClient';
import JwtTokenTesterClient from '@/components/tools/JwtTokenTesterClient';
import KeywordDifficultyToolClient from '@/components/tools/KeywordDifficultyToolClient';
import KeywordExtractorClient from '@/components/tools/KeywordExtractorClient';
import KeywordGeneratorClient from '@/components/tools/KeywordGeneratorClient';
import ListDifferenceFinderClient from '@/components/tools/ListDifferenceFinderClient';
import MetaTagsToolClient from '@/components/tools/MetaTagsToolClient';
import MetricImperialConverterClient from '@/components/tools/MetricImperialConverterClient';
import MIMETypesReferenceClient from '@/components/tools/MIMETypesReferenceClient';
import MP4ToMP3Client from '@/components/tools/MP4ToMP3Client';
import MkvToMp3Client from '@/components/tools/MkvToMp3Client';
import NDAGeneratorClient from '@/components/tools/NDAGeneratorClient';
import PageTitleCheckerClient from '@/components/tools/PageTitleCheckerClient';
import PhotoMetadataRemoverClient from '@/components/tools/PhotoMetadataRemoverClient';
import PhotoResizeToolClient from '@/components/tools/PhotoResizeToolClient';
import PhysicsConstantsReferenceClient from '@/components/tools/PhysicsConstantsReferenceClient';
import PollGeneratorClient from '@/components/tools/PollGeneratorClientV2';
import PressureConverterClient from '@/components/tools/PressureConverterClient';
import ProfilePhotoEditorClient from '@/components/tools/ProfilePhotoEditorClient';
import PurchaseAgreementGeneratorClient from '@/components/tools/PurchaseAgreementGeneratorClient';
import PunycodeEncoderClient from '@/components/tools/PunycodeEncoderClient';
import QuoteOfTheDayClient from '@/components/tools/QuoteOfTheDayClient';
import RandomChoicePickerClient from '@/components/tools/RandomChoicePickerClient';
import RandomChoiceWheelClient from '@/components/tools/RandomChoiceWheelClient';
import ReadingLevelEstimatorClient from '@/components/tools/ReadingLevelEstimatorClient';
import RearrangePDFPagesClient from '@/components/tools/RearrangePDFPagesClient';
import RegexDescriptionGeneratorClient from '@/components/tools/RegexDescriptionGeneratorClient';
import RegexEscapeClient from '@/components/tools/RegexEscapeClient';
import RegexExplainerClient from '@/components/tools/RegexExplainerClient';
import RegexPatternBuilderClient from '@/components/tools/RegexPatternBuilderClient';
import RegexPatternGeneratorClient from '@/components/tools/RegexPatternGeneratorClient';
import RemoveExtraSpacesClient from '@/components/tools/RemoveExtraSpacesClient';
import ScreenDensitySimulatorClient from '@/components/tools/ScreenDensitySimulatorClient';
import ScientificNotationConverterClient from '@/components/tools/ScientificNotationConverterClient';
import SentenceExtractorClient from '@/components/tools/SentenceExtractorClient';
import SentimentAnalyzerClient from '@/components/tools/SentimentAnalyzerClient';
import SEOMetaBuilderClient from '@/components/tools/SEOMetaBuilderClient';
import SEOTitleAnalyzerClient from '@/components/tools/SEOTitleAnalyzerClient';
import SERPQuickClient from '@/components/tools/SERPQuickClient';
import SERPSnippetViewerClient from '@/components/tools/SERPSnippetViewerClient';
import ShellCommandReferenceClient from '@/components/tools/ShellCommandReferenceClient';
import SignPDFClient from '@/components/tools/SignPDFClient';
import SitemapHTMLNewClient from '@/components/tools/SitemapHTMLNewClient';
import SlugHealthCheckerClient from '@/components/tools/SlugHealthCheckerClient';
import SlugPermalinkCheckerClient from '@/components/tools/SlugPermalinkCheckerClient';
import SlideshowGeneratorClient from '@/components/tools/SlideshowGeneratorClient';
import TextComplexityAnalyzerClient from '@/components/tools/TextComplexityAnalyzerClient';
import TextDeduplicatorClient from '@/components/tools/TextDeduplicatorClient';
import TextHighlighterClient from '@/components/tools/TextHighlighterClient';
import TextLineDeduplicatorClient from '@/components/tools/TextLineDeduplicatorClient';
import TextSentenceShufflerClient from '@/components/tools/TextSentenceShufflerClient';
import TextSortToolClient from '@/components/tools/TextSortToolClient';
import TextStructureValidatorClient from '@/components/tools/TextStructureValidatorClient';
import TimestampDiffCalculatorClient from '@/components/tools/TimestampDiffCalculatorClient';
import LogoTraceConverterClient from '@/components/tools/LogoTraceConverterClient';
import TwitterCardPreviewClient from '@/components/tools/TwitterCardPreviewClient';
import UAParserExpressClient from '@/components/tools/UAParserExpressClient';
import UnblurImageClient from '@/components/tools/UnblurImageClient';
import UnicodeEscapeEncoderClient from '@/components/tools/UnicodeEscapeEncoderClient';
import UnitConversionToolClient from '@/components/tools/UnitConversionToolClient';
import UUIDCompareClient from '@/components/tools/UUIDCompareClient';
import UUIDComparatorClient from '@/components/tools/UUIDComparatorClient';
import UUIDNormalizerClient from '@/components/tools/UUIDNormalizerClient';
import WebSocketTesterClient from '@/components/tools/WebSocketTesterClient';
import WhatIfScenarioCalculatorClient from '@/components/tools/WhatIfScenarioCalculatorClient';
import WordAlphabetizerClient from '@/components/tools/WordAlphabetizerClient';
import WordFinderClient from '@/components/tools/WordFinderClient';
import WordFreqExpressClient from '@/components/tools/WordFreqExpressClient';
import WordScrambleGeneratorClient from '@/components/tools/WordScrambleGeneratorClient';
import JupyterCleanerClient from '@/components/tools/JupyterCleanerClient';
import JsonTreeViewClient from '@/components/tools/JsonTreeViewClient';
import JSONToURLEncodedV2Client from '@/components/tools/JSONToURLEncodedV2Client';
import SearchConsoleInsightsClient from '@/components/tools/SearchConsoleInsightsClient';
import SplitCSVFileClient from '@/components/tools/SplitCSVFileClient';
import SplitExcelFileClient from '@/components/tools/SplitExcelFileClient';
import MockPortCheckClient from '@/components/tools/MockPortCheckClient';
import MetaToolClient from '@/components/tools/MetaToolClient';
import PortToolClient from '@/components/tools/PortToolClient';
import SerpToolClient from '@/components/tools/SerpToolClient';
import RegexToolClient from '@/components/tools/RegexToolClient';
import JwtToolClient from '@/components/tools/JwtToolClient';

import WordCloudGeneratorClient from '@/components/tools/WordCloudGeneratorClient';
import PressReleaseGeneratorClient from '@/components/tools/PressReleaseGeneratorClient';
import PrivacyPolicyGeneratorClient from '@/components/tools/PrivacyPolicyGeneratorClient';
import TokenBuilderClient from '@/components/tools/TokenBuilderClient';
import PixelDensityCalculatorClient from '@/components/tools/PixelDensityCalculatorClient';

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
    case 'url-encoder':
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
      return <ImageBorderAdderClient />;
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
    case 'add-pages':
      return <PdfPageAdderClient />;
    case 'add-subtitles':
      return <AddSubtitlesClient />;
    case 'algorithm-visualizer':
      return <AlgorithmVisualizerClient />;
    case 'annotate':
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
    case 'delete-pages':
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
    case 'edit':
      return <EditClient />;
    case 'encodings-ref':
      return <EncodingsRefClient />;
    case 'encodings-reference':
      return <EncodingsReferenceClient />;
    case 'general-unit-converter':
      return <AllInOneUnitConverterClient />;
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
    case 'extract-img':
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
    case 'image-border-adder':
      return <ImageBorderAdderClient />;
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
    case 'merge':
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
    case 'robots-txt-editor':
      return <RobotsTxtEditorClient />;
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
    case 'image-dimension-checker':
      return <DetectClient />;
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
      return <ImageFormatConverterClient />;
    case 'png-to-webp':
      return <ImageFormatConverterClient />;
    case 'jpg-to-png':
      return <JpgToPngClient />;
    case 'image-to-svg-converter':
      return <ImageToSvgConverterClient />;
    case 'jpg-to-webp':
      return <ImageFormatConverterClient />;
    case 'webp-to-png':
      return <ImageFormatConverterClient />;
    case 'webp-to-jpg':
      return <ImageFormatConverterClient />;
    case 'avif-converter':
      return <ImageFormatConverterClient />;
    case 'heic-converter':
      return <ImageFormatConverterClient />;
    case 'heif-converter':
      return <ImageFormatConverterClient />;
    case 'svg-to-png':
      return <ImageFormatConverterClient />;
    case 'svg-to-jpg':
      return <ImageFormatConverterClient />;
    case 'svg-to-webp':
      return <ImageFormatConverterClient />;
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
    case 'markdown-preview':
      return <MarkdownToHtmlClient />;
    case 'markdown-editor':
      return <MarkdownToHtmlClient />;
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
    case 'jwt-inspector':
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
    case 'spelling-checker':
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
    case 'serp-simulator':
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
    case 'robots-txt-validator':
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
    case 'image-size-resizer': return <ImageResizerClient />;
    case 'ip-address-info': return <RandomIpAddressClient />;
    case 'ip-address-info-express': return <RandomIpAddressClient />; // legacy alias, redirected via next.config.mjs
    case 'ip-address-info': return <RandomIpAddressClient />;
    case 'ip-address-info-v2': return <RandomIpAddressClient />;
    case 'json-csv-express': return <JsonCsvExpressClient />;
    case 'json-escape-unescape': return <BackslashEscapeUnescapeClient />;
    case 'json-patch-generator': return <JsonLdGeneratorClient />;
    // 'json-path-evaluator' renders JsonPathTesterClient, not
    // JsonPathEvaluatorExpressClient below — the "express" component just
    // pretty-prints JSON, it doesn't evaluate a JSONPath expression at all,
    // which is what the tool's own description promises.
    case 'json-path-evaluator': return <JsonPathTesterClient />;
    case 'json-path-evaluator-express': return <JsonPathEvaluatorExpressClient />; // legacy alias, redirected via next.config.mjs
    case 'json-path-tester-new': return <JsonPathTesterClient />;
    case 'json-schema-editor': return <JsonSchemaValidatorClient />;
    case 'json-schema-gen-express': return <JsonSchemaGenExpressClient />;
    case 'json-schema-generator': return <JsonLdGeneratorClient />;
    case 'json-schema-viewer': return <JsonSchemaValidatorClient />;
    case 'json-to-go-struct': return <CsvToJsonClient />;
    case 'json-to-php-array': return <CsvToJsonClient />;
    case 'json-to-typescript-interface': return <JsonToTypescriptClient />;
    case 'json-to-typescript-types': return <JsonToTypescriptClient />;
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
    case 'jwt-token-decoder': return <JwtDecoderClient />;
    case 'keyword-density-analyzer-new': return <KeywordDensityCheckerClient />; // legacy alias, redirected via next.config.mjs
    case 'keyword-density-analyzer': return <KeywordDensityCheckerClient />;
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
    case 'lorem-ipsum-words': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-x': return <LoremIpsumGeneratorClient />;
    case 'lorem-ipsum-xl': return <LoremIpsumGeneratorClient />;
    case 'm4a-to-wav': return <AacToWavClient />;
    case 'markdown-table-from-json': return <JsonToMarkdownTableClient />;
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
    case 'random-mac-generator': return <MacAddressGeneratorClient />;
    case 'random-password-generator': return <PasswordGeneratorClient />;
    case 'random-pin-generator': return <RandomPinGeneratorClient />; // real numeric PIN generator, not the fraction tool
    case 'read-time-calculator': return <ReadingTimeCalculatorClient />;
    case 'readability-check-tool': return <ContrastCheckToolClient />;
    case 'readability-checker-pro': return <ReadabilityCheckerClient />;
    case 'readability-checker-tool': return <ReadabilityCheckerClient />;
    case 'readability-score-2025': return <ReadabilityScoreClient />;
    case 'readability-score-adv': return <ReadabilityScoreClient />;
    case 'readability-score-advanced': return <ReadabilityScoreClient />;
    case 'readability-score-api': return <ReadabilityScoreClient />;
    case 'readability-score-browser': return <ReadabilityScoreClient />;
    case 'readability-score-calculator': return <ReadabilityScoreClient />;
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
    case 'reading-pace-calculator': return <ReadingTimeCalculatorClient />;
    case 'reading-time-estimator': return <ReadingTimeCalculatorClient />;
    case 'reading-time-express': return <ReadingTimeCalculatorClient />;
    case 'regex-live-tester': return <RegexTesterClient />;
    case 'regex-match-tester': return <RegexTesterClient />;
    case 'regex-match-visualizer': return <RegexVisualizerClient />;
    case 'regex-pattern-tester': return <RegexTesterClient />;
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
    case 'robots-txt-analyzer': return <RobotsTxtEditorClient />;
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
    case 'serp-snippet-preview': return <SerpPreviewClient />;
    case 'sha1-hash-generator': return <HashGeneratorClient />;
    case 'sha256-hash-generator': return <HashGeneratorClient />;
    case 'shell-command-gen-express': return <ShellCommandGenExpressClient />;
    case 'shell-command-generator': return <BashCommandGeneratorClient />;
    case 'shell-command-generator-new': return <BashCommandGeneratorClient />; // legacy alias, redirected via next.config.mjs
    case 'shell-command-generator': return <BashCommandGeneratorClient />;
    case 'sitemap-html-generator': return <HtmlTableGeneratorClient />;
    case 'sitemap-xml-validator': return <XmlValidatorClient />;
    case 'sitemap-xml-validator-express': return <XmlValidatorClient />;
    case 'sla-uptime-calculator': return <UptimeCalculatorClient />;
    case 'smart-text-sorter': return <TextSorterClient />;
    case 'speech-to-text': return <AudioToTextClient />;
    case 'spelling-checker-tool': return <GrammarCheckerClient />; // legacy alias, redirected via next.config.mjs
    case 'spelling-checker': return <GrammarCheckerClient />;
    case 'srt-to-json': return <CsvToJsonClient />;
    case 'srt-to-json-v2': return <CsvToJsonClient />;
    case 'summarizer': return <ContentSummarizerClient />;
    case 'syllable-counter-express': return <SyllableCounterClient />;
    case 'syllable-word-counter': return <SyllableCounterClient />;
    case 'table-to-markdown': return <JsonToMarkdownTableClient />;
    case 'temp-converter-express': return <TempConverterExpressClient />; // legacy alias, redirected via next.config.mjs
    case 'temp-converter': return <TempConverterExpressClient />;
    case 'text-case-converter': return <CaseConverterClient />;
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
    case 'text-statistics-calculator': return <TextStatisticsClient />;
    case 'text-to-handwriting': return <TextToHandwritingClient />; // real cursive-font renderer, not the speech-to-text mic tool
    case 'text-to-image': return <AudioToTextClient />;
    case 'tiff-to-text': return <AudioToTextClient />;
    case 'time-duration-calculator': return <TimeDurationCalculatorClient />; // real time arithmetic, not a reading-speed estimator
    case 'time-zone-tool': return <TimeZoneConverterClient />;
    case 'title-case-converter': return <CaseConverterClient />;
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
    case 'word-density-analyzer': return <WordFrequencyAnalyzerClient />;
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
    case 'sitemap-extractor': return <SitemapAnalyzerClient />;
    case 'ssh-key-gen': return <SSHKeyGeneratorClient />;
    case 'text-sorting-tool': return <TextSorterClient />;
    case 'unit-convert-toolblip': return <UnitConverterClient />;
    case 'unit-fresh': return <UnitConverterClient />;
    case 'unit-quick': return <UnitConverterClient />;
    case 'unit-toolblip': return <UnitConverterClient />;
    case 'vsd-to-docx': return <VsdxToDocxClient />;
    case 'image-scale-calculator': return <ImageScaleCalculatorClient />;
    case 'image-square-fit': return <ImageSquareFitClient />;
    case 'image-to-base64': return <Base64ImageConverterClient />;
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
    case 'rearrange': return <RearrangePDFPagesClient />;
    case 'regex-description-generator': return <RegexDescriptionGeneratorClient />;
    case 'regex-escape': return <RegexEscapeClient />;
    case 'regex-explainer': return <RegexExplainerClient />;
    case 'regex-pattern-builder': return <RegexPatternBuilderClient />;
    case 'regex-pattern-generator': return <RegexPatternGeneratorClient />;
    case 'regex-pattern-generator-v2': return <RegexPatternGeneratorClient />;
    case 'remove-extra-spaces': return <RemoveExtraSpacesClient />;
    case 'resize': return <ImageResizerClient />;
    case 'rot13-cipher-v2': return <Rot13CipherClient />;
    case 'rotate': return <ImageRotateToolClient />;
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
    case 'sign': return <SignPDFClient />;
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
    case 'unblur': return <UnblurImageClient />;
    case 'unicode-escape-encoder': return <UnicodeEscapeEncoderClient />;
    case 'unit-conversion-tool': return <UnitConversionToolClient />;
    case 'unlock': return <PdfPasswordRemoverClient />;
    case 'uuid-compare': return <UUIDCompareClient />;
    case 'uuid-comparator': return <UUIDComparatorClient />;
    case 'uuid-normalizer': return <UUIDNormalizerClient />;
    case 'visio-to-powerpoint': return <VsdxToPptxClient />;
    case 'visio-to-word': return <VsdxToDocxClient />;
    case 'vsd-to-pptx': return <VsdxToPptxClient />;
    case 'vsdx-to-docx': return <VsdxToDocxClient />;
    case 'vsdx-to-pptx': return <VsdxToPptxClient />;
    case 'watermark': return <AddWatermarkToPDFClient />;
    case 'websocket-tester': return <WebSocketTesterClient />;
    case 'what-if-scenario-calculator': return <WhatIfScenarioCalculatorClient />;
    case 'word-alphabetizer': return <WordAlphabetizerClient />;
    case 'word-combinations': return <WordCombinationsGeneratorClient />;
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
    case 'jwt-tester': return <JwtTokenTesterClient />;
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
    case 'favicon-grabber': return <BatchFaviconDownloaderClient />;
    case 'favicon-png-maker': return <FaviconGeneratorClient />;
    case 'favicon-icon-generator': return <FaviconGeneratorClient />;
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
