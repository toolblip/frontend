'use client';

import type { Tool } from '@/data/tools';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';
import ColorPickerClient from '@/components/tools/ColorPickerClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import PasswordGeneratorClient from '@/components/tools/PasswordGeneratorClient';
import LoremIpsumGeneratorClient from '@/components/tools/LoremIpsumGeneratorClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import TextDiffClient from '@/components/tools/TextDiffClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import MarkdownToHtmlClient from '@/components/tools/MarkdownToHtmlClient';
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';
import XmlToJsonClient from '@/components/tools/XmlToJsonClient';
import SqlToJsonClient from '@/components/tools/SqlToJsonClient';
import JsMinifierClient from '@/components/tools/JsMinifierClient';
import NumberBaseConverterClient from '@/components/tools/NumberBaseConverterClient';
import JwtDecoderClient from '@/components/tools/JwtDecoderClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
import CronParserClient from '@/components/tools/CronParserClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import UrlParamsClient from '@/components/tools/UrlParamsClient';
import MetaTagGeneratorClient from '@/components/tools/MetaTagGeneratorClient';
import SerpPreviewClient from '@/components/tools/SerpPreviewClient';
import CircleCropClient from '@/components/tools/CircleCropClient';
import ContrastCheckerClient from '@/components/tools/ContrastCheckerClient';
import CronGeneratorClient from '@/components/tools/CronGeneratorClient';
import CssBorderRadiusGeneratorClient from '@/components/tools/CssBorderRadiusGeneratorClient';
import CssGradientGeneratorClient from '@/components/tools/CssGradientGeneratorClient';
import FaviconGeneratorClient from '@/components/tools/FaviconGeneratorClient';
import GrammarCheckerClient from '@/components/tools/GrammarCheckerClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import CreditCardValidatorClient from '@/components/tools/CreditCardValidatorClient';
import UnixTimestampConverterClient from '@/components/tools/UnixTimestampConverterClient';
import PercentageDifferenceClient from '@/components/tools/PercentageDifferenceClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';
import ScreenResolutionTesterClient from '@/components/tools/ScreenResolutionTesterClient';
import SquareCropClient from '@/components/tools/SquareCropClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';

import FaqSection from '@/components/v2/FaqSection';
import { getFaqs } from '@/lib/faq';

