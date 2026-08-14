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

function UuidPanel({ label, value, onChange, info, error }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  info: UuidInfo | null;
  error: string;
}) {
  return (
    <div>
      <span className="tb-v2-tool-label">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a UUID…"
        className="tb-v2-input"
        style={{ fontFamily: 'var(--f-mono)' }}
      />
      {error && <p className="tb-v2-error" role="alert">{error}</p>}
      {info && (
        <div className="tb-v2-stats-grid" style={{ marginTop: 10 }}>
          <div className="tb-v2-stat-pill">
            <div className="tb-v2-stat-pill-lbl">Version</div>
            <div className="tb-v2-stat-pill-val">v{info.version}</div>
          </div>
          <div className="tb-v2-stat-pill">
            <div className="tb-v2-stat-pill-lbl">Variant</div>
            <div className="tb-v2-stat-pill-val">{info.variant}</div>
          </div>
          <div className="tb-v2-stat-pill">
            <div className="tb-v2-stat-pill-lbl">Timestamp</div>
            <div className="tb-v2-stat-pill-val">
              {info.timestamp ? fmtDate(info.timestamp) : info.timestampError ? info.timestampError : 'not extractable'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UUIDComparatorClient() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const parsedA = useMemo(() => parseUuid(a), [a]);
  const parsedB = useMemo(() => parseUuid(b), [b]);

  const comparison = useMemo(() => {
    if (!parsedA.info || !parsedB.info) return null;
    const equal = parsedA.info.hex32 === parsedB.info.hex32;
    let chrono: string | null = null;
    if (parsedA.info.timestamp && parsedB.info.timestamp) {
      const ta = parsedA.info.timestamp.getTime();
      const tb = parsedB.info.timestamp.getTime();
      if (ta === tb) chrono = 'Both UUIDs have the same embedded timestamp.';
      else chrono = ta < tb ? 'UUID A is chronologically earlier.' : 'UUID B is chronologically earlier.';
    }
    return { equal, chrono };
  }, [parsedA.info, parsedB.info]);

  return (
    <div>
      <div className="tb-v2-grid-2">
        <UuidPanel label="UUID A" value={a} onChange={setA} info={parsedA.info} error={parsedA.error} />
        <UuidPanel label="UUID B" value={b} onChange={setB} info={parsedB.info} error={parsedB.error} />
      </div>

      {comparison && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Comparison</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className={`tb-v2-status ${comparison.equal ? 'tb-v2-status-ok' : 'tb-v2-status-info'}`}>
                {comparison.equal ? '✓ UUIDs are equal' : '○ UUIDs are not equal'}
              </span>
              {comparison.chrono && (
                <span className="tb-v2-status tb-v2-status-info">{comparison.chrono}</span>
              )}
              {!comparison.chrono && (
                <p className="tb-v2-hash-stats">
                  Chronological comparison needs an extractable timestamp on both sides (UUIDv1 or UUIDv7 only).
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
