'use client';

import { useState, useMemo } from 'react';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Hourly', value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Daily noon', value: '0 12 * * *' },
  { label: 'Weekdays 9 AM', value: '0 9 * * 1-5' },
  { label: 'Monthly 1st', value: '0 0 1 * *' },
  { label: 'Invalid', value: 'abc' },
];

const FIELD_LABELS = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];
const FIELD_RANGES = ['0–59', '0–23', '1–31', '1–12', '0–7'];

const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface ValidationResult {
  valid: boolean;
  error?: string;
  parts?: string[];
  nextRuns?: Date[];
  description?: string;
}

function parseCronField(raw: string, min: number, max: number): number[] | null {
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

function validateCron(expr: string): ValidationResult {
  const trimmed = expr.trim();
  if (!trimmed) return { valid: false, error: 'Enter a cron expression' };
  
  const NAMED: Record<string, string> = {
    '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *',
    '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0',
    '@daily': '0 0 * * *', '@midnight': '0 0 * * *', '@hourly': '0 * * * *',
  };
  const resolved = NAMED[trimmed.toLowerCase()] ?? trimmed;
  const parts = resolved.trim().split(/\s+/);
  
  if (parts.length !== 5) {
    return { valid: false, error: `Expected 5 fields (minute hour day month weekday), got ${parts.length}` };
  }
  
  const [minP, hrP, domP, monP, dowP] = parts;
  
  const minutes = parseCronField(minP, 0, 59);
  if (!minutes) return { valid: false, error: 'Invalid minute field (expected 0-59)' };
  
  const hours = parseCronField(hrP, 0, 23);
  if (!hours) return { valid: false, error: 'Invalid hour field (expected 0-23)' };
  
  const daysOfMonth = parseCronField(domP, 1, 31);
  if (!daysOfMonth) return { valid: false, error: 'Invalid day-of-month field (expected 1-31)' };
  
  const months = parseCronField(monP, 1, 12);
  if (!months) return { valid: false, error: 'Invalid month field (expected 1-12)' };
  
  const daysOfWeek = parseCronField(dowP, 0, 6);
  if (!daysOfWeek) return { valid: false, error: 'Invalid weekday field (expected 0-6)' };
  
  return { valid: true, parts, nextRuns: computeNextRuns(minutes, hours, daysOfMonth, months, daysOfWeek) };
}

function computeNextRuns(minutes: number[], hours: number[], daysOfMonth: number[], months: number[], daysOfWeek: number[]): Date[] {
  const results: Date[] = [];
  const now = new Date();
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  
  const minuteSet = new Set(minutes);
  const hourSet = new Set(hours);
  const domSet = new Set(daysOfMonth);
  const monthSet = new Set(months);
  const dowSet = new Set(daysOfWeek);
  
  const domRestricted = daysOfMonth.length < 31;
  const dowRestricted = daysOfWeek.length < 7;
  
  const sortedMinutes = [...minutes].sort((a, b) => a - b);
  const sortedHours = [...hours].sort((a, b) => a - b);
  const sortedMonths = [...months].sort((a, b) => a - b);
  
  for (let i = 0; i < 500 && results.length < 10; i++) {
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
    
    results.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1, 0, 0);
  }
  
  return results;
}

