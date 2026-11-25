'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';
import { X_LIMITS, limitStatus, type LimitPresetId } from '@/lib/character-limits';

export default function CharacterCounterClient() {
  const [input, setInput] = useState('');
  // No preset is selected by default, so the page behaves as before until one is picked.
  const [preset, setPreset] = useState<LimitPresetId | null>(null);

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
  const active = X_LIMITS.find(p => p.id === preset);
  const status = active ? limitStatus(s.total, active.limit) : null;

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <ToolExampleClearActions
          onExample={() => setInput('The quick brown fox jumps over 2 lazy dogs.')}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <div className="tb-v2-mode-tabs" role="group" aria-label="X limit presets" style={{ marginBottom: 12 }}>
        {X_LIMITS.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(preset === p.id ? null : p.id)}
            className={`tb-v2-mode-tab ${preset === p.id ? 'on' : ''}`}
            aria-pressed={preset === p.id}
          >
            {p.label} ({p.limit})
          </button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to count characters..." className="tb-v2-tool-textarea" />
      {active && status && (
        <p role="status" style={{ margin: '8px 0', fontWeight: 600, color: status.over ? 'var(--red)' : undefined }}>
          {active.label}: {s.total} / {active.limit}
          {status.over ? ` (${-status.remaining} over)` : ` (${status.remaining} left)`}
        </p>
      )}
      {active && <p className="tb-v2-empty">Plain character count. X counts links as a fixed length and weights emoji and some scripts more, so the final number on X can differ.</p>}
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
