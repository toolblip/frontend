'use client';

import { useState } from 'react';

function parseIp(ip: string): number[] | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map(Number);
  if (nums.some(n => isNaN(n) || n < 0 || n > 255)) return null;
  return nums;
}

function ipToNumber(ip: number[]): number {
  return ((ip[0] || 0) << 24) | ((ip[1] || 0) << 16) | ((ip[2] || 0) << 8) | (ip[3] || 0);
}

function numberToIp(num: number): number[] {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255];
}

function calculateIpRange(startIp: string, endIp: string): { startIp: string; endIp: string; count: number; netmask: string; firstIp: string; lastIp: string } | null {
  const start = parseIp(startIp);
  const end = parseIp(endIp);
  if (!start || !end) return null;

  const startNum = ipToNumber(start);
  const endNum = ipToNumber(end);
  if (endNum < startNum) return null;

  const count = endNum - startNum + 1;
  const cidrBits = Math.ceil(Math.log2(count));
  const netmaskNum = cidrBits >= 32 ? 0xFFFFFFFF : (0xFFFFFFFF << (32 - cidrBits)) >>> 0;

  return {
    startIp,
    endIp,
    count,
    netmask: numberToIp(netmaskNum).join('.'),
    firstIp: startIp,
    lastIp: endIp
  };
}

export default function IpRangeCalculatorClient() {
  const [startIp, setStartIp] = useState('192.168.1.1');
  const [endIp, setEndIp] = useState('192.168.1.254');
  const [result, setResult] = useState<ReturnType<typeof calculateIpRange>>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const res = calculateIpRange(startIp, endIp);
    if (res) {
      setResult(res);
      setError('');
    } else {
      setResult(null);
      setError('Enter valid start and end IP addresses');
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--tb-border)' }}>
      <span style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>{label}</span>
      <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">IP Range</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        <input type="text" value={startIp} onChange={(e) => setStartIp(e.target.value)} placeholder="Start IP"
          className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} aria-label="Start IP" />
        <input type="text" value={endIp} onChange={(e) => setEndIp(e.target.value)} placeholder="End IP"
          className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} aria-label="End IP" />
      </div>
      <button type="button" onClick={calculate} className="tb-v2-copy-btn" style={{ width: '100%', marginTop: 12 }}>Calculate</button>
      
      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}
      
      {result && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}><span className="tb-v2-tool-label">Results</span></div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <InfoRow label="Start IP" value={result.startIp} />
            <InfoRow label="End IP" value={result.endIp} />
            <InfoRow label="IP Count" value={result.count.toLocaleString()} />
            <InfoRow label="Equivalent Netmask" value={result.netmask} />
          </div>
        </>
      )}
    </div>
  );
}
