'use client';

import { useMemo, useState } from 'react';

type Op = 'eq' | 'add' | 'del';
type Row = { op: Op; left?: number; right?: number; text: string };

// LCS-based line diff. Suitable for typical paste sizes.
function diffLines(a: string[], b: string[]): Row[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: Row[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: 'eq', left: i + 1, right: j + 1, text: a[i] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ op: 'del', left: i + 1, text: a[i] });
      i++;
    } else {
      out.push({ op: 'add', right: j + 1, text: b[j] });
      j++;
    }
  }
  while (i < n) { out.push({ op: 'del', left: i + 1, text: a[i] }); i++; }
  while (j < m) { out.push({ op: 'add', right: j + 1, text: b[j] }); j++; }
  return out;
}

export default function TextDiffClient() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const rows = useMemo(() => {
    if (!submitted || (!left && !right)) return [];
    return diffLines(left.split('\n'), right.split('\n'));
  }, [submitted, left, right]);

  const stats = useMemo(() => {
    let added = 0, removed = 0, unchanged = 0;
    for (const r of rows) {
      if (r.op === 'add') added++;
      else if (r.op === 'del') removed++;
      else unchanged++;
    }
    return { added, removed, unchanged };
  }, [rows]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Compare</span>
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="tb-v2-mode-tab on"
          disabled={!left && !right}
        >
          Run diff
        </button>
      </div>

      <div className="tb-v2-diff-inputs">
        <div className="tb-v2-diff-input-col">
          <label className="tb-v2-tool-label" htmlFor="diff-left">Original</label>
          <textarea
            id="diff-left"
            value={left}
            onChange={(e) => { setLeft(e.target.value); setSubmitted(false); }}
            placeholder="Paste original text..."
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 180 }}
          />
        </div>
        <div className="tb-v2-diff-input-col">
          <label className="tb-v2-tool-label" htmlFor="diff-right">Changed</label>
          <textarea
            id="diff-right"
            value={right}
            onChange={(e) => { setRight(e.target.value); setSubmitted(false); }}
            placeholder="Paste changed text..."
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 180 }}
          />
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        {submitted && rows.length > 0 && (
          <div className="tb-v2-diff-stats">
            <span className="tb-v2-diff-stat add">+{stats.added}</span>
            <span className="tb-v2-diff-stat del">−{stats.removed}</span>
            <span className="tb-v2-diff-stat eq">{stats.unchanged} unchanged</span>
          </div>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {!submitted ? (
          <p className="tb-v2-diff-empty">Click <strong>Run diff</strong> to compare.</p>
        ) : rows.length === 0 ? (
          <p className="tb-v2-diff-empty">Nothing to compare.</p>
        ) : (
          <div className="tb-v2-diff-list" role="list">
            {rows.map((r, i) => (
              <div key={i} className={`tb-v2-diff-row ${r.op}`} role="listitem">
                <span className="tb-v2-diff-num">{r.left ?? ''}</span>
                <span className="tb-v2-diff-num">{r.right ?? ''}</span>
                <span className="tb-v2-diff-marker" aria-hidden="true">
                  {r.op === 'add' ? '+' : r.op === 'del' ? '−' : ' '}
                </span>
                <code className="tb-v2-diff-text">{r.text || ' '}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
