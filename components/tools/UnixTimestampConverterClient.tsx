'use client';

import { useState, useEffect } from 'react';

export default function UnixTimestampConverterClient() {
  const [timestamp, setTimestamp] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate');

  const now = Math.floor(Date.now() / 1000);

  const convertToDate = (ts: string) => {
    const n = parseInt(ts);
    if (isNaN(n)) return '';
    try {
      return new Date(n * 1000).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
    } catch { return ''; }
  };

  const convertToTimestamp = (date: string) => {
    try {
      return Math.floor(new Date(date).getTime() / 1000);
    } catch { return null; }
  };

  const handleNow = () => {
    setTimestamp(String(now));
    setDateInput(new Date().toISOString().slice(0, 19).replace('T', ' '));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Converter</span>
        <div className="tb-v2-mode-tabs" role="group">
          <button type="button" onClick={() => setMode('toDate')} className={`tb-v2-mode-tab ${mode === 'toDate' ? 'on' : ''}`}>TS → Date</button>
          <button type="button" onClick={() => setMode('toTimestamp')} className={`tb-v2-mode-tab ${mode === 'toTimestamp' ? 'on' : ''}`}>Date → TS</button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mode === 'toDate' ? (
          <>
            <input
              type="number"
              value={timestamp}
              onChange={e => setTimestamp(e.target.value)}
              placeholder={`e.g. ${now}`}
              className="tb-v2-tool-textarea"
              style={{ width: '100%', minHeight: 44, resize: 'none', fontFamily: 'var(--f-mono)' }}
            />
            <button type="button" onClick={handleNow} className="tb-v2-mode-tab" style={{ alignSelf: 'flex-start' }}>Use current time</button>
          </>
        ) : (
          <input
            type="datetime-local"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ width: '100%', minHeight: 44, resize: 'none', fontFamily: 'var(--f-mono)' }}
          />
        )}
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Result</span></div>
      <div className="tb-v2-tool-output-body">
        {mode === 'toDate' ? (
          timestamp ? (
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 15 }}>
              <div style={{ color: 'var(--tb-text)', marginBottom: 6 }}>{convertToDate(timestamp) || 'Invalid timestamp'}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>
                Local: {timestamp ? new Date(parseInt(timestamp) * 1000).toString() : ' - '}
              </div>
            </div>
          ) : <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a Unix timestamp</div>
        ) : (
          dateInput ? (
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 15 }}>
              <div style={{ color: 'var(--tb-text)' }}>{convertToTimestamp(dateInput) ?? 'Invalid date'}</div>
              <div style={{ fontSize: 12, color: 'var(--tb-text-secondary)', marginTop: 6 }}>
                {dateInput} → {convertToTimestamp(dateInput)} seconds since epoch
              </div>
            </div>
          ) : <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a date/time</div>
        )}
      </div>
    </div>
  );
}
