'use client';

import { useCallback, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_NUMBER = String(new Date().getFullYear());

function toRoman(num: number): { roman: string; error: string } {
  if (!Number.isFinite(num) || num <= 0 || num > 3999) {
    return { roman: '', error: 'Number must be between 1 and 3999' };
  }
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let n = Math.floor(num);
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return { roman: result, error: '' };
}

function fromRoman(roman: string): { number: string; error: string } {
  const trimmed = roman.trim().toUpperCase();
  if (!trimmed) return { number: '', error: '' };
  if (!/^[IVXLCDM]+$/.test(trimmed)) {
    return { number: '', error: 'Roman numerals use I, V, X, L, C, D, M only' };
  }
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const curr = map[trimmed[i]] ?? 0;
    const next = map[trimmed[i + 1]] ?? 0;
    if (curr < next) result -= curr;
    else result += curr;
  }
  if (result <= 0 || result > 3999) {
    return { number: '', error: 'Invalid Roman numeral' };
  }
  return { number: String(result), error: '' };
}

const EXAMPLE_ROMAN = toRoman(parseInt(EXAMPLE_NUMBER, 10)).roman;

export default function RomanNumeralConverterClient() {
  const [number, setNumber] = useState('');
  const [roman, setRoman] = useState('');
  const [numberError, setNumberError] = useState('');
  const [romanError, setRomanError] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedRoman, setCopiedRoman] = useState(false);

  const applyNumber = useCallback((raw: string) => {
    setNumber(raw);
    if (!raw.trim()) {
      setRoman('');
      setNumberError('');
      setRomanError('');
      return;
    }
    const n = parseInt(raw, 10);
    const { roman: converted, error } = toRoman(n);
    if (error) {
      setNumberError(error);
      return;
    }
    setRoman(converted);
    setNumberError('');
    setRomanError('');
  }, []);

  const applyRoman = useCallback((raw: string) => {
    const upper = raw.toUpperCase();
    setRoman(upper);
    if (!upper.trim()) {
      setNumber('');
      setNumberError('');
      setRomanError('');
      return;
    }
    const { number: converted, error } = fromRoman(upper);
    if (error) {
      setRomanError(error);
      return;
    }
    setNumber(converted);
    setNumberError('');
    setRomanError('');
  }, []);

  const copy = (value: string, which: 'number' | 'roman') => {
    if (!value) return;
    navigator.clipboard.writeText(value).catch(() => {});
    if (which === 'number') {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 1500);
    } else {
      setCopiedRoman(true);
      setTimeout(() => setCopiedRoman(false), 1500);
    }
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Roman Numeral Converter</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => applyNumber(EXAMPLE_NUMBER)}
          onClear={() => {
            setNumber('');
            setRoman('');
            setNumberError('');
            setRomanError('');
          }}
          canClear={Boolean(number || roman)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-[var(--line)] md:divide-y-0 md:divide-x">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 200 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Number (1–3999)</span>
            <button
              type="button"
              onClick={() => copy(number, 'number')}
              disabled={!number}
              className={`tb-v2-copy-btn ${copiedNumber ? 'done' : ''}`}
            >
              {copiedNumber ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <input
              type="text"
              inputMode="numeric"
              value={number}
              onChange={(e) => applyNumber(e.target.value.replace(/[^\d]/g, ''))}
              placeholder={EXAMPLE_NUMBER}
              className="tb-v2-tool-input"
              style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 20, textAlign: 'center' }}
              aria-label="Arabic number input"
            />
            {numberError ? <p className="tb-v2-error" role="alert" style={{ marginTop: 8 }}>{numberError}</p> : null}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 200 }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Roman numeral</span>
            <button
              type="button"
              onClick={() => copy(roman, 'roman')}
              disabled={!roman}
              className={`tb-v2-copy-btn ${copiedRoman ? 'done' : ''}`}
            >
              {copiedRoman ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <input
              type="text"
              value={roman}
              onChange={(e) => applyRoman(e.target.value)}
              placeholder={EXAMPLE_ROMAN}
              className="tb-v2-tool-input"
              style={{
                width: '100%',
                fontFamily: 'var(--f-mono)',
                fontSize: 20,
                letterSpacing: 2,
                textAlign: 'center',
              }}
              aria-label="Roman numeral input"
              spellCheck={false}
            />
            {romanError ? <p className="tb-v2-error" role="alert" style={{ marginTop: 8 }}>{romanError}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
