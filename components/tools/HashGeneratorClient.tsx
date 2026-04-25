'use client';

import { useEffect, useState } from 'react';

// ─── Pure-JS MD5 (RFC 1321) ─────────────────────────────────────────────────

function safeAdd(x: number, y: number): number {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

function rotl(n: number, s: number): number {
  return (n << s) | (n >>> (32 - s));
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  return safeAdd(rotl(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

function md5cycle(x: number[], k: number[]): number[] {
  let [a, b, c, d] = x;
  a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
  a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
  a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
  a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
  return [safeAdd(a, x[0]), safeAdd(b, x[1]), safeAdd(c, x[2]), safeAdd(d, x[3])];
}

function md5blk(s: string): number[] {
  const md5blks: number[] = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

function md5(str: string): string {
  // Convert to UTF-8 bytes as a binary string for correct multi-byte hashing.
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);

  const n = bin.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;
  for (i = 64; i <= n; i += 64) {
    state = md5cycle(state, md5blk(bin.slice(i - 64, i)));
  }
  const tail = bin.slice(i - 64);
  const length16 = tail.length;
  const tmp: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let j = 0; j < length16; j++) {
    tmp[j >> 2] |= tail.charCodeAt(j) << ((j % 4) << 3);
  }
  tmp[length16 >> 2] |= 0x80 << ((length16 % 4) << 3);
  if (length16 > 55) {
    state = md5cycle(state, tmp);
    tmp.fill(0);
  }
  tmp[14] = n * 8;
  state = md5cycle(state, tmp);
  return state.map(v => {
    const hex = (v < 0 ? v + 4294967296 : v).toString(16).padStart(8, '0');
    return hex.match(/../g)!.map(b => b[1] + b[0]).join('');
  }).join('');
}

// ─── Web Crypto SHA ──────────────────────────────────────────────────────────

async function shaHash(algorithm: string, input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Component ───────────────────────────────────────────────────────────────

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';
const ALGORITHMS: Algorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

export default function HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({
    'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '',
  });
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState<Algorithm | null>(null);

  useEffect(() => {
    let alive = true;
    if (!input) {
      setHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' });
      return;
    }
    Promise.all([
      shaHash('SHA-1', input),
      shaHash('SHA-256', input),
      shaHash('SHA-512', input),
    ]).then(([sha1, sha256, sha512]) => {
      if (!alive) return;
      setHashes({
        'MD5': md5(input),
        'SHA-1': sha1,
        'SHA-256': sha256,
        'SHA-512': sha512,
      });
    });
    return () => { alive = false; };
  }, [input]);

  const fmt = (h: string) => (uppercase ? h.toUpperCase() : h);

  const copy = (algo: Algorithm) => {
    const h = fmt(hashes[algo]);
    if (!h) return;
    navigator.clipboard.writeText(h).catch(() => {});
    setCopied(algo);
    setTimeout(() => setCopied(null), 1500);
  };

  const byteLen = input ? new TextEncoder().encode(input).length : 0;

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <button
          type="button"
          onClick={() => setUppercase((v) => !v)}
          className={`tb-v2-mode-tab ${uppercase ? 'on' : ''}`}
          aria-pressed={uppercase}
        >
          UPPERCASE
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to hash..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Hash input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Hashes</span>
        {input && (
          <span className="tb-v2-hash-stats">
            {input.length} char{input.length !== 1 ? 's' : ''} · {byteLen} byte{byteLen !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ALGORITHMS.map((algo) => {
          const h = fmt(hashes[algo]);
          return (
            <div key={algo} className="tb-v2-hash-row">
              <span className="tb-v2-hash-algo">{algo}</span>
              <code className="tb-v2-hash-val">{h || '—'}</code>
              <button
                type="button"
                onClick={() => copy(algo)}
                disabled={!h}
                className={`tb-v2-copy-btn ${copied === algo ? 'done' : ''}`}
                aria-label={`Copy ${algo}`}
              >
                {copied === algo ? 'Copied' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
