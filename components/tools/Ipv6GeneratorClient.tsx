'use client';

import { useState, useCallback } from 'react';

function randomHex(len: number): string {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateIPv6(format: 'full' | 'compressed' | 'eui64'): string {
  const groups = Array.from({ length: 8 }, () => randomHex(4));
  if (format === 'eui64') {
    groups[7] = generateEUI64(groups.slice(0, 6).join(':'));
    return groups.join(':');
  }
  const addr = groups.join(':');
  if (format === 'compressed') {
    return addr.replace(/(^|:)0(:0)*(:|$)/, '::').replace(/(^|:)0(:|$)/, ':').replace(/^:::/, '::');
  }
  return addr;
}

function generateEUI64(prefix: string): string {
  const mac = Array.from({ length: 6 }, () => randomHex(2)).join(':');
  const parts = mac.split(':').map(p => parseInt(p, 16));
  parts[0] ^= 0x02;
  const u = ((parts[0] << 8) | parts[1]).toString(16).padStart(4, '0');
  const l = ((parts[2] << 8) | parts[3]).toString(16).padStart(4, '0');
  const n = ((parts[4] << 8) | parts[5]).toString(16).padStart(4, '0');
  return `${u}:${l}:${n}`;
}

export default function Ipv6GeneratorClient() {
  const [format, setFormat] = useState<'full' | 'compressed' | 'eui64'>('compressed');
  const [count, setCount] = useState('5');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const cnt = Math.min(parseInt(count) || 5, 100);
    const addrs: string[] = [];
    for (let i = 0; i < cnt; i++) addrs.push(generateIPv6(format));
    setAddresses(addrs);
  }, [format, count]);

  const copy = () => {
    navigator.clipboard.writeText(addresses.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Options</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as typeof format)}
          className="tb-v2-tool-select"
          aria-label="IPv6 format"
        >
          <option value="compressed">Compressed</option>
          <option value="full">Full</option>
          <option value="eui64">EUI-64</option>
        </select>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          min="1"
          max="100"
          className="tb-v2-tool-input"
          style={{ width: 80 }}
          aria-label="Count"
        />
        <button type="button" onClick={generate} className="tb-v2-primary-btn" style={{ flex: 1 }}>
          Generate
        </button>
      </div>

      {addresses.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">IPv6 Addresses</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, lineHeight: 1.8, wordBreak: 'break-all' }}>
              {addresses.map((a, i) => <div key={i}>{a}</div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
