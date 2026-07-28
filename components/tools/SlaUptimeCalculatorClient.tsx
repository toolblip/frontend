"use client";
import { useState, useMemo } from 'react';

export default function SlaUptimeCalculatorClient() {
  const [uptime, setUptime] = useState(99.9);
  const [period, setPeriod] = useState(30);
  const result = useMemo(() => {
    const downtime = (100 - uptime) / 100 * period * 24 * 60;
    const days = Math.floor(downtime / 1440);
    const hours = Math.floor((downtime % 1440) / 60);
    const mins = Math.round(downtime % 60);
    const seconds = Math.round(downtime * 60 % 60);
    return { days, hours, mins, seconds, totalMins: Math.round(downtime),
      totalHours: (downtime / 60).toFixed(2), totalDays: (downtime / 1440).toFixed(4) };
  }, [uptime, period]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">SLA Uptime (%)</span></div>
      <input type="number" min={90} max={100} step={0.001} value={uptime}
        onChange={e => setUptime(+e.target.value)} className="tb-v2-tool-textarea" />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}>
        <span className="tb-v2-tool-label">Period (days)</span>
      </div>
      <input type="number" min={1} max={365} value={period}
        onChange={e => setPeriod(+e.target.value)} className="tb-v2-tool-textarea" />
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
        <p style={{ fontWeight: 600, margin: '0 0 0.5rem' }}>Maximum Allowed Downtime per Month:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          {[
            { label: 'Days', value: result.days },
            { label: 'Hours', value: result.hours },
            { label: 'Minutes', value: result.mins },
            { label: 'Seconds', value: result.seconds },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>{m.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem', textAlign: 'center' }}>
          {result.totalHours} hours / {result.totalDays} days total in {period} days
        </p>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <p style={{ fontWeight: 600 }}>SLA Tiers Reference:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
          {[{ sla: '99.9%', label: 'Three 9s', downtime: '43.8 min/mo' },
            { sla: '99.95%', label: 'Three and a half 9s', downtime: '21.9 min/mo' },
            { sla: '99.99%', label: 'Four 9s', downtime: '4.38 min/mo' }
          ].map(t => (
            <div key={t.sla} style={{ padding: '0.5rem', background: '#f9fafb', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600 }}>{t.sla}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.downtime}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
