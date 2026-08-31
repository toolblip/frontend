'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type CookingUnit =
  | 'cups'
  | 'tablespoons'
  | 'teaspoons'
  | 'milliliters'
  | 'liters'
  | 'fluid_oz'
  | 'pounds'
  | 'grams';

const UNIT_LABELS: Record<CookingUnit, string> = {
  cups: 'Cups',
  tablespoons: 'Tablespoons',
  teaspoons: 'Teaspoons',
  milliliters: 'Milliliters',
  liters: 'Liters',
  fluid_oz: 'Fluid ounces',
  pounds: 'Pounds (approx. water)',
  grams: 'Grams (approx. water)',
};

/** Amount of each unit in 1 US cup (water-density for mass units). */
const FACTORS: Record<CookingUnit, number> = {
  cups: 1,
  tablespoons: 16,
  teaspoons: 48,
  milliliters: 236.588,
  liters: 0.236588,
  fluid_oz: 8,
  pounds: 0.5,
  grams: 236.588,
};

function formatValue(n: number): string {
  if (!isFinite(n)) return '0';
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export default function CookingUnitConverterClient() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<CookingUnit>('cups');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (!value.trim()) return null;
    const n = parseFloat(value);
    if (isNaN(n)) return null;
    const cups = n / FACTORS[fromUnit];
    const out: Record<CookingUnit, number> = {} as Record<CookingUnit, number>;
    (Object.keys(FACTORS) as CookingUnit[]).forEach((u) => {
      out[u] = cups * FACTORS[u];
    });
    return out;
  }, [value, fromUnit]);

  const copyAll = () => {
    if (!results) return;
    const text = (Object.keys(results) as CookingUnit[])
      .map((u) => `${UNIT_LABELS[u]}: ${formatValue(results[u])}`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Cooking measure</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setValue('1');
            setFromUnit('cups');
          }}
          onClear={() => {
            setValue('');
            setFromUnit('cups');
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
          aria-label="Cooking value"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value as CookingUnit)}
          className="tb-v2-input"
          aria-label="Cooking unit"
        >
          {(Object.keys(UNIT_LABELS) as CookingUnit[]).map((u) => (
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
            {(Object.keys(UNIT_LABELS) as CookingUnit[]).map((u) => (
              <div key={u} className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>{UNIT_LABELS[u]}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{formatValue(results[u])}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
