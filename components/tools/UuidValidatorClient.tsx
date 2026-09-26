'use client';
import { copySecurityText } from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame, { useSecurityTask } from './DeveloperSecurityFrame';

import { useState } from 'react';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type UuidVersion = string;

function detectVersion(uuid: string): UuidVersion {
  const parts = uuid.split('-');
  if (parts.length !== 5) return 'unknown';

  const version = parts[2][0];
  switch (version) {
    case '1': return 'v1';
    case '4': return 'v4';
    case '7': return 'v7';
    default: return `v${version}`;
  }
}

export default function UuidValidatorClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const trimmed = input.trim();
  const special = /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(trimmed) ? 'Nil' : /^f{8}-f{4}-f{4}-f{4}-f{12}$/i.test(trimmed) ? 'Max' : '';
  const isValid = !!special || UUID_REGEX.test(trimmed);
  const version = special || (isValid ? detectVersion(trimmed) : 'unknown');

  const copy = () => {
    if (!trimmed) return;
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(trimmed).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(true);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;setInput('017f22e2-79b0-7cc3-98c4-dc0c0c07398f');}} onClear={()=>{clipboardTask.current++;setClipboardError('');setInput('');setCopied(false);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">UUID Input</span>
      </div>
      <textarea maxLength={100000}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a UUID to validate (e.g., 550e8400-e29b-41d4-a716-446655440000)..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="UUID input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Validation Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {trimmed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: isValid ? '#22c55e' : '#ef4444'
              }} />
              <span style={{ fontWeight: 600, color: isValid ? '#22c55e' : '#ef4444' }}>
                {isValid ? 'Valid UUID' : 'Invalid UUID'}
              </span>
            </div>
            {isValid && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ padding: 8, background: 'var(--tb-bg-secondary)', borderRadius: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--tb-text-secondary)' }}>Version</span>
                  <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>{version}</div>
                </div>
                <div style={{ padding: 8, background: 'var(--tb-bg-secondary)', borderRadius: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--tb-text-secondary)' }}>Format</span>
                  <div style={{ fontWeight: 600 }}>RFC 9562</div>
                </div>
              </div>
            )}
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy UUID'}
            </button>
          </div>
        ) : (
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter a UUID above to validate</span>
        )}
      </div>
    </div>
    </DeveloperSecurityFrame>
  );
}
