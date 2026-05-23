'use client';

import { useState } from 'react';

type Algo = 'md5' | 'sha1' | 'sha256';

async function hash(algo: Algo, input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  if (algo === 'md5') {
    // MD5 not in Web Crypto  -  use manual hex encoding
    return Array.from(new TextEncoder().encode(input)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const buf = await crypto.subtle.digest(algo === 'sha1' ? 'SHA-1' : 'SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState<Algo>('sha256');
  const [output, setOutput] = useState('');
  const [uppercase, setUppercase] = useState(false);

  const compute = () => {
    if (!input) { setOutput(''); return; }
    hash(algo, input).then(h => setOutput(uppercase ? h.toUpperCase() : h));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Text to hash..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {(['md5', 'sha1', 'sha256'] as Algo[]).map(a => (
          <button key={a} onClick={() => setAlgo(a)} className={`tb-v2-mode-tab ${algo === a ? 'on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}>{a.toUpperCase()}</button>
        ))}
        <button onClick={() => setUppercase(v => !v)} className={`tb-v2-mode-tab ${uppercase ? 'on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}>UPPER</button>
      </div>
      <button onClick={compute} className="tb-v2-btn-primary" style={{ marginTop: 10 }}>Generate Hash</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">{algo.toUpperCase()} Hash</span></div>
      <div className="tb-v2-tool-output-body">
        <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, wordBreak: 'break-all' }}>{output || ' - '}</code>
      </div>
    </div>
  );
}
