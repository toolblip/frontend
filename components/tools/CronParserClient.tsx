'use client';

import { useState, useMemo } from 'react';

// ── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRESETS = [
  { label: 'Every minute',   value: '* * * * *' },
  { label: 'Every 5 min',    value: '*/5 * * * *' },
  { label: 'Hourly',         value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Daily noon',     value: '0 12 * * *' },
  { label: 'Every Monday',   value: '0 9 * * 1' },
  { label: 'Weekdays 9 AM',  value: '0 9 * * 1-5' },
  { label: 'Monthly',        value: '0 0 1 * *' },
  { label: 'Yearly',         value: '0 0 1 1 *' },
];

const FIELD_LABELS  = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];
const FIELD_RANGES  = ['0–59',   '0–23', '1–31', '1–12', '0–7'];

// ── Types ────────────────────────────────────────────────────────────────────

interface ParsedCron {
  minutes:     number[];
  hours:       number[];
  daysOfMonth: number[];
  months:      number[];
  daysOfWeek:  number[];
  parts:       string[];
}

interface CronResult {
  valid:       boolean;
  error?:      string;
  parsed?:     ParsedCron;
  description?: string;
  nextRuns?:   Date[];
}

// ── Parsing ──────────────────────────────────────────────────────────────────

const MONTH_NAME_MAP: Record<string, number> = {
  jan:1, feb:2, mar:3, apr:4, may:5, jun:6,
  jul:7, aug:8, sep:9, oct:10, nov:11, dec:12,
};
const DOW_NAME_MAP: Record<string, number> = {
  sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6,
};

function parseCronField(
  raw: string,
  min: number,
  max: number,
  nameMap?: Record<string, number>,
): number[] | null {
  let v = raw.trim().toLowerCase().replace(/\?/g, '*');

  if (nameMap) {
    for (const [name, num] of Object.entries(nameMap)) {
      v = v.replace(new RegExp(`\\b${name}\\b`, 'g'), String(num));
    }
  }

  const results = new Set<number>();

  for (const part of v.split(',')) {
    const p = part.trim();

    // */step
    if (p.startsWith('*/')) {
      const step = parseInt(p.slice(2), 10);
      if (isNaN(step) || step < 1) return null;
      for (let i = min; i <= max; i += step) results.add(i);
      continue;
    }

    // *
    if (p === '*') {
      for (let i = min; i <= max; i++) results.add(i);
      continue;
    }

    // range/step: 1-5/2 or */2
    if (p.includes('/')) {
      const slashIdx = p.lastIndexOf('/');
      const rangePart = p.slice(0, slashIdx);
      const step = parseInt(p.slice(slashIdx + 1), 10);
      if (isNaN(step) || step < 1) return null;

      let start = min;
      let end   = max;
      if (rangePart !== '*') {
        if (rangePart.includes('-')) {
          const [sStr, eStr] = rangePart.split('-');
          start = parseInt(sStr, 10);
          end   = parseInt(eStr, 10);
          if (isNaN(start) || isNaN(end)) return null;
        } else {
          start = parseInt(rangePart, 10);
          if (isNaN(start)) return null;
        }
      }
      for (let i = start; i <= end; i += step) results.add(i);
      continue;
    }

    // range: 1-5
    if (p.includes('-')) {
      const [sStr, eStr] = p.split('-');
      const s = parseInt(sStr, 10);
      const e = parseInt(eStr, 10);
      if (isNaN(s) || isNaN(e) || s > e) return null;
      const clampedS = Math.max(min, s);
      const clampedE = Math.min(max, e);
      if (clampedS > clampedE) return null;
      for (let i = clampedS; i <= clampedE; i++) results.add(i);
      continue;
    }

    // single value
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
    '@yearly':   '0 0 1 1 *',
    '@annually': '0 0 1 1 *',
    '@monthly':  '0 0 1 * *',
    '@weekly':   '0 0 * * 0',
    '@daily':    '0 0 * * *',
    '@midnight': '0 0 * * *',
    '@hourly':   '0 * * * *',
  };

  const resolved = NAMED[trimmed.toLowerCase()] ?? trimmed;
  const parts = resolved.trim().split(/\s+/);

  if (parts.length !== 5) {
    return {
      valid: false,
      error: `Expected 5 fields (minute hour day month weekday), got ${parts.length}`,
    };
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

  // Normalize: 7 → 0 (both mean Sunday)
  const daysOfWeek = [...new Set(rawDow.map(d => (d === 7 ? 0 : d)))].sort((a, b) => a - b);

  const parsed: ParsedCron = { minutes, hours, daysOfMonth, months, daysOfWeek, parts };
  const description = describeSchedule(parsed);
  const nextRuns    = computeNextRuns(parsed, 5);

  return { valid: true, parsed, description, nextRuns };
}

// ── Description ──────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return `${n}th`;
  const suffix: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  return `${n}${suffix[n % 10] ?? 'th'}`;
}

