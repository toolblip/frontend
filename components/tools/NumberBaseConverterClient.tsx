'use client';

import { useMemo, useState } from 'react';

type Base = 2 | 8 | 10 | 16;

const BASES: { base: Base; label: string; placeholder: string }[] = [
  { base: 2, label: 'Binary', placeholder: '11111111' },
  { base: 8, label: 'Octal', placeholder: '377' },
  { base: 10, label: 'Decimal', placeholder: '255' },
  { base: 16, label: 'Hex', placeholder: 'FF' },
];

function isValidForBase(value: string, base: Base): boolean {
  if (!value) return true;
  const v = value.startsWith('-') ? value.slice(1) : value;
  if (!v) return false;
  const re = base === 2 ? /^[01]+$/
    : base === 8 ? /^[0-7]+$/
    : base === 10 ? /^\d+$/
    : /^[0-9a-fA-F]+$/;
  return re.test(v);
}

function parseToBigInt(value: string, base: Base): bigint | null {
  if (!isValidForBase(value, base)) return null;
  const negative = value.startsWith('-');
  const v = negative ? value.slice(1) : value;
  if (!v) return null;
  let n = 0n;
  const b = BigInt(base);
  for (const ch of v) {
    n = n * b + BigInt(parseInt(ch, base));
  }
  return negative ? -n : n;
}

function formatBase(n: bigint, base: Base, uppercase = true): string {
  const s = n.toString(base);
  return base === 16 && uppercase ? s.toUpperCase() : s;
}

export default function NumberBaseConverterClient() {
  const [value, setValue] = useState('255');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [copied, setCopied] = useState<Base | null>(null);

  const { decimal, error } = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return { decimal: null as bigint | null, error: '' };
    const parsed = parseToBigInt(trimmed, fromBase);
    if (parsed === null) {
      return { decimal: null, error: `Not a valid base-${fromBase} number.` };
    }
    return { decimal: parsed, error: '' };
  }, [value, fromBase]);

  const copy = (b: Base, val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(b);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Number</span>
        <div className="tb-v2-mode-tabs" role="tablist" aria-label="Source base">
          {BASES.map(({ base, label }) => (
            <button
              key={base}
              type="button"
              role="tab"
              aria-selected={fromBase === base}
              onClick={() => setFromBase(base)}
              className={`tb-v2-mode-tab ${fromBase === base ? 'on' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-nb-input-wrap">
        <input
          type="text"
          inputMode="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={BASES.find((b) => b.base === fromBase)?.placeholder}
          className="tb-v2-nb-input"
          aria-label={`Number in base ${fromBase}`}
          autoComplete="off"
          spellCheck={false}
        />
        {error && <p className="tb-v2-error" role="alert">{error}</p>}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">All bases</span>
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {BASES.map(({ base, label }) => {
          const out = decimal !== null ? formatBase(decimal, base) : '';
          return (
            <div key={base} className="tb-v2-nb-row">
              <span className="tb-v2-nb-label">{label}</span>
              <span className="tb-v2-nb-base">base {base}</span>
              <code className="tb-v2-nb-val">{out || '—'}</code>
              <button
                type="button"
                onClick={() => copy(base, out)}
                disabled={!out}
                className={`tb-v2-copy-btn ${copied === base ? 'done' : ''}`}
                aria-label={`Copy ${label}`}
              >
                {copied === base ? 'Copied' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
