"use client";
import { useState, useMemo } from 'react';

function explainField(field: string, min: number, max: number): string {
  if (field === '*') return `every value from ${min} to ${max}`;
  if (field.includes('/')) {
    const [range, step] = field.split('/');
    return `every ${step} ${range === '*' ? `from ${min} to ${max}` : `in range ${range}`}`;
  }
  if (field.includes('-')) {
    const [a, b] = field.split('-');
    return `from ${a} to ${b}`;
  }
  if (field.includes(',')) return `at values: ${field}`;
  return `at value ${field}`;
}

export default function CronScheduleExplainerClient() {
  const [cron, setCron] = useState('0 9 * * 1-5');
  const parts = useMemo(() => cron.trim().split(/\s+/), [cron]);

  const explanations = useMemo(() => {
    if (parts.length !== 5) return null;
    return [
      { field: parts[0], name: 'Minute', range: '0-59', explain: explainField(parts[0], 0, 59) },
      { field: parts[1], name: 'Hour', range: '0-23', explain: explainField(parts[1], 0, 23) },
      { field: parts[2], name: 'Day of Month', range: '1-31', explain: explainField(parts[2], 1, 31) },
      { field: parts[3], name: 'Month', range: '1-12', explain: explainField(parts[3], 1, 12) },
      { field: parts[4], name: 'Day of Week', range: '0-7', explain: explainField(parts[4], 0, 7) },
    ];
  }, [parts]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Cron Expression</span></div>
      <input value={cron} onChange={e => setCron(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '1.125rem' }} />
      {explanations && (
        <div style={{ marginTop: '1rem' }}>
          {explanations.map(e => (
            <div key={e.name} style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#667eea' }}>{e.name}</strong>
                <code style={{ fontFamily: 'monospace', background: '#f3f4f6', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                  {e.field}
                </code>
              </div>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#374151' }}>{e.explain}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
