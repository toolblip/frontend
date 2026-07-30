'use client';

import { useState, useMemo } from 'react';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
type Unit = (typeof UNITS)[number];

const UNIT_ALIASES: Record<string, Unit> = {
  B: 'B', BYTE: 'B', BYTES: 'B',
  KB: 'KB', K: 'KB', KIB: 'KB',
  MB: 'MB', M: 'MB', MIB: 'MB',
  GB: 'GB', G: 'GB', GIB: 'GB',
  TB: 'TB', T: 'TB', TIB: 'TB',
  PB: 'PB', P: 'PB', PIB: 'PB',
};

const EXAMPLE = `500 MB\n2 GB\n1.5 TB\n750000 KB`;

function toBytes(value: number, unit: Unit, base: number): number {
  return value * Math.pow(base, UNITS.indexOf(unit));
}

function fromBytes(bytes: number, unit: Unit, base: number): number {
  return bytes / Math.pow(base, UNITS.indexOf(unit));
}

function roundClean(value: number): string {
  if (!isFinite(value)) return '0';
  return (Math.round(value * 1e4) / 1e4).toLocaleString('en-US', { maximumFractionDigits: 4 });
}

interface LineResult {
  raw: string;
  error?: string;
  converted?: number;
}

function convertLines(text: string, targetUnit: Unit, base: number): LineResult[] {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(raw => {
      const match = raw.match(/^([\d,]+\.?\d*)\s*([A-Za-z]+)$/);
      if (!match) return { raw, error: 'Expected "value unit", e.g. "500 MB"' };
      const num = parseFloat(match[1].replace(/,/g, ''));
      const unit = UNIT_ALIASES[match[2].toUpperCase()];
      if (!unit) return { raw, error: `Unknown unit "${match[2]}"` };
      const bytes = toBytes(num, unit, base);
      return { raw, converted: fromBytes(bytes, targetUnit, base) };
    });
}

export default function DataSizeConverterExpressClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [targetUnit, setTargetUnit] = useState<Unit>('GB');
  const [binary, setBinary] = useState(true);
  const [copied, setCopied] = useState(false);

  const base = binary ? 1024 : 1000;
  const results = useMemo(() => convertLines(input, targetUnit, base), [input, targetUnit, base]);

  const loadExample = () => {
    setInput(EXAMPLE);
    setTargetUnit('GB');
    setBinary(true);
  };

  const outputText = useMemo(
    () => results.map(r => (r.error ? `${r.raw} -> error: ${r.error}` : `${r.raw} -> ${roundClean(r.converted!)} ${targetUnit}`)).join('\n'),
    [results, targetUnit]
  );

  const copy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Sizes (one per line, e.g. &quot;500 MB&quot;)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'500 MB\n2 GB'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 140, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Convert to</label>
          <select value={targetUnit} onChange={e => setTargetUnit(e.target.value as Unit)} className="tb-v2-input">
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 pb-2">
          <input type="checkbox" checked={binary} onChange={e => setBinary(e.target.checked)} />
          <span className="tb-v2-tool-label" style={{ margin: 0 }}>Binary (1024) instead of decimal (1000)</span>
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Converted ({results.length} lines)</span>
        <button type="button" onClick={copy} disabled={!outputText} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {results.length === 0 ? (
          <p className="tb-v2-empty">Enter sizes above, one per line, to convert them in a batch.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {results.map((r, i) => (
              <div key={i} className="tb-v2-tool-pre" style={{ padding: '8px 12px' }}>
                {r.error ? (
                  <span style={{ color: 'var(--red, #dc2626)' }}>{r.raw} &rarr; {r.error}</span>
                ) : (
                  <span>{r.raw} &rarr; {roundClean(r.converted!)} {targetUnit}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
