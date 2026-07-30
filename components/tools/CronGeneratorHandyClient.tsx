'use client';

import { useState, useCallback } from 'react';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Daily at noon', value: '0 12 * * *' },
  { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5' },
  { label: 'Weekly on Monday', value: '0 0 * * 1' },
  { label: 'Monthly on the 1st', value: '0 0 1 * *' },
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

interface ParseResult {
  valid: boolean;
  error?: string;
  parts?: string[];
  nextRuns?: Date[];
}

function computeNextRuns(minutes: number[], hours: number[], daysOfMonth: number[], months: number[], daysOfWeek: number[]): Date[] {
  const results: Date[] = [];
  const cursor = new Date();
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

  for (let i = 0; i < 1000 && results.length < 5; i++) {
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

function describeSchedule(parts: string[]): string {
  const [min, hr, dom, mon, dow] = parts;
  const allHr = hr === '*';
  const allDom = dom === '*';
  const allMon = mon === '*';
  const allDow = dow === '*';

  if (min === '*') return 'Every minute';
  if (min.startsWith('*/') && allHr) return `Every ${min.slice(2)} minutes`;
  if (min === '0' && allHr) return 'Every hour, on the hour';

  let timeDesc = '';
  if (hr !== '*') {
    const h12 = parseInt(hr) % 12 || 12;
    const ampm = parseInt(hr) < 12 ? 'AM' : 'PM';
    timeDesc = `At ${h12}:${min.padStart(2, '0')} ${ampm}`;
  } else {
    timeDesc = `At minute ${min} of every hour`;
  }

  let dayDesc = '';
  if (!allDow) {
    if (dow === '1-5') dayDesc = ' on weekdays';
    else if (dow === '0,6' || dow === '6,0') dayDesc = ' on weekends';
    else dayDesc = ` on day-of-week ${dow}`;
  }
  if (!allDom) dayDesc += ` on day ${dom} of the month`;

  let monthDesc = '';
  if (!allMon) {
    const monNum = parseInt(mon);
    monthDesc = !isNaN(monNum) && monNum >= 1 && monNum <= 12 ? ` in ${MONTH_NAMES[monNum - 1]}` : ` in month ${mon}`;
  }

  return (timeDesc + dayDesc + monthDesc).trim() || 'Custom schedule';
}

function validateCron(expr: string): ParseResult {
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

function formatDate(d: Date): string {
  const day = DOW_SHORT[d.getDay()];
  const month = MONTH_SHORT[d.getMonth()];
  const date = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${day}, ${month} ${date} · ${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function CronGeneratorHandyClient() {
  const [expr, setExpr] = useState('0 9 * * 1-5');
  const [result, setResult] = useState<ParseResult>(() => validateCron('0 9 * * 1-5'));

  const generate = useCallback((value?: string) => {
    const e = value ?? expr;
    setExpr(e);
    setResult(validateCron(e));
  }, [expr]);

  const loadExample = () => generate('*/15 9-17 * * 1-5');

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Handy Cron Generator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generate()}
          placeholder="* * * * *"
          spellCheck={false}
          autoComplete="off"
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)', flex: 1 }}
        />
        <button type="button" onClick={() => generate()} className="tb-v2-btn tb-v2-btn-primary">Generate</button>
      </div>

      <div className="tb-v2-cron-presets" style={{ marginTop: 12 }}>
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => generate(p.value)}
            className={`tb-v2-mode-tab ${expr === p.value ? 'on' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {result.valid ? (
        <>
          <div className="tb-v2-cron-summary" style={{ marginTop: 16 }}>
            <span className="tb-v2-cron-summary-label">Schedule</span>
            <p className="tb-v2-cron-summary-text">{result.parts && describeSchedule(result.parts)}</p>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Next 5 Run Times</span>
          </div>
          <div className="tb-v2-tool-output-body">
            {result.nextRuns && result.nextRuns.length > 0 ? (
              <ul className="tb-v2-cron-list">
                {result.nextRuns.map((d, i) => (
                  <li key={i} className="tb-v2-cron-row">
                    <span className="tb-v2-cron-num">{i + 1}</span>
                    <code className="tb-v2-cron-when">{formatDate(d)}</code>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>No upcoming runs found.</p>
            )}
          </div>
        </>
      ) : (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>
          <strong>Invalid:</strong> {result.error}
        </p>
      )}
    </div>
  );
}
