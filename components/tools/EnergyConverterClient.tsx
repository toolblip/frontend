'use client';

import { useState, useMemo } from 'react';

type Unit = 'J' | 'kJ' | 'cal' | 'kcal' | 'Wh' | 'kWh' | 'BTU' | 'ftlb';

const UNIT_LABELS: Record<Unit, string> = {
  J: 'Joule (J)',
  kJ: 'Kilojoule (kJ)',
  cal: 'Calorie (cal)',
  kcal: 'Kilocalorie / food Calorie (kcal)',
  Wh: 'Watt-hour (Wh)',
  kWh: 'Kilowatt-hour (kWh)',
  BTU: 'BTU (International Table)',
  ftlb: 'Foot-pound (ft-lb)',
};

const TO_JOULES: Record<Unit, number> = {
  J: 1,
  kJ: 1000,
  cal: 4.184,
  kcal: 4184,
  Wh: 3600,
  kWh: 3600000,
  BTU: 1055.06,
  ftlb: 1.35582,
};

function formatNumber(n: number): string {
  if (!isFinite(n)) return '0';
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export default function EnergyConverterClient() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('kWh');
  const [copied, setCopied] = useState(false);

  const numericValue = useMemo(() => {
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
  }, [value]);

  const results = useMemo(() => {
    if (numericValue === null) return null;
    const joules = numericValue * TO_JOULES[fromUnit];
    const out: Record<Unit, number> = {} as Record<Unit, number>;
    (Object.keys(TO_JOULES) as Unit[]).forEach(u => {
      out[u] = joules / TO_JOULES[u];
    });
    return out;
  }, [numericValue, fromUnit]);

  const loadExample = () => {
    setValue('2.5');
    setFromUnit('kWh');
  };

  const copyAll = () => {
    if (!results) return;
    const text = (Object.keys(results) as Unit[]).map(u => `${UNIT_LABELS[u]}: ${formatNumber(results[u])}`).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Energy Value</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div className="tb-v2-grid-2">
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter a value..."
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)' }}
        />
        <select value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)} className="tb-v2-input">
          {(Object.keys(UNIT_LABELS) as Unit[]).map(u => (
            <option key={u} value={u}>{UNIT_LABELS[u]}</option>
          ))}
        </select>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Converted Values</span>
        <button type="button" onClick={copyAll} disabled={!results} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy All'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">Enter a numeric value to see conversions.</p>
        ) : (
          <div className="tb-v2-stats-grid">
            {(Object.keys(UNIT_LABELS) as Unit[]).map(u => (
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
