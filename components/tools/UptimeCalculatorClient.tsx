'use client';

import { useState } from 'react';

type Period = 'year' | 'month' | 'week' | 'day' | 'hour';

function calcDowntime(slaPercent: number, period: Period) {
  const totalMinutes: Record<Period, number> = {
    year: 525600, month: 43200, week: 10080, day: 1440, hour: 60
  };
  const allowed = (100 - slaPercent) / 100;
  return allowed * totalMinutes[period];
}

export default function UptimeCalculatorClient() {
  const [sla, setSla] = useState(99.9);
  const [period, setPeriod] = useState<Period>('year');

  const downtime = calcDowntime(sla, period);
  // A whole-number sla (typed in the number field, or the slider's own min
  // of 90) has no '.' to split - String(sla).split('.')[1] is undefined and
  // .length used to throw, crashing the tool on that exact realistic input.
  const slaDecimalPlaces = (String(sla).split('.')[1] ?? '').length;
  const slaDecimal = (100 - sla).toFixed(Math.min(6, slaDecimalPlaces + 1));
  const periods: Period[] = ['year', 'month', 'week', 'day', 'hour'];

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">SLA Percentage</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="range"
            min={90} max={99.999}
            step={0.001}
            value={sla}
            onChange={e => setSla(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--tb-accent)' }}
          />
          <input
            type="number"
            value={sla}
            // Clamping on every keystroke snapped the field back to 90 the
            // instant a typed digit (e.g. the "9" in "95.5") parsed below
            // the min, making most values impossible to type from scratch.
            // Only sanitize NaN while typing; clamp the range on blur.
            onChange={e => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) setSla(v); }}
            onBlur={e => { const v = parseFloat(e.target.value); setSla(Math.max(90, Math.min(99.999, Number.isNaN(v) ? 90 : v))); }}
            className="tb-v2-tool-textarea"
            style={{ width: 100, minHeight: 36, resize: 'none', textAlign: 'center' }}
            step={0.001}
            min={90}
            max={99.999}
          />
          <span style={{ fontWeight: 600 }}>%</span>
        </div>
        <div className="tb-v2-mode-tabs" role="group">
          {periods.map(p => (
            <button key={p} type="button" onClick={() => setPeriod(p)} className={`tb-v2-mode-tab ${period === p ? 'on' : ''}`}>{p}</button>
          ))}
        </div>
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Allowed Downtime</span></div>
      <div className="tb-v2-tool-output-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
            {periods.map(p => {
              const d = calcDowntime(sla, p);
              const label = d < 1 ? `${(d * 60).toFixed(1)} min` : d < 60 ? `${d.toFixed(2)} hrs` : `${(d / 60).toFixed(2)} hrs`;
              return (
                <div key={p} style={{ background: p === period ? 'var(--tb-accent)20' : 'var(--tb-bg-secondary)', borderRadius: 8, padding: '10px 12px', border: p === period ? '1px solid var(--tb-accent)' : '1px solid var(--tb-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', textTransform: 'uppercase' }}>{p}</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 4 }}>
            Downtime per {period}: <strong style={{ color: 'var(--tb-text)' }}>{downtime.toFixed(4)} minutes</strong> ({slaDecimal}% of time)
          </div>
        </div>
      </div>
    </div>
  );
}
