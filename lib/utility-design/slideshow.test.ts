import React from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import SlideshowGeneratorClient from '@/components/tools/SlideshowGeneratorClient';

afterEach(() => vi.unstubAllGlobals());

it('starts each server-rendered slideshow with the same initial slide titles', () => {
  // The local test transform uses classic JSX; production Next uses automatic JSX.
  vi.stubGlobal('React', React);
  const firstRequest = renderToString(React.createElement(SlideshowGeneratorClient));
  const secondRequest = renderToString(React.createElement(SlideshowGeneratorClient));
  expect(firstRequest).toContain('value="Slide 1"');
  expect(secondRequest).toContain('value="Slide 1"');
  expect(secondRequest).toEqual(firstRequest);
});
