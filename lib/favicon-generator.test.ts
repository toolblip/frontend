import { describe, expect, it } from 'vitest';
import {
  buildFaviconTextSvg,
  clampIcoExportSize,
  escapeSvgText,
  fitFaviconTextFontSize,
  getContainFit,
  normalizeFaviconText,
  parseFaviconSizeDraft,
} from '@/lib/favicon-generator';

describe('escapeSvgText', () => {
  it('escapes XML metacharacters before text is inserted into an SVG', () => {
    expect(escapeSvgText('A&B <tag> "quote" \'tick\'')).toBe(
      'A&amp;B &lt;tag&gt; &quot;quote&quot; &apos;tick&apos;',
    );
  });
});

describe('parseFaviconSizeDraft', () => {
  it('accepts finite integer dimensions from 16 through 512', () => {
    expect(parseFaviconSizeDraft('16')).toBe(16);
    expect(parseFaviconSizeDraft('256')).toBe(256);
    expect(parseFaviconSizeDraft('512')).toBe(512);
  });

  it('rejects drafts that cannot safely become canvas dimensions', () => {
    expect(parseFaviconSizeDraft('')).toBeNull();
    expect(parseFaviconSizeDraft('15')).toBeNull();
    expect(parseFaviconSizeDraft('513')).toBeNull();
    expect(parseFaviconSizeDraft('32.5')).toBeNull();
    expect(parseFaviconSizeDraft('Infinity')).toBeNull();
    expect(parseFaviconSizeDraft('32px')).toBeNull();
  });
});

describe('normalizeFaviconText', () => {
  it('keeps multi-codepoint graphemes intact while enforcing the visible glyph limit', () => {
    expect(normalizeFaviconText('👩🏽‍💻🚀A', 2)).toBe('👩🏽‍💻🚀');
    expect(normalizeFaviconText(' TBLIP ', 4)).toBe('TBLI');
  });
});

describe('getContainFit', () => {
  it('contains a wide logo inside the padded square without distorting it', () => {
    expect(getContainFit({ sourceWidth: 400, sourceHeight: 100, targetSize: 256, paddingPercent: 12 })).toEqual({
      x: 31,
      y: 104,
      width: 195,
      height: 49,
    });
  });

  it('returns null for impossible source dimensions or excessive padding', () => {
    expect(getContainFit({ sourceWidth: 0, sourceHeight: 100, targetSize: 256, paddingPercent: 12 })).toBeNull();
    expect(getContainFit({ sourceWidth: 100, sourceHeight: 100, targetSize: 256, paddingPercent: 50 })).toBeNull();
  });
});

describe('clampIcoExportSize', () => {
  it('caps ICO output at 256px while preserving smaller valid exports', () => {
    expect(clampIcoExportSize(32)).toBe(32);
    expect(clampIcoExportSize(512)).toBe(256);
  });
});

describe('fitFaviconTextFontSize', () => {
  it('shrinks text font size until the padded icon width can contain it', () => {
    const widths: number[] = [];
    const fontSize = fitFaviconTextFontSize({
      mode: 'text',
      text: 'WIDE',
      size: 100,
      padding: 20,
      measureText: (font) => {
        const size = Number(font.match(/(\d+(?:\.\d+)?)px/)?.[1]);
        widths.push(size * 2);
        return size * 2;
      },
    });

    expect(widths[0]).toBe(96);
    expect(fontSize).toBeLessThanOrEqual(60);
    expect(fontSize).toBeGreaterThan(28);
  });
});

describe('buildFaviconTextSvg', () => {
  it('escapes quoted font-family attributes and XML metacharacters with the fitted font size', () => {
    const svg = buildFaviconTextSvg({
      mode: 'text',
      text: 'A&B<',
      size: 64,
      padding: 18,
      background: '#111827',
      foreground: '#ffffff',
      transparent: false,
      fontSize: 22.5,
    });

    expect(svg).toContain('font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, sans-serif"');
    expect(svg).toContain('font-size="22.5"');
    expect(svg).toContain('A&amp;B&lt;');
    expect(svg).not.toContain('font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI"');
  });
});
