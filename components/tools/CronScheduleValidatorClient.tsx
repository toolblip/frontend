"use client";
import { useState, useMemo } from 'react';

function validateCron(expr: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const parts = expr.trim().split(/\s+/);
  const errors: string[] = [];
  const warnings: string[] = [];
  if (parts.length !== 5) { errors.push(`Expected 5 fields, got ${parts.length}`); return { valid: false, errors, warnings }; }
  const ranges = [[0,59],[0,23],[1,31],[1,12],[0,7]];
  const names = ['minute','hour','day-of-month','month','day-of-week'];
  parts.forEach((p, i) => {
    if (!/^[\d\*\/\-\,]+$/.test(p)) { errors.push(`${names[i]}: invalid characters in "${p}"`); return; }
    const nums = p.split(/[\/\-]/).map(Number).filter(n => !isNaN(n));
    nums.forEach(n => {
      if (n < ranges[i][0] || n > ranges[i][1]) errors.push(`${names[i]}: ${n} out of range [${ranges[i][0]}-${ranges[i][1]}]`);
    });
    if (p === '* * * * *') warnings.push('Runs every minute - this is very frequent');
  });
  return { valid: errors.length === 0, errors, warnings };
}

export default function CronScheduleValidatorClient() {
  const [cron, setCron] = useState('0 9 * * 1-5');
  const result = useMemo(() => validateCron(cron), [cron]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Cron Expression</span></div>
      <input value={cron} onChange={e => setCron(e.target.value)}
        className="tb-v2-tool-textarea" style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '1.125rem' }} />
      <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px',
        background: result.valid ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${result.valid ? '#bbf7d0' : '#fecaca'}` }}>
        <p style={{ fontWeight: 600, margin: 0 }}>{result.valid ? '✅ Valid cron expression' : '❌ Invalid cron expression'}</p>
        {result.errors.map((e, i) => <p key={i} style={{ color: '#dc2626', margin: '0.25rem 0', fontSize: '0.875rem' }}>• {e}</p>)}
        {result.warnings.map((w, i) => <p key={i} style={{ color: '#d97706', margin: '0.25rem 0', fontSize: '0.875rem' }}>⚠️ {w}</p>)}
      </div>
    </div>
  );
}
