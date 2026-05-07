'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  minutes: number[];
  hours: number[];
  daysOfMonth: number[];
  months: number[];
  daysOfWeek: number[];
  parts: string[];
}

interface CronResult {
  valid: boolean;
  error?: string;
  parsed?: ParsedCron;
  description?: string;
  nextRuns?: Date[];
}

const MONTH_NAME_MAP: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const DOW_NAME_MAP: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

function parseCronField(raw: string, min: number, max: number, nameMap?: Record<string, number>): number[] | null {
  let v = raw.trim().toLowerCase().replace(/\?/g, '*');
  if (nameMap) {
    for (const [name, num] of Object.entries(nameMap)) {
      v = v.replace(new RegExp(`\\b${name}\\b`, 'g'), String(num));
    }
  }
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
    if (p.includes('/')) {
      const slashIdx = p.lastIndexOf('/');
      const rangePart = p.slice(0, slashIdx);
      const step = parseInt(p.slice(slashIdx + 1), 10);
      if (isNaN(step) || step < 1) return null;
      let start = min;
      let end = max;
      if (rangePart !== '*') {
        if (rangePart.includes('-')) {
          const [sStr, eStr] = rangePart.split('-');
          start = parseInt(sStr, 10);
          end = parseInt(eStr, 10);
          if (isNaN(start) || isNaN(end)) return null;
        } else {
          start = parseInt(rangePart, 10);
          if (isNaN(start)) return null;
        }
      }
      for (let i = start; i <= end; i += step) results.add(i);
      continue;
    }
    if (p.includes('-')) {
      const [sStr, eStr] = p.split('-');
      const s = parseInt(sStr, 10);
      const e = parseInt(eStr, 10);
      if (isNaN(s) || isNaN(e) || s > e) return null;
      const cs = Math.max(min, s);
      const ce = Math.min(max, e);
      if (cs > ce) return null;
      for (let i = cs; i <= ce; i++) results.add(i);
      continue;
    }
    const n = parseInt(p, 10);
    if (isNaN(n) || n < min || n > max) return null;
    results.add(n);
  }
  if (results.size === 0) return null;
  return [...results].sort((a, b) => a - b);
}

function parseCron(expr: string): CronResult {
  const trimmed = expr.trim();
  if (!trimmed) return { valid: false, error: 'Enter a cron expression' };
  const NAMED: Record<string, string> = {
    '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *', '@monthly': '0 0 1 * *',
    '@weekly': '0 0 * * 0', '@daily': '0 0 * * *', '@midnight': '0 0 * * *', '@hourly': '0 * * * *',
  };
  const resolved = NAMED[trimmed.toLowerCase()] ?? trimmed;
  const parts = resolved.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, error: `Expected 5 fields (minute hour day month weekday), got ${parts.length}` };
  }
  const [minP, hrP, domP, monP, dowP] = parts;
  const minutes = parseCronField(minP, 0, 59);
  if (!minutes) return { valid: false, error: 'Invalid minute field — expected 0–59' };
  const hours = parseCronField(hrP, 0, 23);
  if (!hours) return { valid: false, error: 'Invalid hour field — expected 0–23' };
  const daysOfMonth = parseCronField(domP, 1, 31);
  if (!daysOfMonth) return { valid: false, error: 'Invalid day-of-month field — expected 1–31' };
  const months = parseCronField(monP, 1, 12, MONTH_NAME_MAP);
  if (!months) return { valid: false, error: 'Invalid month field — expected 1–12 or JAN–DEC' };
  const rawDow = parseCronField(dowP, 0, 7, DOW_NAME_MAP);
  if (!rawDow) return { valid: false, error: 'Invalid weekday field — expected 0–7 or SUN–SAT' };
  const daysOfWeek = [...new Set(rawDow.map((d) => (d === 7 ? 0 : d)))].sort((a, b) => a - b);
  const parsed: ParsedCron = { minutes, hours, daysOfMonth, months, daysOfWeek, parts };
  return { valid: true, parsed, description: describeSchedule(parsed) };
}

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return `${n}th`;
  const suffix: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  return `${n}${suffix[n % 10] ?? 'th'}`;
}

