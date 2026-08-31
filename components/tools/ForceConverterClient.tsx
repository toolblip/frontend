'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Unit = 'N' | 'kN' | 'dyn' | 'lbf' | 'kgf' | 'ozf' | 'pdl';

const UNIT_LABELS: Record<Unit, string> = {
  N: 'Newton (N)',
  kN: 'Kilonewton (kN)',
  dyn: 'Dyne (dyn)',
  lbf: 'Pound-force (lbf)',
  kgf: 'Kilogram-force (kgf)',
  ozf: 'Ounce-force (ozf)',
  pdl: 'Poundal (pdl)',
};

const TO_NEWTONS: Record<Unit, number> = {
  N: 1,
  kN: 1000,
  dyn: 1e-5,
  lbf: 4.4482216153,
  kgf: 9.80665,
  ozf: 0.278013851,
  pdl: 0.138254954,
};

function formatNumber(n: number): string {
  if (!isFinite(n)) return '0';
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export default function ForceConverterClient() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>('N');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (!value.trim()) return null;
    const n = parseFloat(value);
    if (isNaN(n)) return null;
    const newtons = n * TO_NEWTONS[fromUnit];
    const out: Record<Unit, number> = {} as Record<Unit, number>;
    (Object.keys(TO_NEWTONS) as Unit[]).forEach((u) => {
      out[u] = newtons / TO_NEWTONS[u];
    });
    return out;
  }, [value, fromUnit]);

  const copyAll = () => {
    if (!results) return;
    const text = (Object.keys(results) as Unit[])
      .map((u) => `${UNIT_LABELS[u]}: ${formatNumber(results[u])}`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Force</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setValue('10');
            setFromUnit('N');
          }}
          onClear={() => {
            setValue('');
            setFromUnit('N');
          }}
          canClear={value.length > 0}
        />
      </div>
      <div className="tb-v2-grid-2" style={{ padding: '0 20px 12px' }}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a value…"
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)' }}
          aria-label="Force value"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value as Unit)}
          className="tb-v2-input"
          aria-label="Force unit"
        >
          {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
            <option key={u} value={u}>
              {UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">All units</span>
        <button
          type="button"
          onClick={copyAll}
          disabled={!results}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy all'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">Enter a value or use Example.</p>
        ) : (
          <div className="tb-v2-stats-grid">
            {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
              <div key={u} className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>{UNIT_LABELS[u]}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{formatNumber(results[u])}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
