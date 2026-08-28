'use client';

import { useState, useCallback } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'red green blue';

export default function TextPermutationGeneratorClient() {
  const [input, setInput] = useState('');
  const [permutations, setPermutations] = useState<string[]>([]);
  const [error, setError] = useState('');

  const generate = useCallback((raw?: string) => {
    const source = raw ?? input;
    setError('');
    const words = source.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      setError('Please enter some words');
      setPermutations([]);
      return;
    }
    if (words.length > 10) {
      setError('Maximum 10 words for permutations');
      setPermutations([]);
      return;
    }

    function permute<T>(arr: T[]): T[][] {
      if (arr.length <= 1) return [arr];
      const result: T[][] = [];
      for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        for (const p of permute(rest)) result.push([arr[i], ...p]);
      }
      return result;
    }

    setPermutations(permute(words).map((p) => p.join(' ')));
  }, [input]);

  const loadExample = () => {
    setInput(EXAMPLE);
    generate(EXAMPLE);
  };

  const clear = () => {
    setInput('');
    setPermutations([]);
    setError('');
  };

  const copy = () => {
    navigator.clipboard.writeText(permutations.join('\n')).catch(() => {});
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Words to Permute</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clear}
          canClear={input.length > 0 || permutations.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter words separated by spaces... (max 10 words)"
        className="tb-v2-tool-textarea"
        aria-label="Words input"
      />
      <div style={{ padding: '0 20px 16px' }}>
        <button
          type="button"
          onClick={() => generate()}
          className="tb-v2-primary-btn"
          style={{ width: '100%', marginTop: 12 }}
        >
          Generate Permutations (
          {input.split(/\s+/).filter(Boolean).length}! ={' '}
          {factorial(input.split(/\s+/).filter(Boolean).length)})
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--tb-accent)', fontSize: 13, padding: '0 20px 12px' }}>
          {error}
        </div>
      )}

      {permutations.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{permutations.length} Permutations</span>
            <button type="button" onClick={copy} className="tb-v2-copy-btn">
              Copy All
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 13,
                lineHeight: 1.6,
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              {permutations.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function factorial(n: number): string {
  if (n > 20) return '~' + Math.round(factorialPrecise(n));
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r.toLocaleString();
}

function factorialPrecise(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
