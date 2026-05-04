'use client';

import { useState } from 'react';

function generateIPv4(): string {
  const octets = [
    Math.floor(Math.random() * 223) + (Math.random() > 0.5 ? 1 : 0),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
  return octets.join('.');
}

function generateIPv6(): string {
  const hex = () => Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
  const groups = Array.from({ length: 8 }, hex);
  const shortcuts = [4, 6];
  if (shortcuts.includes(4) && Math.random() > 0.3) {
    const pos = Math.floor(Math.random() * 6) + 1;
    if (groups[pos] === '0000' && groups[pos + 1] === '0000') {
      groups.splice(pos, 2, '');
    }
  }
  return groups.join(':').replace(/:{2,}/g, '::').replace(/^::/, '::').replace(/::$/, '::') || '::';
}

export default function RandomIpAddressClient() {
  const [type, setType] = useState<'v4' | 'v6'>('v4');
  const [count, setCount] = useState(5);
  const [addresses, setAddresses] = useState<string[]>([]);

  const generate = () => {
    const ips: string[] = [];
    for (let i = 0; i < count; i++) {
      ips.push(type === 'v4' ? generateIPv4() : generateIPv6());
    }
    setAddresses(ips);
  };

  const copy = () => {
    if (!addresses.length) return;
    navigator.clipboard.writeText(addresses.join('\n')).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Options</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="tb-v2-mode-tabs" role="group">
            <button type="button" onClick={() => setType('v4')} className={`tb-v2-mode-tab ${type === 'v4' ? 'on' : ''}`}>IPv4</button>
            <button type="button" onClick={() => setType('v6')} className={`tb-v2-mode-tab ${type === 'v6' ? 'on' : ''}`}>IPv6</button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>Count</span>
            <input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} className="tb-v2-tool-textarea" style={{ width: 70, minHeight: 32, resize: 'none', textAlign: 'center' }} min={1} max={100} />
          </label>
        </div>
        <button onClick={generate} className="tb-v2-btn-primary">Generate {type === 'v4' ? 'IPv4' : 'IPv6'} Addresses</button>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Generated</span>
        {addresses.length > 0 && <button type="button" onClick={copy} className="tb-v2-copy-btn">Copy All</button>}
      </div>
      <div className="tb-v2-tool-output-body">
        {addresses.length > 0 ? (
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {addresses.map((ip, i) => <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--tb-border)' }}>{ip}</div>)}
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Click Generate to create random IP addresses</div>
        )}
      </div>
    </div>
  );
}
