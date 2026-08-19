'use client';

import { useMemo, useState } from 'react';

type Mode = 'add' | 'diff';

function parseHms(value: string): number | null {
  const m = value.match(/^(\d{1,3}):([0-5]?\d):([0-5]?\d)$/);
  if (!m) return null;
  const [, h, mm, s] = m;
  return Number(h) * 3600 + Number(mm) * 60 + Number(s);
}

function formatHms(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? '-' : '';
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.floor(abs % 60);
  return `${sign}${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TimeDurationCalculatorClient() {
  const [mode, setMode] = useState<Mode>('add');
  const [start, setStart] = useState('09:00:00');
  const [duration, setDuration] = useState('01:30:00');
  const [end, setEnd] = useState('17:00:00');

  const addResult = useMemo(() => {
    const s = parseHms(start);
    const d = parseHms(duration);
    if (s === null || d === null) return null;
    const total = s + d;
    const days = Math.floor(total / 86400);
    return { time: formatHms(total % 86400), rolloverDays: days };
  }, [start, duration]);

  const diffResult = useMemo(() => {
    const s = parseHms(start);
    const e = parseHms(end);
    if (s === null || e === null) return null;
    let delta = e - s;
    if (delta < 0) delta += 86400; // assume the end time is the next day
    return formatHms(delta);
  }, [start, end]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-mode-tabs">
        <button
          className={mode === 'add' ? 'tb-v2-mode-tab-active' : 'tb-v2-mode-tab'}
          onClick={() => setMode('add')}
        >
          Start + Duration
        </button>
        <button
          className={mode === 'diff' ? 'tb-v2-mode-tab-active' : 'tb-v2-mode-tab'}
          onClick={() => setMode('diff')}
        >
          Time Between
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        <label className="tb-v2-tool-label">
          Start time (h:mm:ss)
          <input
            className="tb-v2-input"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="9:00:00"
          />
        </label>
        {mode === 'add' ? (
          <label className="tb-v2-tool-label">
            Duration to add (h:mm:ss)
            <input
              className="tb-v2-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="1:30:00"
            />
          </label>
        ) : (
          <label className="tb-v2-tool-label">
            End time (h:mm:ss)
            <input className="tb-v2-input" value={end} onChange={(e) => setEnd(e.target.value)} placeholder="17:00:00" />
          </label>
        )}
      </div>

      <div className="tb-v2-tool-output-body" style={{ marginTop: 16 }}>
        {mode === 'add' ? (
          addResult ? (
            <>
              <strong>{addResult.time}</strong>
              {addResult.rolloverDays > 0 && (
                <span style={{ marginLeft: 8, color: '#6b7280', fontSize: 13 }}>
                  (+{addResult.rolloverDays} day{addResult.rolloverDays > 1 ? 's' : ''})
                </span>
              )}
            </>
          ) : (
            <span style={{ color: '#6b7280' }}>Enter times as h:mm:ss, e.g. 9:00:00</span>
          )
        ) : diffResult ? (
          <strong>{diffResult}</strong>
        ) : (
          <span style={{ color: '#6b7280' }}>Enter times as h:mm:ss, e.g. 9:00:00</span>
        )}
      </div>
    </div>
  );
}
