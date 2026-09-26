'use client';
import { useState } from 'react';
import ToolExampleClearActions from '../ToolExampleClearActions';
import { finiteNumber, temperature } from '@/lib/media-conversion/data';
import { units, type Category } from '@/lib/media-conversion/units';
export default function UnitConverter({ temperatureOnly = false }: { temperatureOnly?: boolean }) {
  const initial = temperatureOnly ? 'temperature' : 'length';
  const [category, setCategory] = useState<Category>(initial); const [input, setInput] = useState('');
  const [from, setFrom] = useState(units[initial][0].value); const [to, setTo] = useState(units[initial][1].value); const [notice, setNotice] = useState('');
  const changeCategory = (c: Category) => { setCategory(c); setFrom(units[c][0].value); setTo(units[c][1].value); setNotice(''); };
  let result = '', error = '';
  try { if (input.trim()) { const n = finiteNumber(input); const value = category === 'temperature' ? temperature(n, from, to) : n * units[category].find(u => u.value === from)!.factor / units[category].find(u => u.value === to)!.factor; if (!Number.isFinite(value)) throw new Error('Result exceeds the numeric range.'); result = String(Number(value.toPrecision(12))); } } catch (e) { error = (e as Error).message; }
  return <div className="tb-v2-section" style={{ display: 'grid', gap: 12, minWidth: 0 }}>
    <div className="tb-v2-tool-input-head" style={{ flexWrap: 'wrap', gap: 8 }}><span className="tb-v2-tool-label">Unit conversion</span><ToolExampleClearActions onExample={() => { changeCategory(initial); setInput(temperatureOnly ? '100' : '1000'); }} onClear={() => { setInput(''); setNotice(''); }} /></div>
    {!temperatureOnly && <label>Category<select className="tb-v2-select" aria-label="Category" value={category} onChange={e => changeCategory(e.target.value as Category)}>{Object.keys(units).map(c => <option key={c} value={c}>{c}</option>)}</select></label>}
    <label>Value<input className="tb-v2-input" aria-label="Value" value={input} maxLength={256} onChange={e => { setInput(e.target.value); setNotice(''); }} /></label>
    {(['From unit', 'To unit'] as const).map((label, i) => <label key={label}>{label}<select className="tb-v2-select" aria-label={label} value={i ? to : from} onChange={e => { (i ? setTo : setFrom)(e.target.value); setNotice(''); }}>{units[category].map(u => <option key={u.value} value={u.value}>{u.label}</option>)}</select></label>)}
    <button className="tb-v2-btn" onClick={() => { setFrom(to); setTo(from); setNotice(''); }}>Swap units</button>
    {temperatureOnly && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{[['Absolute zero', -273.15], ['Freezing point', 0], ['Body temperature', 37], ['Boiling point', 100], ['Room temperature', 20], ['Oven low', 150], ['Oven high', 220], ['Sun surface (approximate)', 5500]].map(([label, c]) => <button key={String(label)} className="tb-v2-btn" onClick={() => { setInput(String(temperature(Number(c), 'c', from))); setNotice(''); }}>{label}</button>)}</div>}
    {temperatureOnly && result && !error && <div>{units.temperature.map(u => <p key={u.value}>{u.label}: {Number(temperature(finiteNumber(input), from, u.value).toPrecision(12))}</p>)}</div>}
    {error && <p role="alert">{error}</p>}<output aria-label="Result" style={{ overflowWrap: 'anywhere' }}>{result}</output>
    <button className="tb-v2-btn" disabled={!result} onClick={async () => { try { await navigator.clipboard.writeText(result); } catch { setNotice('Clipboard unavailable. Select and copy the result.'); } }}>Copy</button>
    {notice && <p role="status">{notice}</p>}
  </div>;
}
