import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import EnglishDictionaryClient, { DictionaryAttribution } from '@/components/tools/EnglishDictionaryClient';

beforeAll(() => vi.stubGlobal('React', React));
afterAll(() => vi.unstubAllGlobals());
it('visibly credits the provider and license without offering invented audio', () => {
  const html = renderToStaticMarkup(React.createElement(EnglishDictionaryClient));
  expect(html).toContain('href="https://freedictionaryapi.com"');
  expect(html).toContain('FreeDictionaryAPI.com</a>');
  expect(html).toContain('href="https://creativecommons.org/licenses/by-sa/4.0/"');
  expect(html).toContain('audio is not provided');
  expect(html).not.toContain('>Play</button>');
});

it('links the displayed result to its original Wiktionary source', () => {
  const html = renderToStaticMarkup(React.createElement(DictionaryAttribution, { sourceUrl: 'https://en.wiktionary.org/wiki/eloquent' }));
  expect(html).toContain('href="https://en.wiktionary.org/wiki/eloquent"');
  expect(html).toContain('Original Wiktionary entry</a>');
});
