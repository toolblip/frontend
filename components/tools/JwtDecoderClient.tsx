'use client';
import { copySecurityText } from '@/lib/developer-security/primitives';
import DeveloperSecurityFrame, { useSecurityTask } from './DeveloperSecurityFrame';
import { decodeJwt as parseJwt } from '@/lib/developer-security/primitives';

import { useMemo, useState, useEffect } from 'react';

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

interface Decoded {
  header: unknown;
  payload: unknown;
  signature: string;
  rawHeader: string;
  rawPayload: string;
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function base64UrlDecode(s: string): string {
  return new TextDecoder().decode(base64UrlToBytes(s));
}

function decodeJwt(token: string): { result: Decoded | null; error: string } {
  if (!token.trim()) return {result:null,error:''};
  try { return {result:parseJwt(token),error:''}; } catch(e) { return {result:null,error:(e as Error).message}; }
}

function fmtTime(t: unknown): string | null {
  if (typeof t !== 'number') return null;
  const ms = t * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

export default function JwtDecoderClient() {
  const [clipboardError,setClipboardError]=useState('');
  const clipboardTask=useSecurityTask();
  const [token, setToken] = useState(SAMPLE);
  const [copied, setCopied] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<{ result: Decoded | null; error: string }>({ result: null, error: '' });

  useEffect(() => {
    setDecoded(decodeJwt(token));
  }, [token]);

  const { result, error } = decoded;

  const claims = useMemo(() => {
    if (!result || typeof result.payload !== 'object' || !result.payload) return null;
    const p = result.payload as Record<string, unknown>;
    const now = Math.floor(Date.now() / 1000);
    const exp = typeof p.exp === 'number' ? p.exp : null;
    const nbf = typeof p.nbf === 'number' ? p.nbf : null;
    let status: 'valid' | 'expired' | 'not-yet' | 'unknown' = 'unknown';
    if (exp !== null && exp <= now) status = 'expired';
    else if (nbf !== null && nbf > now) status = 'not-yet';
    else if (exp !== null) status = 'valid';
    return {
      iss: typeof p.iss === 'string' ? p.iss : null,
      sub: typeof p.sub === 'string' ? p.sub : null,
      aud: p.aud,
      iat: typeof p.iat === 'number' ? p.iat : null,
      exp,
      nbf,
      status,
    };
  }, [result]);

  const copy = (id: string, val: string) => {
    if (!val) return;
    const copyId=++clipboardTask.current;setClipboardError('');
    copySecurityText(val).then(()=>{if(copyId!==clipboardTask.current)return;setCopied(id);}).catch(()=>{if(copyId===clipboardTask.current)setClipboardError('Clipboard access failed. Select and copy the output manually.');});
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <DeveloperSecurityFrame onExample={()=>{clipboardTask.current++;setToken(SAMPLE);}} onClear={()=>{clipboardTask.current++;setClipboardError('');setToken(''); setDecoded({result:null,error:''}); setCopied(null);}}>
    {clipboardError&&<p role="alert" className="tb-v2-error">{clipboardError}</p>}
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">JWT</span>
        {claims && (
          <span className={`tb-v2-jwt-badge ${claims.status}`}>
            {claims.status === 'valid' && '● Not expired'}
            {claims.status === 'expired' && '● Expired'}
            {claims.status === 'not-yet' && '● Not yet valid'}
            {claims.status === 'unknown' && '○ No exp claim'}
          </span>
        )}
      </div>
      <textarea maxLength={100000}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste a JWT (header.payload.signature)…"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', wordBreak: 'break-all' }}
        aria-label="JWT input"
      />

      {error && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>
          <strong>Decode error:</strong> {error}
        </p>
      )}

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label tb-v2-jwt-section">Header</span>
            <button
              type="button"
              onClick={() => copy('h', JSON.stringify(result.header, null, 2))}
              className={`tb-v2-copy-btn ${copied === 'h' ? 'done' : ''}`}
            >
              {copied === 'h' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">{JSON.stringify(result.header, null, 2)}</pre>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label tb-v2-jwt-section">Payload</span>
            <button
              type="button"
              onClick={() => copy('p', JSON.stringify(result.payload, null, 2))}
              className={`tb-v2-copy-btn ${copied === 'p' ? 'done' : ''}`}
            >
              {copied === 'p' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>

          {claims && (claims.iss || claims.sub || claims.iat || claims.exp || claims.nbf) && (
            <>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Standard claims</span>
              </div>
              <div className="tb-v2-tool-output-body">
                <dl className="tb-v2-jwt-claims">
                  {claims.iss && <><dt>iss</dt><dd>{claims.iss}</dd></>}
                  {claims.sub && <><dt>sub</dt><dd>{claims.sub}</dd></>}
                  {claims.aud !== undefined && <><dt>aud</dt><dd>{Array.isArray(claims.aud) ? claims.aud.join(', ') : String(claims.aud)}</dd></>}
                  {claims.iat !== null && <><dt>iat</dt><dd>{fmtTime(claims.iat)} <span className="tb-v2-hash-stats">({claims.iat})</span></dd></>}
                  {claims.nbf !== null && <><dt>nbf</dt><dd>{fmtTime(claims.nbf)}</dd></>}
                  {claims.exp !== null && <><dt>exp</dt><dd>{fmtTime(claims.exp)}</dd></>}
                </dl>
              </div>
            </>
          )}

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label tb-v2-jwt-section">Signature</span>
            <button
              type="button"
              onClick={() => copy('s', result.signature)}
              className={`tb-v2-copy-btn ${copied === 's' ? 'done' : ''}`}
            >
              {copied === 's' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{result.signature}</pre>
            <p className="tb-v2-hash-stats" style={{ marginTop: 8 }}>
              Signature is shown as-is. This tool only decodes  -  it does not verify the signature.
            </p>
          </div>
        </>
      )}
    </div>
    </DeveloperSecurityFrame>
  );
}
