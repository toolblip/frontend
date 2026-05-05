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
import ChangeBgPhotoClient from '@/components/tools/ChangeBgPhotoClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CharacterFrequencyCounterClient from '@/components/tools/CharacterFrequencyCounterClient';
import CharacterVarietyCheckerClient from '@/components/tools/CharacterVarietyCheckerClient';
import OxfordCommaClient from '@/components/tools/OxfordCommaClient';
import NotebookToHtmlClient from '@/components/tools/NotebookToHtmlClient';
import HexToRgbClient from '@/components/tools/HexToRgbClient';
import RgbToHexClient from '@/components/tools/RgbToHexClient';
import RandomStringClient from '@/components/tools/RandomStringClient';
import Base64EncoderDecoderClient from '@/components/tools/Base64EncoderDecoderClient';
import Base64FileEncoderClient from '@/components/tools/Base64FileEncoderClient';
import Base64ImageDecoderClient from '@/components/tools/Base64ImageDecoderClient';
import Base64ImageEncoderClient from '@/components/tools/Base64ImageEncoderClient';
import Base64ImageViewerClient from '@/components/tools/Base64ImageViewerClient';
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
import BulkGeneratorClient from '@/components/tools/BulkGeneratorClient';
import BusinessNameGeneratorClient from '@/components/tools/BusinessNameGeneratorClient';
import BusinessPlanGeneratorClient from '@/components/tools/BusinessPlanGeneratorClient';
import BusinessSloganGeneratorClient from '@/components/tools/BusinessSloganGeneratorClient';
import ByteConverterClient from '@/components/tools/ByteConverterClient';
import CanonicalTagCheckerClient from '@/components/tools/CanonicalTagCheckerClient';
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
import AiDetectorClient from '@/components/tools/AiDetectorClient';
import AiRephraserClient from '@/components/tools/AiRephraserClient';
import AiTwitterGeneratorClient from '@/components/tools/AiTwitterGeneratorClient';
import ApiAuthHeaderGeneratorClient from '@/components/tools/ApiAuthHeaderGeneratorClient';
import ApiDocGeneratorClient from '@/components/tools/ApiDocGeneratorClient';
import AacToFlacClient from '@/components/tools/AacToFlacClient';
import AacToM4rClient from '@/components/tools/AacToM4rClient';
import AacToMp3Client from '@/components/tools/AacToMp3Client';
import AacToMp4Client from '@/components/tools/AacToMp4Client';
import AacToWavClient from '@/components/tools/AacToWavClient';
import AddImagesClient from '@/components/tools/AddImagesClient';
import AddPagesClient from '@/components/tools/AddPagesClient';
import AddSubtitlesClient from '@/components/tools/AddSubtitlesClient';
import AddTextClient from '@/components/tools/AddTextClient';
import AlgorithmVisualizerClient from '@/components/tools/AlgorithmVisualizerClient';
import AnnotateClient from '@/components/tools/AnnotateClient';
import AsciiArtGeneratorClient from '@/components/tools/AsciiArtGeneratorClient';
import AllInOneUnitConverterClient from '@/components/tools/AllInOneUnitConverterClient';
import AngleUnitConverterClient from '@/components/tools/AngleUnitConverterClient';
import ApiEndpointDebuggerClient from '@/components/tools/ApiEndpointDebuggerClient';
import ApiEndpointDocumenterClient from '@/components/tools/ApiEndpointDocumenterClient';
import ApiEndpointTesterClient from '@/components/tools/ApiEndpointTesterClient';
import ApiSpecGeneratorClient from '@/components/tools/ApiSpecGeneratorClient';
import AccessibilityCheckerClient from '@/components/tools/AccessibilityCheckerClient';
import AreaConverterClient from '@/components/tools/AreaConverterClient';
import Argon2HashGeneratorClient from '@/components/tools/Argon2HashGeneratorClient';
import ArticleGeneratorClient from '@/components/tools/ArticleGeneratorClient';
import ArticleRewriterClient from '@/components/tools/ArticleRewriterClient';
import ArticleTitleGenClient from '@/components/tools/ArticleTitleGenClient';
import ArticleTitleGeneratorClient from '@/components/tools/ArticleTitleGeneratorClient';
import ArticleWriterClient from '@/components/tools/ArticleWriterClient';
import AudioToTextClient from '@/components/tools/AudioToTextClient';
import AutomationWizardClient from '@/components/tools/AutomationWizardClient';
import AviToGifClient from '@/components/tools/AviToGifClient';
import AviToMkvClient from '@/components/tools/AviToMkvClient';
import AviToMovClient from '@/components/tools/AviToMovClient';
import AviToMp3Client from '@/components/tools/AviToMp3Client';
import AviToMp4Client from '@/components/tools/AviToMp4Client';
import Azw3ToEpubClient from '@/components/tools/Azw3ToEpubClient';
import Azw3ToMobiClient from '@/components/tools/Azw3ToMobiClient';
import BacklinkAnalyzerClient from '@/components/tools/BacklinkAnalyzerClient';
import BacklinkCheckerExpressClient from '@/components/tools/BacklinkCheckerExpressClient';
import BacklinkCheckerV2Client from '@/components/tools/BacklinkCheckerV2Client';
import BackslashEscapeUnescapeClient from '@/components/tools/BackslashEscapeUnescapeClient';
import BarcodeGeneratorClient from '@/components/tools/BarcodeGeneratorClient';
import BarcodeScannerClient from '@/components/tools/BarcodeScannerClient';
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
import BlurBackgroundClient from '@/components/tools/BlurBackgroundClient';
import BlogOutlineClient from '@/components/tools/BlogOutlineClient';
import BorderClient from '@/components/tools/BorderClient';
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
import ColorPickerV2Client from '@/components/tools/ColorPickerV2Client';
import ColorPickerV3Client from '@/components/tools/ColorPickerV3Client';
import ColorPickerV4Client from '@/components/tools/ColorPickerV4Client';
import ColorPickerV5Client from '@/components/tools/ColorPickerV5Client';
import ColorPickerV6Client from '@/components/tools/ColorPickerV6Client';
import ColorPickerWebClient from '@/components/tools/ColorPickerWebClient';
import ColorPickerWheelClient from '@/components/tools/ColorPickerWheelClient';
import ColorPickerXClient from '@/components/tools/ColorPickerXClient';
import ColorPickerXLClient from '@/components/tools/ColorPickerXLClient';
import ColorTemperatureAdjusterClient from '@/components/tools/ColorTemperatureAdjusterClient';
import ChartMakerClient from '@/components/tools/ChartMakerClient';
import CitationGeneratorClient from '@/components/tools/CitationGeneratorClient';
import CleanupPictureClient from '@/components/tools/CleanupPictureClient';
import CodeBeautifierClient from '@/components/tools/CodeBeautifierClient';
import CodeDiffClient from '@/components/tools/CodeDiffClient';
import CodeDiffToolClient from '@/components/tools/CodeDiffToolClient';
import CodeToDiagramGeneratorClient from '@/components/tools/CodeToDiagramGeneratorClient';
import ColdEmailWriterClient from '@/components/tools/ColdEmailWriterClient';
import CollocationsCheckerClient from '@/components/tools/CollocationsCheckerClient';
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
import MemeMakerClient from '@/components/tools/MemeMakerClient';
import OgTagDebuggerClient from '@/components/tools/OgTagDebuggerClient';
import OpenGraphPreviewClient from '@/components/tools/OpenGraphPreviewClient';
import ParagraphCounterClient from '@/components/tools/ParagraphCounterClient';
import ParaphrasingClient from '@/components/tools/ParaphrasingClient';
import PassiveVoiceDetectorClient from '@/components/tools/PassiveVoiceDetectorClient';
import PixelateClient from '@/components/tools/PixelateClient';
import PngCompressorClient from '@/components/tools/PngCompressorClient';
import QrCodeScannerClient from '@/components/tools/QrCodeScannerClient';
import ReadabilityCheckerClient from '@/components/tools/ReadabilityCheckerClient';
import RemoveBgClient from '@/components/tools/RemoveBgClient';
import RobotsTxtEditorClient from '@/components/tools/RobotsTxtEditorClient';
import SentenceCounterClient from '@/components/tools/SentenceCounterClient';
import SentenceRewriterClient from '@/components/tools/SentenceRewriterClient';
import SharpenClient from '@/components/tools/SharpenClient';
import SitemapAnalyzerClient from '@/components/tools/SitemapAnalyzerClient';
import SqlFormatterClient from '@/components/tools/SqlFormatterClient';
import TemperatureUnitConverterClient from '@/components/tools/TemperatureUnitConverterClient';
import TextUniquenessCheckerClient from '@/components/tools/TextUniquenessCheckerClient';
import TsvToJsonClient from '@/components/tools/TsvToJsonClient';
import UrlRedirectCheckerClient from '@/components/tools/UrlRedirectCheckerClient';
import WebpConverterClient from '@/components/tools/WebpConverterClient';

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
    case 'character-frequency-counter':
      return <CharacterFrequencyCounterClient />;
    case 'character-variety-checker':
      return <CharacterVarietyCheckerClient />;
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
    case 'change-bg-photo':
      return <ChangeBgPhotoClient />;
    case 'circle-crop':
      return <CircleCropClient />;
    case 'chart-maker':
      return <ChartMakerClient />;
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
    case 'blog-outline':
      return <BlogOutlineClient />;
    case 'blur-background':
      return <BlurBackgroundClient />;
    case 'border':
      return <BorderClient />;
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
    case 'bulk-generator':
      return <BulkGeneratorClient />;
    case 'business-name-generator':
      return <BusinessNameGeneratorClient />;
    case 'business-plan-generator':
      return <BusinessPlanGeneratorClient />;
    case 'business-slogan-generator':
      return <BusinessSloganGeneratorClient />;
    case 'byte-converter':
      return <ByteConverterClient />;
    case 'canonical-tag-checker':
      return <CanonicalTagCheckerClient />;
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
    case 'cold-email-writer':
      return <ColdEmailWriterClient />;
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
    case 'cleanup-picture':
      return <CleanupPictureClient />;
    case 'cors-header-generator':
      return <CorsHeaderGeneratorClient />;
    case 'citation-generator':
      return <CitationGeneratorClient />;
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
    case 'ai-detector':
      return <AiDetectorClient />;
    case 'ai-rephraser':
      return <AiRephraserClient />;
    case 'ai-twitter-generator':
      return <AiTwitterGeneratorClient />;
    case 'api-auth-header-generator':
      return <ApiAuthHeaderGeneratorClient />;
    case 'api-doc-generator':
      return <ApiDocGeneratorClient />;
    case 'accessibility-checker':
      return <AccessibilityCheckerClient />;
    case 'aac-to-flac':
      return <AacToFlacClient />;
    case 'aac-to-m4r':
      return <AacToM4rClient />;
    case 'aac-to-mp3':
      return <AacToMp3Client />;
    case 'aac-to-mp4':
      return <AacToMp4Client />;
    case 'aac-to-wav':
      return <AacToWavClient />;
    case 'add-images':
      return <AddImagesClient />;
    case 'add-pages':
      return <AddPagesClient />;
    case 'add-subtitles':
      return <AddSubtitlesClient />;
    case 'add-text':
      return <AddTextClient />;
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
    case 'api-endpoint-tester':
      return <ApiEndpointTesterClient />;
    case 'api-spec-generator':
      return <ApiSpecGeneratorClient />;
    case 'area-converter':
      return <AreaConverterClient />;
    case 'argon2-hash-generator':
      return <Argon2HashGeneratorClient />;
    case 'article-generator':
      return <ArticleGeneratorClient />;
    case 'article-rewriter':
      return <ArticleRewriterClient />;
    case 'article-title-gen':
      return <ArticleTitleGenClient />;
    case 'article-title-generator':
      return <ArticleTitleGeneratorClient />;
    case 'article-writer':
      return <ArticleWriterClient />;
    case 'audio-to-text':
      return <AudioToTextClient />;
    case 'automation-wizard':
      return <AutomationWizardClient />;
    case 'avi-to-gif':
      return <AviToGifClient />;
    case 'avi-to-mkv':
      return <AviToMkvClient />;
    case 'avi-to-mov':
      return <AviToMovClient />;
    case 'avi-to-mp3':
      return <AviToMp3Client />;
    case 'avi-to-mp4':
      return <AviToMp4Client />;
    case 'azw3-to-epub':
      return <Azw3ToEpubClient />;
    case 'azw3-to-mobi':
      return <Azw3ToMobiClient />;
    case 'backlink-analyzer':
      return <BacklinkAnalyzerClient />;
    case 'backlink-checker-express':
      return <BacklinkCheckerExpressClient />;
    case 'backlink-checker-v2':
      return <BacklinkCheckerV2Client />;
    case 'backslash-escape-unescape':
      return <BackslashEscapeUnescapeClient />;
    case 'barcode-generator':
      return <BarcodeGeneratorClient />;
    case 'barcode-scanner':
      return <BarcodeScannerClient />;
    case 'base-convert-tool':
      return <BaseConvertToolClient />;
    case 'base-converter':
      return <BaseConverterClient />;
    case 'base-converter-quick':
      return <BaseConverterQuickClient />;
    case 'color-contrast-checker':
      return <ColorContrastCheckerClient />;
    case 'color-format-converter':
      return <ColorFormatConverterClient />;
    case 'color-format-converter-v2':
      return <ColorFormatConverterV2Client />;
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
    case 'color-picker-v2':
      return <ColorPickerV2Client />;
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
    case 'image-flip-tool':
      return <ImageFlipToolClient />;
    case 'image-optimizer':
      return <ImageOptimizerClient />;
    case 'image-rotate-tool':
      return <ImageRotateToolClient />;
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
    case 'paraphrasing':
      return <ParaphrasingClient />;
    case 'passive-voice-detector':
      return <PassiveVoiceDetectorClient />;
    case 'pixelate':
      return <PixelateClient />;
    case 'png-compressor':
      return <PngCompressorClient />;
    case 'qr-code-scanner':
      return <QrCodeScannerClient />;
    case 'readability-checker':
      return <ReadabilityCheckerClient />;
    case 'remove-bg':
      return <RemoveBgClient />;
    case 'robots-txt-editor':
      return <RobotsTxtEditorClient />;
    case 'sentence-counter':
      return <SentenceCounterClient />;
    case 'sentence-rewriter':
      return <SentenceRewriterClient />;
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
