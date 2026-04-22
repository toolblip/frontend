'use client';

import { useState } from 'react';

const PRESETS: Record<string, string> = {
  'Every minute': '* * * * *',
  'Every hour': '0 * * * *',
  'Every day midnight': '0 0 * * *',
  'Every Monday': '0 0 * * 1',
  'Every month': '0 0 1 * *',
  'Every Sunday': '0 0 * * 0',
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function getNextRuns(expr: string, count = 5): string[] {
  try {
    const [min, hour, dom, mon, dow] = expr.trim().split(/\s+/);
    const runs: string[] = [];
    const now = new Date();
    let d = new Date(now);
    d.setSeconds(0, 0);
    for (let i = 0; i < 100 && runs.length < count; i++) {
      d = new Date(d.getTime() + 60000);
      const matchMin = min === '*' || parseInt(min) === d.getMinutes();
      const matchHour = hour === '*' || parseInt(hour) === d.getHours();
      const matchDom = dom === '*' || parseInt(dom) === d.getDate();
      const matchDow = dow === '*' || parseInt(dow) === d.getDay();
      const matchMon = mon === '*' || parseInt(mon) === d.getMonth() + 1;
      if (matchMin && matchHour && matchDom && matchMon && matchDow) {
        runs.push(d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
      }
    }
    return runs;
  } catch {
    return [];
  }
}

export default function CronGeneratorClient() {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [mon, setMon] = useState('*');
  const [dow, setDow] = useState('*');

  const expr = `${min} ${hour} ${dom} ${mon} ${dow}`;
  const nextRuns = getNextRuns(expr);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expression</label>
        <input
          type="text"
          value={expr}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'Minute', value: min, set: setMin, options: ['*', ...MINS.map(String)] },
          { label: 'Hour', value: hour, set: setHour, options: ['*', ...HOURS.map(String)] },
          { label: 'Day', value: dom, set: setDom, options: ['*', ...Array.from({ length: 31 }, (_, i) => String(i + 1))] },
          { label: 'Month', value: mon, set: setMon, options: ['*', ...Array.from({ length: 12 }, (_, i) => String(i + 1))] },
          { label: 'Weekday', value: dow, set: setDow, options: ['*', ...DAYS.map((_, i) => String(i))] },
        ].map(({ label, value, set, options }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {options.map((o) => (
                <option key={o} value={o}>{o === '*' ? 'Every' : o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Presets</label>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PRESETS).map(([label, val]) => (
            <button
              key={label}
              onClick={() => {
                const [m, h, d, mo, w] = val.split(' ');
                setMin(m); setHour(h); setDom(d); setMon(mo); setDow(w);
              }}
              className="text-xs px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {nextRuns.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Next 5 runs</p>
          <ul className="space-y-1">
            {nextRuns.map((r, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400">{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