function formatTime(h: number, m: number): string {
  const h12  = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function describeSchedule({ minutes, hours, daysOfMonth, months, daysOfWeek, parts }: ParsedCron): string {
  const [minP, hrP] = parts;

  const allMin = minutes.length === 60;
  const allHr  = hours.length === 24;
  const allDom = daysOfMonth.length === 31;
  const allMon = months.length === 12;
  const allDow = daysOfWeek.length === 7;

  // ── Time segment ──────────────────────────────────────────────────────────

  let timeSeg: string;

  if (allMin && allHr) {
    timeSeg = 'every minute';
  } else if (allMin) {
    timeSeg = hours.length === 1
      ? `every minute past ${hours[0]}:xx`
      : `every minute`;
  } else if (allHr) {
    if (minP.startsWith('*/')) {
      const n = parseInt(minP.split('/')[1], 10);
      timeSeg = n === 1 ? 'every minute' : `every ${n} minutes`;
    } else if (minutes.length === 1 && minutes[0] === 0) {
      timeSeg = 'on the hour';
    } else if (minutes.length === 1) {
      timeSeg = `at minute ${minutes[0]} past each hour`;
    } else {
      timeSeg = `at minutes ${minutes.join(', ')} past each hour`;
    }
  } else {
    // Both hours and minutes are specific
    if (hrP.startsWith('*/') && minutes.length === 1) {
      const n   = parseInt(hrP.split('/')[1], 10);
      const min = String(minutes[0]).padStart(2, '0');
      timeSeg   = n === 1 ? `at :${min} every hour` : `at :${min} every ${n} hours`;
    } else if (hours.length === 1 && minutes.length === 1) {
      timeSeg = `at ${formatTime(hours[0], minutes[0])}`;
    } else if (hours.length <= 3 && minutes.length === 1) {
      timeSeg = `at ${hours.map(h => formatTime(h, minutes[0])).join(' and ')}`;
    } else {
      timeSeg = `at ${hrP}:${minP}`;
    }
  }

  // ── Day segment ───────────────────────────────────────────────────────────

  let daySeg: string | null = null;

  if (!allDow && allDom) {
    const set = new Set(daysOfWeek);
    if (daysOfWeek.length === 5 && [1, 2, 3, 4, 5].every(d => set.has(d))) {
      daySeg = 'weekdays';
    } else if (daysOfWeek.length === 2 && set.has(0) && set.has(6)) {
      daySeg = 'weekends';
    } else if (daysOfWeek.length === 1) {
      daySeg = `${DOW_NAMES[daysOfWeek[0]]}`;
    } else {
      daySeg = daysOfWeek.map(d => DOW_SHORT[d]).join(', ');
    }
  } else if (allDow && !allDom) {
    daySeg = daysOfMonth.length === 1
      ? `the ${ordinal(daysOfMonth[0])} of each month`
      : `days ${daysOfMonth.join(', ')} of the month`;
  } else if (!allDow && !allDom) {
    // Both restricted — standard cron uses OR
    daySeg = `${daysOfMonth.join(',')} or ${daysOfWeek.map(d => DOW_SHORT[d]).join(',')}`;
  }

  // ── Month segment ─────────────────────────────────────────────────────────

  let monthSeg: string | null = null;
  if (!allMon) {
    monthSeg = months.length === 1
      ? `in ${MONTH_NAMES[months[0] - 1]}`
      : `in ${months.map(m => MONTH_SHORT[m - 1]).join(', ')}`;
  }

  // ── Combine ───────────────────────────────────────────────────────────────

  if (allMin && allHr && allDom && allMon && allDow) return 'Every minute';

  const pieces: string[] = [];

  if (timeSeg === 'every minute' && !daySeg && !monthSeg) {
    return 'Every minute';
  }

  if (!daySeg && !monthSeg) {
    // Pure time schedule
    if (timeSeg === 'on the hour') {
      return 'Every hour, on the hour';
    }
    if (timeSeg.startsWith('every ') && !timeSeg.startsWith('every minute')) {
      return timeSeg.charAt(0).toUpperCase() + timeSeg.slice(1);
    }
    return `Every day, ${timeSeg}`;
  }

  if (daySeg) {
    if (daySeg.startsWith('the ') || daySeg.startsWith('days ')) {
      pieces.push(`On ${daySeg}`);
    } else {
      pieces.push(`Every ${daySeg}`);
    }
  }

  if (monthSeg) pieces.push(monthSeg);

  if (timeSeg !== 'every minute') {
    pieces.push(timeSeg);
  }

  return pieces.join(', ');
}

// ── Next-run computation ─────────────────────────────────────────────────────

function computeNextRuns(parsed: ParsedCron, count: number): Date[] {
  const results: Date[] = [];
  const now = new Date();

  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const minuteSet = new Set(parsed.minutes);
  const hourSet   = new Set(parsed.hours);
  const domSet    = new Set(parsed.daysOfMonth);
  const monthSet  = new Set(parsed.months);
  const dowSet    = new Set(parsed.daysOfWeek);

  const domRestricted = parsed.daysOfMonth.length < 31;
  const dowRestricted = parsed.daysOfWeek.length < 7;

  const maxDate = new Date(now);
  maxDate.setFullYear(maxDate.getFullYear() + 4);

  const sortedMonths  = [...parsed.months].sort((a, b) => a - b);
  const sortedHours   = [...parsed.hours].sort((a, b) => a - b);
  const sortedMinutes = [...parsed.minutes].sort((a, b) => a - b);

  let iters = 0;
  const MAX_ITERS = 600_000;

  while (results.length < count && cursor < maxDate && iters < MAX_ITERS) {
    iters++;

    const month = cursor.getMonth() + 1;

    if (!monthSet.has(month)) {
      const next = sortedMonths.find(m => m > month);
      if (next !== undefined) {
        cursor.setMonth(next - 1, 1);
      } else {
        cursor.setFullYear(cursor.getFullYear() + 1);
        cursor.setMonth(sortedMonths[0] - 1, 1);
      }
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    const dom = cursor.getDate();
    const dow = cursor.getDay();

    const domMatch = domRestricted ? domSet.has(dom) : true;
    const dowMatch = dowRestricted ? dowSet.has(dow) : true;
    const dayMatch = domRestricted && dowRestricted
      ? domMatch || dowMatch        // OR when both restricted (standard cron)
      : domMatch && dowMatch;

    if (!dayMatch) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    const hour = cursor.getHours();

    if (!hourSet.has(hour)) {
      const nextHour = sortedHours.find(h => h > hour);
      if (nextHour !== undefined) {
        cursor.setHours(nextHour, 0, 0, 0);
      } else {
        cursor.setDate(cursor.getDate() + 1);
        cursor.setHours(0, 0, 0, 0);
      }
      continue;
    }

    const minute = cursor.getMinutes();

    if (!minuteSet.has(minute)) {
      const nextMin = sortedMinutes.find(m => m > minute);
      if (nextMin !== undefined) {
        cursor.setMinutes(nextMin, 0, 0);
      } else {
        const nextHour = sortedHours.find(h => h > hour);
        if (nextHour !== undefined) {
          cursor.setHours(nextHour, 0, 0, 0);
        } else {
          cursor.setDate(cursor.getDate() + 1);
          cursor.setHours(0, 0, 0, 0);
        }
      }
      continue;
    }

    results.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1, 0, 0);
  }

  return results;
}

// ── Date formatting ───────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  const day   = DOW_SHORT[d.getDay()];
  const month = MONTH_SHORT[d.getMonth()];
  const date  = d.getDate();
  const year  = d.getFullYear();
  const h     = d.getHours();
  const m     = d.getMinutes();
  const h12   = h % 12 || 12;
  const ampm  = h < 12 ? 'AM' : 'PM';
  return `${day}, ${month} ${date}, ${year} — ${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function relativeTime(d: Date): string {
  const diffMs  = d.getTime() - Date.now();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1)  return 'in < 1 min';
  if (diffMin < 60) return `in ${diffMin} min`;
  if (diffHr  < 24) return `in ${diffHr} hr`;
  if (diffDay < 30) return `in ${diffDay} day${diffDay === 1 ? '' : 's'}`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo  < 12) return `in ${diffMo} mo`;
  return `in ${Math.floor(diffDay / 365)} yr`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CronParserClient() {
  const [expression, setExpression] = useState('0 9 * * 1-5');

  const result = useMemo(() => parseCron(expression), [expression]);

  return (
    <div className="space-y-5">

      {/* Input */}
      <div>
        <label htmlFor="cron-input" className="block text-sm font-medium text-gray-300 mb-2">
          Cron Expression
        </label>
        <input
          id="cron-input"
          type="text"
          value={expression}
          onChange={e => setExpression(e.target.value)}
          placeholder="* * * * *"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 font-mono text-lg focus:outline-none focus:border-red-500 placeholder-gray-600 transition-colors"
          aria-label="Cron expression"
          aria-describedby="cron-field-guide"
        />

        {/* Field guide */}
        <div
          id="cron-field-guide"
          className="mt-2 grid grid-cols-5 gap-1 text-center"
          aria-label="Cron field positions"
        >
          {FIELD_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-xs text-gray-600">{FIELD_RANGES[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setExpression(preset.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                expression === preset.value
                  ? 'bg-red-600 border-red-600 text-black font-medium'
                  : 'border-gray-700 text-gray-400 hover:border-red-600 hover:text-red-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result.valid ? (
        <div className="space-y-4">
          {/* Description */}
          <div className="bg-gray-800 border border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-bold">✓</span>
              <span className="text-red-400 text-xs font-medium uppercase tracking-wide">Valid</span>
            </div>
            <p className="text-gray-100 text-base leading-relaxed">{result.description}</p>
          </div>

          {/* Next runs */}
          {result.nextRuns && result.nextRuns.length > 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Next 5 Run Times
              </h3>
              <div className="space-y-0">
                {result.nextRuns.map((date, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 border-b border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 text-xs font-mono w-4 text-right shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-200 text-sm font-mono">{formatDate(date)}</span>
                    </div>
                    <span className="text-gray-500 text-xs shrink-0 ml-3">{relativeTime(date)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                No run times found within the next 4 years for this expression.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4" role="alert">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">✗</span>
            <span className="text-red-300 text-sm">{result.error}</span>
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Quick Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700">
                <th className="text-left pb-2 pr-4 font-medium">Symbol</th>
                <th className="text-left pb-2 pr-4 font-medium">Meaning</th>
                <th className="text-left pb-2 font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['*',        'Any value',         '* = every minute/hour/etc.'],
                [',',        'List separator',     '1,3,5 = values 1, 3, and 5'],
                ['-',        'Range',              '1-5 = 1 through 5'],
                ['/',        'Step',               '*/15 = every 15 units'],
                ['@yearly',  'Once a year',        '= 0 0 1 1 *'],
                ['@monthly', 'Once a month',       '= 0 0 1 * *'],
                ['@weekly',  'Once a week',        '= 0 0 * * 0'],
                ['@daily',   'Once a day',         '= 0 0 * * *'],
                ['@hourly',  'Once an hour',       '= 0 * * * *'],
              ] as [string, string, string][]).map(([sym, meaning, example]) => (
                <tr key={sym} className="border-b border-gray-700/40 last:border-0">
                  <td className="py-1.5 pr-4 font-mono text-red-400">{sym}</td>
                  <td className="py-1.5 pr-4 text-gray-400">{meaning}</td>
                  <td className="py-1.5 text-gray-500">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
