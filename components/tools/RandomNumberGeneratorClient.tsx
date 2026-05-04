'use client';

import { useState, useCallback } from 'react';

export default function RandomNumberGeneratorClient() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(false);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const minNum = parseInt(min) || 0;
    const maxNum = parseInt(max) || 100;
    const cnt = Math.min(parseInt(count) || 1, 1000);
    const nums: number[] = [];

    if (unique) {
      const range = maxNum - minNum + 1;
      if (cnt > range) {
        setNumbers(['Cannot generate more unique numbers than range allows']);
        return;
      }
      const seen = new Set<number>();
      while (seen.size < cnt) {
        const n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        if (!seen.has(n)) {
          seen.add(n);
          nums.push(n);
        }
      }
    } else {
      for (let i = 0; i < cnt; i++) {
        nums.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
      }
    }

    setNumbers(nums.map(String));
  }, [min, max, count, unique]);

  const copy = () => {
    const text = numbers.join(', ');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
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
        <input
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
  );
}
