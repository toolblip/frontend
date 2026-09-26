'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from './ToolExampleClearActions';
import { downloadText } from '@/lib/seo-network/request';

export function SeoFrame({ children, example, clear, note }: { children: ReactNode; example: () => void; clear: () => void; note?: string }) {
  return <div className="seo-network" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
    <style>{`.seo-network input,.seo-network select,.seo-network textarea{min-width:0;max-width:100%;box-sizing:border-box}.seo-network pre{white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;max-width:100%}.seo-network .tb-v2-tool-input-head,.seo-network .tb-v2-tool-output-head{flex-wrap:wrap;gap:10px}.seo-network label{display:block}.seo-network .seo-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px}`}</style>
    <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input</span><ToolExampleClearActions onExample={example} onClear={clear} /></div>
    <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 14 }}>{note && <p style={{ fontSize: 13 }}>{note}</p>}{children}</div>
  </div>;
}
export function SeoField({ label, value, onChange, multiline = false, maxLength = 200000 }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; maxLength?: number }) {
  return <label><span className="tb-v2-tool-label">{label}</span>{multiline ? <textarea aria-label={label} className="tb-v2-tool-textarea" rows={8} maxLength={maxLength} value={value} onChange={e => onChange(e.target.value)} /> : <input aria-label={label} className="tb-v2-input" style={{ width: '100%' }} maxLength={maxLength} value={value} onChange={e => onChange(e.target.value)} />}</label>;
}
export function SeoSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] | [string, string][] }) {
  return <label><span className="tb-v2-tool-label">{label}</span><select aria-label={label} className="tb-v2-input" value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={typeof o === 'string' ? o : o[0]} value={typeof o === 'string' ? o : o[0]}>{typeof o === 'string' ? o : o[1]}</option>)}</select></label>;
}
export function SeoOutput({ text, filename = 'result.txt', error = '' }: { text: string; filename?: string; error?: string }) {
  const [message, setMessage] = useState('');
  const current = useRef(text); current.current = text;
  useEffect(() => setMessage(''), [text]);
  return <>{error && <p role="alert" className="tb-v2-banner tb-v2-banner-err">{error}</p>}{text && <>
    <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Result</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}><button className="tb-v2-copy-btn" onClick={async () => { try { await navigator.clipboard.writeText(text); if (current.current === text) setMessage('Copied'); } catch { if (current.current === text) setMessage('Clipboard unavailable. Select the result to copy.'); } }}>Copy</button><button className="tb-v2-btn-sm" onClick={() => downloadText(text, filename)}>Download</button></div></div>
    {message && <p role="status">{message}</p>}<pre aria-label="Result" className="tb-v2-tool-pre">{text}</pre>
  </>}</>;
}
export function useSeoRequest() {
  const controller = useRef<AbortController | null>(null), generation = useRef(0);
  const [loading, setLoading] = useState(false), [error, setError] = useState('');
  function cancel() { generation.current++; controller.current?.abort(); controller.current = null; setLoading(false); setError(''); }
  useEffect(() => () => { generation.current++; controller.current?.abort(); }, []);
  async function run<T>(task: (signal: AbortSignal) => Promise<T>, commit: (value: T) => void) {
    cancel(); const id = generation.current, next = new AbortController(); controller.current = next; setLoading(true);
    try { const value = await task(next.signal); if (id === generation.current) commit(value); }
    catch (e) { if (id === generation.current) setError(e instanceof Error ? e.message : 'Request failed.'); }
    finally { if (id === generation.current) { setLoading(false); controller.current = null; } }
  }
  return { loading, error, cancel, run, setError };
}

/** Scoped layout guard for the retained generator forms. */
export function SeoOwnedBoundary({ children }: { children: ReactNode }) {
  return <div className="seo-owned" style={{ minWidth: 0, overflowWrap: 'anywhere' }}><style>{`.seo-owned input,.seo-owned select,.seo-owned textarea{min-width:0;max-width:100%;box-sizing:border-box}.seo-owned pre{white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}.seo-owned .tb-v2-mode-tabs,.seo-owned .tb-v2-tool-input-head,.seo-owned .tb-v2-tool-output-head{flex-wrap:wrap;gap:10px}.seo-owned .grid>*{min-width:0}@media(max-width:480px){.seo-owned .tb-v2-grid-2,.seo-owned .tb-v2-grid-3{grid-template-columns:minmax(0,1fr)}.seo-owned .tb-v2-section{padding:12px!important}}`}</style>{children}</div>;
}
