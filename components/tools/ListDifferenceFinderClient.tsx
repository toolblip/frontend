'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_A = 'apple\nbanana\ncherry\ndate\nelderberry';
const EXAMPLE_B = 'banana\ncherry\nfig\ngrape';

function toItems(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function computeDiff(textA: string, textB: string, caseInsensitive: boolean) {
  const itemsA = toItems(textA);
  const itemsB = toItems(textB);

  const normalize = (s: string) => (caseInsensitive ? s.toLowerCase() : s);

  const setA = new Set(itemsA.map(normalize));
  const setB = new Set(itemsB.map(normalize));

  const seenAOnly = new Set<string>();
  const aOnly: string[] = [];
  for (const item of itemsA) {
    const key = normalize(item);
    if (!setB.has(key) && !seenAOnly.has(key)) {
      seenAOnly.add(key);
      aOnly.push(item);
    }
  }

  const seenBOnly = new Set<string>();
  const bOnly: string[] = [];
  for (const item of itemsB) {
    const key = normalize(item);
    if (!setA.has(key) && !seenBOnly.has(key)) {
      seenBOnly.add(key);
      bOnly.push(item);
    }
  }

  const seenBoth = new Set<string>();
  const both: string[] = [];
  for (const item of itemsA) {
    const key = normalize(item);
    if (setB.has(key) && !seenBoth.has(key)) {
      seenBoth.add(key);
      both.push(item);
    }
  }

  return { aOnly, bOnly, both };
}

function ResultColumn({
  title,
  items,
  onCopy,
  copied,
}: {
  title: string;
  items: string[];
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div>
      <div className="tb-v2-tool-output-head" style={{ padding: '10px 0' }}>
        <span className="tb-v2-tool-label">{title} ({items.length})</span>
        <button type="button" onClick={onCopy} disabled={!items.length} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {items.length === 0 ? (
        <div className="tb-v2-empty" style={{ padding: '20px 12px' }}>None</div>
      ) : (
        <pre className="tb-v2-tool-pre">{items.join('\n')}</pre>
      )}
    </div>
  );
}

export default function ListDifferenceFinderClient() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result = useMemo(() => computeDiff(textA, textB, caseInsensitive), [textA, textB, caseInsensitive]);

  const loadExample = () => {
    setTextA(EXAMPLE_A);
    setTextB(EXAMPLE_B);
  };

  const copy = (key: string, items: string[]) => {
    if (!items.length) return;
    navigator.clipboard.writeText(items.join('\n')).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Compare two lists</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={() => { setTextA(''); setTextB(''); }}
          canClear={textA.length > 0 || textB.length > 0}
        />
      </div>
      <div className="tb-v2-grid-2">
        <div style={{ padding: 16 }}>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>List A</label>
          <textarea
            value={textA}
            onChange={e => setTextA(e.target.value)}
            placeholder="One item per line..."
            className="tb-v2-input"
            rows={8}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
        <div style={{ padding: 16 }}>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>List B</label>
          <textarea
            value={textB}
            onChange={e => setTextB(e.target.value)}
            placeholder="One item per line..."
            className="tb-v2-input"
            rows={8}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
      </div>

      <div className="tb-v2-section">
        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={caseInsensitive} onChange={e => setCaseInsensitive(e.target.checked)} />
          Case-insensitive comparison
        </label>
      </div>

      <div className="tb-v2-tool-output-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ResultColumn title="Only in List A" items={result.aOnly} onCopy={() => copy('a', result.aOnly)} copied={copiedKey === 'a'} />
          <ResultColumn title="Only in List B" items={result.bOnly} onCopy={() => copy('b', result.bOnly)} copied={copiedKey === 'b'} />
          <ResultColumn title="In Both Lists" items={result.both} onCopy={() => copy('both', result.both)} copied={copiedKey === 'both'} />
        </div>
      </div>
    </div>
  );
}
