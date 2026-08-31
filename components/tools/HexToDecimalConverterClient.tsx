'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_HEX = 'FF';
const EXAMPLE_DECIMAL = '255';

export default function HexToDecimalConverterClient() {
  const [hex, setHex] = useState('');
  const [decimal, setDecimal] = useState('');
  const [binary, setBinary] = useState('');
  const [hexError, setHexError] = useState('');
  const [decimalError, setDecimalError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const applyHex = useCallback((raw: string) => {
    const cleaned = raw.replace(/^0x/i, '').replace(/\s+/g, '').toUpperCase();
    setHex(cleaned);
    if (!cleaned) {
      setDecimal('');
      setBinary('');
      setHexError('');
      setDecimalError('');
      return;
    }
    if (!/^[0-9A-F]+$/.test(cleaned)) {
      setHexError('Use hex digits 0–9 and A–F.');
      return;
    }
    const n = parseInt(cleaned, 16);
    if (Number.isNaN(n)) {
      setHexError('Invalid hex value.');
      return;
    }
    setDecimal(String(n));
    setBinary(n.toString(2));
    setHexError('');
    setDecimalError('');
  }, []);

  const applyDecimal = useCallback((raw: string) => {
    setDecimal(raw);
    if (!raw.trim()) {
      setHex('');
      setBinary('');
      setHexError('');
      setDecimalError('');
      return;
    }
    if (!/^\d+$/.test(raw.trim())) {
      setDecimalError('Enter a non-negative whole number.');
      return;
    }
    const n = parseInt(raw.trim(), 10);
    if (Number.isNaN(n)) {
      setDecimalError('Invalid decimal value.');
      return;
    }
    setHex(n.toString(16).toUpperCase());
    setBinary(n.toString(2));
    setHexError('');
    setDecimalError('');
  }, []);

  const copy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Hex ↔ Decimal</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => applyHex(EXAMPLE_HEX)}
          onClear={() => {
            setHex('');
            setDecimal('');
            setBinary('');
            setHexError('');
            setDecimalError('');
          }}
          canClear={hex.length > 0 || decimal.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ padding: 20 }}>
          <div className="tb-v2-tool-input-head" style={{ padding: 0, marginBottom: 8 }}>
            <span className="tb-v2-tool-label">Hexadecimal</span>
            <button
              type="button"
              onClick={() => copy('hex', hex)}
              disabled={!hex}
              className={`tb-v2-copy-btn ${copied === 'hex' ? 'done' : ''}`}
            >
              {copied === 'hex' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={hex}
            onChange={(e) => applyHex(e.target.value)}
            placeholder={EXAMPLE_HEX}
            className="tb-v2-input"
            style={{ fontFamily: 'var(--f-mono)', textTransform: 'uppercase' }}
            aria-label="Hexadecimal"
            spellCheck={false}
          />
          {hexError ? (
            <p className="tb-v2-empty" style={{ marginTop: 8, color: 'var(--red)' }}>
              {hexError}
            </p>
          ) : null}
        </div>

        <div style={{ padding: 20 }}>
          <div className="tb-v2-tool-input-head" style={{ padding: 0, marginBottom: 8 }}>
            <span className="tb-v2-tool-label">Decimal</span>
            <button
              type="button"
              onClick={() => copy('decimal', decimal)}
              disabled={!decimal}
              className={`tb-v2-copy-btn ${copied === 'decimal' ? 'done' : ''}`}
            >
              {copied === 'decimal' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={decimal}
            onChange={(e) => applyDecimal(e.target.value)}
            placeholder={EXAMPLE_DECIMAL}
            className="tb-v2-input"
            style={{ fontFamily: 'var(--f-mono)' }}
            aria-label="Decimal"
          />
          {decimalError ? (
            <p className="tb-v2-empty" style={{ marginTop: 8, color: 'var(--red)' }}>
              {decimalError}
            </p>
          ) : null}
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Binary</span>
        <button
          type="button"
          onClick={() => copy('binary', binary)}
          disabled={!binary}
          className={`tb-v2-copy-btn ${copied === 'binary' ? 'done' : ''}`}
        >
          {copied === 'binary' ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!binary ? (
          <p className="tb-v2-empty">Enter hex or decimal, or use Example.</p>
        ) : (
          <code style={{ fontFamily: 'var(--f-mono)', fontSize: 15, wordBreak: 'break-all' }}>{binary}</code>
        )}
      </div>
    </div>
  );
}
