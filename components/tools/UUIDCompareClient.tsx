'use client';

import { useMemo, useState } from 'react';

interface UuidInfo {
  hex32: string;
  dashed: string;
  version: string;
  variant: string;
  timestamp: Date | null;
  timestampError: string | null;
}

function cleanHex(input: string): string {
  return input.trim().replace(/^[{[]/, '').replace(/[}\]]$/, '').replace(/-/g, '').replace(/^urn:uuid:/i, '');
}

function insertDashes(hex32: string): string {
  return `${hex32.slice(0, 8)}-${hex32.slice(8, 12)}-${hex32.slice(12, 16)}-${hex32.slice(16, 20)}-${hex32.slice(20, 32)}`;
}

function detectVariant(hex32: string): string {
  const nibble = parseInt(hex32[16], 16);
  if (isNaN(nibble)) return 'unknown';
  if ((nibble & 0b1000) === 0) return 'NCS (0xxx)';
  if ((nibble & 0b1100) === 0b1000) return 'RFC 4122 (10xx)';
  if ((nibble & 0b1110) === 0b1100) return 'Microsoft (110x)';
  return 'Reserved (111x)';
}

/** UUIDv1: 60-bit count of 100ns intervals since 1582-10-15, split across time_low / time_mid / time_hi_and_version. */
function extractV1Timestamp(hex32: string): { date: Date | null; error: string | null } {
  try {
    const timeLow = BigInt(`0x${hex32.slice(0, 8)}`);
    const timeMid = BigInt(`0x${hex32.slice(8, 12)}`);
    const timeHiAndVersion = BigInt(`0x${hex32.slice(12, 16)}`) & 0x0fffn;
    const intervals = (timeHiAndVersion << 48n) | (timeMid << 32n) | timeLow;
    const GREGORIAN_TO_UNIX_100NS = 0x01b21dd213814000n;
    const unix100ns = intervals - GREGORIAN_TO_UNIX_100NS;
    const unixMs = Number(unix100ns / 10000n);
    const date = new Date(unixMs);
    if (isNaN(date.getTime())) return { date: null, error: 'Timestamp out of range' };
    return { date, error: null };
  } catch (e) {
    return { date: null, error: (e as Error).message };
  }
}

/** UUIDv7: first 48 bits are a big-endian Unix timestamp in milliseconds. */
function extractV7Timestamp(hex32: string): { date: Date | null; error: string | null } {
  const ms = parseInt(hex32.slice(0, 12), 16);
  const date = new Date(ms);
  if (isNaN(date.getTime())) return { date: null, error: 'Timestamp out of range' };
  return { date, error: null };
}

function parseUuid(raw: string): { info: UuidInfo | null; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { info: null, error: '' };
  const hex32 = cleanHex(trimmed).toLowerCase();
  if (hex32.length !== 32) {
    return { info: null, error: `Expected 32 hex characters, got ${hex32.length}.` };
  }
  if (!/^[0-9a-f]{32}$/.test(hex32)) {
    return { info: null, error: 'Input contains non-hexadecimal characters.' };
  }
  const version = hex32[12];
  let timestamp: Date | null = null;
  let timestampError: string | null = null;
  if (version === '1') {
    const r = extractV1Timestamp(hex32);
    timestamp = r.date;
    timestampError = r.error;
  } else if (version === '7') {
    const r = extractV7Timestamp(hex32);
    timestamp = r.date;
    timestampError = r.error;
  }
  return {
    info: { hex32, dashed: insertDashes(hex32), version, variant: detectVariant(hex32), timestamp, timestampError },
    error: '',
  };
}

function fmtDate(d: Date): string {
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

export default function UUIDCompareClient() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const parsedA = useMemo(() => parseUuid(a), [a]);
  const parsedB = useMemo(() => parseUuid(b), [b]);

  const summary = useMemo(() => {
    if (!parsedA.info || !parsedB.info) return null;
    const infoA = parsedA.info;
    const infoB = parsedB.info;
    const equal = infoA.hex32 === infoB.hex32;
    const lexCompare = infoA.dashed < infoB.dashed ? -1 : infoA.dashed > infoB.dashed ? 1 : 0;
    const lexLabel = lexCompare === 0 ? 'a === b' : lexCompare < 0 ? 'a < b (A sorts first)' : 'a > b (B sorts first)';
    let chrono: string | null = null;
    if (infoA.timestamp && infoB.timestamp) {
      const ta = infoA.timestamp.getTime();
      const tb = infoB.timestamp.getTime();
      chrono = ta === tb ? 'Same timestamp' : ta < tb ? 'A is earlier' : 'B is earlier';
    }
    return { equal, lexLabel, chrono };
  }, [parsedA.info, parsedB.info]);

  const rows: { label: string; a: (info: UuidInfo) => string; b: (info: UuidInfo) => string }[] = [
    { label: 'Normalized', a: (i) => i.dashed, b: (i) => i.dashed },
    { label: 'Version', a: (i) => `v${i.version}`, b: (i) => `v${i.version}` },
    { label: 'Variant', a: (i) => i.variant, b: (i) => i.variant },
    { label: 'Timestamp', a: (i) => (i.timestamp ? fmtDate(i.timestamp) : i.timestampError ?? 'not extractable'), b: (i) => (i.timestamp ? fmtDate(i.timestamp) : i.timestampError ?? 'not extractable') },
  ];

  return (
    <div>
      <div className="tb-v2-grid-2">
        <div>
          <span className="tb-v2-tool-label">UUID A</span>
          <input
            type="text"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Paste a UUID…"
            className="tb-v2-input"
            style={{ fontFamily: 'var(--f-mono)' }}
          />
          {parsedA.error && <p className="tb-v2-error" role="alert">{parsedA.error}</p>}
        </div>
        <div>
          <span className="tb-v2-tool-label">UUID B</span>
          <input
            type="text"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Paste a UUID…"
            className="tb-v2-input"
            style={{ fontFamily: 'var(--f-mono)' }}
          />
          {parsedB.error && <p className="tb-v2-error" role="alert">{parsedB.error}</p>}
        </div>
      </div>

      {parsedA.info && parsedB.info && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Field-by-field diff</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--fg-2)', fontWeight: 600 }}>Field</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--fg-2)', fontWeight: 600 }}>UUID A</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--fg-2)', fontWeight: 600 }}>UUID B</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const valA = row.a(parsedA.info as UuidInfo);
                  const valB = row.b(parsedB.info as UuidInfo);
                  const differs = valA !== valB;
                  return (
                    <tr key={row.label} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '6px 8px', color: 'var(--fg-2)' }}>{row.label}</td>
                      <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)', color: differs ? 'var(--red)' : 'var(--fg-0)' }}>{valA}</td>
                      <td style={{ padding: '6px 8px', fontFamily: 'var(--f-mono)', color: differs ? 'var(--red)' : 'var(--fg-0)' }}>{valB}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Summary</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className={`tb-v2-status ${summary?.equal ? 'tb-v2-status-ok' : 'tb-v2-status-info'}`}>
                {summary?.equal ? '✓ Equal' : '○ Not equal'}
              </span>
              <span className="tb-v2-status tb-v2-status-info">Lexicographic: {summary?.lexLabel}</span>
              <span className="tb-v2-status tb-v2-status-info">
                Chronological: {summary?.chrono ?? 'not extractable — needs UUIDv1 or UUIDv7 on both sides'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
