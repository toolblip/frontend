#!/usr/bin/env python3
"""
Batch component generator for Toolblip.
Reads tool definitions and generates React client components.

Usage:
  python scripts/build_tools_batch.py [category] [batch_num]
  python scripts/build_tools_batch.py all

Categories: ai_text, text_tools, dev_tools, pdf_image_tools, media_conversion, converters, seo, generators
"""
import os
import re
import sys
import json
from pathlib import Path

TOOLS_DIR = Path("/Users/ray/Work/toolblip/components/tools")
TOOLUI_PATH = Path("/Users/ray/Work/toolblip/app/tools/[slug]/ToolUI.tsx")

TOOLS_BY_CATEGORY = {
    "ai_text": [
        ("AIParagraphWriterClient", "paragraph-writer", "Generate complete paragraphs with AI. Fill in content gaps in articles.", "Generate complete paragraphs with AI. Fill in content gaps in articles with smart suggestions."),
        ("AISocialPostWriterClient", "post-writer", "Write engaging social media posts. Optimized for each platform.", "Write engaging social media posts optimized for Twitter, LinkedIn, Instagram, and Facebook."),
        ("ContentShortenerClient", "shorten-content", "Shorten text while keeping key points. Condense articles and text.", "Shorten text while keeping key points. Condense articles, tweets, and paragraphs."),
        ("InstagramCaptionGeneratorClient", "instagram-caption-generator", "Generate engaging Instagram captions. Perfect for feed posts.", "Generate engaging Instagram captions with hashtags, emojis, and CTAs."),
        ("InstagramStoryIdeasGeneratorClient", "instagram-story-ideas", "Generate creative Instagram Story ideas. Engage your followers.", "Generate creative Instagram Story ideas with polls, quizzes, and interactive content."),
        ("LandingPageCopyGeneratorClient", "landing-page-copy", "Generate high-converting landing page copy. Headlines, CTAs, benefits.", "Generate high-converting landing page copy including headlines, subheadlines, CTAs, and benefits."),
        ("LinkedInPostGeneratorClient", "linkedin-post-generator", "Generate professional LinkedIn posts. Perfect for thought leaders.", "Generate professional LinkedIn posts optimized for thought leadership and engagement."),
        ("ListicleWriterClient", "listicle-writer", "Generate list-style articles and posts. Popular format, easy to read.", "Generate list-style articles and posts. Popular format, easy to read and share."),
        ("ParagraphCompleterClient", "paragraph-completer", "Complete your paragraphs with AI. Finish writing faster.", "Complete your paragraphs with AI. Finish writing faster with smart suggestions."),
        ("ParaphraseParagraphClient", "paragraph-rewriter", "Rewrite individual paragraphs with AI. Fresh wording, same message.", "Rewrite individual paragraphs with AI. Fresh wording, same meaning, better flow."),
        ("PodcastScriptWriterClient", "podcast-writer", "Generate podcast scripts and outlines. From intro to outro.", "Generate podcast scripts and outlines from intro to outro with scripted segments."),
        ("PostGeneratorClient", "post-generator", "Generate social media posts for any platform. Consistent content.", "Generate social media posts for any platform with consistent branding and voice."),
        ("PostIdeasGeneratorClient", "post-ideas", "Brainstorm social media post ideas. Never run out of content ideas.", "Brainstorm social media post ideas. Never run out of content with trending suggestions."),
        ("PostRewriterClient", "post-rewriter", "Rewrite existing social media posts. Fresh angle, same message.", "Rewrite existing social media posts with a fresh angle while keeping the core message."),
        ("RealEstateDescriptionWriterClient", "real-estate-description", "Write property listing descriptions. Attract buyers with compelling copy.", "Write property listing descriptions that attract buyers with compelling and descriptive copy."),
        ("StoryGeneratorClient", "story-generator", "Generate creative short stories with AI. Adventure, romance, sci-fi.", "Generate creative short stories with AI in multiple genres: adventure, romance, sci-fi."),
        ("SummarizePodcastEpisodesClient", "summarize-podcast", "Get key insights from podcast episodes. Transcribe and summarize.", "Get key insights from podcast episodes. Transcribe audio and summarize main points."),
        ("SummarizeYouTubeVideosClient", "summarize-youtube", "Get a summary of any YouTube video. Key points without watching.", "Get a summary of any YouTube video. Extract key points without watching the full video."),
        ("TikTokScriptWriterClient", "tiktok-script-writer", "Generate TikTok video scripts. Viral hooks, body, and CTAs included.", "Generate TikTok video scripts with viral hooks, engaging body, and strong CTAs."),
        ("TitleRewriterClient", "title-rewriter", "Rewrite headlines and titles with AI. More clickable, same content.", "Rewrite headlines and titles with AI. More clickable and engaging while keeping the topic."),
        ("ToneOfVoiceRewriterClient", "tone-of-voice", "Change the tone of your writing. Professional, casual, friendly.", "Change the tone of your writing to professional, casual, friendly, or formal instantly."),
        ("TranscribePodcastClient", "transcribe-podcast", "Convert podcast audio to text transcripts. Searchable, shareable.", "Convert podcast audio to text transcripts. Make episodes searchable and shareable."),
        ("TriviaQuizGeneratorClient", "trivia-generator", "Generate trivia questions and answers. Fun for education and games.", "Generate trivia questions and answers for education, team building, or entertainment."),
        ("YouTubeScriptWriterClient", "youtube-script-writer", "Generate YouTube video scripts. Hook, content, and CTA structure.", "Generate YouTube video scripts with compelling hooks, structured content, and CTAs."),
        ("YouTubeTranscriptGeneratorClient", "youtube-transcript", "Get transcripts of YouTube videos. Searchable text from video.", "Get transcripts of YouTube videos. Searchable and shareable text from any video."),
    ],
    "text_tools": [
        ("IPAPhoneticFinderClient", "ipa-phonetic-finder", "Convert words to IPA phonetic transcription.", "Convert words to IPA phonetic transcription with pronunciation guide."),
        ("ListDifferenceFinderClient", "list-difference-finder", "Find items unique to each list - show items only in A or B.", "Find items that are unique to each list. Show items only in list A, only in list B, or in both."),
        ("PlagiarismCheckerClient", "plagiarism-checker", "Check text for plagiarism by scanning matching phrases.", "Check text for plagiarism by scanning for matching phrases and sources online."),
        ("QuoteOfTheDayClient", "quote-of-the-day", "Get an inspiring or random quote of the day.", "Get an inspiring or random quote of the day with author and category."),
        ("ReadabilityImproverClient", "readability-improver", "Simplify complex sentences and improve readability scores.", "Simplify complex sentences and improve readability scores with one click."),
        ("ReadingLevelEstimatorClient", "reading-level-estimator", "Estimate reading grade level required to understand text.", "Estimate the reading grade level required to understand any text passage."),
        ("RemoveExtraSpacesClient", "remove-extra-spaces", "Remove multiple spaces, tabs, and line breaks from text.", "Remove multiple spaces, tabs, and line breaks from text. Clean up messy text."),
        ("SentenceExtractorClient", "sentence-extractor", "Extract all sentences from any text block.", "Extract all sentences from any text block with automatic numbering and labeling."),
        ("SentimentAnalyzerClient", "sentiment-analyzer", "Analyze text sentiment and detect tone.", "Analyze text sentiment and detect positive, negative, or neutral tone with confidence score."),
        ("SynonymFinderClient", "synonym-finder", "Find synonyms and antonyms for any word.", "Find synonyms and antonyms for any word with one click."),
        ("TextComplexityAnalyzerClient", "text-complexity-analyzer", "Analyze text complexity with syllable count and stats.", "Analyze text complexity with syllable count, sentence length, and vocabulary stats."),
        ("TextDeduplicatorClient", "text-deduplicator", "Remove duplicate words, phrases, and sentences from text.", "Remove duplicate words, phrases, and sentences from text while preserving meaning."),
        ("TextHighlighterClient", "text-highlighter", "Highlight keywords and phrases in text with custom colors.", "Highlight keywords and phrases in text with customizable colors and formatting."),
        ("TextImproverClient", "text-improver", "Rewrite and improve text clarity, flow, and style.", "Rewrite and improve text clarity, flow, and style with AI-powered suggestions."),
        ("TextLineDeduplicatorClient", "text-line-deduplicator", "Remove duplicate lines from text.", "Remove duplicate lines from text while preserving original order and formatting."),
        ("TextSentenceShufflerClient", "text-sentence-shuffler", "Shuffle sentences within paragraphs or across text.", "Shuffle sentences within paragraphs or across an entire text randomly."),
        ("TextSorterClient", "text-sort-tool", "Sort lines alphabetically, by length, numerically, or reverse.", "Sort lines alphabetically, by length, numerically, in reverse, or randomly."),
        ("TextStructureValidatorClient", "text-structure-validator", "Check heading hierarchy, paragraph length, and list usage.", "Check heading hierarchy, paragraph length, and list usage for structured content."),
        ("WordAlphabetizerClient", "word-alphabetizer", "Extract and alphabetically sort unique words from text.", "Extract and alphabetically sort unique words from any text block."),
        ("WordCloudGeneratorClient", "word-cloud-generator", "Generate a visual word cloud from text.", "Generate a visual word cloud from any text with customizable colors and layout."),
        ("WordCombinationsGeneratorClient", "word-combinations-generator", "Generate all two and three-word combinations from a list.", "Generate all two-word and three-word combinations from a list of words."),
        ("WordCountFromURLClient", "word-count-from-url", "Fetch and count words, characters, and paragraphs from URL.", "Fetch and count words, characters, and paragraphs from any webpage URL."),
        ("WordFinderClient", "word-finder", "Find valid English words from a string of letters.", "Find valid English words from a string of letters with pattern matching and anagrams."),
        ("WordFrequencyAnalyzerClient", "word-freq-express", "Analyze word and phrase frequency in text for SEO.", "Analyze word and phrase frequency in any text for SEO and content analysis."),
        ("WordScrambleGeneratorClient", "word-scramble-generator", "Scramble letters in any word to create anagrams and puzzles.", "Scramble letters in any word to create fun anagrams and puzzle games."),
    ],
    "dev_tools": [
        ("JsonEditorClient", "json-editor", "Edit JSON with syntax highlighting, tree view, validation.", "Edit JSON with syntax highlighting, tree view, validation, and formatting."),
        ("JsonTreeViewClient", "json-tree-view", "Explore JSON data as an interactive tree.", "Explore JSON data as an interactive tree with expand/collapse and search."),
        ("JSONWebTokenTesterClient", "jwt-tester", "Test and validate JWT tokens - decode header, payload.", "Test and validate JWT tokens. Decode header, payload, and verify signatures."),
        ("JSONPathQueryToolClient", "jsonpath-query-tool", "Query JSON data using JSONPath expressions.", "Query JSON data using JSONPath expressions and see matched results instantly."),
        ("JSONPathQueryTesterClient", "jsonpath-query-tester", "Test JSONPath expressions against JSON data.", "Test JSONPath expressions against JSON data and extract matched results with syntax."),
        ("JwtDecoderClient", "jwt-toolblip", "Decode JWT tokens and inspect header, payload.", "Decode JWT tokens and inspect header, payload, expiration, and signature validity."),
        ("JwtTokenInspectorClient", "jwt-token-inspector", "Decode JWT tokens and view header, payload, validity.", "Decode JWT tokens and view header, payload, expiration, and validity status."),
        ("JwtTokenTesterClient", "jwt-token-tester", "Test and validate JWT tokens with signature verification.", "Test and validate JWT tokens with signature verification and claim inspection."),
        ("JupyterCleanerClient", "jupyter-cleaner", "Remove outputs, execution counts, metadata from notebooks.", "Remove all outputs, execution counts, and metadata from Jupyter notebooks."),
        ("MIMETypesReferenceClient", "mime-types-reference", "Search and reference common MIME types.", "Search and reference common MIME types for file formats and HTTP headers."),
        ("MockPortScannerClient", "mock-port-check", "Simulate scanning common ports on a host.", "Simulate scanning common ports on a host to check available services and firewalls."),
        ("NetworkPortCheckerClient", "network-port-checker", "Check if network ports are open on a remote host.", "Check if specific network ports are open on a remote host from your browser."),
        ("PortScannerClient", "port-toolblip", "Scan common ports on a host to identify open services.", "Scan common ports on a host to identify open services and running daemons."),
        ("PunycodeEncoderClient", "punycode-encoder", "Encode and decode Punycode for internationalized domains.", "Encode and decode Punycode for internationalized domain names (IDN)."),
        ("RegexDescriptionGeneratorClient", "regex-description-generator", "Get plain English explanation of regex patterns.", "Paste a regex pattern and get a plain English explanation of what it matches."),
        ("RegexEscapeClient", "regex-escape", "Escape special regex characters in text.", "Escape special regex characters in text so they are treated as literal characters."),
        ("RegexExplanationToolClient", "regex-explainer", "Get plain English explanation of regex patterns.", "Paste a regex and get a plain English explanation of what each part of the pattern does."),
        ("RegexPatternBuilderClient", "regex-pattern-builder", "Build regex patterns visually from common use cases.", "Build regex patterns visually from common use cases like emails, URLs, and phones."),
        ("RegexPatternGeneratorClient", "regex-pattern-generator", "Generate regex patterns from natural language.", "Generate regex patterns from natural language descriptions for common validation patterns."),
        ("RegexPatternGeneratorV2Client", "regex-pattern-generator-v2", "Generate regex patterns for emails, URLs, phones.", "Generate regex patterns from natural language for emails, URLs, phones, and more."),
        ("RegexTesterClient", "regex-toolblip", "Test regex patterns with live match highlighting.", "Test regex patterns with real-time match highlighting and capture group display."),
        ("ResponseHeaderAnalyzerClient", "response-header-analyzer", "Analyze HTTP response headers for security and performance.", "Analyze HTTP response headers for security headers, caching, CORS, and performance."),
        ("SSHKeyGeneratorClient", "ssh-key-generator", "Generate RSA, ECDSA, and Ed25519 SSH key pairs.", "Generate RSA, ECDSA, and Ed25519 SSH key pairs for server authentication."),
        ("SVGMinifierClient", "svg-minifier", "Minify SVG files by removing unnecessary attributes.", "Minify SVG files by removing unnecessary attributes, comments, and whitespace."),
        ("ScreenDensitySimulatorClient", "screen-density-simulator", "Simulate websites on screens with different DPI.", "Simulate how websites look on screens with different DPI and pixel densities."),
        ("ShellCommandReferenceClient", "shell-command-reference", "Quick reference for common shell commands.", "Quick reference for common shell commands with syntax examples for bash and zsh."),
        ("TokenBuilderClient", "token-builder", "Build custom JWT or bearer tokens.", "Build custom JWT or bearer tokens with custom header, payload, and secret signing."),
        ("UUIDComparatorClient", "uuid-comparator", "Compare two UUIDs for equality and sort.", "Compare two UUIDs to check equality and sort them chronologically by timestamp."),
        ("UUIDCompareClient", "uuid-compare", "Compare two UUIDs for version, variant, timestamp.", "Compare two UUIDs to check version, variant, timestamp, and equality."),
        ("UUIDNormalizerClient", "uuid-normalizer", "Normalize UUID formats between v1, v4, v7.", "Normalize UUID formats between v1, v4, and v7 with uppercase/lowercase options."),
        ("UnicodeEscapeEncoderClient", "unicode-escape-encoder", "Encode Unicode characters to escape sequences.", "Encode Unicode characters to escape sequences and decode escaped sequences back to text."),
        ("UserAgentParserClient", "ua-parser-express", "Parse browser, OS, and device from User-Agent strings.", "Parse browser, OS, and device info from any User-Agent string."),
        ("WebSocketTesterClient", "websocket-tester", "Connect to WebSocket server, send messages, inspect responses.", "Connect to a WebSocket server, send custom messages, and inspect responses in real-time."),
        ("WebhookTesterClient", "webhook-tester", "Test webhook endpoints with custom payloads.", "Test webhook endpoints by sending custom payloads and inspecting HTTP responses."),
        ("YAMLPrettyPrintClient", "yaml-pretty-print", "Format and indent YAML with syntax highlighting.", "Format and indent YAML with syntax highlighting and configurable indentation."),
        ("IPynbFormatterClient", "ipynb-formatter", "Format and pretty-print Jupyter notebook JSON.", "Format and pretty-print Jupyter notebook (.ipynb) JSON with proper indentation."),
    ],
    "pdf_image_tools": [
        ("ImageSquareFitClient", "image-square-fit", "Fit any image into a square canvas.", "Fit any image into a square canvas with customizable background color and padding."),
        ("ImageToBase64Client", "image-to-base64", "Convert any image to Base64 encoding.", "Convert any image to Base64 encoding for embedding in HTML, CSS, or XML."),
        ("ImageScaleCalculatorClient", "image-scale-calculator", "Calculate new image dimensions from scale.", "Calculate new image dimensions from a percentage scale or target size while maintaining aspect ratio."),
        ("MakeImageBackgroundTransparentClient", "make-background-transparent", "Remove background from any image.", "Remove background from any image. Get a clean cutout of the subject with transparency."),
        ("PhotoMetadataRemoverClient", "photo-metadata-remover", "Strip EXIF and metadata from photos.", "Strip EXIF and metadata from photos to protect privacy before sharing online."),
        ("PhotoResizeToolClient", "photo-resize-tool", "Resize photos to standard dimensions.", "Resize photos to standard dimensions for social media, web, or print platforms."),
        ("PixelDensityCalculatorClient", "pixel-density-calculator", "Calculate PPI and DPI for images.", "Calculate PPI and DPI for images at different dimensions and intended view distances."),
        ("ProfilePhotoEditorClient", "profile-photo", "Edit and enhance profile pictures.", "Edit and enhance profile pictures with crop, filter, brightness, and retouch tools."),
        ("RemoveObjectsFromPhotoClient", "remove-objects", "Remove unwanted objects from photos.", "Remove unwanted objects from photos using AI-powered clone and heal tools."),
        ("RemovePersonFromPhotoClient", "remove-person", "Remove people from images seamlessly.", "Remove people from images seamlessly with automatic background fill."),
        ("RemoveTextFromImageClient", "remove-text-photo", "Erase text from photos.", "Erase text from photos. Clean up screenshots and documents with automatic fill."),
        ("RemoveWatermarkFromPhotoClient", "remove-watermark-photo", "Remove watermark marks from photographs.", "Remove watermark marks from photographs. Restore clean images with AI fill."),
        ("RepairPhotoDefectsClient", "repair-defects", "Fix scratches, stains, and damage in old photos.", "Fix scratches, stains, and damage in old photos. Restore cherished memories."),
        ("ResizeImageClient", "resize", "Resize images to any dimension.", "Resize images to any dimension. Maintain aspect ratio or set custom width and height."),
        ("RotateImageClient", "rotate", "Rotate images by 90, 180, or custom angle.", "Rotate images by 90, 180 degrees, or any custom angle to fix orientation."),
        ("ScreenshotMakerClient", "screenshot-maker", "Capture full-page screenshots of any URL.", "Capture full-page screenshots of any URL with customizable viewport and device presets."),
        ("SVGCompressorClient", "svg-compressor", "Compress SVG files by removing metadata.", "Compress SVG files by removing unnecessary metadata and reducing file size."),
        ("SVGOptimizerClient", "svg-optimizer", "Optimize SVG files by removing metadata.", "Optimize SVG files by removing metadata, reducing path data, and cleaning up code."),
        ("UnblurImageClient", "unblur", "Fix blurry photos. Sharpen and enhance images.", "Fix blurry photos with AI sharpening and enhancement for low-resolution images."),
        ("UpscaleImageClient", "upscale", "Increase image resolution without quality loss.", "Increase image resolution without quality loss using AI-powered upscaling."),
        ("AddWatermarkToPDFClient", "watermark", "Add text or image watermarks to PDF files.", "Add text or image watermarks to PDF files to protect your documents."),
        ("ProtectPDFClient", "protect", "Password-protect PDF files with AES-256.", "Password-protect PDF files with AES-256 encryption for document security."),
        ("RearrangePDFPagesClient", "rearrange", "Reorder, rotate, and reorganize PDF pages.", "Reorder, rotate, and reorganize PDF pages with drag and drop interface."),
        ("SignPDFClient", "sign", "Add signature to PDF documents.", "Add signature to PDF documents by drawing, typing, or uploading your signature."),
        ("SplitPDFClient", "split", "Split a PDF into separate pages or ranges.", "Split a PDF into separate pages or page ranges. Extract sections easily."),
        ("UnlockPDFClient", "unlock", "Remove password protection from PDF files.", "Remove password protection from PDF files you have the credentials for."),
    ],
    "media_conversion": [
        ("M4AToMP3Client", "m4a-to-mp3", "Convert M4A audio to MP3 format.", "Convert M4A audio to MP3 format with quality options for iTunes and Apple Music files."),
        ("M4AToMP4Client", "m4a-to-mp4", "Convert M4A audio to MP4 video format.", "Convert M4A audio to MP4 video format with album art and metadata embedding."),
        ("MP4ToMP3Client", "mp4-to-mp3", "Extract audio from MP4 videos as MP3.", "Extract audio from MP4 videos and save as MP3. Perfect for saving music and soundtracks."),
        ("MP4ToOGGClient", "mp4-to-ogg", "Convert MP4 to OGG audio format.", "Convert MP4 to OGG audio format with open-source codec support."),
        ("OGGToMP3Client", "ogg-to-mp3", "Convert OGG audio files to MP3 format.", "Convert OGG audio files to MP3 format for universal device compatibility."),
        ("MuteVideoAudioClient", "mute", "Remove audio from video files.", "Remove audio from video files. Create silent versions of any video for background use."),
    ],
    "converters": [
        ("JSONToURLEncodedClient", "json-to-url-encoded-v2", "Convert JSON to URL-encoded query string.", "Convert JSON key-value pairs to URL-encoded query string format for API requests."),
        ("LogoTraceConverterClient", "trace", "Trace bitmap logos to vector SVG format.", "Trace bitmap logos to vector SVG format. Convert PNG to editable vector graphics."),
        ("MetricImperialConverterClient", "metric-imperial-converter", "Convert between metric and imperial units.", "Convert between metric and imperial units for length, weight, and volume measurements."),
        ("PressureUnitConverterClient", "pressure-converter", "Convert between pressure units.", "Convert between pascals, bars, PSI, atmospheres, and mmHg pressure units."),
        ("ROT13CipherClient", "rot13-cipher-v2", "Apply ROT13 cipher to encode or decode text.", "Apply ROT13 substitution cipher to encode or decode text instantly in your browser."),
        ("ScientificNotationConverterClient", "scientific-notation-converter", "Convert between decimal and scientific notation.", "Convert between decimal notation and scientific notation with precision control."),
        ("UnitConverterClient", "unit-conversion-tool", "Convert length, weight, temperature, speed, volume.", "Convert length, weight, temperature, speed, and volume between metric and imperial systems."),
    ],
    "seo": [
        ("KeywordDifficultyCheckerClient", "keyword-difficulty-tool", "Estimate SEO difficulty for keywords.", "Estimate SEO difficulty for keywords based on search result competition and authority analysis."),
        ("KeywordExtractorClient", "keyword-extractor", "Extract top keywords and phrases from text.", "Extract top keywords and key phrases from any text or webpage for SEO analysis."),
        ("KeywordGeneratorClient", "keyword-generator", "Generate keyword suggestions from seed terms.", "Generate relevant keyword suggestions from any seed term with search volume indicators."),
        ("KeywordGeneratorV2Client", "keyword-generator-v2", "Generate keyword suggestions with difficulty scores.", "Generate keyword suggestions from seed terms with competition and difficulty scores."),
        ("MetaTagGeneratorClient", "meta-toolblip", "Generate SEO meta tags, Open Graph, Twitter Cards.", "Generate SEO meta tags, Open Graph, and Twitter Card tags with live preview."),
        ("MetaTagGeneratorToolClient", "meta-tags-tool", "Generate SEO meta tags with live preview.", "Generate SEO meta tags with live SERP preview for any webpage."),
        ("MetaTagGeneratorSEOLClient", "seo-meta-builder", "Generate SEO meta tags, Open Graph, Twitter Cards.", "Generate SEO meta tags, Open Graph, and Twitter Card tags with preview and copy."),
        ("PageSpeedInsightsPreviewClient", "pagespeed-preview", "Preview estimated PageSpeed score and Web Vitals.", "Preview estimated Google PageSpeed score and Core Web Vitals for any URL."),
        ("PageSpeedPreviewClient", "page-speed-preview", "Estimate page load time and size breakdown.", "Estimate page load time and size breakdown for any URL on slow connections."),
        ("PageTitleCheckerClient", "page-title-checker", "Check page title length for Google SEO.", "Check page title length and quality for optimal Google search result display."),
        ("SEOTitleAnalyzerClient", "seo-title-analyzer", "Analyze SEO title length and quality for search.", "Analyze SEO title length and quality for Google search result snippets."),
        ("SERPSnippetViewerClient", "serp-snippet-viewer", "Preview page appearance in Google search results.", "Preview how a page title and description appear in Google search engine results."),
        ("SERPPreviewToolblipClient", "serp-toolblip", "See SERP appearance for your page title and description.", "See how your page title and meta description appear in Google search snippets."),
        ("SERPPreviewQuickClient", "serp-quick", "Quick SERP preview for any title and description.", "Quick SERP preview for any title and description combination."),
        ("SERPRankTrackerClient", "serp-rank-tracker", "Track keyword rankings in Google search results.", "Track keyword rankings in Google search results and monitor position changes over time."),
        ("SitemapHTMLGeneratorClient", "sitemap-html-new", "Generate linked HTML sitemap from URL list.", "Generate a linked HTML sitemap page from a list of URLs for website navigation."),
        ("SitemapURLExtractorClient", "sitemap-urls-extractor", "Extract all URLs from XML sitemap.", "Extract and list all URLs from any XML sitemap for SEO auditing."),
        ("SlugHealthCheckerClient", "slug-health-checker", "Check URL slug health for duplicate content.", "Check URL slug health for duplicate content issues, redirects, and SEO problems."),
        ("SlugPermalinkCheckerClient", "slug-permalink-checker", "Check URL slug availability and structure.", "Check URL slug availability and analyze permalink structure for SEO optimization."),
        ("TwitterCardPreviewClient", "twitter-card-preview", "Preview webpage on Twitter with large card.", "Preview how a webpage appears when shared on Twitter with large card image."),
    ],
    "generators": [
        ("KubernetesYAMLGeneratorClient", "kubernetes-yaml-generator", "Generate Kubernetes manifests for Deployments, Services.", "Generate Kubernetes manifests for Deployments, Services, ConfigMaps, and more."),
        ("NonDisclosureAgreementGeneratorClient", "nda-generator", "Generate free NDA documents.", "Generate free NDA documents with standard legal templates for business relationships."),
        ("PhysicsConstantsReferenceClient", "physics-constants-reference", "Browse common physics constants with units.", "Browse common physics constants with units, symbols, and precision values."),
        ("PollGeneratorClient", "poll-generator", "Create polls for Twitter, Instagram, surveys.", "Create polls for Twitter, Instagram, and surveys with interactive voting."),
        ("PressReleaseGeneratorClient", "press-release-generator", "Write professional press releases.", "Write professional press releases in standard media-ready format."),
        ("PrivacyPolicyGeneratorClient", "privacy-policy-generator", "Generate privacy policy for websites.", "Generate a privacy policy for your website with free legal template sections."),
        ("PurchaseAgreementGeneratorClient", "purchase-agreement-generator", "Create purchase agreement contracts.", "Create purchase agreement contracts with free legal document templates."),
        ("QuoteOfTheDayClient", "quote-of-the-day", "Get a random or themed quote of the day.", "Get an inspiring or random quote of the day with author attribution and categories."),
        ("RandomChoicePickerClient", "random-choice-picker", "Pick random items from a list.", "Pick random items from a list. Enter choices separated by newlines and pick one."),
        ("RandomChoiceWheelClient", "random-choice-wheel", "Spin a wheel to pick random names or items.", "Spin a customizable wheel to pick random names or items from a list with animation."),
        ("ScreenshotMakerClient", "screenshot-maker", "Capture full-page screenshots of any URL.", "Capture full-page screenshots of any URL with customizable viewport and device presets."),
        ("SlideshowGeneratorClient", "slideshow-generator", "Create HTML slideshows from markdown or text.", "Create HTML slideshows from markdown or text with smooth transition animations."),
        ("SplitCSVFileClient", "split-csv", "Split large CSV files into smaller parts.", "Split large CSV files into smaller parts. Handle big data with configurable row limits."),
        ("SplitExcelFileClient", "split-excel", "Split large Excel files into spreadsheets.", "Split large Excel files into smaller spreadsheets. Manage data in configurable chunks."),
        ("TimestampDiffCalculatorClient", "timestamp-diff-calculator", "Calculate difference between two timestamps.", "Calculate the difference between two Unix timestamps or date/time values in various units."),
        ("WhatIfScenarioCalculatorClient", "what-if-scenario-calculator", "Model what-if scenarios with changing variables.", "Model what-if scenarios by changing variables and seeing results update in real-time."),
    ],
}

