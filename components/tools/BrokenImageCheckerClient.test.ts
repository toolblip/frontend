import { describe, expect, it } from 'vitest';
import {
  buildBrokenImageExtraction,
  canReadBrokenImageHtmlResponse,
  getBrokenImagePageFetchUrl,
  normalizeBrokenImagePageUrl,
  parseBrokenImageSrcset,
} from './BrokenImageCheckerClient';

describe('normalizeBrokenImagePageUrl', () => {
  it('accepts only absolute HTTP and HTTPS page URLs', () => {
    expect(normalizeBrokenImagePageUrl(' https://example.com/page ')).toEqual({
      ok: true,
      url: 'https://example.com/page',
    });
    expect(normalizeBrokenImagePageUrl('/samples/broken-image-checker.html')).toEqual({
      ok: false,
      error: 'Enter an absolute http:// or https:// page URL.',
    });
    expect(normalizeBrokenImagePageUrl('javascript:alert(1)')).toEqual({
      ok: false,
      error: 'Enter an absolute http:// or https:// page URL.',
    });
  });
});

describe('getBrokenImagePageFetchUrl', () => {
  it('fetches same-origin pages directly and cross-origin pages through the proxy', () => {
    expect(getBrokenImagePageFetchUrl('http://localhost:3000/samples/page.html', 'http://localhost:3000')).toBe('/samples/page.html');
    expect(getBrokenImagePageFetchUrl('https://example.com/page.html', 'http://localhost:3000')).toBe('/api/proxy?url=https%3A%2F%2Fexample.com%2Fpage.html');
  });
});

describe('buildBrokenImageExtraction', () => {
  it('resolves img attributes against the submitted page URL and base href', () => {
    expect(buildBrokenImageExtraction({
      pageUrl: 'https://example.com/posts/page.html',
      baseHref: '/assets/',
      sources: [
        { value: 'photo.jpg', source: 'src' },
        { value: '../lazy.png', source: 'data-src' },
        { value: 'small.jpg 480w, https://cdn.example.com/large.jpg 960w', source: 'srcset' },
        { value: 'javascript:alert(1)', source: 'src' },
        { value: 'photo.jpg', source: 'src' },
      ],
    })).toEqual({
      candidates: [
        { src: 'https://example.com/assets/photo.jpg', source: 'src' },
        { src: 'https://example.com/lazy.png', source: 'data-src' },
        { src: 'https://example.com/assets/small.jpg', source: 'srcset' },
        { src: 'https://cdn.example.com/large.jpg', source: 'srcset' },
      ],
      discoveredCount: 5,
      uniqueCount: 4,
      skippedCount: 1,
      capped: false,
    });
  });

  it('dedupes and caps checks at the first 20 unique HTTP image URLs', () => {
    const extracted = buildBrokenImageExtraction({
      pageUrl: 'https://example.com/page',
      sources: Array.from({ length: 25 }, (_, index) => ({ value: `/img-${index}.png`, source: 'src' as const })),
    });

    expect(extracted.candidates).toHaveLength(20);
    expect(extracted.candidates[0].src).toBe('https://example.com/img-0.png');
    expect(extracted.candidates[19].src).toBe('https://example.com/img-19.png');
    expect(extracted.discoveredCount).toBe(25);
    expect(extracted.uniqueCount).toBe(25);
    expect(extracted.skippedCount).toBe(0);
    expect(extracted.capped).toBe(true);
  });
});

describe('parseBrokenImageSrcset', () => {
  it('keeps common descriptors but skips data URL candidates with comma fragments', () => {
    expect(parseBrokenImageSrcset('small.jpg 480w, image@2x.jpg 2x, data:image/svg+xml,%3Csvg%3E 1x, https://cdn.example.com/large.jpg 960w')).toEqual([
      'small.jpg',
      'image@2x.jpg',
      'https://cdn.example.com/large.jpg',
    ]);
  });

  it('skips data URLs with fractional descriptors and keeps the next real URL', () => {
    expect(parseBrokenImageSrcset('data:image/png;base64,AAAA 1.5x, /photo.png 2x')).toEqual([
      '/photo.png',
    ]);
  });

  it('skips data URLs without descriptors and keeps the following comma-separated URL', () => {
    expect(parseBrokenImageSrcset('data:image/png;base64,AAAA, /photo.png 2x')).toEqual([
      '/photo.png',
    ]);
  });
});

describe('canReadBrokenImageHtmlResponse', () => {
  it('accepts HTML and XHTML content types and rejects non-HTML types', () => {
    expect(canReadBrokenImageHtmlResponse('text/html; charset=utf-8')).toBe(true);
    expect(canReadBrokenImageHtmlResponse('application/xhtml+xml')).toBe(true);
    expect(canReadBrokenImageHtmlResponse('application/json')).toBe(false);
  });
});
