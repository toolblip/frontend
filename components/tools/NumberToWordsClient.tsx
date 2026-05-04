'use client';

import { useState } from 'react';

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const UNITS = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToWords(Math.abs(num));
  if (num > 1e15) return 'Number too large (max 1 quadrillion)';

  let result = '';
  let unitIdx = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      const chunk = num % 1000;
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
    num = Math.floor(num / 1000);
    unitIdx++;
  }
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default function NumberToWordsClient() {
  const [number, setNumber] = useState('');

  const words = (() => {
    const n = parseFloat(number);
    if (isNaN(n)) return '';
    if (n > 1e15) return 'Number too large (max 1 quadrillion)';
    if (!Number.isInteger(n)) {
      const parts = number.split('.');
      const intPart = numberToWords(parseInt(parts[0]));
      const decPart = parts[1].split('').map(d => ONES[parseInt(d)]).join(' ');
      return intPart + ' point ' + decPart;
    }
    return numberToWords(Math.round(n));
  })();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Number</span></div>
      <input
        type="text"
        value={number}
        onChange={e => setNumber(e.target.value.replace(/[^0-9.-]/g, ''))}
        placeholder="Enter a number (e.g. 1234567890)"
        className="tb-v2-tool-textarea"
        style={{ width: '100%', minHeight: 44, resize: 'none', fontFamily: 'var(--f-mono)' }}
      />
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Words</span></div>
      <div className="tb-v2-tool-output-body">
        {words ? (
          <div style={{ fontSize: 16, color: 'var(--tb-accent)', fontWeight: 500, lineHeight: 1.5 }}>
            {words}
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter a number to convert to words</div>
        )}
      </div>
    </div>
  );
}
