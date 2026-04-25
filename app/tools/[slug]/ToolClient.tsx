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
