'use client';
import { useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { checkedImage, imageKind, preflightImage } from '@/lib/media-conversion/image';
import { useMediaJob } from './media-conversion/useMediaJob';
import Result from './media-conversion/Result';
export default function Base64ImageDecoderClient() {
  const [input, setInput] = useState(''); const ref = useRef<HTMLInputElement>(null); const job = useMediaJob();
  const change = (s: string) => { job.cancel(); setInput(s); };
  const decode = () => job.run(async signal => {
    if (input.length > 7_000_000) throw new Error('Base64 input exceeds 7 million characters.');
    const match = /^data:([^;,]+);base64,/i.exec(input.trim());
    const raw = input.trim().replace(/^data:[^;,]+;base64,/i, '').replace(/\s/g, '');
    if (!raw || raw.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(raw)) throw new Error('Invalid padded Base64 data.');
    const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0)); const kind = imageKind(bytes);
    if (!['png', 'jpeg', 'webp', 'gif'].includes(kind)) throw new Error('Decode PNG, JPEG, WebP or GIF image data only.');
    if (match && match[1].toLowerCase() !== `image/${kind}`) throw new Error('Declared MIME type does not match the image bytes.');
    preflightImage(bytes, kind); const blob = new Blob([bytes], { type: `image/${kind}` }); const image = await checkedImage(blob, signal);
    return { blob, name: `decoded.${kind === 'jpeg' ? 'jpg' : kind}`, detail: `${image.naturalWidth} × ${image.naturalHeight}`, preview: 'image' };
  });
  const example = () => { job.cancel(); void job.run(async signal => {
    const response = await fetch('/samples/tool-sample.png', { signal }); if (!response.ok) throw new Error('Example unavailable.');
    const bytes = new Uint8Array(await response.arrayBuffer()); let binary = ''; for (const b of bytes) binary += String.fromCharCode(b);
    signal.throwIfAborted(); setInput('data:image/png;base64,' + btoa(binary)); return null;
  }); };
  return <div className="tb-v2-section" style={{ display: 'grid', gap: 12, minWidth: 0 }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">Base64 image data</span><ToolExampleClearActions onExample={example} onClear={() => { change(''); if (ref.current) ref.current.value = ''; }} /></div>
    <textarea aria-label="Base64 input" className="tb-v2-tool-textarea" value={input} maxLength={7000001} onChange={e => change(e.target.value)} />
    <input ref={ref} aria-label="Base64 text file" type="file" accept=".txt,.b64" style={{ maxWidth: '100%' }} onChange={e => { const f = e.target.files?.[0]; if (f) { change(''); void job.run(async signal => { if (f.size > 7000000) throw new Error('File exceeds 7 MB.'); const text = await f.text(); signal.throwIfAborted(); setInput(text); return null; }); } }} />
    <button className="tb-v2-btn" disabled={!input} onClick={async () => { const id = job.generation.current; try { await navigator.clipboard.writeText(input); } catch { if (id === job.generation.current) job.setError('Clipboard unavailable. Select and copy the Base64 input.'); } }}>Copy Base64</button>
    <button className="tb-v2-btn tb-v2-btn-primary" disabled={!input.trim() || job.busy} onClick={decode}>{job.busy ? 'Decoding…' : 'Decode'}</button>
    {job.error && <p role="alert">{job.error}</p>}{job.result && <Result result={job.result} />}
  </div>;
}
