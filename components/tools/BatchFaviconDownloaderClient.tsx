'use client';
import { useEffect, useRef, useState } from 'react';
import { normalizeHostname } from '@/lib/network-tools';
import { httpUrl } from '@/lib/seo-network/core';
import { boundedFetch, downloadBlob, pooled } from '@/lib/seo-network/request';
import { SeoField, SeoFrame, SeoOutput, useSeoRequest } from './SeoNetworkShared';
type Result = { host: string; blob?: Blob; url?: string; error?: string };
export default function BatchFaviconDownloaderClient() {
  const [input, setInput] = useState(''), [results, setResults] = useState<Result[]>([]);
  const urls = useRef<string[]>([]), file = useRef<HTMLInputElement>(null), reader = useRef<FileReader | null>(null);
  const request = useSeoRequest();
  const cleanup = () => { urls.current.forEach(url => URL.revokeObjectURL(url)); urls.current = []; };
  useEffect(() => () => { cleanup(); reader.current?.abort(); }, []);
  const update = (text: string) => { const previous = reader.current; reader.current = null; previous?.abort(); request.cancel(); cleanup(); setResults([]); setInput(text); };
  const clear = () => { update(''); if (file.current) file.current.value = ''; };
  const fetchIcons = () => {
    cleanup(); setResults([]);
    request.run(async signal => {
      const lines = input.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
      if (!lines.length || lines.length > 20) throw new Error('Enter 1–20 domains or HTTP(S) URLs.');
      const hosts = [...new Set(lines.map(line => {
        const host = normalizeHostname(line.includes('://') ? httpUrl(line).hostname : line);
        if (!host || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(host)) throw new Error(`Invalid public domain: ${line}`);
        return host;
      }))];
      return pooled(hosts, signal, async host => {
        try {
          const response = await boundedFetch(`/api/favicon?domain=${encodeURIComponent(host)}&sz=128`, signal, { limit: 1000000 });
          const b = response.bytes;
          const png = b.length >= 24 && [137,80,78,71,13,10,26,10].every((n, i) => b[i] === n);
          const ico = b.length >= 22 && b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0;
          if (!png && !ico) throw new Error('Provider did not return a supported PNG or ICO image.');
          if (png) { const header = new DataView(b.buffer, b.byteOffset, b.byteLength); if (header.getUint32(16) > 1024 || header.getUint32(20) > 1024) throw new Error('Unexpected favicon dimensions.'); }
          const blob = new Blob([b], { type: png ? 'image/png' : 'image/x-icon' });
          // Decoding validates more than a content-type or file signature. Bitmap is never retained.
          const bitmap = await createImageBitmap(blob);
          const valid = bitmap.width > 0 && bitmap.height > 0 && bitmap.width <= 1024 && bitmap.height <= 1024;
          bitmap.close();
          if (!valid) throw new Error('Unexpected favicon dimensions.');
          return { host, blob } as Result;
        } catch (e) { return { host, error: (e as Error).message } as Result; }
      });
    }, values => setResults(values.map(value => { if (!value.blob) return value; const url = URL.createObjectURL(value.blob); urls.current.push(url); return { ...value, url }; })));
  };
  const download = (r: Result) => { if (r.blob) downloadBlob(r.blob, `favicon-${r.host}.${r.blob.type === 'image/png' ? 'png' : 'ico'}`); };
  return <SeoFrame note="Downloads images from Google's favicon service through Toolblip's favicon endpoint. The provider may return a generic fallback; a returned image does not prove the site's own favicon exists. Up to 20 domains, three concurrent requests." example={() => update('google.com')} clear={clear}>
    <SeoField label="URLs input" value={input} onChange={update} multiline maxLength={10000} />
    <label>Load URLs from file<input ref={file} type="file" accept=".txt,text/plain" aria-label="Load URLs from file" onChange={e => {
      const selected = e.target.files?.[0]; if (!selected) return;
      update(''); if (selected.size > 10000 || !/\.txt$/i.test(selected.name)) { request.setError('Choose a .txt file of at most 10 KB.'); return; }
      const next = new FileReader(); reader.current = next;
      next.onload = () => { if (reader.current === next) { setInput(String(next.result)); reader.current = null; } };
      next.onerror = () => { if (reader.current === next) request.setError('Could not read the file.'); }; next.readAsText(selected);
    }} /></label>
    <button className="tb-v2-btn tb-v2-btn-primary" disabled={request.loading} onClick={fetchIcons}>{request.loading ? 'Fetching…' : 'Fetch Favicons'}</button>
    {results.some(r => r.blob) && <button className="tb-v2-btn-sm" onClick={() => results.forEach(download)}>Download All</button>}
    <SeoOutput error={request.error} text={results.length ? results.map(r => `${r.host}: ${r.error ?? `Downloaded ${r.blob?.size} bytes (provider image; may be a fallback)`}`).join('\n') : ''} filename="favicon-report.txt" />
    {results.map(r => <div key={r.host}>{r.url && <img src={r.url} alt={`Provider favicon for ${r.host}`} width={32} height={32} />}<span>{r.host}</span>{r.blob && <button className="tb-v2-btn-sm" onClick={() => download(r)}>Download {r.host}</button>}</div>)}
  </SeoFrame>;
}
