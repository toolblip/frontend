'use client';

import { useEffect, useMemo, useState } from 'react';

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0Ijo3NTE2MjM5MDIyLCJleHAiOjkwMDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

interface Decoded {
  header: unknown;
  payload: unknown;
  signature: string;
  rawHeader: string;
  rawPayload: string;
  signingInput: string;
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(s: string): string {
  return new TextDecoder().decode(base64UrlToBytes(s));
}

function decodeJwt(token: string): { result: Decoded | null; error: string } {
  const t = token.trim();
  if (!t) return { result: null, error: '' };
  const parts = t.split('.');
  if (parts.length !== 3) {
    return { result: null, error: 'A JWT has three dot-separated parts: header.payload.signature' };
  }
  try {
    const rawHeader = base64UrlDecode(parts[0]);
    const rawPayload = base64UrlDecode(parts[1]);
    const header = JSON.parse(rawHeader);
    const payload = JSON.parse(rawPayload);
    return {
      result: {
        header,
        payload,
        signature: parts[2],
        rawHeader,
        rawPayload,
        signingInput: `${parts[0]}.${parts[1]}`,
      },
      error: '',
    };
  } catch (e) {
    return { result: null, error: `Could not decode: ${(e as Error).message}` };
  }
}

function fmtTime(t: unknown): string | null {
  if (typeof t !== 'number') return null;
  const ms = t > 1e12 ? t : t * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

const HMAC_ALGS: Record<string, string> = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
};

type VerifyState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'match' }
  | { status: 'mismatch' }
  | { status: 'unsupported'; alg: string }
  | { status: 'error'; message: string };

export default function JwtTokenTesterClient() {
  const [token, setToken] = useState(SAMPLE);
  const [secret, setSecret] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<{ result: Decoded | null; error: string }>({ result: null, error: '' });
  const [verify, setVerify] = useState<VerifyState>({ status: 'idle' });

  useEffect(() => {
    setDecoded(decodeJwt(token));
  }, [token]);

  const { result, error } = decoded;

  const alg = useMemo(() => {
    if (!result || typeof result.header !== 'object' || !result.header) return null;
    const h = result.header as Record<string, unknown>;
    return typeof h.alg === 'string' ? h.alg : null;
  }, [result]);

  const claims = useMemo(() => {
    if (!result || typeof result.payload !== 'object' || !result.payload) return null;
    const p = result.payload as Record<string, unknown>;
    const now = Math.floor(Date.now() / 1000);
    const exp = typeof p.exp === 'number' ? p.exp : null;
    const nbf = typeof p.nbf === 'number' ? p.nbf : null;
    let status: 'valid' | 'expired' | 'not-yet' | 'unknown' = 'unknown';
    if (exp !== null && exp < now) status = 'expired';
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

  useEffect(() => {
    let cancelled = false;
    if (!result || !alg) {
      setVerify({ status: 'idle' });
      return;
    }
    if (!(alg in HMAC_ALGS)) {
      setVerify({ status: 'unsupported', alg });
      return;
    }
    if (!secret) {
      setVerify({ status: 'idle' });
      return;
    }
    setVerify({ status: 'checking' });
    (async () => {
      try {
        const hash = HMAC_ALGS[alg];
        const key = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(secret),
          { name: 'HMAC', hash },
          false,
          ['sign']
        );
        const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(result.signingInput));
        const computed = bytesToBase64Url(new Uint8Array(sigBuf));
        if (cancelled) return;
        setVerify({ status: computed === result.signature ? 'match' : 'mismatch' });
      } catch (e) {
        if (cancelled) return;
        setVerify({ status: 'error', message: (e as Error).message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result, alg, secret]);

  const copy = (id: string, val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
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
      <textarea
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
            <span className="tb-v2-tool-label tb-v2-jwt-section">Verify signature</span>
            {verify.status === 'match' && <span className="tb-v2-status tb-v2-status-ok">✓ Signature valid</span>}
            {verify.status === 'mismatch' && <span className="tb-v2-status tb-v2-status-err">✗ Signature does not match</span>}
            {verify.status === 'unsupported' && <span className="tb-v2-status tb-v2-status-warn">Unsupported alg</span>}
            {verify.status === 'error' && <span className="tb-v2-status tb-v2-status-err">Error</span>}
            {verify.status === 'checking' && <span className="tb-v2-status tb-v2-status-info">Checking…</span>}
          </div>
          <div className="tb-v2-tool-output-body">
            {alg && alg in HMAC_ALGS ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="tb-v2-tool-label" style={{ fontWeight: 400 }}>
                  Secret used to sign this token ({alg})
                </span>
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter the HMAC secret to verify…"
                  className="tb-v2-input"
                  style={{ fontFamily: 'var(--f-mono)' }}
                  aria-label="HMAC secret"
                />
                {verify.status === 'error' && (
                  <p className="tb-v2-error" role="alert">{verify.message}</p>
                )}
                {verify.status === 'idle' && !secret && (
                  <p className="tb-v2-hash-stats">Enter the secret above to check the signature.</p>
                )}
              </div>
            ) : (
              <p className="tb-v2-hash-stats">
                {alg
                  ? `Signature verification for "${alg}" requires a public key — not yet supported here. Only HS256 / HS384 / HS512 (shared-secret HMAC) can be verified in the browser.`
                  : 'No "alg" claim found in the header.'}
              </p>
            )}
          </div>

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
          </div>
        </>
      )}
    </div>
  );
}
