'use client';

import { useMemo, useState } from 'react';

interface ParsedTime {
  ms: number;
  label: string;
}

function parseTimeInput(raw: string): ParsedTime | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Pure integer/decimal -> treat as a Unix timestamp.
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const n = parseFloat(trimmed);
    if (!isFinite(n)) return null;
    // Heuristic: 10-digit-ish numbers are seconds, 13-digit-ish are milliseconds.
    const digits = Math.abs(Math.trunc(n)).toString().length;
    const ms = digits >= 13 ? n : n * 1000;
    return { ms, label: `${trimmed} (${digits >= 13 ? 'ms' : 's'} epoch)` };
  }

  // Otherwise, try native Date parsing (ISO strings, RFC dates, etc.)
  const parsed = Date.parse(trimmed);
  if (isNaN(parsed)) return null;
  return { ms: parsed, label: new Date(parsed).toISOString() };
}

export default function TimestampDiffCalculatorClient() {
  const [a, setA] = useState('1700000000');
  const [b, setB] = useState('1700086400');

  const { error, parsedA, parsedB } = useMemo(() => {
    if (!a.trim() || !b.trim()) return { error: '', parsedA: null, parsedB: null };
    const pa = parseTimeInput(a);
    const pb = parseTimeInput(b);
    if (!pa) return { error: `Could not parse the first value: "${a}"`, parsedA: null, parsedB: null };
    if (!pb) return { error: `Could not parse the second value: "${b}"`, parsedA: null, parsedB: null };
    return { error: '', parsedA: pa, parsedB: pb };
  }, [a, b]);

  const diff = useMemo(() => {
    if (!parsedA || !parsedB) return null;
    const totalMs = Math.abs(parsedB.ms - parsedA.ms);
    const totalSeconds = totalMs / 1000;
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalMinutes / 60;
    const totalDays = totalHours / 24;

    let remaining = Math.floor(totalSeconds);
    const days = Math.floor(remaining / 86400);
    remaining -= days * 86400;
    const hours = Math.floor(remaining / 3600);
    remaining -= hours * 3600;
    const minutes = Math.floor(remaining / 60);
    remaining -= minutes * 60;
    const seconds = remaining;

    return { totalMs, totalSeconds, totalMinutes, totalHours, totalDays, days, hours, minutes, seconds };
  }, [parsedA, parsedB]);

  const loadExample = () => {
    setA('2024-01-01T00:00:00Z');
    setB('2024-06-15T14:30:00Z');
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Two Timestamps or Dates</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ padding: 20 }}>
        <div className="tb-v2-grid-2">
          <div>
            <span className="tb-v2-tool-label">First value</span>
            <input
              type="text"
              value={a}
              onChange={e => setA(e.target.value)}
              placeholder="Unix timestamp or date string"
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
            />
            {parsedA && <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 4 }}>{parsedA.label}</div>}
          </div>
          <div>
            <span className="tb-v2-tool-label">Second value</span>
            <input
              type="text"
              value={b}
              onChange={e => setB(e.target.value)}
              placeholder="Unix timestamp or date string"
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
            />
            {parsedB && <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 4 }}>{parsedB.label}</div>}
          </div>
        </div>
      </div>

      {error && <div className="tb-v2-error" style={{ margin: '0 20px 20px' }}>{error}</div>}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Difference</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!diff ? (
          <p className="tb-v2-empty">Enter both values to see the difference.</p>
        ) : (
          <>
            <div className="tb-v2-tool-pre" style={{ marginBottom: 16 }}>
              {diff.days} days, {diff.hours} hours, {diff.minutes} minutes, {diff.seconds} seconds
            </div>
            <div className="tb-v2-stats-grid" style={{ background: 'transparent', border: 0, padding: 0 }}>
              <div className="tb-v2-stat-pill">
                <div className="tb-v2-stat-pill-val">{diff.totalSeconds.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                <div className="tb-v2-stat-pill-lbl">Total Seconds</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div className="tb-v2-stat-pill-val">{diff.totalMinutes.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                <div className="tb-v2-stat-pill-lbl">Total Minutes</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div className="tb-v2-stat-pill-val">{diff.totalHours.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                <div className="tb-v2-stat-pill-lbl">Total Hours</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div className="tb-v2-stat-pill-val">{diff.totalDays.toLocaleString('en-US', { maximumFractionDigits: 3 })}</div>
                <div className="tb-v2-stat-pill-lbl">Total Days</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
