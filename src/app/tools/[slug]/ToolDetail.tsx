'use client';

import Link from 'next/link';
import { tools, type Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';
import ToolUI from './ToolUI';

// ─── Tool registry (individual wired-up client components) ─────────────────────
// The 6 core text/encoding tools use inline implementations in ToolUI.tsx.
// Other tools use dedicated client components imported here.

import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import ImageCropperClient from '@/components/tools/ImageCropperClient';
import ImageFormatConverterClient from '@/components/tools/ImageFormatConverterClient';
import UuidGeneratorClient from '@/components/tools/UuidGeneratorClient';
import MarkdownToHtmlClient from '@/components/tools/MarkdownToHtmlClient';
import YamlToJsonClient from '@/components/tools/YamlToJsonClient';
import CronParserClient from '@/components/tools/CronParserClient';
import HashGeneratorClient from '@/components/tools/HashGeneratorClient';
import ScreenResolutionTesterClient from '@/components/tools/ScreenResolutionTesterClient';
import UrlSlugGeneratorClient from '@/components/tools/UrlSlugGeneratorClient';
import PercentageCalculatorClient from '@/components/tools/PercentageCalculatorClient';
import CssBorderRadiusGeneratorClient from '@/components/tools/CssBorderRadiusGeneratorClient';
import CssGradientGeneratorClient from '@/components/tools/CssGradientGeneratorClient';
import LoremIpsumGeneratorClient from '@/components/tools/LoremIpsumGeneratorClient';
import RegexTesterClient from '@/components/tools/RegexTesterClient';
import JwtDecoderClient from '@/components/tools/JwtDecoderClient';
import MetaTagGeneratorClient from '@/components/tools/MetaTagGeneratorClient';
import TextSorterClient from '@/components/tools/TextSorterClient';
import ColorPickerClient from '@/components/tools/ColorPickerClient';
import ContrastCheckerClient from '@/components/tools/ContrastCheckerClient';
import UnitConverterClient from '@/components/tools/UnitConverterClient';
import NumberBaseConverterClient from '@/components/tools/NumberBaseConverterClient';
import ReadabilityScoreClient from '@/components/tools/ReadabilityScoreClient';
import SerpPreviewClient from '@/components/tools/SerpPreviewClient';
import GrammarCheckerClient from '@/components/tools/GrammarCheckerClient';
import FaviconGeneratorClient from '@/components/tools/FaviconGeneratorClient';
import ImageResizerClient from '@/components/tools/ImageResizerClient';
import CronGeneratorClient from '@/components/tools/CronGeneratorClient';
import HttpHeadersViewerClient from '@/components/tools/HttpHeadersViewerClient';
import HtmlEncoderClient from '@/components/tools/HtmlEncoderClient';
import JsonToYamlClient from '@/components/tools/JsonToYamlClient';

// ─── Tool registry ─────────────────────────────────────────────────────────────

function ToolRouter({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    // Core 6 — inline in ToolUI.tsx
    case 'word-counter':
    case 'character-counter':
    case 'case-converter':
    case 'base64':
    case 'url-encode':
    case 'json-formatter':
      return <ToolUI slug={tool.slug} />;

    // Other wired-up tools
    case 'remove-duplicate-lines':  return <RemoveDuplicateLinesClient />;
    case 'markdown-to-html':       return <MarkdownToHtmlClient />;
    case 'yaml-to-json':           return <YamlToJsonClient />;
    case 'uuid-generator':         return <UuidGeneratorClient />;
    case 'hash-generator':         return <HashGeneratorClient />;
    case 'cron-parser':            return <CronParserClient />;
    case 'url-slug-generator':     return <UrlSlugGeneratorClient />;
    case 'image-cropper':          return <ImageCropperClient />;
    case 'image-format-converter':  return <ImageFormatConverterClient />;
    case 'css-border-radius-generator': return <CssBorderRadiusGeneratorClient />;
    case 'css-gradient-generator':  return <CssGradientGeneratorClient />;
    case 'percentage-calculator':  return <PercentageCalculatorClient />;
    case 'screen-resolution-tester': return <ScreenResolutionTesterClient />;
    case 'unit-converter':         return <UnitConverterClient />;
    case 'number-base-converter':  return <NumberBaseConverterClient />;
    case 'contrast-checker':       return <ContrastCheckerClient />;
    case 'lorem-ipsum-generator':  return <LoremIpsumGeneratorClient />;
    case 'readability-score':      return <ReadabilityScoreClient />;
    case 'text-sorter':           return <TextSorterClient />;
    case 'regex-tester':          return <RegexTesterClient />;
    case 'jwt-decoder':           return <JwtDecoderClient />;
    case 'meta-tag-generator':     return <MetaTagGeneratorClient />;
    case 'color-picker':          return <ColorPickerClient />;
    case 'serp-preview':           return <SerpPreviewClient />;
    case 'grammar-checker':         return <GrammarCheckerClient />;
    case 'favicon-generator':       return <FaviconGeneratorClient />;
    case 'image-resizer':           return <ImageResizerClient />;
    case 'cron-generator':          return <CronGeneratorClient />;
    case 'http-headers-viewer':     return <HttpHeadersViewerClient />;
    case 'html-encoder':             return <HtmlEncoderClient />;
    case 'json-to-yaml':             return <JsonToYamlClient />;

    default: return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">🚧</span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Coming soon</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          <strong>{tool.name}</strong> is on our roadmap and will be available soon.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/tools" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">Browse all tools</Link>
          <Link href="/directory" className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-lg font-medium transition-colors">Explore directory</Link>
        </div>
      </div>
    );
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ToolDetail({ tool }: { tool: Tool }) {
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `https://toolblip.com/tools/${tool.slug}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/tools?category=${encodeURIComponent(tool.category)}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">{tool.category}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{tool.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 leading-relaxed">
              {tool.description}
            </p>
            <span className="inline-block mt-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      {/* Tool UI */}
      <ToolRouter tool={tool} />

      {/* Share */}
      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
        <ShareButtons toolName={tool.name} />
      </div>

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map(t => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl p-3 transition-all"
              >
                <span className="text-xl flex-shrink-0">{t.emoji}</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 truncate">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
