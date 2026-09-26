'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useCallback } from 'react';
import { randomIntegers } from '@/lib/utility-design/core';

export default function RandomNumberGeneratorClient() {
  const [error,setError]=useState('');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(false);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setError('');
    try {
      if (![min, max, count].every(v => v.trim())) throw new Error('Enter all three integer values.');
      setNumbers(randomIntegers(Number(min), Number(max), Number(count), unique).map(String));
    } catch (e) { setNumbers([]); setError(e instanceof Error ? e.message : 'Invalid range'); }
  }, [min, max, count, unique]);

  const copy = () => {
    const text = numbers.join(', ');
    navigator.clipboard.writeText(text).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  return (<UtilityDesignLayout>
    <div onChangeCapture={() => { setNumbers([]); setError(''); }}>
      <ToolExampleClearActions onExample={() => { setMin('1'); setMax('10'); setCount('5'); setUnique(true); setNumbers([]); setError(''); }} onClear={() => { setMin(''); setMax(''); setCount('1'); setUnique(false); setNumbers([]); setCopied(false); setError(''); }}/>
      {error && <p role="alert">{error}</p>}
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Range &amp; Options</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="tb-v2-tool-input"
            aria-label="Minimum value"
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="tb-v2-tool-input"
            aria-label="Maximum value"
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="1000"
            className="tb-v2-tool-input"
            aria-label="Number of values"
          />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
        <input aria-label="Unique"
          type="checkbox"
          checked={unique}
          onChange={(e) => setUnique(e.target.checked)}
          style={{ width: 16, height: 16 }}
        />
        <span style={{ fontSize: 14 }}>Unique numbers only</span>
      </label>
      <button type="button" onClick={generate} className="tb-v2-primary-btn" style={{ width: '100%', marginBottom: 16 }}>
        Generate
      </button>

      {numbers.length > 0 && (
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">Result</span>
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      {numbers.length > 0 && (
        <div className="tb-v2-tool-output-body">
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, lineHeight: 1.6, wordBreak: 'break-all' }}>
            {numbers.join(', ')}
          </div>
        </div>
      )}
    </div>
  </UtilityDesignLayout>
  );
}
