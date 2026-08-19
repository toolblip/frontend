'use client';

import { useMemo, useState } from 'react';

function cleanHex(input: string): string {
  return input.trim().replace(/^[{[]/, '').replace(/[}\]]$/, '').replace(/-/g, '').replace(/^urn:uuid:/i, '');
}

function insertDashes(hex32: string): string {
  return `${hex32.slice(0, 8)}-${hex32.slice(8, 12)}-${hex32.slice(12, 16)}-${hex32.slice(16, 20)}-${hex32.slice(20, 32)}`;
}

function detectVersion(hex32: string): string {
  const nibble = hex32[12];
  return /[0-9a-f]/.test(nibble) ? nibble : '?';
}

function detectVariant(hex32: string): string {
  const nibble = parseInt(hex32[16], 16);
  if (isNaN(nibble)) return 'unknown';
  if ((nibble & 0b1000) === 0) return 'NCS backward compatibility (0xxx)';
  if ((nibble & 0b1100) === 0b1000) return 'RFC 4122 / DCE (10xx)';
  if ((nibble & 0b1110) === 0b1100) return 'Microsoft GUID (110x)';
  return 'Reserved for future use (111x)';
}

interface ParseResult {
  hex32: string;
  version: string;
  variant: string;
}

function parseUuid(raw: string): { result: ParseResult | null; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { result: null, error: '' };
  const hex32 = cleanHex(trimmed);
  if (hex32.length !== 32) {
    return { result: null, error: `Expected 32 hex characters (ignoring braces/dashes), got ${hex32.length}.` };
  }
  if (!/^[0-9a-fA-F]{32}$/.test(hex32)) {
    return { result: null, error: 'Input contains non-hexadecimal characters.' };
  }
  const lower = hex32.toLowerCase();
  return {
    result: { hex32: lower, version: detectVersion(lower), variant: detectVariant(lower) },
    error: '',
  };
}

export default function UUIDNormalizerClient() {
  const [input, setInput] = useState('550e8400-E29B-41D4-A716-446655440000');
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => parseUuid(input), [input]);

  const normalized = useMemo(() => {
    if (!result) return null;
    const dashed = insertDashes(result.hex32);
    return uppercase ? dashed.toUpperCase() : dashed;
  }, [result, uppercase]);

  const copy = () => {
    if (!normalized) return;
    navigator.clipboard.writeText(normalized).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">UUID</span>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Case">
          <button type="button" onClick={() => setUppercase(false)} className={`tb-v2-mode-tab ${!uppercase ? 'on' : ''}`} aria-pressed={!uppercase}>lowercase</button>
          <button type="button" onClick={() => setUppercase(true)} className={`tb-v2-mode-tab ${uppercase ? 'on' : ''}`} aria-pressed={uppercase}>UPPERCASE</button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a UUID in any format: {braces}, urn:uuid:, no dashes…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="UUID input"
      />

      {error && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>{error}</p>
      )}

      {normalized && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Normalized (8-4-4-4-12)</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">{normalized}</pre>
            <div className="tb-v2-stats-grid" style={{ marginTop: 12 }}>
              <div className="tb-v2-stat-pill">
                <div className="tb-v2-stat-pill-lbl">Version</div>
                <div className="tb-v2-stat-pill-val">{result?.version}</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div className="tb-v2-stat-pill-lbl">Variant</div>
                <div className="tb-v2-stat-pill-val">{result?.variant}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
