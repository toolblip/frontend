'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'apple\nbanana\ncherry\nmango\npeach\nkiwi';

export default function ListRandomizerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [unique, setUnique] = useState(false);

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const randomize = (raw?: string) => {
    const source = raw ?? input;
    const lines = source.split('\n').filter((l) => l.trim());
    if (!lines.length) return;
    const items = unique ? [...new Set(lines)] : lines;
    setOutput(shuffle(items));
  };

  const loadExample = () => {
    setInput(EXAMPLE);
    randomize(EXAMPLE);
  };

  const clear = () => {
    setInput('');
    setOutput([]);
  };

  const copy = () => {
    if (!output.length) return;
    navigator.clipboard.writeText(output.join('\n')).catch(() => {});
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input List</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clear}
          canClear={input.length > 0 || output.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter one item per line..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
      />
      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />
          Remove duplicates before shuffling
        </label>
        <button type="button" onClick={() => randomize()} className="tb-v2-primary-btn">
          Shuffle
        </button>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Randomized</span>
        {output.length > 0 && (
          <button type="button" onClick={copy} className="tb-v2-copy-btn">
            Copy
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {output.length > 0 ? (
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {output.map((item, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--tb-text)' }}>
                {item}
              </li>
            ))}
          </ol>
        ) : (
          <div className="tb-v2-empty">Enter items and click Shuffle, or load Examples</div>
        )}
      </div>
    </div>
  );
}
