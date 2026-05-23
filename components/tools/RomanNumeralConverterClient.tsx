'use client';

import { useState } from 'react';

function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return 'Invalid (1-3999)';
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
  }
  return result;
}

function fromRoman(roman: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const curr = map[roman[i]] || 0;
    const next = map[roman[i + 1]] || 0;
    if (curr < next) result -= curr;
    else result += curr;
  }
  return result;
}

export default function RomanNumeralConverterClient() {
  const [number, setNumber] = useState('');
  const [roman, setRoman] = useState('');

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Number</span></div>
      <input
        type="number"
        value={number}
        onChange={e => setNumber(e.target.value)}
        placeholder="Enter a number (1-3999)"
        className="tb-v2-tool-textarea"
        style={{ width: '100%', minHeight: 44, resize: 'none', textAlign: 'center', fontFamily: 'var(--f-mono)' }}
        min={1}
        max={3999}
      />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Roman Numeral</span></div>
      <div className="tb-v2-tool-output-body">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)', letterSpacing: 2 }}>
          {number ? toRoman(parseInt(number)) : ' - '}
        </div>
      </div>
      <div className="tb-v2-tool-input-head" style={{ marginTop: 16 }}><span className="tb-v2-tool-label">Roman Numeral</span></div>
      <input
        type="text"
        value={roman}
        onChange={e => setRoman(e.target.value.toUpperCase())}
        placeholder="Enter Roman numeral (e.g. MMXXIV)"
        className="tb-v2-tool-textarea"
        style={{ width: '100%', minHeight: 44, resize: 'none', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 18, letterSpacing: 2 }}
      />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Number</span></div>
      <div className="tb-v2-tool-output-body">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 28, fontWeight: 700, color: 'var(--tb-accent)' }}>
          {roman ? fromRoman(roman) || 'Invalid' : ' - '}
        </div>
      </div>
    </div>
  );
}
