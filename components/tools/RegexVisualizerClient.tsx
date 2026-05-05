'use client';

import { useState } from 'react';

export default function RegexVisualizerClient() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('');
  const [error, setError] = useState('');

  const getMatches = () => {
    if (!pattern || !testStr) return { matches: [], regex: null };
    try {
      const regex = new RegExp(pattern, flags);
      const matches: string[] = [];
      let m;
      if (flags.includes('g')) { while ((m = regex.exec(testStr)) !== null) matches.push(m[0]); }
      else { m = regex.exec(testStr); if (m) matches.push(m[0]); }
      return { matches, regex };
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Invalid regex'); return { matches: [], regex: null }; }
  };

  const { matches, regex } = getMatches();

  const getParts = () => {
    if (!pattern) return [];
    const parts: { text: string; desc: string }[] = [];
    let p = pattern;
    const tokenDescriptions: Record<string, string> = {
      '.': 'Any character', '\\d': 'Digit', '\\D': 'Non-digit', '\\w': 'Word char', '\\W': 'Non-word',
      '\\s': 'Whitespace', '\\S': 'Non-whitespace', '^': 'Start', '$': 'End', '|': 'OR',
    };
    Object.entries(tokenDescriptions).forEach(([k, v]) => { if (p.includes(k)) parts.push({ text: k, desc: v }); });
    return parts;
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Pattern</span></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="text" value={pattern} onChange={e => { setPattern(e.target.value); setError(''); }} placeholder="e.g. \d+-\d+-\d+" className="tb-v2-tool-textarea" style={{ flex: 1, minHeight: 40, fontFamily: 'var(--f-mono)' }} />
        <input type="text" value={flags} onChange={e => setFlags(e.target.value)} placeholder="g" className="tb-v2-tool-textarea" style={{ width: 60, minHeight: 40, fontFamily: 'var(--f-mono)', textAlign: 'center' }} />
      </div>
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Test String</span></div>
      <textarea value={testStr} onChange={e => setTestStr(e.target.value)} placeholder="Test against this string..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      {pattern && (
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {getParts().map((part, i) => (
            <span key={i} style={{ fontSize: 11, background: 'var(--tb-bg-secondary)', padding: '2px 8px', borderRadius: 4 }} title={part.desc}>{part.text}</span>
          ))}
        </div>
      )}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Matches ({matches.length})</span></div>
      <div className="tb-v2-tool-output-body">
        {regex ? matches.length > 0 ? matches.map((m, i) => (
          <span key={i} style={{ display: 'inline-block', background: '#22c55e22', color: '#22c55e', padding: '2px 8px', borderRadius: 4, margin: '2px', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{m}</span>
        )) : <span style={{ color: 'var(--tb-text-muted)' }}>No matches</span> : <span style={{ color: 'var(--tb-text-muted)' }}>Enter a pattern</span>}
      </div>
    </div>
  );
}
