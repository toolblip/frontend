'use client';

import { useState } from 'react';

const LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';

function getWords(count: number, startFrom = 0): string {
  const words = LOREM.split(' ');
  return Array.from({ length: count }, (_, i) => words[(startFrom + i) % words.length]).join(' ');
}

export default function LoremIpsumGeneratorClient() {
  const [count, setCount] = useState(5);
  const [unit, setUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [startLorem, setStartLorem] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (unit === 'words') {
      const w = getWords(count, 0);
      setOutput(startLorem ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    } else if (unit === 'sentences') {
      const words = getWords(count * 10, 0);
      const parts = words.match(/[^.!?]+[.!?]+/g) || [words + '.'];
      setOutput(parts.slice(0, count).map((s, i) => i === 0 && startLorem ? s.charAt(0).toUpperCase() + s.slice(1) : s).join(' '));
    } else {
      let text = '';
      for (let p = 0; p < count; p++) {
        const pw = getWords(80, p * 80);
        const sentences = pw.match(/.{1,80}?(?:\s|$)/g) || [pw];
        text += (p > 0 ? '\n\n' : '') + sentences.map((s, i) => i === 0 && (p > 0 || startLorem) ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1) : s.trim()).join('. ') + (text && !text.endsWith('.') ? '.' : '');
      }
      setOutput(text.trim());
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Options</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} className="tb-v2-tool-textarea" style={{ width: 64, minHeight: 32, resize: 'none', textAlign: 'center' }} min={1} max={100} />
          <div className="tb-v2-mode-tabs" role="group">
            {(['words', 'sentences', 'paragraphs'] as const).map(u => (
              <button key={u} type="button" onClick={() => setUnit(u)} className={`tb-v2-mode-tab ${unit === u ? 'on' : ''}`}>{u}</button>
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={startLorem} onChange={e => setStartLorem(e.target.checked)} />
          <span style={{ fontSize: 13 }}>Start with &quot;Lorem ipsum...&quot;</span>
        </label>
      </div>
      <button onClick={generate} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Generate</button>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Output</span>
        {output && <button type="button" onClick={() => navigator.clipboard.writeText(output).catch(() => {})} className="tb-v2-copy-btn">Copy</button>}
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, whiteSpace: 'pre-wrap', color: 'var(--tb-text-secondary)' }}>{output || '—'}</div>
      </div>
    </div>
  );
}
