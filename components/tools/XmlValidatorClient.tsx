'use client';

import { useState } from 'react';

export default function XmlValidatorClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const validate = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const err = doc.querySelector('parsererror');
      setResult(err ? { valid: false, error: err.textContent || 'Invalid XML' } : { valid: true });
    } catch (e: unknown) {
      setResult({ valid: false, error: e instanceof Error ? e.message : 'Parse error' });
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">XML Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="<root><item>value</item></root>" className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <button onClick={validate} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Validate XML</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Result</span></div>
      <div className="tb-v2-tool-output-body">
        {result && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{result.valid ? '✅' : '❌'}</span>
            <span style={{ color: result.valid ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{result.valid ? 'Valid XML' : result.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
