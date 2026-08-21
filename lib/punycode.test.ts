import { describe, it, expect } from 'vitest';
import { toASCII, toUnicode, convertLine, analyse, extractDomain } from '@/lib/punycode';

describe('toASCII / toUnicode round trip', () => {
  const vectors: Array<{ unicode: string; punycode: string }> = [
    { unicode: 'হারুন', punycode: 'xn--85bp0auq' },
    { unicode: 'হারুন.বাংলা', punycode: 'xn--85bp0auq.xn--54b7fta0cc' },
    { unicode: '🇧🇪.ws', punycode: 'xn--f77hga.ws' },
    { unicode: 'münchen.de', punycode: 'xn--mnchen-3ya.de' },
    { unicode: '點看', punycode: 'xn--c1yn36f' },
    { unicode: 'россия.рф', punycode: 'xn--h1alffa9f.xn--p1ai' },
    { unicode: '日本語.jp', punycode: 'xn--wgv71a119e.jp' },
  ];

  describe.each(vectors)('$unicode <-> $punycode', ({ unicode, punycode }) => {
    it(`toASCII(${JSON.stringify(unicode)}) === ${JSON.stringify(punycode)}`, () => {
      expect(toASCII(unicode)).toBe(punycode);
    });

    it(`toUnicode(${JSON.stringify(punycode)}) === ${JSON.stringify(unicode)}`, () => {
      expect(toUnicode(punycode)).toBe(unicode);
    });
  });
});

describe('toASCII preprocessing', () => {
  it('case-folds uppercase input', () => {
    expect(toASCII('MÜNCHEN.DE')).toBe('xn--mnchen-3ya.de');
  });

  it('NFC-composes decomposed combining marks before encoding', () => {
    // 'a' + U+0308 COMBINING DIAERESIS NFC-composes to 'ä'.
    const input = 'ex' + 'a' + '̈' + 'mple.com';
    expect(toASCII(input)).toBe('xn--exmple-cua.com');
  });

  it('treats the fullwidth full stop (U+FF0E) as a label separator', () => {
    expect(toASCII('münchen．de')).toBe('xn--mnchen-3ya.de');
  });
});

describe('toUnicode malformed-input rejection', () => {
  it('throws on a bad Punycode digit sequence', () => {
    expect(() => toUnicode('xn--zzzz')).toThrow();
  });

  it('throws on an empty payload after the xn-- prefix', () => {
    expect(() => toUnicode('xn--')).toThrow();
  });
});

describe('convertLine dispatch', () => {
  it('converts the domain portion of an email address', () => {
    expect(convertLine('user@münchen.de', 'toASCII')).toBe('user@xn--mnchen-3ya.de');
  });
});

describe('analyse homograph warning', () => {
  it('flags a mixed Latin/Cyrillic label', () => {
    expect(analyse('paypal-раypal.com').length).toBeGreaterThan(0);
  });
});

describe('convertLine with URLs', () => {
  it('round-trips a URL in both directions, preserving a non-ASCII path verbatim', () => {
    const unicodeUrl = 'https://münchen.de/straße';
    const asciiUrl = 'https://xn--mnchen-3ya.de/straße';
    expect(convertLine(unicodeUrl, 'toASCII')).toBe(asciiUrl);
    expect(convertLine(asciiUrl, 'toUnicode')).toBe(unicodeUrl);
  });
});

describe('analyse with extractDomain', () => {
  it('does not warn on a URL-shaped line', () => {
    const domain = extractDomain('https://münchen.de/straße');
    expect(domain).toBe('münchen.de');
    expect(analyse(domain)).toEqual([]);
  });

  it('does not warn on an email-shaped line', () => {
    const domain = extractDomain('harun@হারুন.বাংলা');
    expect(domain).toBe('হারুন.বাংলা');
    expect(analyse(domain)).toEqual([]);
  });

  // Regression test: analyse() compares toASCII()'s output against
  // new URL('http://' + domain).hostname to catch real encoding bugs, but
  // the browser's IDNA mapping silently drops "default ignorable"
  // codepoints (emoji variation selectors, ZWJ) before encoding, which
  // toASCII() doesn't - so a plain emoji using one of these isn't a real
  // divergence and shouldn't warn. (U+2708 airplane + U+FE0F selector.)
  it('does not warn about a variation-selector emoji disagreeing with the browser URL parser', () => {
    expect(analyse('✈️')).toEqual([]);
  });

  // Regression test for the opposite failure mode: don't let silencing the
  // emoji false-positive above turn into silencing every disagreement.
  // toASCII()'s NFC+toLowerCase() maps Cherokee uppercase syllabics to the
  // Cherokee Supplement lowercase block, which real IDNA/UTS-46 mapping
  // does not do - the two encoders produce genuinely different domains, and
  // that's exactly the class of bug this warning exists to catch.
  it('still warns when toASCII genuinely disagrees with the browser (Cherokee case-folding)', () => {
    const warnings = analyse('ᏔᏬᎵᎵ.com');
    expect(warnings.some((w) => w.includes("disagrees with the browser's own IDNA encoding"))).toBe(true);
  });
});
