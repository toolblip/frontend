'use client';

import { useState } from 'react';

const PARTS = ['minute', 'hour', 'day-of-month', 'month', 'day-of-week'];

const CRON_LABELS: Record<string, string> = {
  minute: 'Minute (0-59)',
  hour: 'Hour (0-23)',
  'day-of-month': 'Day of Month (1-31)',
  month: 'Month (1-12)',
  'day-of-week': 'Day of Week (0-6)',
};

function toHuman(cron: string[]): string {
  const parts = cron.map((v, i) => ({ name: PARTS[i], value: v }));
  const human: string[] = [];
  const min = parts.find(p => p.name === 'minute');
  const hr = parts.find(p => p.name === 'hour');
  const dom = parts.find(p => p.name === 'day-of-month');
  const mon = parts.find(p => p.name === 'month');
  const dow = parts.find(p => p.name === 'day-of-week');
  if (min?.value === '*' && hr?.value === '*') human.push('Every minute');
  else if (min?.value === '0' && hr?.value === '*') human.push('Every hour at minute 0');
  else if (min?.value !== '*' && hr?.value === '*') human.push(`At minute ${min?.value} of every hour`);
  else if (min?.value === '0' && hr?.value !== '*') human.push(`Every day at ${hr?.value}:00`);
  else human.push(`At ${hr?.value ?? '*'}:${(min?.value ?? '0').padStart(2, '0')}`);
  if (dom?.value !== '*') human.push(`on day ${dom?.value}`);
  if (mon?.value !== '*') human.push(`in month ${mon?.value}`);
  if (dow?.value !== '*') human.push(`on weekday ${dow?.value}`);
  return human.join(' ') || 'Every minute';
}

export default function CrontabGeneratorClient() {
  const [values, setValues] = useState({ minute: '*', hour: '*', 'day-of-month': '*', month: '*', 'day-of-week': '*' });
  const [mode, setMode] = useState<'tab' | 'expr'>('tab');

  const cron = `${values.minute} ${values.hour} ${values['day-of-month']} ${values.month} ${values['day-of-week']}`;
  const human = toHuman(cron.split(' '));

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Expression Type</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setMode('tab')} className={`tb-v2-mode-tab ${mode === 'tab' ? 'on' : ''}`}>Tab Input</button>
        <button onClick={() => setMode('expr')} className={`tb-v2-mode-tab ${mode === 'expr' ? 'on' : ''}`}>Expression</button>
      </div>
      {mode === 'tab' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {PARTS.map(part => (
            <label key={part} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>{CRON_LABELS[part]}</span>
              <input
                type="text"
                value={values[part as keyof typeof values]}
                onChange={e => setValues({ ...values, [part]: e.target.value })}
                className="tb-v2-tool-textarea"
                style={{ width: 100, minHeight: 32, resize: 'none', fontFamily: 'var(--f-mono)', textAlign: 'center' }}
              />
            </label>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            value={cron}
            onChange={e => {
              const parts = e.target.value.split(' ');
              if (parts.length === 5) {
                setValues({
                  minute: parts[0],
                  hour: parts[1],
                  'day-of-month': parts[2],
                  month: parts[3],
                  'day-of-week': parts[4],
                });
              }
            }}
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', textAlign: 'center', minHeight: 40 }}
            placeholder="* * * * *"
          />
        </div>
      )}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Generated Crontab</span></div>
      <div className="tb-v2-tool-output-body">
        <code style={{ fontFamily: 'var(--f-mono)', fontSize: 15 }}>{cron}</code>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--tb-text-secondary)' }}>{human}</p>
      </div>
    </div>
  );
}
