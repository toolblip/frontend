'use client';
import { useState } from 'react';
import { normalizeHostname } from '@/lib/network-tools';
import { domainAge, httpUrl } from '@/lib/seo-network/core';
import { boundedFetch, pooled } from '@/lib/seo-network/request';
import { SeoField, SeoFrame, SeoOutput, SeoSelect, useSeoRequest } from './SeoNetworkShared';
export type LookupKind = 'dns' | 'batch-dns' | 'ping' | 'rdap' | 'links';
const CODES: Record<string, number> = { A: 1, AAAA: 28, MX: 15, TXT: 16, CNAME: 5, NS: 2 };
export async function lookupDns(host: string, type: string, signal: AbortSignal) {
  // Direct Google DoH also supports NS; existing shared API only permits five types.
  const response = await boundedFetch(`https://dns.google/resolve?name=${encodeURIComponent(host)}&type=${type}`, signal, { limit: 128000 });
  const data = JSON.parse(response.text());
  if (!Number.isInteger(data.Status)) throw new Error('Invalid DNS response.');
  if (data.Status !== 0 && data.Status !== 3) throw new Error(`DNS resolver error ${data.Status}.`);
  if (data.Answer !== undefined && !Array.isArray(data.Answer)) throw new Error('Invalid DNS answers.');
  const records = (data.Answer ?? []).filter((a: { type: number }) => a.type === CODES[type]);
  if (records.some((a: { data: unknown; TTL: unknown }) => typeof a.data !== 'string' || !Number.isFinite(a.TTL))) throw new Error('Invalid DNS record.');
  return { host, type, status: data.Status === 3 ? 'NXDOMAIN' : records.length ? 'Records returned' : 'No records of this type', records };
}
export default function SeoNetworkLookupClient({ kind }: { kind: LookupKind }) {
  const [input, setInput] = useState(''), [type, setType] = useState(kind === 'dns' ? 'ALL' : 'A'), [text, setText] = useState('');
  const request = useSeoRequest();
  const update = (value: string) => { request.cancel(); setText(''); setInput(value); };
  const notes = kind === 'ping' ? 'DNS lookup timing only. Browsers cannot send ICMP ping. Records do not prove a host is reachable; elapsed time includes resolver and network overhead.' : kind === 'links' ? 'Reads HTTP HEAD status where CORS permits. A blocked request, timeout or rejected HEAD is Unknown, not a broken link. Maximum 20 URLs, three concurrent requests.' : kind === 'rdap' ? 'Reads public RDAP registration events. Registries may omit dates, restrict requests or block browser access. Registration age is not website age.' : 'Queries Google DNS-over-HTTPS. NXDOMAIN, empty answers and resolver errors are distinct. Maximum 20 domains, three concurrent requests.';
  const run = () => {
    setText('');
    request.run(async signal => {
      const rows = input.trim().split(/\r?\n/).map(x => x.trim()).filter(Boolean);
      if (!rows.length || rows.length > (kind === 'dns' || kind === 'rdap' || kind === 'ping' ? 1 : 20)) throw new Error('Enter a valid number of inputs (one for single lookups, at most 20 for batches).');
      if (kind === 'links') {
        const urls = rows.map(raw => httpUrl(raw).href);
        return JSON.stringify(await pooled(urls, signal, async url => {
          try { const response = await boundedFetch(url, signal, { method: 'HEAD', allowHttpError: true }); return { url, status: response.status, result: response.status === 405 || response.status === 501 ? 'Unknown: HEAD unsupported' : response.status >= 400 ? 'HTTP error observed' : 'HTTP response observed' }; }
          catch (e) { return { url, status: null, result: 'Unknown', reason: `${(e as Error).message} CORS, network failure or timeout can prevent inspection.` }; }
        }), null, 2);
      }
      const hosts = rows.map(raw => { const host = normalizeHostname(raw); if (!host) throw new Error(`Invalid hostname: ${raw}`); return host; });
      if (kind === 'rdap') {
        if (!hosts[0].includes('.')) throw new Error('Enter a domain with a suffix, such as example.com.');
        const response = await boundedFetch(`https://rdap.org/domain/${encodeURIComponent(hosts[0])}`, signal);
        const data = JSON.parse(response.text());
        if (data.objectClassName !== 'domain') throw new Error('Registry did not return a domain object.');
        return JSON.stringify(domainAge(data), null, 2);
      }
      const types = kind === 'ping' ? ['A', 'AAAA'] : type === 'ALL' ? ['A', 'AAAA', 'MX', 'TXT', 'CNAME'] : [type];
      const start = performance.now();
      const results = await pooled(hosts.flatMap(host => types.map(type => ({ host, type }))), signal, async ({ host, type }) => {
        try { return await lookupDns(host, type, signal); }
        catch (e) { return { host, type, error: (e as Error).message }; }
      });
      return JSON.stringify(kind === 'ping' ? { measurement: 'DNS lookup round trip, not ICMP or host reachability', elapsedMs: Math.round(performance.now() - start), results } : results, null, 2);
    }, setText);
  };
  return <SeoFrame note={notes} clear={() => { update(''); setType(kind === 'dns' ? 'ALL' : 'A'); }} example={() => update(kind === 'links' ? 'https://example.com/' : 'example.com')}>
    <SeoField label={kind === 'links' ? 'URLs' : 'Hostname'} value={input} onChange={update} multiline={['links', 'batch-dns'].includes(kind)} maxLength={10000} />
    {['dns', 'batch-dns'].includes(kind) && <SeoSelect label="Record type" value={type} options={kind === 'dns' ? ['ALL', ...Object.keys(CODES)] : Object.keys(CODES)} onChange={value => { request.cancel(); setText(''); setType(value); }} />}
    <button className="tb-v2-btn tb-v2-btn-primary" disabled={request.loading} onClick={run}>{request.loading ? 'Looking up…' : 'Lookup'}</button>
    {request.loading && <button className="tb-v2-btn-sm" onClick={request.cancel}>Cancel</button>}
    <SeoOutput text={text} error={request.error} filename={`${kind}-report.json`} />
  </SeoFrame>;
}
