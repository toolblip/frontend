'use client';
import type { MediaResult } from './useMediaJob';
export default function Result({ result }: { result: MediaResult & { url: string } }) {
  return <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
    <p role="status">{result.detail} · {result.blob.size.toLocaleString()} bytes · {result.blob.type}</p>
    {result.preview === 'image' && <img src={result.url} alt="Converted result" style={{ maxWidth: '100%', maxHeight: 320 }} />}
    {result.preview === 'audio' && <audio controls src={result.url} style={{ width: '100%' }} />}
    {result.preview === 'video' && <video controls src={result.url} style={{ width: '100%' }} />}
    <a className="tb-v2-btn tb-v2-btn-primary" href={result.url} download={result.name}>Download {result.name.split('.').pop()?.toUpperCase()}</a>
  </div>;
}
