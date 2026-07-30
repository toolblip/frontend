'use client';

import { useState } from 'react';

function parseIp(ip: string): number[] {
  return ip.split('.').map(Number);
}

function ipToNumber(ip: number[]): number {
  return ((ip[0] || 0) << 24) | ((ip[1] || 0) << 16) | ((ip[2] || 0) << 8) | (ip[3] || 0);
}

function numberToIp(num: number): number[] {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255];
}

function calculateCidr(cidr: string): { network: string; firstHost: string; lastHost: string; broadcast: string; totalHosts: number; subnetMask: string; wildcard: string } | null {
  const parts = cidr.split('/');
  if (parts.length !== 2) return null;

  const ip = parseIp(parts[0]);
  if (ip.length !== 4 || ip.some(o => isNaN(o) || o < 0 || o > 255)) return null;

  const prefix = parseInt(parts[1]);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;

  const ipNum = ipToNumber(ip);
  const mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  const wildcardMask = (~mask) >>> 0;

  const networkNum = (ipNum & mask) >>> 0;
  const broadcastNum = (networkNum | wildcardMask) >>> 0;
  const totalHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.pow(2, 32 - prefix) - 2;

  return {
    network: numberToIp(networkNum).join('.'),
    firstHost: prefix >= 31 ? networkNum === broadcastNum ? 'N/A' : numberToIp(networkNum + 1).join('.') : numberToIp(networkNum + 1).join('.'),
    lastHost: prefix >= 31 ? networkNum === broadcastNum ? 'N/A' : numberToIp(broadcastNum - 1).join('.') : numberToIp(broadcastNum - 1).join('.'),
    broadcast: numberToIp(broadcastNum).join('.'),
    totalHosts: Math.max(0, totalHosts),
    subnetMask: numberToIp(mask >>> 0).join('.'),
    wildcard: numberToIp(wildcardMask).join('.')
  };
}

export default function CidrCalculatorClient() {
  const [cidr, setCidr] = useState('192.168.1.0/24');
  const [result, setResult] = useState<ReturnType<typeof calculateCidr>>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const res = calculateCidr(cidr);
    if (res) {
      setResult(res);
      setError('');
    } else {
      setResult(null);
      setError('Enter a valid CIDR (e.g., 192.168.1.0/24)');
    }
  };

  const loadExample = () => {
    setCidr('10.0.0.0/16');
    setResult(null);
    setError('');
  };

  const copySummary = () => {
    if (!result) return;
    const text = [
      `Network Address: ${result.network}`,
      `Subnet Mask: ${result.subnetMask}`,
      `Wildcard Mask: ${result.wildcard}`,
      `Broadcast Address: ${result.broadcast}`,
      `First Host: ${result.firstHost}`,
      `Last Host: ${result.lastHost}`,
      `Total Usable Hosts: ${result.totalHosts.toLocaleString()}`,
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--tb-border)', alignItems: 'center' }}>
      <span style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>{label}</span>
      <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CIDR Notation</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input type="text" value={cidr} onChange={(e) => setCidr(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calculate()} placeholder="192.168.1.0/24"
          className="tb-v2-input" style={{ flex: 1, fontFamily: 'var(--f-mono)' }} aria-label="CIDR input" />
        <button type="button" onClick={calculate} className="tb-v2-btn tb-v2-btn-primary">Calculate</button>
      </div>
      {error && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 13 }}>{error}</div>}

      {!result && !error && (
        <p className="tb-v2-empty" style={{ marginTop: 16 }}>
          Enter a CIDR block above to calculate its network address, subnet mask, and usable host range.
        </p>
      )}

      {result && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Results</span>
            <button type="button" onClick={copySummary} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <InfoRow label="Network Address" value={result.network} />
            <InfoRow label="Subnet Mask" value={result.subnetMask} />
            <InfoRow label="Wildcard Mask" value={result.wildcard} />
            <InfoRow label="Broadcast Address" value={result.broadcast} />
            <InfoRow label="First Host" value={result.firstHost} />
            <InfoRow label="Last Host" value={result.lastHost} />
            <InfoRow label="Total Usable Hosts" value={result.totalHosts.toLocaleString()} />
          </div>
        </>
      )}
    </div>
  );
}
