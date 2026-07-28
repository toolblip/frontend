"use client";
import { useState, useMemo } from 'react';

export default function DecimalToHexConverterClient() {
  const [decimal, setDecimal] = useState(255);
  const result = useMemo(() => {
    const hex = decimal.toString(16).toUpperCase();
    const bin = decimal.toString(2);
    const oct = decimal.toString(8);
    return { hex, bin, oct, padded: hex.padStart(2, '0') };
  }, [decimal]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Decimal</span></div>
      <input type="number" value={decimal} onChange={e => setDecimal(+e.target.value)}
        className="tb-v2-tool-textarea" style={{ fontSize: '1.25rem', fontFamily: 'monospace' }} />
      <div style={{ marginTop: '1rem' }}>
        {[
          { label: 'Hexadecimal', value: '0x' + result.hex, color: '#667eea' },
          { label: 'Binary', value: '0b' + result.bin, color: '#16a34a' },
          { label: 'Octal', value: '0o' + result.oct, color: '#d97706' },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem',
            borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
            <span style={{ color: '#6b7280' }}>{f.label}</span>
            <code style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 600, color: f.color }}>{f.value}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
