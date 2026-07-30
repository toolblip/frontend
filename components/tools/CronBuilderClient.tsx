'use client';

import { useState, useCallback, useEffect } from 'react';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Hourly', value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Daily noon', value: '0 12 * * *' },
  { label: 'Weekdays 9 AM', value: '0 9 * * 1-5' },
  { label: 'Monthly', value: '0 0 1 * *' },
  { label: 'Yearly', value: '0 0 1 1 *' },
];

const FIELD_LABELS = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];
const FIELD_RANGES = ['0–59', '0–23', '1–31', '1–12', '0–7'];

interface ParsedCron {
  valid: boolean;
  description?: string;
  error?: string;
  nextRuns?: string[];
}

function describeSchedule(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid expression';
  
  const [min, hr, dom, mon, dow] = parts;
  
  if (min === '*' && hr === '*') return 'Every minute';
  if (min === '0' && hr === '*') return 'Every hour';
  if (min === '*/5') return 'Every 5 minutes';
  if (min === '*/10') return 'Every 10 minutes';
  if (min === '*/15') return 'Every 15 minutes';
  if (min === '*/30') return 'Every 30 minutes';
  if (min === '0' && hr === '0') return 'At midnight';
  if (min === '0' && hr === '12') return 'At noon';
  if (dow === '1-5' || dow === '1,2,3,4,5') return 'On weekdays';
  if (dow === '0,6' || dow === '6,0') return 'On weekends';
  
  const timeDesc = hr !== '*' || min !== '*' ? `At ${hr}:${min.padStart(2, '0')}` : '';
  const dayDesc = dom !== '*' ? ` on day ${dom}` : '';
  const monthDesc = mon !== '*' ? ` in month ${mon}` : '';
  const dowDesc = dow !== '*' ? ` on day of week ${dow}` : '';
  
  return (timeDesc + dayDesc + monthDesc + dowDesc) || 'Custom schedule';
}

function parseField(raw: string, min: number, max: number): number[] | null {
  const v = raw.trim();
  if (!v) return null;
  const results = new Set<number>();
  for (const part of v.split(',')) {
    const p = part.trim();
    if (p.startsWith('*/')) {
      const step = parseInt(p.slice(2), 10);
      if (isNaN(step) || step < 1) return null;
      for (let i = min; i <= max; i += step) results.add(i);
      continue;
    }
    if (p === '*') {
      for (let i = min; i <= max; i++) results.add(i);
      continue;
    }
    if (p.includes('-')) {
      const [sStr, eStr] = p.split('-');
      const s = parseInt(sStr, 10);
      const e = parseInt(eStr, 10);
      if (isNaN(s) || isNaN(e) || s > e) return null;
      for (let i = Math.max(min, s); i <= Math.min(max, e); i++) results.add(i);
      continue;
    }
    const n = parseInt(p, 10);
    if (isNaN(n) || n < min || n > max) return null;
    results.add(n);
  }
  return results.size > 0 ? [...results].sort((a, b) => a - b) : null;
}

