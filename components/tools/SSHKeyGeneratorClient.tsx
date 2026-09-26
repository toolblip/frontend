'use client';
import { copySecurityText } from '@/lib/developer-security/primitives';
import { useSecurityTask } from './DeveloperSecurityFrame';
import DeveloperSecurityFrame from './DeveloperSecurityFrame';

import { useState } from 'react';

import { generateRsa, generateEcdsa, generateEd25519, type KeyResult, type KeyType } from '@/lib/developer-security/ssh';
const KEY_TYPE_LABELS: Record<KeyType, string> = {
  'rsa-2048': 'RSA 2048-bit',
  'rsa-4096': 'RSA 4096-bit',
  'ecdsa-256': 'ECDSA P-256',
  'ecdsa-384': 'ECDSA P-384',
  'ecdsa-521': 'ECDSA P-521',
  ed25519: 'Ed25519',
};

type GenState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'done'; result: KeyResult }
  | { status: 'error'; message: string };

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export default function SSHKeyGeneratorClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [keyType, setKeyType] = useState<KeyType>('ed25519');
  const [comment, setComment] = useState('toolblip@generated');
  const [state, setState] = useState<GenState>({ status: 'idle' });
  const [copied, setCopied] = useState<string | null>(null);

  const task=useSecurityTask();
  const invalidate=()=>{task.current++;setState({status:'idle'});setCopied(null);};
  const generate = async () => {
    const id=++task.current;
    if(/[\r\n\x00]/.test(comment)){setState({status:'error',message:'Use a single-line comment without control characters.'});return;}
    setState({ status: 'generating' });
    try {
      let result: KeyResult;
      switch (keyType) {
        case 'rsa-2048':
          result = await generateRsa(2048, comment);
          break;
        case 'rsa-4096':
          result = await generateRsa(4096, comment);
          break;
        case 'ecdsa-256':
          result = await generateEcdsa('P-256', comment);
          break;
        case 'ecdsa-384':
          result = await generateEcdsa('P-384', comment);
          break;
        case 'ecdsa-521':
          result = await generateEcdsa('P-521', comment);
          break;
        case 'ed25519':
          result = await generateEd25519(comment);
          break;
      }
      if(id!==task.current)return;
      setState({ status: 'done', result });
    } catch (e) {
      if(id!==task.current)return;
      const isEd25519 = keyType === 'ed25519';
      setState({
        status: 'error',
        message: isEd25519
          ? "Ed25519 isn't supported in this browser yet — try RSA or ECDSA instead."
          : `Key generation failed: ${(e as Error).message}`,
      });
    }
  };

  const copy = (id: string, val: string) => {
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(val).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(id);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;invalidate();setKeyType('ecdsa-256');setComment('example@local');}} onClear={()=>{clipboardTask.current++;setClipboardError('');invalidate();setComment('');setCopied(null);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    <div>
      <div className="tb-v2-grid-2">
        <div>
          <span className="tb-v2-tool-label">Key type</span>
          <select aria-label="Key type"
            value={keyType}
            onChange={(e) => {invalidate();setKeyType(e.target.value as KeyType);}}
            className="tb-v2-select"
            style={{ width: '100%' }}
          >
            {(Object.keys(KEY_TYPE_LABELS) as KeyType[]).map((k) => (
              <option key={k} value={k}>{KEY_TYPE_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="tb-v2-tool-label">Comment</span>
          <input aria-label="Comment" maxLength={100000}
            type="text"
            value={comment}
            onChange={(e) => {invalidate();setComment(e.target.value);}}
            placeholder="user@host"
            className="tb-v2-input"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={state.status === 'generating'}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        style={{ marginTop: 12 }}
      >
        {state.status === 'generating' ? 'Generating…' : 'Generate key pair'}
      </button>

      <p className="tb-v2-hash-stats" style={{ marginTop: 8 }}>
        Keys are generated entirely in your browser with the Web Crypto API and never leave your device.
      </p>

      {state.status === 'error' && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>{state.message}</p>
      )}

      {state.status === 'done' && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Public key (id_rsa.pub style)</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => copy('pub', state.result.publicKey)}
                className={`tb-v2-copy-btn ${copied === 'pub' ? 'done' : ''}`}
              >
                {copied === 'pub' ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={() => download('id_' + state.result.type + '.pub', state.result.publicKey)}
                className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
              >
                Download
              </button>
            </div>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{state.result.publicKey}</pre>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Private key (id_rsa style, PKCS#8 PEM)</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => copy('priv', state.result.privateKeyPem)}
                className={`tb-v2-copy-btn ${copied === 'priv' ? 'done' : ''}`}
              >
                {copied === 'priv' ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={() => download('id_' + state.result.type, state.result.privateKeyPem)}
                className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
              >
                Download
              </button>
            </div>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{state.result.privateKeyPem}</pre>
            <p className="tb-v2-hash-stats" style={{ marginTop: 8 }}>
              This is an unencrypted PKCS#8 PEM private key, not an OpenSSH private-key container.
              SSH client compatibility varies, especially for Ed25519; conversion may be needed.
              Keep the private key secret.
            </p>
          </div>
        </>
      )}
    </div>
    </DeveloperSecurityFrame>
  );
}
