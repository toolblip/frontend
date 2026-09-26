'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import { useEffect, useMemo, useRef, useState } from 'react';

import { parseCron, computeNextRuns } from '@/lib/developer-general/cron';
import ToolExampleClearActions from './ToolExampleClearActions';
const DOW_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FIELD_LABELS = ['Minute','Hour','Day','Month','Weekday'];
const FIELD_RANGES = ['0–59','0–23','1–31','1–12','0–7'];
const PRESETS = [{label:'Every minute',value:'* * * * *'},{label:'Weekdays 9 AM',value:'0 9 * * 1-5'},{label:'Monthly',value:'0 0 1 * *'}];
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

export default function CronParserClient({count = 5}: {count?: number}) {
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
      setNextRuns(computeNextRuns(result.parsed, count));
    } else {
      setNextRuns(null);
    }
  }, [result,count]);

  if (!isMounted) {
    return (
      <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Cron expression</span><ToolExampleClearActions onExample={() => setExpression('0 9 * * 1-5')} onClear={() => { setExpression(''); setNextRuns(null); }} />
          <span className="tb-v2-hash-stats"> - </span>
        </div>
        <input maxLength={8000} type="text" placeholder="* * * * *" className="tb-v2-cron-input" aria-label="Cron expression" />
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
    <DeveloperGeneralFrame><div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cron expression</span><ToolExampleClearActions onExample={() => setExpression('0 9 * * 1-5')} onClear={() => { setExpression(''); setNextRuns(null); }} />
        <span className="tb-v2-hash-stats">{result.valid ? 'Valid' : 'Invalid'}</span>
      </div>
      <input
        type="text"
        maxLength={256}
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

      {!expression ? null : result.valid ? (
        <>
          <div className="tb-v2-cron-summary">
            <span className="tb-v2-cron-summary-label">Schedule</span>
            <p className="tb-v2-cron-summary-text">{result.description}</p>
          </div>

          {nextRuns && nextRuns.length > 0 ? (
            <>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Next {count} run times</span>
              </div>
              <div className="tb-v2-tool-output-body">
                <ul className="tb-v2-cron-list">
                  {nextRuns.map((d, i) => (
                    <li key={i} className="tb-v2-cron-row">
                      <span className="tb-v2-cron-num">{i + 1}</span>
                      <code className="tb-v2-cron-when">{formatDate(d)}</code>
                      <span className="tb-v2-cron-rel">{now != null ? relativeTime(d, now) : ' - '}</span>
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
    </div></DeveloperGeneralFrame>
  );
}
