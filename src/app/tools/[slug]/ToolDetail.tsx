'use client';

import Link from 'next/link';
import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

// Wired-up tool components
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import RemoveDuplicateLinesClient from '@/components/tools/RemoveDuplicateLinesClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
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

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Tool not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        This tool doesn&rsquo;t exist or may have been renamed.
      </p>
      <Link
        href="/tools"
        className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        Browse all tools
      </Link>
    </div>
  );
}

// ─── Coming Soon ──────────────────────────────────────────────────────────────

function ComingSoon({ toolName }: { toolName: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10">
        <span className="text-5xl">🚧</span>
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Coming soon</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          <strong>{toolName}</strong> is on our roadmap and will be available soon.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href="/tools"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Browse all tools
          </Link>
          <Link
            href="/directory"
            className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Explore directory
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Tool registry ─────────────────────────────────────────────────────────────

function ToolRouter({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    // Text tools
    case 'word-counter':          return <WordCounterClient />;
    case 'character-counter':      return <CharacterCounterClient />;
    case 'remove-duplicate-lines':  return <RemoveDuplicateLinesClient />;
    case 'case-converter':         return <CaseConverterClient />;
    case 'json-formatter':         return <JsonFormatterClient />;

    // Encoding / conversion
    case 'base64':                 return <Base64Client />;
    case 'url-encode':             return <UrlEncodeClient />;
    case 'markdown-to-html':       return <MarkdownToHtmlClient />;
    case 'yaml-to-json':           return <YamlToJsonClient />;

    // Developer tools
    case 'uuid-generator':         return <UuidGeneratorClient />;
    case 'hash-generator':         return <HashGeneratorClient />;
    case 'cron-parser':            return <CronParserClient />;
    case 'url-slug-generator':     return <UrlSlugGeneratorClient />;

    // Image tools
    case 'image-cropper':          return <ImageCropperClient />;
    case 'image-format-converter':  return <ImageFormatConverterClient />;

    // CSS tools
    case 'css-border-radius-generator': return <CssBorderRadiusGeneratorClient />;
    case 'css-gradient-generator':  return <CssGradientGeneratorClient />;

    // Calculators
    case 'percentage-calculator':  return <PercentageCalculatorClient />;
    case 'screen-resolution-tester': return <ScreenResolutionTesterClient />;

    default:                       return <ComingSoon toolName={tool.name} />;
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ToolDetail({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/tools" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          All Tools
        </Link>
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
    </div>
  );
}
