'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Unit = 'Hz' | 'kHz' | 'MHz' | 'GHz' | 'THz' | 'rpm' | 'radps';

const UNIT_LABELS: Record<Unit, string> = {
  Hz: 'Hertz (Hz)',
  kHz: 'Kilohertz (kHz)',
  MHz: 'Megahertz (MHz)',
  GHz: 'Gigahertz (GHz)',
  THz: 'Terahertz (THz)',
  rpm: 'Revolutions per minute (RPM)',
  radps: 'Radians per second (rad/s)',
};

const TO_HZ: Record<Unit, number> = {
  Hz: 1,
  kHz: 1e3,
  MHz: 1e6,
  GHz: 1e9,
  THz: 1e12,
  rpm: 1 / 60,
  radps: 1 / (2 * Math.PI),
};

function formatNumber(n: number): string {
  if (!isFinite(n)) return '0';
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export default function FrequencyConverterClient() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>('GHz');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (!value.trim()) return null;
    const n = parseFloat(value);
    if (isNaN(n)) return null;
    const hz = n * TO_HZ[fromUnit];
    const out: Record<Unit, number> = {} as Record<Unit, number>;
    (Object.keys(TO_HZ) as Unit[]).forEach((u) => {
      out[u] = hz / TO_HZ[u];
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
        <span className="tb-v2-tool-label">Frequency</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setValue('2.4');
            setFromUnit('GHz');
          }}
          onClear={() => {
            setValue('');
            setFromUnit('GHz');
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
          aria-label="Frequency value"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value as Unit)}
          className="tb-v2-input"
          aria-label="Frequency unit"
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
