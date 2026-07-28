"use client";
import { useState } from 'react';

export default function CronGeneratorDgClient() {
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(9);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [month, setMonth] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [copied, setCopied] = useState(false);

  const cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const copy = () => {
    navigator.clipboard.writeText(cron).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Schedule Builder</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Minute', value: minute, set: setMinute, min: 0, max: 59 },
          { label: 'Hour', value: hour, set: setHour, min: 0, max: 23 },
          { label: 'Day', value: dayOfMonth, set: setDayOfMonth, min: 1, max: 31 },
          { label: 'Month', value: month, set: setMonth, min: 1, max: 12 },
          { label: 'Weekday', value: dayOfWeek, set: setDayOfWeek, min: 0, max: 6 },
        ].map(f => (
          <div key={f.label}>
            <label className="tb-v2-tool-label">{f.label}</label>
            <input type="number" min={f.min} max={f.max} value={f.value}
              onChange={e => f.set(+e.target.value)}
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
