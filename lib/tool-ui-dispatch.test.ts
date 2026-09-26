import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createElement, type ReactElement } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { consolidatedAliases } from '@/e2e/content-aliases';

// Execute the real dispatcher, isolating its hundreds of browser-only imports.
// Component markers make a missing return or wrong component observable in HTML.
const source = readFileSync(new URL('../app/tools/[slug]/ToolUI.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const exports: { ToolUI?: (props: { tool: { slug: string } }) => ReactElement } = {};
runInNewContext(compiled, {
  exports,
  require: (id: string) => {
    if (id === 'react/jsx-runtime') return jsxRuntime;
    if (id.startsWith('@/components/tools/')) {
      return { default: () => createElement('div', { 'data-tool': id.split('/').at(-1) }) };
    }
    return {};
  },
});

const destinations = [
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
  it('covers every unique consolidation destination', () => {
    expect(destinations.map(([slug]) => slug).sort())
      .toEqual([...new Set(Object.values(consolidatedAliases))].sort());
  });

  it.each(destinations)('%s renders %s', (slug, component) => {
    const html = renderToStaticMarkup(exports.ToolUI!({ tool: { slug } }));
    expect(html).toBe(`<div data-tool="${component}"></div>`);
  });
});