function formatDate(d: Date): string {
  const day = DOW_SHORT[d.getDay()];
  const month = MONTH_SHORT[d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${day}, ${month} ${date}, ${year} · ${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function relativeTime(d: Date): string {
  const diffMs = d.getTime() - Date.now();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return 'in < 1 min';
  if (diffMin < 60) return `in ${diffMin} min`;
  if (diffHr < 24) return `in ${diffHr} hr`;
  if (diffDay < 30) return `in ${diffDay} day${diffDay === 1 ? '' : 's'}`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return `in ${diffMo} mo`;
  return `in ${Math.floor(diffDay / 365)} yr`;
}

export default function CronValidatorClient() {
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const result = useMemo(() => validateCron(expression), [expression]);

  return (
    <div className="space-y-6">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cron Expression</span>
        <span className={`tb-v2-hash-stats ${result.valid ? 'text-green-500' : 'text-red-500'}`}>
          {result.valid ? 'Valid' : 'Invalid'}
        </span>
      </div>
      
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="* * * * *"
        spellCheck={false}
        autoComplete="off"
        className="tb-v2-cron-input"
        aria-label="Cron expression"
      />
      
      <div className="tb-v2-cron-fields" aria-hidden="true">
        {FIELD_LABELS.map((label, i) => (
          <div key={label} className="tb-v2-cron-field">
            <span className="tb-v2-cron-field-label">{label}</span>
            <span className="tb-v2-cron-field-range">{FIELD_RANGES[i]}</span>
          </div>
        ))}
      </div>

      <div className="tb-v2-cron-presets">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setExpression(p.value)}
            className={`tb-v2-mode-tab ${expression === p.value ? 'on' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {result.valid ? (
        <>
          <div className="tb-v2-cron-summary">
            <span className="tb-v2-cron-summary-label">Schedule</span>
            <p className="tb-v2-cron-summary-text">
              {result.parts && describeSchedule(result.parts)}
            </p>
          </div>

          {result.nextRuns && result.nextRuns.length > 0 ? (
            <>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Next 10 Run Times</span>
              </div>
              <div className="tb-v2-tool-output-body">
                <ul className="tb-v2-cron-list">
                  {result.nextRuns.map((d, i) => (
                    <li key={i} className="tb-v2-cron-row">
                      <span className="tb-v2-cron-num">{i + 1}</span>
                      <code className="tb-v2-cron-when">{formatDate(d)}</code>
                      <span className="tb-v2-cron-rel">{relativeTime(d)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="tb-v2-error" role="status" style={{ marginTop: 12 }}>
              No run times found within the next 4 years.
            </p>
          )}
        </>
      ) : (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>
          <strong>Invalid:</strong> {result.error}
        </p>
      )}
    </div>
  );
}

function describeSchedule(parts: string[]): string {
  const [min, hr, dom, mon, dow] = parts;
  
  const allMin = min === '*';
  const allHr = hr === '*';
  const allDom = dom === '*';
  const allMon = mon === '*';
  const allDow = dow === '*';
  
  if (allMin && allHr && allDom && allMon && allDow) return 'Every minute';
  if (allMin) return 'Every minute';
  if (min.startsWith('*/')) {
    const step = min.slice(2);
    if (allHr) return `Every ${step} minutes`;
  }
  if (min === '0' && allHr) return 'On the hour';
  if (allMin && allHr) return 'Every minute';
  
  let timeDesc = '';
  if (min === '0' && hr !== '*') {
    const h12 = parseInt(hr) % 12 || 12;
    const ampm = parseInt(hr) < 12 ? 'AM' : 'PM';
    timeDesc = `At ${h12}:00 ${ampm}`;
  } else if (hr !== '*' && min !== '*') {
    const h12 = parseInt(hr) % 12 || 12;
    const ampm = parseInt(hr) < 12 ? 'AM' : 'PM';
    timeDesc = `At ${h12}:${min.padStart(2, '0')} ${ampm}`;
  }
  
  let dayDesc = '';
  if (!allDow) {
    if (dow === '1-5') dayDesc = ' on weekdays';
    else if (dow === '0,6') dayDesc = ' on weekends';
    else if (dow === '0') dayDesc = ' on Sundays';
    else if (dow === '1') dayDesc = ' on Mondays';
    else if (dow === '2') dayDesc = ' on Tuesdays';
    else if (dow === '3') dayDesc = ' on Wednesdays';
    else if (dow === '4') dayDesc = ' on Thursdays';
    else if (dow === '5') dayDesc = ' on Fridays';
    else if (dow === '6') dayDesc = ' on Saturdays';
  }
  
  let monthDesc = '';
  if (!allMon) {
    const monNum = parseInt(mon);
    if (!isNaN(monNum) && monNum >= 1 && monNum <= 12) {
      monthDesc = ` in ${MONTH_NAMES[monNum - 1]}`;
    }
  }
  
  return (timeDesc + dayDesc + monthDesc).trim() || 'Custom schedule';
}
