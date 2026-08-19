'use client';

import { useState, useMemo } from 'react';

const MAX_RESULTS = 2000;

function parseWords(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map(w => w.trim())
    .filter(Boolean);
}

function nPr(n: number, r: number): number {
  let result = 1;
  for (let i = 0; i < r; i++) result *= n - i;
  return n >= r ? result : 0;
}

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function nCr(n: number, r: number): number {
  if (n < r) return 0;
  return nPr(n, r) / factorial(r);
}

function generateCombinations(words: string[], size: 2 | 3, ordered: boolean, cap: number): string[] {
  const out: string[] = [];
  const n = words.length;

  if (ordered) {
    if (size === 2) {
      outer: for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (j === i) continue;
          out.push(`${words[i]} ${words[j]}`);
          if (out.length >= cap) break outer;
        }
      }
    } else {
      outer: for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (j === i) continue;
          for (let k = 0; k < n; k++) {
            if (k === i || k === j) continue;
            out.push(`${words[i]} ${words[j]} ${words[k]}`);
            if (out.length >= cap) break outer;
          }
        }
      }
    }
  } else {
    if (size === 2) {
      outer: for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          out.push(`${words[i]} ${words[j]}`);
          if (out.length >= cap) break outer;
        }
      }
    } else {
      outer: for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
          for (let k = j + 1; k < n; k++) {
            out.push(`${words[i]} ${words[j]} ${words[k]}`);
            if (out.length >= cap) break outer;
          }
        }
      }
    }
  }

  return out;
}

export default function WordCombinationsGeneratorClient() {
  const [input, setInput] = useState('');
  const [size, setSize] = useState<2 | 3>(2);
  const [ordered, setOrdered] = useState(false);
  const [copied, setCopied] = useState(false);

  const words = useMemo(() => parseWords(input), [input]);

  const totalPossible = useMemo(() => {
    if (words.length < size) return 0;
    return ordered ? nPr(words.length, size) : nCr(words.length, size);
  }, [words, size, ordered]);

  const results = useMemo(() => {
    if (words.length < size) return [];
    return generateCombinations(words, size, ordered, MAX_RESULTS);
  }, [words, size, ordered]);

  const loadExample = () => {
    setInput('apple\nbanana\ncherry\nmango\npeach');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Word List (one per line or comma separated)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder={'apple\nbanana\ncherry'}
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-section" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div className="tb-v2-mode-tabs">
          <button type="button" className={`tb-v2-mode-tab ${size === 2 ? 'on' : ''}`} onClick={() => setSize(2)}>2-word</button>
          <button type="button" className={`tb-v2-mode-tab ${size === 3 ? 'on' : ''}`} onClick={() => setSize(3)}>3-word</button>
        </div>
        <div className="tb-v2-mode-tabs">
          <button type="button" className={`tb-v2-mode-tab ${!ordered ? 'on' : ''}`} onClick={() => setOrdered(false)}>Combinations (A B = B A)</button>
          <button type="button" className={`tb-v2-mode-tab ${ordered ? 'on' : ''}`} onClick={() => setOrdered(true)}>Permutations (A B ≠ B A)</button>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          Results {results.length > 0 && `(showing ${results.length.toLocaleString()} of ${totalPossible.toLocaleString()} possible)`}
        </span>
        <button type="button" onClick={copyAll} disabled={results.length === 0} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy All'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {words.length < size ? (
          <p className="tb-v2-empty">Enter at least {size} words to generate {size}-word {ordered ? 'permutations' : 'combinations'}.</p>
        ) : (
          <>
            {totalPossible > MAX_RESULTS && (
              <p style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 10 }}>
                Showing the first {MAX_RESULTS.toLocaleString()} of {totalPossible.toLocaleString()} possible {ordered ? 'permutations' : 'combinations'} to keep things fast.
              </p>
            )}
            <div className="tb-v2-tool-pre" style={{ maxHeight: 360 }}>
              {results.join('\n')}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
