"use client";
import { useState } from 'react';

export default function CronScheduleGeneratorClient() {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [mon, setMon] = useState('*');
  const [dow, setDow] = useState('*');

  const cron = `${min} ${hour} ${dom} ${mon} ${dow}`;
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: 'Every minute', min: '*', hour: '*', dom: '*', mon: '*', dow: '*' },
    { label: 'Every 5 min', min: '*/5', hour: '*', dom: '*', mon: '*', dow: '*' },
    { label: 'Hourly', min: '0', hour: '*', dom: '*', mon: '*', dow: '*' },
    { label: 'Daily at midnight', min: '0', hour: '0', dom: '*', mon: '*', dow: '*' },
    { label: 'Weekdays 9 AM', min: '0', hour: '9', dom: '*', mon: '*', dow: '1-5' },
    { label: 'Weekly Sunday', min: '0', hour: '0', dom: '*', mon: '*', dow: '0' },
    { label: 'Monthly 1st', min: '0', hour: '0', dom: '1', mon: '*', dow: '*' },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setMin(p.min); setHour(p.hour); setDom(p.dom); setMon(p.mon); setDow(p.dow);
  };

  const copy = () => {
    navigator.clipboard.writeText(cron).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Presets</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {presets.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)}
            className="tb-v2-mode-tab" style={{ fontSize: '0.75rem' }}>{p.label}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
        {[
          { label: 'Minute', value: min, set: setMin, range: '0-59' },
          { label: 'Hour', value: hour, set: setHour, range: '0-23' },
          { label: 'Day', value: dom, set: setDom, range: '1-31' },
          { label: 'Month', value: mon, set: setMon, range: '1-12' },
          { label: 'Weekday', value: dow, set: setDow, range: '0-7' },
        ].map(f => (
          <div key={f.label}>
            <label className="tb-v2-tool-label">{f.label} ({f.range})</label>
            <input value={f.value} onChange={e => f.set(e.target.value)}
              className="tb-v2-tool-textarea" style={{ padding: '0.5rem', fontFamily: 'monospace', textAlign: 'center' }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#1a1a2e', borderRadius: '8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <code style={{ color: '#a5f3fc', fontFamily: 'monospace', fontSize: '1.125rem' }}>{cron}</code>
        <button onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
