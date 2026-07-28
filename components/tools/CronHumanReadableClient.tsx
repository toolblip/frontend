"use client";
import { useState, useMemo } from 'react';

function explainCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression (need 5 fields)';
  const [min, hour, dom, mon, dow] = parts;

  const time = hour === '*' && min === '*' ? 'every minute' :
    hour === '*' ? `every hour at minute ${min}` :
    min === '*' ? `every minute of hour ${hour}` :
    `at ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;

  const dayPart = dom === '*' && mon === '*' && dow === '*' ? 'every day' :
    dow !== '*' ? `on ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][parseInt(dow) || 7] || dow}` :
    dom !== '*' ? `on day ${dom}` : 'every day';

  return `${time}, ${dayPart}`;
}

export default function CronHumanReadableClient() {
  const [cron, setCron] = useState('0 9 * * 1-5');
  const explanation = useMemo(() => explainCron(cron), [cron]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Cron Expression</span></div>
      <input value={cron} onChange={e => setCron(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '1.125rem' }}
        placeholder="* * * * *" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
        <p style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{explanation}</p>
      </div>
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
        {['Minute', 'Hour', 'Day', 'Month', 'Weekday'].map((label, i) => (
          <div key={label} style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{label}</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{cron.split(/\s+/)[i] || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