function getToolComponent(slug: string): React.ReactNode {
  switch (slug) {
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'base64':
      return <Base64Client />;
    case 'url-encode':
    case 'url-encoder':
      return <UrlEncodeClient />;
    case 'json-formatter':
    case 'json-editor':
      return <JsonFormatterClient />;
    case 'qr-code-generator':
    case 'qr-code':
      return <QrCodeGeneratorClient />;
    case 'color-picker':
      return <ColorPickerClient />;
    case 'uuid-generator':
      return <UuidGeneratorClient />;
    case 'password-generator':
      return <PasswordGeneratorClient />;
    case 'lorem-ipsum-generator':
      return <LoremIpsumGeneratorClient />;
    case 'hash-generator':
      return <HashGeneratorClient />;
    case 'text-diff':
      return <TextDiffClient />;
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesClient />;
    case 'markdown-to-html':
      return <MarkdownToHtmlClient />;
    case 'yaml-to-json':
    case 'json-to-yaml':
      return <YamlToJsonClient />;
    case 'xml-to-json':
      return <XmlToJsonClient />;
    case 'sql-to-json':
      return <SqlToJsonClient />;
    case 'js-minifier':
    case 'javascript-minifier':
      return <JsMinifierClient />;
    case 'number-base-converter':
      return <NumberBaseConverterClient />;
    case 'jwt-decoder':
      return <JwtDecoderClient />;
    case 'regex-tester':
      return <RegexTesterClient />;
    case 'cron-parser':
    case 'cron-expression-parser':
      return <CronParserClient />;
    case 'url-slug-generator':
      return <UrlSlugGeneratorClient />;
    case 'url-parameter-extractor':
    case 'url-params-extractor':
      return <UrlParamsClient />;
    case 'meta-tag-generator':
      return <MetaTagGeneratorClient />;
    case 'serp-preview':
      return <SerpPreviewClient />;
    case 'circle-crop':
      return <CircleCropClient />;
    case 'contrast-checker':
      return <ContrastCheckerClient />;
    case 'credit-card-validator':
      return <CreditCardValidatorClient />;
    case 'cron-generator':
      return <CronGeneratorClient />;
    case 'css-border-radius-generator':
      return <CssBorderRadiusGeneratorClient />;
    case 'css-gradient-generator':
      return <CssGradientGeneratorClient />;
    case 'favicon-generator':
      return <FaviconGeneratorClient />;
    case 'grammar-checker':
      return <GrammarCheckerClient />;
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
    case 'percentage-calculator':
      return <PercentageCalculatorClient />;
    case 'readability-score':
      return <ReadabilityScoreClient />;
    case 'screen-resolution-tester':
      return <ScreenResolutionTesterClient />;
    case 'square-crop':
      return <SquareCropClient />;
    case 'text-sorter':
      return <TextSorterClient />;
    case 'unit-converter':
    case 'binary-converter':
    case 'binary-decimal-hex-converter':
    case 'binary-text':
    case 'binary-text-express':
    case 'binary-to-text':
    case 'binary-to-text-v2':
    case 'hex-converter':
    case 'hex-decimal-converter':
    case 'decimal-to-hex':
    case 'decimal-to-binary':
    case 'octal-converter':
    case 'base-convert-tool':
    case 'base-converter':
    case 'base-number-converter':
    case 'base64-to-text':
    case 'base64-decode':
    case 'base64-encode':
    case 'hex-to-decimal':
    case 'hex-to-binary':
    case 'decimal-to-hex':
    case 'decimal-to-octal':
    case 'octal-to-decimal':
    case 'binary-to-hex':
    case 'hex-to-octal':
    case 'number-base-converter':
    case 'base-2-converter':
    case 'base-8-converter':
    case 'base-16-converter':
    case 'base-36-converter':
    case 'binary-decimal-converter':
    case 'decimal-binary-converter':
    case 'hex-decimal-converter-v2':
    case 'binary-converter-tool':
    case 'hex-converter-tool':
    case 'base-converter-tool':
    case 'number-system-converter':
    case 'radix-converter':
      return <NumberBaseConverterClient />;
    case 'text-case-converter':
    case 'lowercase-converter':
    case 'uppercase-converter':
    case 'title-case-generator':
    case 'sentence-case':
    case 'text-capitalize':
      return <CaseConverterClient />;
    case 'url-encoder-decoder':
    case 'html-encoder-decoder':
    case 'backslash-escape-unescape':
    case 'html-encoder':
    case 'html-decoder':
    case 'url-encode-decode':
      return <UrlEncodeClient />;
    case 'unix-timestamp-converter':
    case 'unix-timestamp':
    case 'timestamp-converter':
    case 'epoch-converter':
    case 'json-validator':
    case 'json-beautifier':
    case 'json-prettifier':
    case 'json-format':
    case 'format-json':
    case 'prettify-json':
    case 'minify-json':
    case 'json-minifier':
      return <JsonFormatterClient />;
    case 'yaml-validator':
    case 'yaml-formatter':
    case 'yaml-prettifier':
      return <YamlToJsonClient />;
    case 'text-sorter':
    case 'alphabetical-sorter':
    case 'sort-text':
    case 'sort-lines':
    case 'sort-list':
    case 'sort-words':
    case 'sort-alphabetically':
    case 'text-sort-tool':
    case 'line-sorter':
    case 'sort-text-lines':
    case 'sort-strings':
    case 'randomize-list':
    case 'shuffle-list':
    case 'shuffle-text':
    case 'random-text-order':
      return <TextSorterClient />;
    case 'lorem-generator':
    case 'lorem-text':
    case 'placeholder-text':
    case 'dummy-text':
    case 'lorem-ipsum-generator':
    case 'lorem-ipsum-creator':
    case 'lorem-text-generator':
    case 'ipsum-generator':
    case 'latin-text-generator':
      return <LoremIpsumGeneratorClient />;
    case 'md5-generator':
    case 'sha256-generator':
    case 'sha-256-generator':
    case 'sha512-generator':
    case 'sha1-generator':
    case 'hash-generator-tool':
      return <HashGeneratorClient />;
    case 'remove-duplicates':
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesClient />;
    case 'text-compare':
    case 'compare-text':
    case 'text-comparison':
    case 'text-diff-tool':
      return <TextDiffClient />;
    case 'cron-generator':
    case 'cron-expander':
    case 'cron-schedule-builder':
    case 'cron-tool':
    case 'cron-visual-builder':
    case 'cron-human-readable':
    case 'cron-expression-builder':
    case 'cron-schedule-generator':
    case 'cron-validator':
    case 'cron-schedule-checker':
    case 'cron-toolblip':
    case 'cron-generator-tool':
    case 'cron-generator-browser':
    case 'cron-generator-easy':
    case 'cron-generator-express':
    case 'cron-generator-final':
    case 'cron-generator-full':
    case 'cron-generator-new':
    case 'cron-generator-pro':
    case 'cron-generator-quick':
    case 'cron-generator-std':
    case 'cron-generator-v2':
    case 'cron-generator-v3':
    case 'cron-generator-v4':
    case 'cron-generator-v5':
    case 'cron-generator-v6':
    case 'cron-schedule-validator':
    case 'cron-expression-generator':
    case 'cron-generator-2025':
    case 'cron-generator-api':
    case 'cron-generator-dg':
    case 'cron-generator-handy':
      return <CronGeneratorClient />;
    case 'jwt-decoder':
    case 'jwt-viewer':
    case 'jwt-explorer':
    case 'jwt-parser':
      return <JwtDecoderClient />;
    case 'regex-tester':
    case 'regex-match':
    case 'regex-validator':
    case 'regex-generator':
      return <RegexTesterClient />;
    case 'url-slug':
    case 'slug-generator':
    case 'slug-creator':
    case 'slug-maker':
    case 'url-friendly-text':
    case 'text-to-slug':
      return <UrlSlugGeneratorClient />;
    case 'meta-tag-generator':
    case 'og-tag-generator':
    case 'meta-generator':
    case 'meta-tags':
    case 'facebook-og-generator':
    case 'twitter-card-generator':
    case 'seo-meta-tags':
      return <MetaTagGeneratorClient />;
    case 'serp-preview':
    case 'google-preview':
    case 'search-preview':
    case 'seo-preview':
    case 'google-serp-preview':
    case 'search-result-preview':
      return <SerpPreviewClient />;
    case 'markdown-prettifier':
    case 'markdown-formatter':
    case 'md-to-html':
      return <MarkdownToHtmlClient />;
    case 'password-generator-tool':
    case 'random-password-generator':
    case 'pwd-generator':
      return <PasswordGeneratorClient />;
    case 'uuid-generator':
    case 'uuid-creator':
    case 'uuid-maker':
    case 'uuid-v4-generator':
    case 'guid-generator':
    case 'unique-id-generator':
      return <UuidGeneratorClient />;
    case 'image-resizer':
    case 'resize-image':
    case 'resize-photo':
    case 'photo-resizer':
    case 'image-resize-tool':
    case 'resize-images':
    case 'image-resize-browser':
    case 'image-resize-toolblip':
    case 'resize-image-tool':
    case 'resize-picture':
    case 'picture-resizer':
    case 'image-scaler':
    case 'scale-image':
      return <ImageResizerClient />;
    case 'image-cropper':
    case 'crop-image':
    case 'crop-photo':
    case 'photo-cropper':
    case 'image-crop-tool':
    case 'crop-photo-tool':
    case 'cropping-tool':
      return <ImageCropperClient />;
    case 'image-format-converter':
    case 'convert-image-format':
    case 'image-converter':
    case 'change-image-format':
    case 'image-file-converter':
    case 'png-to-jpg':
    case 'jpg-to-png':
    case 'webp-converter':
    case 'convert-to-webp':
    case 'convert-to-png':
    case 'convert-to-jpg':
    case 'image-convert-format':
    case 'format-converter-image':
      return <ImageFormatConverterClient />;
    case 'percentage-calculator':
    case 'percent-calculator':
    case 'percentage-of-number':
    case 'percentage-change-calculator':
    case 'percentage-off-calculator':
    case 'percentage-difference':
    case 'percent-difference':
      return <PercentageCalculatorClient />;
    case 'readability-checker':
    case 'flesch-reading-ease':
    case 'readability-score':
    case 'reading-level':
    case 'text-readability':
      return <ReadabilityScoreClient />;
    case 'http-headers-viewer':
    case 'http-header-checker':
    case 'view-http-headers':
    case 'http-headers-check':
    case 'check-http-headers':
    case 'header-viewer':
      return <HttpHeadersViewerClient />;
    case 'screen-resolution-tester':
    case 'viewport-tester':
    case 'responsive-checker':
    case 'browser-resolution-test':
    case 'screen-size-tester':
    case 'device-viewport-test':
      return <ScreenResolutionTesterClient />;
    case 'favicon-generator':
    case 'favicon-creator':
    case 'favicon-maker':
    case 'favicon-from-emoji':
    case 'favicon-tool':
    case 'favicon-maker-tool':
    case 'favicon-generator-tool':
    case 'favicon-png-generator':
    case 'favicon-preview-tool':
      return <FaviconGeneratorClient />;
    case 'grammar-checker':
    case 'grammar-check':
    case 'grammar-fixer':
    case 'check-grammar':
    case 'grammar-checker-tool':
    case 'english-grammar-checker':
    case 'grammar-corrector':
      return <GrammarCheckerClient />;
    case 'qr-generator':
    case 'qrcode-generator':
    case 'qr-creator':
    case 'qr-code-maker':
      return <QrCodeGeneratorClient />;
    case 'circle-crop':
    case 'circular-crop':
    case 'crop-circle':
    case 'round-crop':
      return <CircleCropClient />;
    case 'square-crop':
    case 'crop-square':
    case 'square-crop-tool':
      return <SquareCropClient />;
    case 'contrast-checker':
    case 'color-contrast-checker':
    case 'wcag-contrast-checker':
    case 'contrast-auditor':
    case 'color-contrast-auditor':
      return <ContrastCheckerClient />;
    case 'css-border-radius-generator':
    case 'border-radius-generator':
    case 'border-radius-tool':
      return <CssBorderRadiusGeneratorClient />;
    case 'css-gradient-generator':
    case 'gradient-generator':
    case 'css-gradient-tool':
      return <CssGradientGeneratorClient />;
    case 'sql-to-json':
    case 'sql-converter':
    case 'sql-to-json-converter':
      return <SqlToJsonClient />;
    case 'xml-to-json':
    case 'xml-converter':
    case 'xml-to-json-converter':
    case 'xml-formatter':
      return <XmlToJsonClient />;
    case 'js-minifier':
    case 'javascript-minifier':
    case 'minify-javascript':
    case 'minify-js':
    case 'compress-javascript':
      return <JsMinifierClient />;
    case 'unit-converter':
    case 'all-in-one-unit-converter':
    case 'angle-unit-converter':
    case 'area-converter':
    case 'pressure-converter':
    case 'volume-converter':
    case 'speed-converter':
    case 'energy-converter':
    case 'temperature-converter':
    case 'length-converter':
    case 'weight-converter':
    case 'mass-converter':
    case 'time-converter':
    case 'unit-conversion-tool':
    case 'unit-convert-toolblip':
    case 'unit-converter-browser':
    case 'unit-converter-easy':
    case 'unit-converter-express':
    case 'unit-converter-final':
    case 'unit-converter-full':
    case 'unit-converter-handy':
    case 'unit-converter-length-weight':
    case 'unit-converter-new':
    case 'unit-converter-pro':
    case 'unit-converter-quick':
    case 'unit-converter-std':
    case 'unit-converter-tool':
    case 'unit-converter-toolbox':
    case 'unit-converter-v2':
    case 'unit-converter-v3':
    case 'unit-converter-v4':
    case 'unit-converter-v5':
    case 'unit-converter-xl':
    case 'unit-converter-2025':
    case 'unit-converter-dg':
    case 'unit-toolblip':
    case 'units-convert-tool':
      return <UnitConverterClient />;

      return <UnitConverterClient />;
    default:
      return <ComingSoonUI />;
  }
}