def component_template(name, slug, description, extended_desc):
    return f"""'use client';

import {{ useState }} from 'react';

interface Props {{
  tool: {{
    name: string;
    slug: string;
    description: string;
  }};
}}

export default function {name}({{ tool }}: Props) {{
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async () => {{
    setIsLoading(true);
    try {{
      // TODO: Implement {name} logic
      setOutput(`Processed: ${{input}}`);
    }} catch (error) {{
      setOutput(`Error: ${{error}}`);
    }}
    setIsLoading(false);
  }};

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{{tool.name}}</h1>
        <p className="text-gray-600 dark:text-gray-400">{{tool.description}}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <textarea
            className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
            placeholder="Enter your text..."
            value={{input}}
            onChange={{(e) => setInput(e.target.value)}}
          />
        </div>
        
        <button
          onClick={{handleProcess}}
          disabled={{isLoading}}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{isLoading ? 'Processing...' : 'Process'}}
        </button>
        
        {{output && (
          <div>
            <label className="block text-sm font-medium mb-2">Output</label>
            <pre className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm whitespace-pre-wrap">
              {{output}}
            </pre>
          </div>
        )}}
      </div>
    </div>
  );
}}
"""

def write_component(comp_name, slug, desc, extended_desc):
    path = TOOLS_DIR / f"{comp_name}.tsx"
    if path.exists():
        print(f"  SKIP (exists): {comp_name}")
        return False
    content = component_template(comp_name, slug, desc, extended_desc)
    with open(path, 'w') as f:
        f.write(content)
    print(f"  CREATED: {comp_name}")
    return True

