'use client';

import { useState } from 'react';

export default function HexToDecimalConverterClient() {
  const [hex, setHex] = useState('');
  const [decimal, setDecimal] = useState('');
  const [binary, setBinary] = useState('');
  const [copied, setCopied] = useState(false);

  const handleHexChange = (value: string) => {
    setHex(value);
    if (/^[0-9a-fA-F]*$/.test(value)) {
      const dec = parseInt(value, 16);
      if (!isNaN(dec)) {
        setDecimal(dec.toString());
        setBinary(dec.toString(2));
      } else {
        setDecimal('');
        setBinary('');
      }
    } else {
      setDecimal('');
      setBinary('');
    }
  };

  const handleDecimalChange = (value: string) => {
    setDecimal(value);
    const dec = parseInt(value);
    if (!isNaN(dec) && dec >= 0) {
      setHex(dec.toString(16).toUpperCase());
      setBinary(dec.toString(2));
    } else {
      setHex('');
      setBinary('');
    }
  };

  const copyAll = () => {
    const text = `Hex: ${hex}\nDecimal: ${decimal}\nBinary: ${binary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Hex to Decimal Converter</h2>
        <p className="tb-v2-card-description">Convert between Hex, Decimal, and Binary number systems</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Hexadecimal</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
            className="tb-v2-input w-full font-mono uppercase"
            placeholder="FF"
          />
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Decimal</label>
          <input
            type="number"
            value={decimal}
            onChange={(e) => handleDecimalChange(e.target.value)}
            className="tb-v2-input w-full font-mono"
            placeholder="255"
          />
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Binary</label>
          <div className="tb-v2-input bg-gray-50 font-mono break-all p-3">
            {binary || ' - '}
          </div>
        </div>
      </div>

      <div className="tb-v2-mode-tabs">
        <button onClick={copyAll} className="tb-v2-button-secondary flex-1">
          {copied ? '✓ Copied' : 'Copy All'}
        </button>
        <button onClick={() => { setHex(''); setDecimal(''); setBinary(''); }} className="tb-v2-button-secondary">
          Clear
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
        {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].map((char) => (
          <div key={char} className="p-2 rounded border bg-gray-50">
            <div className="font-mono font-bold">{char}</div>
            <div className="text-gray-500">{parseInt(char, 16)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
