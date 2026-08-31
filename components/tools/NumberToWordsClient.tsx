'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const UNITS = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

const EXAMPLE = '1234567';

function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToWords(Math.abs(num));
  if (num > 1e15) return 'Number too large (max 1 quadrillion)';

  let result = '';
  let unitIdx = 0;
  let n = num;

  while (n > 0) {
    if (n % 1000 !== 0) {
      const chunk = n % 1000;
      const hundreds = Math.floor(chunk / 100);
      const tens = chunk % 100;
      let chunkStr = '';
      if (hundreds > 0) chunkStr += ONES[hundreds] + ' hundred';
      if (tens > 0) {
        if (hundreds > 0) chunkStr += ' ';
        if (tens < 20) chunkStr += ONES[tens];
        else chunkStr += TENS[Math.floor(tens / 10)] + (tens % 10 !== 0 ? '-' + ONES[tens % 10] : '');
      }
      result = chunkStr + (unitIdx > 0 ? ' ' + UNITS[unitIdx] : '') + (result ? ' ' + result : '');
    }
    n = Math.floor(n / 1000);
    unitIdx++;
  }
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default function NumberToWordsClient() {
  const [number, setNumber] = useState('');
  const [copied, setCopied] = useState(false);

  const words = (() => {
    if (!number.trim()) return '';
    const n = parseFloat(number);
    if (isNaN(n)) return '';
    if (n > 1e15) return 'Number too large (max 1 quadrillion)';
    if (!Number.isInteger(n)) {
      const parts = number.split('.');
      const intPart = numberToWords(parseInt(parts[0] || '0', 10));
      const decPart = (parts[1] || '')
        .split('')
        .map((d) => ONES[parseInt(d, 10)])
        .join(' ');
      return intPart + ' point ' + decPart;
    }
    return numberToWords(Math.round(n));
  })();

  const copy = () => {
    if (!words) return;
    navigator.clipboard.writeText(words).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Number</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => setNumber(EXAMPLE)}
          onClear={() => setNumber('')}
          canClear={number.length > 0}
        />
      </div>
      <div style={{ padding: '0 20px 12px' }}>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^0-9.-]/g, ''))}
          placeholder={`e.g. ${EXAMPLE}`}
          className="tb-v2-tool-input"
          style={{ width: '100%', fontFamily: 'var(--f-mono)' }}
          aria-label="Number input"
        />
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Words</span>
        <button
          type="button"
          onClick={copy}
          disabled={!words}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {words ? (
          <div style={{ fontSize: 16, color: 'var(--tb-accent)', fontWeight: 500, lineHeight: 1.5 }}>
            {words}
          </div>
        ) : (
          <p className="tb-v2-empty">Enter a number or use Example.</p>
        )}
      </div>
    </div>
  );
}
