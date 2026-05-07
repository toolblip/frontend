'use client';

import { useState, useMemo, useEffect } from 'react';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *', desc: 'Runs every minute' },
  { label: 'Every 5 min', value: '*/5 * * * *', desc: 'Runs every 5 minutes' },
  { label: 'Every 15 min', value: '*/15 * * * *', desc: 'Runs every 15 minutes' },
  { label: 'Every hour', value: '0 * * * *', desc: 'Runs at the start of every hour' },
  { label: 'Daily midnight', value: '0 0 * * *', desc: 'Runs at midnight every day' },
  { label: 'Daily 9 AM', value: '0 9 * * *', desc: 'Runs at 9 AM every day' },
  { label: 'Weekdays 9 AM', value: '0 9 * * 1-5', desc: 'Runs at 9 AM on weekdays' },
  { label: 'Weekly Monday', value: '0 0 * * 1', desc: 'Runs at midnight every Monday' },
  { label: 'Monthly 1st', value: '0 0 1 * *', desc: 'Runs at midnight on 1st of month' },
  { label: 'Yearly Jan 1st', value: '0 0 1 1 *', desc: 'Runs at midnight Jan 1st' },
];

const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface CronPart {
  value: string;
  set: (v: string) => void;
  label: string;
  range: string;
  options: { value: string; label: string }[];
}

function getNextRuns(expr: string, count: number = 5): Date[] {
  try {
    const [min, hr, dom, mon, dow] = expr.trim().split(/\s+/);
    const runs: Date[] = [];
    const now = new Date();
    const cursor = new Date(now);
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);
    
    const minuteSet = new Set(min === '*' ? Array.from({length: 60}, (_, i) => i) : 
      min.startsWith('*/') ? Array.from({length: Math.floor(60/parseInt(min.slice(2)))}, (_, i) => i * parseInt(min.slice(2))) :
      min.split(',').map(Number));
    const hourSet = new Set(hr === '*' ? Array.from({length: 24}, (_, i) => i) :
      hr.startsWith('*/') ? Array.from({length: Math.floor(24/parseInt(hr.slice(2)))}, (_, i) => i * parseInt(hr.slice(2))) :
      hr.split(',').map(Number));
    const domSet = new Set(dom === '*' ? [] : dom.split(',').map(Number));
    const monSet = new Set(mon === '*' ? [] : mon.split(',').map(Number));
    const dowSet = new Set(dow === '*' ? [] : dow.split(',').map(Number));
    
    const domAll = dom === '*';
    const dowAll = dow === '*';
    const monAll = mon === '*';
    
    for (let i = 0; i < 500 && runs.length < count; i++) {
      const matchMin = minuteSet.has(cursor.getMinutes());
      const matchHr = hourSet.has(cursor.getHours());
      const matchDom = domAll || domSet.has(cursor.getDate());
      const matchMon = monAll || monSet.has(cursor.getMonth() + 1);
      const matchDow = dowAll || dowSet.has(cursor.getDay());
      
      if (matchMin && matchHr && matchDom && matchMon && matchDow) {
        runs.push(new Date(cursor));
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }
    return runs;
  } catch {
    return [];
  }
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

export default function CronGeneratorV2Client() {
  const [min, setMin] = useState('0');
  const [hour, setHour] = useState('9');
  const [dom, setDom] = useState('*');
  const [mon, setMon] = useState('*');
  const [dow, setDow] = useState('*');
  const [showPresets, setShowPresets] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const expr = `${min} ${hour} ${dom} ${mon} ${dow}`;
  const nextRuns = useMemo(() => mounted ? getNextRuns(expr, 5) : [], [expr, mounted]);

  const applyPreset = (preset: string) => {
    const [m, h, d, mo, w] = preset.split(' ');
    setMin(m);
    setHour(h);
    setDom(d);
    setMon(mo);
    setDow(w);
  };

  const cronParts: CronPart[] = [
    { 
      value: min, set: setMin, 
      label: 'Minute', 
      range: '0-59',
      options: [
        { value: '*', label: 'Every minute' },
        { value: '0', label: '0' },
        { value: '15', label: '15' },
        { value: '30', label: '30' },
        { value: '45', label: '45' },
        { value: '*/5', label: 'Every 5 min' },
        { value: '*/10', label: 'Every 10 min' },
        { value: '*/15', label: 'Every 15 min' },
        { value: '*/30', label: 'Every 30 min' },
      ]
    },
    { 
      value: hour, set: setHour, 
      label: 'Hour', 
      range: '0-23',
      options: [
        { value: '*', label: 'Every hour' },
        { value: '0', label: '0 (midnight)' },
        { value: '6', label: '6 AM' },
        { value: '9', label: '9 AM' },
        { value: '12', label: '12 PM' },
        { value: '18', label: '6 PM' },
        { value: '*/2', label: 'Every 2 hrs' },
        { value: '*/4', label: 'Every 4 hrs' },
        { value: '*/6', label: 'Every 6 hrs' },
      ]
    },
    { 
      value: dom, set: setDom, 
      label: 'Day', 
      range: '1-31',
      options: [
        { value: '*', label: 'Every day' },
        { value: '1', label: '1st' },
        { value: '15', label: '15th' },
        { value: '*/2', label: 'Every 2 days' },
        { value: '*/7', label: 'Every week' },
      ]
    },
    { 
      value: mon, set: setMon, 
      label: 'Month', 
      range: '1-12',
      options: [
        { value: '*', label: 'Every month' },
        { value: '1', label: 'Jan' },
        { value: '4', label: 'Apr' },
        { value: '7', label: 'Jul' },
        { value: '10', label: 'Oct' },
        { value: '*/3', label: 'Every quarter' },
        { value: '*/6', label: 'Every 6 months' },
      ]
    },
    { 
      value: dow, set: setDow, 
      label: 'Weekday', 
      range: '0-6',
      options: [
        { value: '*', label: 'Every day' },
        { value: '0', label: 'Sunday' },
        { value: '1', label: 'Monday' },
        { value: '2', label: 'Tuesday' },
        { value: '3', label: 'Wednesday' },
        { value: '4', label: 'Thursday' },
        { value: '5', label: 'Friday' },
        { value: '6', label: 'Saturday' },
        { value: '1-5', label: 'Weekdays' },
        { value: '0,6', label: 'Weekends' },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cron Expression</span>
        <code className="tb-v2-hash-stats font-mono text-lg">{expr}</code>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {cronParts.map(({ value, set, label, range, options }) => (
          <div key={label} className="space-y-2">
            <div className="text-center">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {label}
              </label>
              <span className="block text-[10px] text-gray-400">{range}</span>
            </div>
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-center"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          {showPresets ? 'Hide' : 'Show'} presets
        </button>
      </div>

      {showPresets && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => applyPreset(p.value)}
              className={`p-3 rounded-xl border text-left transition-all ${
                expr === p.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{p.value}</div>
            </button>
          ))}
        </div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Next 5 Run Times</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {nextRuns.length > 0 ? (
          <ul className="tb-v2-cron-list">
            {nextRuns.map((d, i) => (
              <li key={i} className="tb-v2-cron-row">
                <span className="tb-v2-cron-num">{i + 1}</span>
                <code className="tb-v2-cron-when">{formatDate(d)}</code>
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
