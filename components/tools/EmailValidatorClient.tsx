'use client';
import { copySecurityText } from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame, { useSecurityTask } from './DeveloperSecurityFrame';
import { validateEmail } from '@/lib/developer-security/primitives';

import { useState } from 'react';

export default function EmailValidatorClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const result = validateEmail(email);

  const copy = () => {
    if (!email) return;
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(email).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(true);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;setEmail('a+b@example.com');}} onClear={()=>{clipboardTask.current++;setClipboardError('');setEmail('');setCopied(false);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    <div>
      <p className="tb-v2-hash-stats">Checks unquoted ASCII address syntax only. This does not check DNS, mailbox existence, or deliverability. Use Punycode for international domain names.</p>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Email Address</span></div>
      <div style={{ position: 'relative' }}>
        <input aria-label="Email" maxLength={100000}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="tb-v2-tool-textarea"
          style={{ width: '100%', minHeight: 44, resize: 'none', paddingRight: 80, boxSizing: 'border-box' }}
        />
        {email && (
          <button
            type="button"
            onClick={copy}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 12
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Validation Result</span></div>
      <div className="tb-v2-tool-output-body">
        {!email.trim() ? (
          <div className="tb-v2-empty">Enter an email address to validate</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: result.valid ? '#10b98120' : '#ef444420',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20
            }}>
              {result.valid ? '✅' : '❌'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: result.valid ? '#10b981' : '#ef4444', fontSize: 15 }}>
                {result.valid ? 'Valid email address' : 'Invalid email address'}
              </div>
              {result.reason && <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{result.reason}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
    </DeveloperSecurityFrame>
  );
}
