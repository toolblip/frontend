'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useCallback, useEffect } from 'react';

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

const DECODE_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ',
  '&copy;': '©', '&reg;': '®', '&trade;': '™',
};

export default function HtmlEntityEncoderClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = useCallback(() => {
    if (mode === 'encode') {
      setOutput([...input].map(c => HTML_ENTITIES[c] || c).join(''));
    } else {
      const ta = document.createElement('textarea');
      ta.innerHTML = input;
      setOutput(ta.value);
    }
  }, [input, mode]);

  useEffect(() => { process(); }, [process]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => setCopied(true), () => setCopied(false));
    setTimeout(() => setCopied(false), 1500);
  };

  return (<UtilityDesignLayout>
    <div>
      <ToolExampleClearActions onExample={() => { setMode('encode'); setInput('<p>Hello & goodbye</p>'); }} onClear={() => { setInput(''); setOutput(''); setCopied(false); }}/>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="button" onClick={() => setMode('encode')} className={`tb-v2-mode-tab ${mode === 'encode' ? 'on' : ''}`}>Encode</button>
          <button type="button" onClick={() => setMode('decode')} className={`tb-v2-mode-tab ${mode === 'decode' ? 'on' : ''}`}>Decode</button>
        </div>
      </div>
      <textarea maxLength={100000}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter HTML entities to decode...'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="HTML entity input"
      />
      <button type="button" onClick={process} className="tb-v2-primary-btn" style={{ width: '100%', marginTop: 12, marginBottom: 12 }}>
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Output</span>
        {output && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ fontFamily: 'var(--f-mono)', fontSize: 14, whiteSpace: 'pre-wrap', margin: 0 }}>
          {output || ' - '}
        </pre>
      </div>
    </div>
  </UtilityDesignLayout>
  );
}
