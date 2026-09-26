'use client';
import { useState } from 'react';
import { formatMac } from '@/lib/seo-network/core';
import { SeoField, SeoFrame, SeoOutput, SeoSelect } from './SeoNetworkShared';
export default function MacAddressGeneratorClient() {
  const [count, setCount] = useState('5'), [format, setFormat] = useState(':'), [text, setText] = useState(''), [error, setError] = useState('');
  const invalidate = () => { setText(''); setError(''); };
  return <SeoFrame note="Generates locally administered unicast addresses with Web Crypto. These are test values, not vendor assignments or guaranteed globally unique addresses." example={() => { invalidate(); setCount('5'); setFormat(':'); }} clear={() => { invalidate(); setCount(''); setFormat(':'); }}>
    <SeoField label="Count" value={count} onChange={v => { invalidate(); setCount(v); }} maxLength={4} />
    <SeoSelect label="Format" value={format} onChange={v => { invalidate(); setFormat(v); }} options={[[ ':', 'Colon' ], ['-', 'Hyphen'], ['', 'No separator']]} />
    <button className="tb-v2-btn tb-v2-btn-primary" onClick={() => { invalidate(); if (!/^\d+$/.test(count) || Number(count) < 1 || Number(count) > 1000) { setError('Count must be an integer from 1 to 1000.'); return; } try { const values = new Set<string>(); for (let tries = 0; values.size < Number(count) && tries < 10000; tries++) values.add(formatMac(crypto.getRandomValues(new Uint8Array(6)), format)); if (values.size !== Number(count)) throw new Error('Random source did not provide distinct addresses.'); setText([...values].join('\n')); } catch { setError('Secure random generation is unavailable in this browser.'); } }}>Generate</button>
    <SeoOutput text={text} error={error} filename="mac-addresses.txt" />
  </SeoFrame>;
}
