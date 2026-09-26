'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useCallback } from 'react';
import { ipv6 } from '@/lib/utility-design/core';

function generateIPv6(format: string) { return ipv6(format, crypto.getRandomValues(new Uint8Array(16))); }

export default function Ipv6GeneratorClient() {
  const [format, setFormat] = useState<'full' | 'compressed' | 'eui64'>('compressed');
  const [count, setCount] = useState('5');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const cnt = Math.max(1, Math.min(Math.trunc(Number(count)) || 1, 100));
    const addrs: string[] = [];
    for (let i = 0; i < cnt; i++) addrs.push(generateIPv6(format));
    setAddresses(addrs);
  }, [format, count]);

  const copy = () => {
    navigator.clipboard.writeText(addresses.join('\n')).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  return (<UtilityDesignLayout>
    <div onChangeCapture={() => { setAddresses([]); }}>
      <ToolExampleClearActions onExample={() => { setFormat('eui64'); setCount('3'); setAddresses([]); }} onClear={() => { setCount('5'); setAddresses([]); setCopied(false); }}/>
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
  </UtilityDesignLayout>
  );
}
