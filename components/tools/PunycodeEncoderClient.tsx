'use client';

import { useMemo, useState } from 'react';

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

function punycodeEncode(input: string): string {
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

function punycodeDecode(input: string): string {
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

function isAscii(s: string): boolean {
  return /^[\x00-\x7F]*$/.test(s);
}

function domainToAscii(domain: string): string {
  return domain
    .split('.')
    .map((label) => {
      if (!label || isAscii(label)) return label;
      return 'xn--' + punycodeEncode(label);
    })
    .join('.');
}

function domainToUnicode(domain: string): string {
  return domain
    .split('.')
    .map((label) => {
      if (!/^xn--/i.test(label)) return label;
      return punycodeDecode(label.slice(4));
    })
    .join('.');
}

type Mode = 'encode' | 'decode';
type Form = 'raw' | 'domain';

export default function PunycodeEncoderClient() {
  const [mode, setMode] = useState<Mode>('encode');
  const [form, setForm] = useState<Form>('domain');
  const [input, setInput] = useState('münchen.de');
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null };
    try {
      if (form === 'domain') {
        return { output: mode === 'encode' ? domainToAscii(input.trim()) : domainToUnicode(input.trim()), error: null };
      }
      return { output: mode === 'encode' ? punycodeEncode(input) : punycodeDecode(input), error: null };
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : String(e) };
    }
  }, [input, mode, form]);

  const loadExample = () => {
    setForm('domain');
    setMode('encode');
    setInput('münchen.de');
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{form === 'domain' ? 'Domain Name' : 'Raw Text / Label'}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="tb-v2-mode-tabs" role="group" aria-label="Form">
            <button type="button" onClick={() => setForm('domain')} className={`tb-v2-mode-tab ${form === 'domain' ? 'on' : ''}`} aria-pressed={form === 'domain'}>Domain</button>
            <button type="button" onClick={() => setForm('raw')} className={`tb-v2-mode-tab ${form === 'raw' ? 'on' : ''}`} aria-pressed={form === 'raw'}>Raw</button>
          </div>
          <div className="tb-v2-mode-tabs" role="group" aria-label="Mode">
            <button type="button" onClick={() => setMode('encode')} className={`tb-v2-mode-tab ${mode === 'encode' ? 'on' : ''}`} aria-pressed={mode === 'encode'}>Encode</button>
            <button type="button" onClick={() => setMode('decode')} className={`tb-v2-mode-tab ${mode === 'decode' ? 'on' : ''}`} aria-pressed={mode === 'decode'}>Decode</button>
          </div>
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
        </div>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          form === 'domain'
            ? mode === 'encode'
              ? 'e.g. münchen.de'
              : 'e.g. xn--mnchen-3ya.de'
            : mode === 'encode'
              ? 'e.g. münchen'
              : 'e.g. mnchen-3ya'
        }
        className="tb-v2-input"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'ASCII / Punycode Output' : 'Unicode Output'}</span>
        <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error">{error}</p>
        ) : !output ? (
          <p className="tb-v2-empty">Enter a value above to convert it.</p>
        ) : (
          <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{output}</pre>
        )}
      </div>
    </div>
  );
}
