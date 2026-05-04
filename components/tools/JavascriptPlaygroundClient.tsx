'use client';

import { useState } from 'react';

export default function JavascriptPlaygroundClient() {
  const [code, setCode] = useState('// Try JavaScript\neval("2 + 2");\n[1, 2, 3].map(x => x * 2);');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = () => {
    setError('');
    setOutput('');
    try {
      const logs: string[] = [];
      const customLog = (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      const fn = new Function('console', code);
      fn({ log: customLog, error: customLog, warn: customLog, info: customLog });
      setOutput(logs.join('\n'));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Execution error');
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">JavaScript Code</span></div>
      <textarea value={code} onChange={e => setCode(e.target.value)} className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)', minHeight: 150 }} />
      <button onClick={run} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Run Code</button>
      {error && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 8, padding: 8, background: '#ef444422', borderRadius: 6 }}>Error: {error}</div>}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Output</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output || '—'}</pre>
      </div>
    </div>
  );
}
