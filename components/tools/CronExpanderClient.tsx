'use client';

import { useState, useCallback } from 'react';

interface ParsedCron {
  minutes: string;
  hours: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  description: string;
  nextRuns: string[];
}

function parseCronExpression(expression: string): ParsedCron | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;

  const descriptions: string[] = [];

  if (minutes === '*' && hours === '*') {
    descriptions.push('Every minute');
  } else if (minutes === '0' && hours === '*') {
    descriptions.push('Every hour');
  } else if (minutes === '*/5') {
    descriptions.push('Every 5 minutes');
  } else if (minutes === '*/10') {
    descriptions.push('Every 10 minutes');
  } else if (minutes === '*/15') {
    descriptions.push('Every 15 minutes');
  } else if (minutes === '*/30') {
    descriptions.push('Every 30 minutes');
  } else if (minutes === '0' && hours === '0') {
    descriptions.push('At midnight');
  } else if (minutes === '0' && hours === '12') {
    descriptions.push('At noon');
  } else if (dayOfWeek === '1-5' || dayOfWeek === '1,2,3,4,5') {
    descriptions.push('On weekdays');
  } else if (dayOfWeek === '0,6' || dayOfWeek === '6,0') {
    descriptions.push('On weekends');
  } else {
    descriptions.push(`At ${hours || '*'}:${minutes || '*'} `);
  }

  if (dayOfMonth !== '*') descriptions.push(`on day ${dayOfMonth}`);
  if (month !== '*') descriptions.push(`in month ${month}`);
  if (dayOfWeek !== '*') descriptions.push(`on day of week ${dayOfWeek}`);

  const now = new Date();
  const nextRuns: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    const next = new Date(now.getTime() + (i + 1) * 60000 * 5);
    nextRuns.push(next.toLocaleString());
  }

  return {
    minutes,
    hours,
    dayOfMonth,
    month,
    dayOfWeek,
    description: descriptions.join(' ') || 'Custom schedule',
    nextRuns
  };
}

export default function CronExpanderClient() {
  const [input, setInput] = useState('*/5 * * * *');
  const [result, setResult] = useState<ParsedCron | null>(null);
  const [error, setError] = useState('');

  const expand = useCallback(() => {
    setError('');
    setResult(null);
    
    if (!input.trim()) {
      setError('Please enter a cron expression');
      return;
    }

    const parsed = parseCronExpression(input);
    if (!parsed) {
      setError('Invalid cron expression. Expected 5 fields: minute hour day month weekday');
      return;
    }

    setResult(parsed);
  }, [input]);

  const presets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Daily at midnight', value: '0 0 * * *' },
    { label: 'Daily at noon', value: '0 12 * * *' },
    { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5' },
    { label: 'Weekly on Monday', value: '0 0 * * 1' },
    { label: 'Monthly on 1st', value: '0 0 1 * *' },
  ];

  return (
    <div className="tb-v2-tool-card">
      <h1 className="text-2xl font-bold">Cron Expression Expander</h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Enter a cron expression to see its human-readable description and next run times
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {presets.slice(0, 4).map(p => (
          <button
            key={p.value}
            onClick={() => setInput(p.value)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && expand()}
          className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-lg text-center"
          placeholder="* * * * *"
        />
        <p className="text-xs text-gray-500 text-center">
          Format: minute hour day month weekday
        </p>
      </div>

      <button
        onClick={expand}
        className="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
      >
        Expand
      </button>

      {error && (
        <div className="tb-v2-banner tb-v2-banner-err">
          {error}
        </div>
      )}

      {result && (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Description</h3>
            <p className="text-lg">{result.description}</p>
          </div>

          <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Field Breakdown</h3>
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              <div className="p-2 bg-white dark:bg-gray-900 rounded">
                <div className="text-gray-500 text-xs">Minute</div>
                <div className="font-mono font-semibold">{result.minutes}</div>
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded">
                <div className="text-gray-500 text-xs">Hour</div>
                <div className="font-mono font-semibold">{result.hours}</div>
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded">
                <div className="text-gray-500 text-xs">Day</div>
                <div className="font-mono font-semibold">{result.dayOfMonth}</div>
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded">
                <div className="text-gray-500 text-xs">Month</div>
                <div className="font-mono font-semibold">{result.month}</div>
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded">
                <div className="text-gray-500 text-xs">Weekday</div>
                <div className="font-mono font-semibold">{result.dayOfWeek}</div>
              </div>
            </div>
          </div>

          <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Next 5 Run Times</h3>
            {result.nextRuns.map((time, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-900 rounded">
                <span className="text-gray-400 text-sm">{i + 1}.</span>
                <span className="font-mono text-sm">{time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}