function getNextRuns(expr: string, count: number = 5): string[] {
  try {
    const [minP, hrP, domP, monP, dowP] = expr.trim().split(/\s+/);
    const minutes = parseField(minP, 0, 59);
    const hours = parseField(hrP, 0, 23);
    const doms = parseField(domP, 1, 31);
    const mons = parseField(monP, 1, 12);
    const dows = parseField(dowP, 0, 6);
    if (!minutes || !hours || !doms || !mons || !dows) return [];

    const minuteSet = new Set(minutes);
    const hourSet = new Set(hours);
    const domSet = new Set(doms);
    const monthSet = new Set(mons);
    const dowSet = new Set(dows);
    const domRestricted = doms.length < 31;
    const dowRestricted = dows.length < 7;
    const sortedMinutes = [...minutes];
    const sortedHours = [...hours];
    const sortedMonths = [...mons];

    const runs: string[] = [];
    const cursor = new Date();
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    for (let i = 0; i < 1000 && runs.length < count; i++) {
      const month = cursor.getMonth() + 1;
      if (!monthSet.has(month)) {
        const next = sortedMonths.find((m) => m > month);
        if (next !== undefined) cursor.setMonth(next - 1, 1);
        else { cursor.setFullYear(cursor.getFullYear() + 1); cursor.setMonth(sortedMonths[0] - 1, 1); }
        cursor.setHours(0, 0, 0, 0);
        continue;
      }
      const dom = cursor.getDate();
      const dow = cursor.getDay();
      const domMatch = domRestricted ? domSet.has(dom) : true;
      const dowMatch = dowRestricted ? dowSet.has(dow) : true;
      const dayMatch = domRestricted && dowRestricted ? domMatch || dowMatch : domMatch && dowMatch;
      if (!dayMatch) { cursor.setDate(cursor.getDate() + 1); cursor.setHours(0, 0, 0, 0); continue; }

      const hour = cursor.getHours();
      if (!hourSet.has(hour)) {
        const nextHour = sortedHours.find((h) => h > hour);
        if (nextHour !== undefined) cursor.setHours(nextHour, 0, 0, 0);
        else { cursor.setDate(cursor.getDate() + 1); cursor.setHours(0, 0, 0, 0); }
        continue;
      }
      const minute = cursor.getMinutes();
      if (!minuteSet.has(minute)) {
        const nextMin = sortedMinutes.find((m) => m > minute);
        if (nextMin !== undefined) cursor.setMinutes(nextMin, 0, 0);
        else {
          const nextHour = sortedHours.find((h) => h > hour);
          if (nextHour !== undefined) cursor.setHours(nextHour, 0, 0, 0);
          else { cursor.setDate(cursor.getDate() + 1); cursor.setHours(0, 0, 0, 0); }
        }
        continue;
      }
      runs.push(cursor.toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }));
      cursor.setMinutes(cursor.getMinutes() + 1, 0, 0);
    }
    return runs;
  } catch {
    return [];
  }
}

export default function CronBuilderClient() {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [mon, setMon] = useState('*');
  const [dow, setDow] = useState('*');
  const [nextRuns, setNextRuns] = useState<string[]>([]);

  useEffect(() => {
    setNextRuns(getNextRuns(`${min} ${hour} ${dom} ${mon} ${dow}`));
  }, [min, hour, dom, mon, dow]);

  const expr = `${min} ${hour} ${dom} ${mon} ${dow}`;
  const description = describeSchedule(expr);

  const applyPreset = useCallback((preset: string) => {
    const [m, h, d, mo, w] = preset.split(' ');
    setMin(m);
    setHour(h);
    setDom(d);
    setMon(mo);
    setDow(w);
  }, []);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cron Expression</span>
        <code className="tb-v2-hash-stats">{expr}</code>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Minute', value: min, set: setMin, options: ['*', ...Array.from({length: 60}, (_, i) => String(i))] },
          { label: 'Hour', value: hour, set: setHour, options: ['*', ...Array.from({length: 24}, (_, i) => String(i))] },
          { label: 'Day', value: dom, set: setDom, options: ['*', ...Array.from({length: 31}, (_, i) => String(i + 1))] },
          { label: 'Month', value: mon, set: setMon, options: ['*', ...Array.from({length: 12}, (_, i) => String(i + 1))] },
          { label: 'Weekday', value: dow, set: setDow, options: ['*', '0', '1', '2', '3', '4', '5', '6'] },
        ].map(({ label, value, set, options }) => (
          <div key={label} className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
              {label}
            </label>
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {options.map((o) => (
                <option key={o} value={o}>{o === '*' ? 'Every' : o}</option>
              ))}
            </select>
            <span className="block text-xs text-gray-400 text-center">{FIELD_RANGES[['Minute', 'Hour', 'Day', 'Month', 'Weekday'].indexOf(label)]}</span>
          </div>
        ))}
      </div>

      <div className="tb-v2-cron-presets">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => applyPreset(p.value)}
            className={`tb-v2-mode-tab ${expr === p.value ? 'on' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="tb-v2-cron-summary">
        <span className="tb-v2-cron-summary-label">Schedule Description</span>
        <p className="tb-v2-cron-summary-text">{description}</p>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Next 5 Run Times</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {nextRuns.length > 0 ? (
          <ul className="tb-v2-cron-list">
            {nextRuns.map((time, i) => (
              <li key={i} className="tb-v2-cron-row">
                <span className="tb-v2-cron-num">{i + 1}</span>
                <code className="tb-v2-cron-when">{time}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming runs found.</p>
        )}
      </div>
    </div>
  );
}
