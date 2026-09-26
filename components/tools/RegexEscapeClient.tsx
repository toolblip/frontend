'use client';
import { copySecurityText } from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame, { useSecurityTask } from './DeveloperSecurityFrame';

import { useMemo, useState } from 'react';

const SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;
const ESCAPED_CHARS = /\\([.*+?^${}()|[\]\\])/g;

function escapeText(text: string): string {
  return text.replace(SPECIAL_CHARS, '\\$&');
}

function unescapeText(text: string): string {
  return text.replace(ESCAPED_CHARS, '$1');
}

export default function RegexEscapeClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [input, setInput] = useState('Price: $12.99 (was $15.00) [50% off]?');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => (mode === 'escape' ? escapeText(input) : unescapeText(input)), [input, mode]);

  const copyOutput = () => {
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(output).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(true);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;setMode('escape');setInput('Price: $12.99 (sale)?');}} onClear={()=>{clipboardTask.current++;setClipboardError('');setInput('');setCopied(false);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Mode</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <button type="button" onClick={() => setMode('escape')} className={`tb-v2-mode-tab ${mode === 'escape' ? 'on' : ''}`}>
          Escape (text → pattern-safe)
        </button>
        <button type="button" onClick={() => setMode('unescape')} className={`tb-v2-mode-tab ${mode === 'unescape' ? 'on' : ''}`}>
          Unescape (pattern → plain text)
        </button>
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{mode === 'escape' ? 'Plain text' : 'Escaped pattern'}</span>
      </div>
      <textarea aria-label="Input" maxLength={100000}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'escape' ? 'Enter text to escape for use inside a regex...' : 'Enter escaped text to decode...'}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
      />

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">{mode === 'escape' ? 'Escaped output' : 'Unescaped output'}</span>
        <button type="button" onClick={copyOutput} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {output ? (
          <pre className="tb-v2-tool-pre" style={{ fontFamily: 'var(--f-mono)' }}>{output}</pre>
        ) : (
          <p className="tb-v2-empty">Enter text above to see the result.</p>
        )}
      </div>
    </div>
    </DeveloperSecurityFrame>
  );
}
