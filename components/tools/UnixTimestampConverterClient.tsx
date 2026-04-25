'use client';

import { useState, useEffect } from 'react';

function formatDate(unix: number): string {
  return new Date(unix * 1000).toISOString().replace('T', ' ').replace('Z', ' UTC');
}

export default function UnixTimestampConverterClient() {
  const [input, setInput] = useState('');
  const [nowUnix, setNowUnix] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNowUnix(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const unixToHuman = (val: string): string => {
    const n = parseInt(val.trim(), 10);
    if (isNaN(n)) return '';
    if (n < 0) return 'Invalid (negative)';
    if (n > 9999999999) return 'Invalid (too large for 32-bit)';
    return formatDate(n);
  };

  const humanToUnix = (val: string): string => {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    return String(Math.floor(d.getTime() / 1000));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Current time */}
      <div style={{
        padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 10,
        border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8
      }}>
        <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>Current Unix timestamp:</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 600, color: 'var(--red)' }}>{nowUnix}</span>
      </div>

      {/* Unix → Human */}
      <div>
        <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 6 }}>Unix Timestamp</label>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1745625600"
          style={{
            width: '100%', padding: '10px 14px', fontSize: 14, fontFamily: 'var(--f-mono)',
            border: '1.5px solid var(--line)', borderRadius: 9, background: 'var(--surface)',
            color: 'var(--fg-0)', outline: 'none', boxSizing: 'border-box',
          }}
        />
        {input && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--fg-2)' }}>UTC: </span>
            <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, color: 'var(--fg-0)' }}>{unixToHuman(input) || 'Invalid'}</span>
          </div>
        )}
      </div>

      {/* Common timestamps */}
      <div>
        <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 8 }}>Common Timestamps</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {[
            { label: 'Now', val: nowUnix },
            { label: '1 minute ago', val: nowUnix - 60 },
            { label: '1 hour ago', val: nowUnix - 3600 },
            { label: 'Today midnight UTC', val: Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000) },
            { label: 'Tomorrow midnight', val: Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000) + 86400 },
            { label: 'Jan 1 2027 UTC', val: 1767225600 },
            { label: 'Jan 1 2030 UTC', val: 1893456000 },
          ].map(({ label, val }) => (
            <button
              key={label}
              onClick={() => setInput(String(val))}
              style={{
                padding: '8px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8,
                color: 'var(--fg-1)', textAlign: 'left', transition: 'border-color .1s',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--fg-0)', fontFamily: 'var(--f-mono)', fontSize: 11 }}>{val}</div>
              <div style={{ color: 'var(--fg-3)', marginTop: 2 }}>{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Human → Unix */}
      <div>
        <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 6 }}>Date/Time String to Unix</label>
        <input
          type="datetime-local"
          defaultValue=""
          onChange={(e) => {
            const out = humanToUnix(e.target.value);
            if (out) {
              navigator.clipboard.writeText(out);
            }
          }}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 14,
            border: '1.5px solid var(--line)', borderRadius: 9, background: 'var(--surface)',
            color: 'var(--fg-0)', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <p style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 5 }}>Click a date, then copy the timestamp that appears.</p>
      </div>
    </div>
  );
}
