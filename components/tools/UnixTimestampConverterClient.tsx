'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_TS = '1704067200'; // 2024-01-01 00:00:00 UTC

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toDatetimeLocal(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function timestampToDate(raw: string): { date: string; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { date: '', error: '' };
  if (!/^\d+$/.test(trimmed)) {
    return { date: '', error: 'Timestamp must contain digits only' };
  }
  const n = parseInt(trimmed, 10);
  const d = new Date(n * 1000);
  if (isNaN(d.getTime())) {
    return { date: '', error: 'Invalid timestamp' };
  }
  return { date: toDatetimeLocal(d), error: '' };
}

function dateToTimestamp(raw: string): { ts: string; error: string } {
  if (!raw) return { ts: '', error: '' };
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    return { ts: '', error: 'Invalid date' };
  }
  return { ts: String(Math.floor(d.getTime() / 1000)), error: '' };
}

export default function UnixTimestampConverterClient() {
  const [timestamp, setTimestamp] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timestampError, setTimestampError] = useState('');
  const [dateError, setDateError] = useState('');
  const [copiedTs, setCopiedTs] = useState(false);
  const [copiedDate, setCopiedDate] = useState(false);

  const applyTimestamp = useCallback((raw: string) => {
    setTimestamp(raw);
    if (!raw.trim()) {
      setDateInput('');
      setTimestampError('');
      setDateError('');
      return;
    }
    const { date, error } = timestampToDate(raw);
    if (error) {
      setTimestampError(error);
      return;
    }
    setDateInput(date);
    setTimestampError('');
    setDateError('');
  }, []);

  const applyDate = useCallback((raw: string) => {
    setDateInput(raw);
    if (!raw) {
      setTimestamp('');
      setTimestampError('');
      setDateError('');
      return;
    }
    const { ts, error } = dateToTimestamp(raw);
    if (error) {
      setDateError(error);
      return;
    }
    setTimestamp(ts);
    setTimestampError('');
    setDateError('');
  }, []);

  const loadExample = useCallback(() => {
    applyTimestamp(EXAMPLE_TS);
  }, [applyTimestamp]);

  const clearAll = useCallback(() => {
    setTimestamp('');
    setDateInput('');
    setTimestampError('');
    setDateError('');
  }, []);

  const useNow = useCallback(() => {
    const ts = String(Math.floor(Date.now() / 1000));
    applyTimestamp(ts);
  }, [applyTimestamp]);

  const copyTimestamp = useCallback(() => {
    if (!timestamp) return;
    navigator.clipboard.writeText(timestamp).catch(() => {});
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 1500);
  }, [timestamp]);

  const copyDate = useCallback(() => {
    if (!dateInput) return;
    navigator.clipboard.writeText(dateInput).catch(() => {});
    setCopiedDate(true);
    setTimeout(() => setCopiedDate(false), 1500);
  }, [dateInput]);

  const localPreview =
    timestamp && /^\d+$/.test(timestamp.trim()) && !isNaN(parseInt(timestamp, 10))
      ? new Date(parseInt(timestamp, 10) * 1000).toString()
      : '';

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Unix Timestamp Converter</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button type="button" onClick={useNow} className="tb-v2-tool-text-action">
            Now
          </button>
          <ToolExampleClearActions
            exampleCount={1}
            onExample={loadExample}
            onClear={clearAll}
            canClear={Boolean(timestamp || dateInput)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 200 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Unix timestamp (seconds)</span>
            <button
              type="button"
              onClick={copyTimestamp}
              disabled={!timestamp}
              className={`tb-v2-copy-btn ${copiedTs ? 'done' : ''}`}
            >
              {copiedTs ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <input
              type="text"
              inputMode="numeric"
              value={timestamp}
              onChange={(e) => applyTimestamp(e.target.value)}
              placeholder={EXAMPLE_TS}
              className="tb-v2-tool-input"
              style={{ width: '100%', fontFamily: 'var(--f-mono)' }}
              aria-label="Unix timestamp input"
              spellCheck={false}
            />
            {localPreview ? (
              <p style={{ fontSize: 12, color: 'var(--tb-text-secondary)', margin: '8px 0 0' }}>
                Local: {localPreview}
              </p>
            ) : null}
            {timestampError ? (
              <p className="tb-v2-error" role="alert" style={{ margin: '8px 0 0' }}>
                {timestampError}
              </p>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 200 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Date & time</span>
            <button
              type="button"
              onClick={copyDate}
              disabled={!dateInput}
              className={`tb-v2-copy-btn ${copiedDate ? 'done' : ''}`}
            >
              {copiedDate ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => applyDate(e.target.value)}
              className="tb-v2-tool-input"
              style={{ width: '100%', fontFamily: 'var(--f-mono)' }}
              aria-label="Date and time input"
            />
            {dateError ? (
              <p className="tb-v2-error" role="alert" style={{ margin: '8px 0 0' }}>
                {dateError}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
