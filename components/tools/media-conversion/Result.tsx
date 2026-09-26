'use client';
import type { MediaJobResult } from './useMediaJob';
export default function Result({ result }: { result: MediaJobResult }) {
  return <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
    <p role="status">{result.detail} · {result.blob.size.toLocaleString()} bytes · {result.blob.type}</p>
    {result.preview === 'image' && <img ref={result.attachPreview} src={result.url} alt="Converted result" style={{ maxWidth: '100%', maxHeight: 320 }} />}
    {result.preview === 'audio' && <audio ref={result.attachPreview} controls src={result.url} style={{ width: '100%' }} />}
    {result.preview === 'video' && <video ref={result.attachPreview} controls src={result.url} style={{ width: '100%' }} />}
    <a className="tb-v2-btn tb-v2-btn-primary" href={result.url} download={result.name}>Download {result.name.split('.').pop()?.toUpperCase()}</a>
  </div>;
}
