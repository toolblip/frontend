'use client';

import { useState, useMemo } from 'react';

const UNITS = ['px', 'rem', 'em', 'pt', 'pc', 'in', 'cm', 'mm'] as const;
type Unit = typeof UNITS[number];

const EXAMPLE = `16px\n1.5rem\n12pt\n2em\n0.5in`;

function toPx(value: number, unit: Unit, base: number): number {
  switch (unit) {
    case 'px': return value;
    case 'rem': return value * base;
    case 'em': return value * base;
    case 'pt': return value * (96 / 72);
    case 'pc': return value * 16;
    case 'in': return value * 96;
    case 'cm': return value * (96 / 2.54);
    case 'mm': return value * (96 / 25.4);
  }
}

function fromPx(px: number, unit: Unit, base: number): number {
  switch (unit) {
    case 'px': return px;
    case 'rem': return px / base;
    case 'em': return px / base;
    case 'pt': return px * (72 / 96);
    case 'pc': return px / 16;
    case 'in': return px / 96;
    case 'cm': return px * (2.54 / 96);
    case 'mm': return px * (25.4 / 96);
  }
}

function roundClean(n: number): string {
  return (Math.round(n * 10000) / 10000).toString();
}

function parseValueUnit(raw: string): { value: number; unit: Unit } | null {
  const m = raw.trim().match(/^(-?\d+(?:\.\d+)?)\s*(px|rem|em|pt|pc|in|cm|mm)$/i);
  if (!m) return null;
  return { value: parseFloat(m[1]), unit: m[2].toLowerCase() as Unit };
}

export default function CssUnitsConverterNewClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [targetUnit, setTargetUnit] = useState<Unit>('rem');
  const [baseFontSize, setBaseFontSize] = useState('16');

  const base = parseFloat(baseFontSize) || 16;

  const results = useMemo(() => {
    return input
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const parsed = parseValueUnit(line);
        if (!parsed) return { original: line, converted: null };
        const px = toPx(parsed.value, parsed.unit, base);
        return { original: line, converted: `${roundClean(fromPx(px, targetUnit, base))}${targetUnit}` };
      });
  }, [input, targetUnit, base]);

  const loadExample = () => setInput(EXAMPLE);

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Values (one per line, e.g. 16px)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="16px&#10;1.5rem"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Convert To</label>
          <select value={targetUnit} onChange={e => setTargetUnit(e.target.value as Unit)} className="tb-v2-input">
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Base Font Size (for em/rem)</label>
          <input
            type="number"
            value={baseFontSize}
            onChange={e => setBaseFontSize(e.target.value)}
            className="tb-v2-input"
            style={{ width: 120 }}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <p className="tb-v2-empty">Enter one or more values above (e.g. 16px, 1.5rem) to convert them in bulk.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {results.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <code className="text-sm" style={{ fontFamily: 'var(--f-mono)' }}>{r.original}</code>
              <span className="text-gray-400">→</span>
              <code className="text-sm font-medium" style={{ fontFamily: 'var(--f-mono)' }}>
                {r.converted ?? 'Invalid value'}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
