'use client';

import { useState } from 'react';

export default function DiffToolClient() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const computeDiff = () => {
    const lLines = left.split('\n');
    const rLines = right.split('\n');
    const result: { type: 'same' | 'added' | 'removed'; text: string }[] = [];
    const maxLen = Math.max(lLines.length, rLines.length);
    for (let i = 0; i < maxLen; i++) {
      const l = lLines[i];
      const r = rLines[i];
      if (l === r) result.push({ type: 'same', text: l ?? '' });
      else {
        if (l !== undefined) result.push({ type: 'removed', text: l });
        if (r !== undefined) result.push({ type: 'added', text: r });
      }
    }
    return result;
  };

  const diff = computeDiff();
  const stats = { added: diff.filter(d => d.type === 'added').length, removed: diff.filter(d => d.type === 'removed').length };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Original</span></div>
          <textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="Original text..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
        </div>
        <div>
          <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Modified</span></div>
          <textarea value={right} onChange={e => setRight(e.target.value)} placeholder="Modified text..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 13 }}>
        <span style={{ color: '#22c55e' }}>+{stats.added} added</span>
        <span style={{ color: '#ef4444' }}>-{stats.removed} removed</span>
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Diff</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, fontFamily: 'var(--f-mono)', fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {diff.map((d, i) => (
            <span key={i} style={{ display: 'block', background: d.type === 'added' ? '#22c55e22' : d.type === 'removed' ? '#ef444422' : 'transparent' }}>
              <span style={{ color: d.type === 'added' ? '#22c55e' : d.type === 'removed' ? '#ef4444' : 'transparent', marginRight: 8 }}>{d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '}</span>{d.text}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}
