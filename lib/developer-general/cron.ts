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

export function parseCronField(raw: string, min: number, max: number, nameMap?: Record<string, number>): number[] | null {
  let v = raw.trim().toLowerCase();
  if (v.length > 256) return null;
  if (nameMap) for (const [name, num] of Object.entries(nameMap)) v = v.replace(new RegExp(`\\b${name}\\b`, 'g'), String(num));
  const values = new Set<number>();
  for (const part of v.split(',')) {
    const m = part.match(/^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/);
    if (!m) return null;
    const step = m[2] === undefined ? 1 : Number(m[2]);
    if (!Number.isSafeInteger(step) || step < 1 || step > max - min + 1) return null;
    const range = m[1].split('-').map(Number);
    const start = m[1] === '*' ? min : range[0];
    const end = m[1] === '*' || (m[2] && range.length === 1) ? max : (range[1] ?? start);
    if (start < min || end > max || start > end) return null;
    for (let n = start; n <= end; n += step) values.add(n);
  }
  return values.size ? [...values].sort((a, b) => a - b) : null;
}

export function parseCron(expr: string): CronResult {
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
  if (!minutes) return { valid: false, error: 'Invalid minute field  -  expected 0–59' };
  const hours = parseCronField(hrP, 0, 23);
  if (!hours) return { valid: false, error: 'Invalid hour field  -  expected 0–23' };
  const daysOfMonth = parseCronField(domP, 1, 31);
  if (!daysOfMonth) return { valid: false, error: 'Invalid day-of-month field  -  expected 1–31' };
  const months = parseCronField(monP, 1, 12, MONTH_NAME_MAP);
  if (!months) return { valid: false, error: 'Invalid month field  -  expected 1–12 or JAN–DEC' };
  const rawDow = parseCronField(dowP, 0, 7, DOW_NAME_MAP);
  if (!rawDow) return { valid: false, error: 'Invalid weekday field  -  expected 0–7 or SUN–SAT' };
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
  else if (allMin) timeSeg = `every minute during hours ${hours.join(', ')}`;
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
  pieces.push(timeSeg);
  return pieces.join(', ');
}

export function computeNextRuns(parsed: ParsedCron, count: number, now = new Date()): Date[] {
  const results: Date[] = [];
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  const minuteSet = new Set(parsed.minutes);
  const hourSet = new Set(parsed.hours);
  const domSet = new Set(parsed.daysOfMonth);
  const monthSet = new Set(parsed.months);
  const dowSet = new Set(parsed.daysOfWeek);
  const domRestricted = !parsed.parts[2].startsWith('*');
  const dowRestricted = !parsed.parts[4].startsWith('*');
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