function ComingSoonUI() {
  return (
    <div className="tb-v2-coming-soon">
      <div className="tb-v2-coming-soon-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <div className="tb-v2-coming-soon-body">
        <div className="tb-v2-coming-soon-title">This tool is being built</div>
        <p className="tb-v2-coming-soon-desc">
          Need it sooner? Email{' '}
          <a
            className="tb-v2-coming-soon-link"
            href="mailto:info@toolblip.com?subject=Tool%20Request"
          >
            info@toolblip.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function ToolClient({ tool }: { tool: Tool }) {
  const component = getToolComponent(tool.slug);

  return (
    <section className="tb-v2-tool-page">
      <div className="tb-v2-container">

        {/* Breadcrumb */}
        <nav className="tb-v2-breadcrumb" aria-label="Breadcrumb">
          <Link href="/tools">All Tools</Link>
          <span className="tb-v2-breadcrumb-sep" aria-hidden="true">›</span>
          <span>{tool.category}</span>
        </nav>

        {/* Header */}
        <div className="tb-v2-tool-header">
          <div className="tb-v2-tool-emoji" aria-hidden="true">
            {tool.emoji}
          </div>
          <div className="tb-v2-tool-title-group">
            <h1 className="tb-v2-tool-title">{tool.name}</h1>
            <p className="tb-v2-tool-desc">{tool.description}</p>
            <div className="tb-v2-tool-header-row">
              <span className="tb-v2-tool-cat-pill">{tool.category}</span>
              <div className="tb-v2-share-row">
                <ShareButtons
                  toolName={tool.name}
                  className="tb-v2-share-row"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tool card */}
        <div className="tb-v2-tool-card">
          {component}
        </div>

        {/* FAQ */}
        <FaqSection toolName={tool.name} faqs={getFaqs(tool)} />

        {/* Footer note */}
        <p className="tb-v2-tool-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          100% client-side - nothing leaves your browser
        </p>
      </div>
    </section>
  );
}
