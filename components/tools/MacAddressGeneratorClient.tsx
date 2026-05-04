'use client';

import { useState, useCallback } from 'react';

function randomHexPair(): string {
  return Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
}

function generateMAC(format: 'XX:XX:XX:XX:XX:XX' | 'XX-XX-XX-XX-XX-XX' | 'XXXXXXXXXXXX'): string {
  const pairs = Array.from({ length: 6 }, () => randomHexPair());
  if (format === 'XXXXXXXXXXXX') return pairs.join('');
  if (format === 'XX-XX-XX-XX-XX-XX') return pairs.join('-');
  return pairs.join(':');
}

export default function MacAddressGeneratorClient() {
  const [format, setFormat] = useState<'XX:XX:XX:XX:XX:XX' | 'XX-XX-XX-XX-XX-XX' | 'XXXXXXXXXXXX'>('XX:XX:XX:XX:XX:XX');
  const [count, setCount] = useState('5');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const cnt = Math.min(parseInt(count) || 5, 100);
    const addrs: string[] = [];
    for (let i = 0; i < cnt; i++) addrs.push(generateMAC(format));
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
          aria-label="MAC format"
        >
          <option value="XX:XX:XX:XX:XX:XX">XX:XX:XX:XX:XX:XX</option>
          <option value="XX-XX-XX-XX-XX-XX">XX-XX-XX-XX-XX-XX</option>
          <option value="XXXXXXXXXXXX">XXXXXXXXXXXX</option>
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
            <span className="tb-v2-tool-label">MAC Addresses</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, lineHeight: 1.8 }}>
              {addresses.map((a, i) => <div key={i}>{a}</div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
