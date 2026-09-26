'use client';
import { useState } from 'react';
import ToolExampleClearActions from '../ToolExampleClearActions';
import { parseBase } from '@/lib/media-conversion/data';
export default function NumberConverter({ all = false }: { all?: boolean }) {
  const [input, setInput] = useState(''); const [from, setFrom] = useState(10); const [to, setTo] = useState(2); const [notice, setNotice] = useState('');
  let output = '', error = '', number: bigint | null = null;
  try { if (input.trim()) { number = parseBase(input, from); output = all ? `Binary: ${number.toString(2)}\nDecimal: ${number.toString(10)}\nHexadecimal: ${number.toString(16).toUpperCase()}` : number.toString(to).toUpperCase(); } } catch (e) { error = (e as Error).message; }
  const change = (value: string) => { setInput(value); setNotice(''); };
  const bases = all ? [2, 10, 16] : Array.from({ length: 35 }, (_, n) => n + 2);
  return <div className="tb-v2-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, minWidth: 0 }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">Integer</span><ToolExampleClearActions onExample={() => { change('255'); setFrom(10); setTo(2); }} onClear={() => change('')} /></div>
    <input className="tb-v2-input" aria-label="Number input" value={input} maxLength={4097} onChange={e => change(e.target.value)} />
    <label>Source base<select className="tb-v2-select" aria-label="Source base" value={from} onChange={e => { setFrom(Number(e.target.value)); setNotice(''); }}>{bases.map(n => <option key={n} value={n}>Base {n}</option>)}</select></label>
    {!all && <><label>Target base<select className="tb-v2-select" aria-label="Target base" value={to} onChange={e => { setTo(Number(e.target.value)); setNotice(''); }}>{bases.map(n => <option key={n} value={n}>Base {n}</option>)}</select></label><button className="tb-v2-btn" disabled={!output || !!error} onClick={() => { change(output); setFrom(to); setTo(from); }}>Swap bases</button></>}
    {error && <p role="alert">{error}</p>}
    <pre aria-label="Result" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{output}</pre>
    {all && number !== null && [2, 10, 16].map(base => <button key={base} className="tb-v2-btn" onClick={() => { change(number!.toString(base)); setFrom(base); }}>Use base {base} result as input</button>)}
    <button className="tb-v2-btn" disabled={!output} onClick={async () => { try { await navigator.clipboard.writeText(output); } catch { setNotice('Clipboard unavailable. Select and copy the result.'); } }}>Copy</button>
    {notice && <p role="status">{notice}</p>}
    <p>Exact integer conversion, up to 4,096 digits. Fractions and invalid trailing characters are rejected.</p>
  </div>;
}
