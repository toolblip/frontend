// --- RFC 3492 Punycode implementation ---
const BASE = 36;
const T_MIN = 1;
const T_MAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIMITER = '-';

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  let d = firstTime ? Math.floor(delta / DAMP) : Math.floor(delta / 2);
  d += Math.floor(d / numPoints);
  let k = 0;
  while (d > Math.floor(((BASE - T_MIN) * T_MAX) / 2)) {
    d = Math.floor(d / (BASE - T_MIN));
    k += BASE;
  }
  return Math.floor(k + ((BASE - T_MIN + 1) * d) / (d + SKEW));
}

function digitToBasic(digit: number): number {
  // 0..25 -> a..z (97..122), 26..35 -> 0..9 (48..57)
  return digit + 22 + (digit < 26 ? 75 : 0);
}

function basicToDigit(codePoint: number): number {
  if (codePoint >= 0x30 && codePoint <= 0x39) return codePoint - 0x30 + 26;
  if (codePoint >= 0x41 && codePoint <= 0x5a) return codePoint - 0x41;
  if (codePoint >= 0x61 && codePoint <= 0x7a) return codePoint - 0x61;
  return BASE;
}

export function punycodeEncode(input: string): string {
  const codePoints = Array.from(input).map((c) => c.codePointAt(0) as number);
  const output: string[] = [];

  const basicPoints = codePoints.filter((cp) => cp < 0x80);
  basicPoints.forEach((cp) => output.push(String.fromCodePoint(cp)));
  const b = basicPoints.length;
  let h = b;
  if (b > 0) output.push(DELIMITER);

  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;

  while (h < codePoints.length) {
    let m = Infinity;
    for (const cp of codePoints) {
      if (cp >= n && cp < m) m = cp;
    }
    delta += (m - n) * (h + 1);
    n = m;

    for (const cp of codePoints) {
      if (cp < n) delta++;
      if (cp === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? T_MIN : k >= bias + T_MAX ? T_MAX : k - bias;
          if (q < t) break;
          output.push(String.fromCodePoint(digitToBasic(t + ((q - t) % (BASE - t)))));
          q = Math.floor((q - t) / (BASE - t));
        }
        output.push(String.fromCodePoint(digitToBasic(q)));
        bias = adapt(delta, h + 1, h === b);
        delta = 0;
        h++;
      }
    }
    delta++;
    n++;
  }

  return output.join('');
}

export function punycodeDecode(input: string): string {
  const output: number[] = [];
  let n = INITIAL_N;
  let i = 0;
  let bias = INITIAL_BIAS;

  const lastDelim = input.lastIndexOf(DELIMITER);
  const basicLen = lastDelim > 0 ? lastDelim : 0;

  for (let j = 0; j < basicLen; j++) {
    const cp = input.charCodeAt(j);
    if (cp >= 0x80) throw new Error('Invalid Punycode input: non-ASCII character before delimiter');
    output.push(cp);
  }

  let index = basicLen > 0 ? basicLen + 1 : 0;

  while (index < input.length) {
    const oldI = i;
    let w = 1;
    for (let k = BASE; ; k += BASE) {
      if (index >= input.length) throw new Error('Invalid Punycode input: unexpected end of string');
      const digit = basicToDigit(input.charCodeAt(index++));
      if (digit >= BASE) throw new Error('Invalid Punycode input: bad digit');
      i += digit * w;
      const t = k <= bias ? T_MIN : k >= bias + T_MAX ? T_MAX : k - bias;
      if (digit < t) break;
      w *= BASE - t;
    }
    bias = adapt(i - oldI, output.length + 1, oldI === 0);
    n += Math.floor(i / (output.length + 1));
    i %= output.length + 1;
    output.splice(i, 0, n);
    i++;
  }

  return output.map((cp) => String.fromCodePoint(cp)).join('');
}

// --- IDNA-ish domain conversion helpers built on top of the codec above ---

export const IDNA_SEPARATORS = /[.。．｡]/;

const ASCII_ONLY = /^[\x00-\x7F]*$/;
const XN_PREFIX = /^xn--/i;
const EMAIL_SHAPE = /^[^@\s]+@[^@\s]+$/;

export function toASCII(domain: string): string {
  const normalized = domain.normalize('NFC').toLowerCase();
  const labels = normalized.split(IDNA_SEPARATORS);
  const converted = labels.map((label) => {
    if (ASCII_ONLY.test(label)) return label;
    return 'xn--' + punycodeEncode(label);
  });
  return converted.join('.');
}