function formatTime(h: number, m: number): string {
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function describeSchedule({ minutes, hours, daysOfMonth, months, daysOfWeek, parts }: ParsedCron): string {
  const [minP, hrP] = parts;
  const allMin = minutes.length === 60;
  const allHr = hours.length === 24;
  const allDom = daysOfMonth.length === 31;
  const allMon = months.length === 12;
  const allDow = daysOfWeek.length === 7;

  let timeSeg: string;
  if (allMin && allHr) timeSeg = 'every minute';
  else if (allMin) timeSeg = hours.length === 1 ? `every minute past ${hours[0]}:xx` : `every minute`;
  else if (allHr) {
    if (minP.startsWith('*/')) {
      const n = parseInt(minP.split('/')[1], 10);
      timeSeg = n === 1 ? 'every minute' : `every ${n} minutes`;
    } else if (minutes.length === 1 && minutes[0] === 0) timeSeg = 'on the hour';
    else if (minutes.length === 1) timeSeg = `at minute ${minutes[0]} past each hour`;
    else timeSeg = `at minutes ${minutes.join(', ')} past each hour`;
  } else {
    if (hrP.startsWith('*/') && minutes.length === 1) {
      const n = parseInt(hrP.split('/')[1], 10);
      const min = String(minutes[0]).padStart(2, '0');
      timeSeg = n === 1 ? `at :${min} every hour` : `at :${min} every ${n} hours`;
    } else if (hours.length === 1 && minutes.length === 1) timeSeg = `at ${formatTime(hours[0], minutes[0])}`;
    else if (hours.length <= 3 && minutes.length === 1) timeSeg = `at ${hours.map((h) => formatTime(h, minutes[0])).join(' and ')}`;
    else timeSeg = `at ${hrP}:${minP}`;
  }

  let daySeg: string | null = null;
  if (!allDow && allDom) {
    const set = new Set(daysOfWeek);
    if (daysOfWeek.length === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d))) daySeg = 'weekdays';
    else if (daysOfWeek.length === 2 && set.has(0) && set.has(6)) daySeg = 'weekends';
    else if (daysOfWeek.length === 1) daySeg = `${DOW_NAMES[daysOfWeek[0]]}`;
    else daySeg = daysOfWeek.map((d) => DOW_SHORT[d]).join(', ');
  } else if (allDow && !allDom) {
    daySeg = daysOfMonth.length === 1 ? `the ${ordinal(daysOfMonth[0])} of each month` : `days ${daysOfMonth.join(', ')} of the month`;
  } else if (!allDow && !allDom) {
    daySeg = `${daysOfMonth.join(',')} or ${daysOfWeek.map((d) => DOW_SHORT[d]).join(',')}`;
  }

  let monthSeg: string | null = null;
  if (!allMon) monthSeg = months.length === 1 ? `in ${MONTH_NAMES[months[0] - 1]}` : `in ${months.map((m) => MONTH_SHORT[m - 1]).join(', ')}`;

  if (allMin && allHr && allDom && allMon && allDow) return 'Every minute';
  const pieces: string[] = [];
  if (timeSeg === 'every minute' && !daySeg && !monthSeg) return 'Every minute';
  if (!daySeg && !monthSeg) {
    if (timeSeg === 'on the hour') return 'Every hour, on the hour';
    if (timeSeg.startsWith('every ') && !timeSeg.startsWith('every minute')) return timeSeg.charAt(0).toUpperCase() + timeSeg.slice(1);
    return `Every day, ${timeSeg}`;
  }
  if (daySeg) {
    if (daySeg.startsWith('the ') || daySeg.startsWith('days ')) pieces.push(`On ${daySeg}`);
    else pieces.push(`Every ${daySeg}`);
  }
  if (monthSeg) pieces.push(monthSeg);
  if (timeSeg !== 'every minute') pieces.push(timeSeg);
  return pieces.join(', ');
}

function computeNextRuns(parsed: ParsedCron, count: number): Date[] {
  const results: Date[] = [];
  const now = new Date();
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  const minuteSet = new Set(parsed.minutes);
  const hourSet = new Set(parsed.hours);
  const domSet = new Set(parsed.daysOfMonth);
  const monthSet = new Set(parsed.months);
  const dowSet = new Set(parsed.daysOfWeek);
  const domRestricted = parsed.daysOfMonth.length < 31;
  const dowRestricted = parsed.daysOfWeek.length < 7;
  const maxDate = new Date(now);
  maxDate.setFullYear(maxDate.getFullYear() + 4);
  const sortedMonths = [...parsed.months].sort((a, b) => a - b);
  const sortedHours = [...parsed.hours].sort((a, b) => a - b);
  const sortedMinutes = [...parsed.minutes].sort((a, b) => a - b);
  let iters = 0;
  const MAX_ITERS = 600_000;
  while (results.length < count && cursor < maxDate && iters < MAX_ITERS) {
    iters++;
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

function relativeTime(d: Date, now: number): string {
  const diffMs = d.getTime() - now;
  const diffMin = Math.floor(diffMs / 60_000);
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

export default function CronParserClient() {
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [nextRuns, setNextRuns] = useState<Date[] | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    isMountedRef.current = true;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const result = useMemo(() => {
    if (!isMounted) return { valid: false, error: null, parsed: null, description: null, parts: [] };
    return parseCron(expression);
  }, [expression, isMounted]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    if (result.valid && result.parsed) {
      setNextRuns(computeNextRuns(result.parsed, 5));
    } else {
      setNextRuns(null);
    }
  }, [result]);

  if (!isMounted) {
    return (
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Cron expression</span>
          <span className="tb-v2-hash-stats">—</span>
        </div>
        <input type="text" placeholder="* * * * *" className="tb-v2-cron-input" aria-label="Cron expression" />
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
            <button key={p.value} type="button" className="tb-v2-mode-tab">{p.label}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cron expression</span>
        <span className="tb-v2-hash-stats">{result.valid ? 'Valid' : 'Invalid'}</span>
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
            <p className="tb-v2-cron-summary-text">{result.description}</p>
          </div>

          {nextRuns && nextRuns.length > 0 ? (
            <>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Next 5 run times</span>
              </div>
              <div className="tb-v2-tool-output-body">
                <ul className="tb-v2-cron-list">
                  {nextRuns.map((d, i) => (
                    <li key={i} className="tb-v2-cron-row">
                      <span className="tb-v2-cron-num">{i + 1}</span>
                      <code className="tb-v2-cron-when">{formatDate(d)}</code>
                      <span className="tb-v2-cron-rel">{now != null ? relativeTime(d, now) : '—'}</span>
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