def add_switch_case(slug, comp_name):
    with open(TOOLUI_PATH, 'r') as f:
        content = f.read()
    
    new_case = f"    case '{slug}': return <{comp_name} />;"
    if f"case '{slug}':" in content:
        print(f"  SKIP switch (exists): {slug}")
        return False
    
    # Insert before default:
    old = "    default:\n      return <ComingSoonUI tool={tool} />;"
    new = f"{new_case}\n  {old}"
    if old in content:
        content = content.replace(old, new)
        with open(TOOLUI_PATH, 'w') as f:
            f.write(content)
        print(f"  SWITCH ADDED: {slug}")
        return True
    else:
        print(f"  ERROR: Could not find default case in ToolUI.tsx")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python build_tools_batch.py [category|all]")
        print(f"Categories: {', '.join(TOOLS_BY_CATEGORY.keys())}")
        sys.exit(1)
    
    target = sys.argv[1]
    
    if target == 'all':
        categories = TOOLS_BY_CATEGORY
    else:
        if target not in TOOLS_BY_CATEGORY:
            print(f"Unknown category: {target}")
            print(f"Available: {', '.join(TOOLS_BY_CATEGORY.keys())}")
            sys.exit(1)
        categories = {target: TOOLS_BY_CATEGORY[target]}
    
    total_created = 0
    total_switch = 0
    
    for cat, tools in categories.items():
        print(f"\n=== {cat.upper()} ({len(tools)} tools) ===")
        for comp_name, slug, desc, extended_desc in tools:
            if write_component(comp_name, slug, desc, extended_desc):
                total_created += 1
            if add_switch_case(slug, comp_name):
                total_switch += 1
    
    print(f"\nDone. Created {total_created} components, added {total_switch} switch cases.")

if __name__ == '__main__':
    main()
