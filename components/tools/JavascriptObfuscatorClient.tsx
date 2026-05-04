'use client';

import { useState } from 'react';

export default function JavascriptObfuscatorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const obfuscate = () => {
    try {
      let code = input;
      // Simple string encoding
      code = code.replace(/["']([^"']+)["']/g, (_, s) => {
        const encoded = [...s].map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        return `"${encoded}"`;
      });
      // Remove comments
      code = code.replace(/\/\/.*$/gm, '');
      code = code.replace(/\/\*[\s\S]*?\*\//g, '');
      // Collapse whitespace
      code = code.replace(/\s+/g, ' ').trim();
      setOutput(code);
    } catch {
      setOutput('Error obfuscating');
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">JavaScript Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="console.log('hello');" className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <button onClick={obfuscate} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Obfuscate</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Obfuscated Output</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output || '—'}</pre>
      </div>
    </div>
  );
}
