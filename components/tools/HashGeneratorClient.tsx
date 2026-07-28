'use client';

import { useState } from 'react';

type Algo = 'md5' | 'sha1' | 'sha256';

function toHexLE(n: number): string {
  let hex = '';
  for (let i = 0; i < 4; i++) {
    hex += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
  }
  return hex;
}

function rotl(x: number, c: number): number {
  return (x << c) | (x >>> (32 - c));
}

// Standard MD5 (RFC 1321). Web Crypto's SubtleCrypto has no MD5 digest, so it's
// implemented directly here rather than faking output with a hex byte dump.
function md5(message: string): string {
  const K = new Int32Array([
    -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426, -1473231341, -45705983,
    1770035416, -1958414417, -42063, -1990404162, 1804603682, -40341101, -1502002290, 1236535329,
    -165796510, -1069501632, 643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
    568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784, 1735328473, -1926607734,
    -378558, -2022574463, 1839030562, -35309556, -1530992060, 1272893353, -155497632, -1094730640,
    681279174, -358537222, -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
    -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606, -1051523, -2054922799,
    1873313359, -30611744, -1560198380, 1309151649, -145523070, -1120210379, 718787259, -343485551,
  ]);
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const bytes = Array.from(new TextEncoder().encode(message));
  const originalBitLength = bytes.length * 8;

  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);

  const lenLow = originalBitLength >>> 0;
  const lenHigh = Math.floor(originalBitLength / 0x100000000) >>> 0;
  for (let i = 0; i < 4; i++) bytes.push((lenLow >>> (i * 8)) & 0xff);
  for (let i = 0; i < 4; i++) bytes.push((lenHigh >>> (i * 8)) & 0xff);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89 | 0;
  let c0 = 0x98badcfe | 0;
  let d0 = 0x10325476;

  for (let chunkStart = 0; chunkStart < bytes.length; chunkStart += 64) {
    const M = new Int32Array(16);
    for (let i = 0; i < 16; i++) {
      const o = chunkStart + i * 4;
      M[i] = bytes[o] | (bytes[o + 1] << 8) | (bytes[o + 2] << 16) | (bytes[o + 3] << 24);
    }

    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(F, S[i])) | 0;
    }

    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }

  return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);
}

async function hash(algo: Algo, input: string): Promise<string> {
  if (algo === 'md5') return md5(input);
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest(algo === 'sha1' ? 'SHA-1' : 'SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState<Algo>('sha256');
  const [output, setOutput] = useState('');
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState(false);

  const compute = () => {
    if (!input) { setOutput(''); return; }
    hash(algo, input).then(h => setOutput(uppercase ? h.toUpperCase() : h));
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Text to hash..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {(['md5', 'sha1', 'sha256'] as Algo[]).map(a => (
          <button key={a} onClick={() => setAlgo(a)} className={`tb-v2-mode-tab ${algo === a ? 'on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}>{a.toUpperCase()}</button>
        ))}
        <button onClick={() => setUppercase(v => !v)} className={`tb-v2-mode-tab ${uppercase ? 'on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}>UPPER</button>
      </div>
      <button onClick={compute} className="tb-v2-btn-primary" style={{ marginTop: 10 }}>Generate Hash</button>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{algo.toUpperCase()} Hash</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, wordBreak: 'break-all' }}>{output || ' - '}</code>
      </div>
    </div>
  );
}
