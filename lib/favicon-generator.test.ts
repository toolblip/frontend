import { describe, expect, it } from 'vitest';
import { escapeSvgText, parseFaviconSizeDraft } from '@/lib/favicon-generator';

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
