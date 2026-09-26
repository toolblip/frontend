import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createElement, type ReactElement } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import { reviewedToolSlugs } from '@/data/reviewed-tools';
import { consolidatedAliases } from '@/e2e/content-aliases';

// Execute the real dispatcher, isolating its hundreds of browser-only imports.
// Component markers make a missing return or wrong component observable in HTML.
const source = readFileSync(new URL('../app/tools/[slug]/ToolUI.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const exports: { ToolUI?: (props: { tool: { slug: string } }) => ReactElement } = {};
const pending: Promise<unknown>[] = [];
runInNewContext(compiled, {
  exports,
  require: (id: string) => {
    if (id === 'react/jsx-runtime') return jsxRuntime;
    if (id === 'next/dynamic') return {default: (loader: () => Promise<{ default: () => ReactElement }>) => {
      let component: (() => ReactElement) | undefined;
      pending.push(loader().then(module => { component = module.default; }));
      return () => { if (!component) throw new Error('Tool loader not resolved'); return createElement(component); };
    }};
    if (id.startsWith('@/components/tools/')) {
      return { default: () => createElement('div', { 'data-tool': id.split('/').at(-1) }) };
    }
    return {};
  },
});

const destinations = [
  ['json-formatter', 'JsonFormatterClient'],
  ['base64-encoder-decoder', 'Base64EncoderDecoderClient'],
  ['uuid-generator', 'UuidGeneratorClient'],
  ['word-counter', 'WordCounterClient'],
  ['json-to-markdown-table', 'JsonToMarkdownTableClient'],
  ['base64-image-converter', 'Base64ImageConverterClient'],
  ['text-line-sorter', 'TextSorterClient'],
  ['serp-preview', 'SerpPreviewClient'],
  ['readability-score', 'ReadabilityScoreClient'],
  ['image-resizer', 'ImageResizerClient'],
  ['grammar-checker', 'GrammarCheckerClient'],
  ['favicon-generator', 'FaviconGeneratorClient'],
  ['batch-favicon-downloader', 'BatchFaviconDownloaderClient'],
  ['json-path-tester', 'JsonPathTesterClient'],
  ['json-to-typescript', 'JsonToTypescriptClient'],
  ['keyword-density-checker', 'KeywordDensityCheckerClient'],
  ['mac-address-generator', 'MacAddressGeneratorClient'],
  ['backslash-escape-unescape', 'BackslashEscapeUnescapeClient'],
  ['detect', 'DetectClient'],
  ['image-rotate', 'ImageRotateToolClient'],
  ['robots-txt-checker', 'RobotsTxtEditorClient'],
  ['sitemap-analyzer', 'SitemapAnalyzerClient'],
  ['word-frequency-table', 'WordFrequencyAnalyzerClient'],
  ['pdf-password-remover', 'PdfPasswordRemoverClient'],
  ['jwt-token-tester', 'JwtTokenTesterClient'],
  ['word-combinations-generator', 'WordCombinationsGeneratorClient'],

  ['case-converter', 'CaseConverterClient'],
  ['url-encode', 'UrlEncodeClient'],
  ['regex-tester', 'RegexTesterClient'],
  ['password-generator', 'PasswordGeneratorClient'],
  ['markdown-to-html', 'MarkdownToHtmlClient'],
  ['lorem-ipsum-generator', 'LoremIpsumGeneratorClient'],
  ['jwt-decoder', 'JwtDecoderClient'],
  ['reading-time-calculator', 'ReadingTimeCalculatorClient'],
  ['text-statistics', 'TextStatisticsClient'],
  ['uptime-calculator', 'UptimeCalculatorClient'],
  ['all-in-one-unit-converter', 'AllInOneUnitConverterClient'],
];

describe('retained canonical tool dispatch', () => {
  beforeAll(async () => { await Promise.all(pending); });
  it('covers every unique consolidation destination', () => {
    expect(destinations.map(([slug]) => slug).sort())
      .toEqual([...new Set([...Object.values(consolidatedAliases), ...reviewedToolSlugs])].sort());
  });

  it('removes retired switch labels without leaving fallthrough blocks', () => {
    for (const alias of Object.keys(consolidatedAliases)) expect(source).not.toContain(`case '${alias}':`);
  });

  it.each(destinations)('%s renders %s', (slug, component) => {
    const html = renderToStaticMarkup(exports.ToolUI!({ tool: { slug } }));
    expect(html).toBe(`<div data-tool="${component}"></div>`);
  });
});