export function toUnicode(domain: string): string {
  const labels = domain.split('.');
  const converted = labels.map((label) => {
    if (!XN_PREFIX.test(label)) return label;
    const payload = label.slice(4);
    if (payload === '') {
      throw new Error(`Invalid Punycode label: ${label}`);
    }
    const decoded = punycodeDecode(payload.toLowerCase());
    const reEncoded = punycodeEncode(decoded);
    if (reEncoded.toLowerCase() !== payload.toLowerCase()) {
      throw new Error(`Invalid Punycode label: ${label}`);
    }
    return decoded;
  });
  return converted.join('.');
}

interface DomainSpan {
  prefix: string;
  domain: string;
  suffix: string;
}

function locateDomain(line: string): DomainSpan {
  if (line.includes('://')) {
    const match = line.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/)([^/?#]*)([\s\S]*)$/);
    if (match) {
      try {
        // Validate the line actually parses as a URL. We never read fields back
        // off this object — new URL() auto-applies IDNA ToASCII to the hostname
        // on parse, and the .hostname setter/`.toString()` do so again on write,
        // which would silently defeat the toUnicode direction and percent-encode
        // the path. We only use it here to confirm URL-shape, then do the actual
        // host substitution via plain string slicing below.
        new URL(line);
        const [, scheme, authority, rest] = match;
        const atIndex = authority.lastIndexOf('@');
        const userinfo = atIndex >= 0 ? authority.slice(0, atIndex + 1) : '';
        const hostport = atIndex >= 0 ? authority.slice(atIndex + 1) : authority;
        const colonIndex = hostport.lastIndexOf(':');
        const host = colonIndex >= 0 ? hostport.slice(0, colonIndex) : hostport;
        const port = colonIndex >= 0 ? hostport.slice(colonIndex) : '';
        return { prefix: scheme + userinfo, domain: host, suffix: port + rest };
      } catch {
        // Not actually a valid URL despite the "://" — fall through, treat the
        // whole line as a bare domain.
      }
    }
  } else if (EMAIL_SHAPE.test(line)) {
    const atIndex = line.indexOf('@');
    return { prefix: line.slice(0, atIndex + 1), domain: line.slice(atIndex + 1), suffix: '' };
  }
  return { prefix: '', domain: line, suffix: '' };
}

export function convertLine(line: string, direction: 'toASCII' | 'toUnicode'): string {
  const convert = direction === 'toASCII' ? toASCII : toUnicode;
  const { prefix, domain, suffix } = locateDomain(line);
  return prefix + convert(domain) + suffix;
}

export function extractDomain(line: string): string {
  return locateDomain(line).domain;
}

export function analyse(domain: string): string[] {
  const warnings: string[] = [];
  const labels = domain.split(IDNA_SEPARATORS);
  const encoder = new TextEncoder();

  try {
    const asciiDomain = toASCII(domain);
    if (encoder.encode(asciiDomain).length > 253) {
      warnings.push(`Domain "${domain}" exceeds 253 bytes when encoded.`);
    }
  } catch {
    // Doesn't encode cleanly — the length check doesn't apply here.
  }

  for (const label of labels) {
    if (label === '') {
      warnings.push('Domain contains an empty label (leading, trailing, or repeated separator).');
      continue;
    }

    try {
      const asciiLabel = toASCII(label);
      if (encoder.encode(asciiLabel).length > 63) {
        warnings.push(`Label "${label}" exceeds 63 bytes when encoded.`);
      }
    } catch {
      // Doesn't encode cleanly — the length check doesn't apply here.
    }

    const hasLatin = /\p{Script=Latin}/u.test(label);
    const hasCyrillic = /\p{Script=Cyrillic}/u.test(label);
    const hasGreek = /\p{Script=Greek}/u.test(label);
    if (hasLatin && (hasCyrillic || hasGreek)) {
      const mixed = [hasCyrillic ? 'Cyrillic' : null, hasGreek ? 'Greek' : null]
        .filter(Boolean)
        .join(' and ');
      warnings.push(`Label "${label}" mixes Latin with ${mixed} script — possible homograph attack.`);
    }
  }

  try {
    const url = new URL('http://' + domain);
    const asciiForm = toASCII(domain);
    if (url.hostname !== asciiForm) {
      warnings.push(
        `Domain "${domain}" disagrees with URL-parser hostname "${url.hostname}" — possible encoding edge case.`
      );
    }
  } catch {
    // domain doesn't parse as a hostname at all — not every analyse() input is one, skip silently.
  }

  return warnings;
}
