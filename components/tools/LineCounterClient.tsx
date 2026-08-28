'use client';

import { useState, useEffect } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface LineCounts {
  total: number;
  nonEmpty: number;
  empty: number;
  bytes: number;
}

const EXAMPLE = `First line
Second line

Fourth line after a blank
Fifth line`;

export default function LineCounterClient() {
  const [text, setText] = useState('');
  const [counts, setCounts] = useState<LineCounts | null>(null);

  useEffect(() => {
    if (!text) {
      setCounts(null);
      return;
    }
    const lines = text.split('\n');
    const nonEmpty = lines.filter(line => line.trim().length > 0).length;
    const empty = lines.length - nonEmpty;
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text).length;
    setCounts({ total: lines.length, nonEmpty, empty, bytes });
  }, [text]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input Text</span>
        <ToolExampleClearActions
          onExample={() => setText(EXAMPLE)}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text to count lines..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for line counting"
      />

      {counts && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Line Count Results</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>{counts.total}</div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>Total Lines</div>
              </div>
              <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>{counts.nonEmpty}</div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>Non-Empty</div>
              </div>
              <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>{counts.empty}</div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>Empty</div>
              </div>
              <div style={{ padding: 12, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tb-accent)' }}>{counts.bytes.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>Bytes</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
