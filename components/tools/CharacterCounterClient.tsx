'use client';

import { useState } from 'react';

export default function CharacterCounterClient() {
  const [input, setInput] = useState('');

  const stats = () => {
    const text = input;
    return {
      total: text.length,
      noSpaces: text.replace(/\s/g, '').length,
      noNewlines: text.replace(/\n/g, '').length,
      letters: text.replace(/[^a-zA-Z]/g, '').length,
      digits: text.replace(/[^0-9]/g, '').length,
    };
  };

  const s = stats();

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={() => setInput('The quick brown fox jumps over 2 lazy dogs.')} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to count characters..." className="tb-v2-tool-textarea" />
      {!input && <p className="tb-v2-empty">Type or paste text above to see live character counts.</p>}
      {input && (
      <>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Character Count</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Total Characters', value: s.total },
          { label: 'Without Spaces', value: s.noSpaces },
          { label: 'Without Newlines', value: s.noNewlines },
          { label: 'Letters Only', value: s.letters },
          { label: 'Digits Only', value: s.digits },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--tb-border)' }}>
            <span style={{ color: 'var(--tb-text-secondary)', fontSize: 13 }}>{row.label}</span>
            <span style={{ fontWeight: 600, fontFamily: 'var(--f-mono)' }}>{row.value}</span>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
}
