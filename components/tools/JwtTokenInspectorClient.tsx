'use client';

import { useEffect, useMemo, useState } from 'react';

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0Ijo3NTE2MjM5MDIyLCJleHAiOjkwMDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

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
      result: { header, payload, signature: parts[2], rawHeader, rawPayload },
      error: '',
    };
  } catch (e) {
    return { result: null, error: `Could not decode: ${(e as Error).message}` };
  }
}

function fmtTime(t: number): string {
  const ms = t > 1e12 ? t : t * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

function relativeTime(t: number): string {
  const ms = t > 1e12 ? t : t * 1000;
  const diffSec = Math.round((ms - Date.now()) / 1000);
  const abs = Math.abs(diffSec);

  const units: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  for (const [unit, secs] of units) {
    if (abs >= secs || unit === 'second') {
      const amount = Math.max(1, Math.round(abs / secs));
      const plural = amount === 1 ? unit : `${unit}s`;
      return diffSec >= 0 ? `in ${amount} ${plural}` : `${amount} ${plural} ago`;
    }
  }
  return 'now';
}

const CLAIM_KEYS: { key: 'iat' | 'exp' | 'nbf'; label: string; pastPrefix: string; futurePrefix: string }[] = [
  { key: 'iat', label: 'Issued at', pastPrefix: 'issued', futurePrefix: 'issues' },
  { key: 'exp', label: 'Expires at', pastPrefix: 'expired', futurePrefix: 'expires' },
  { key: 'nbf', label: 'Not valid before', pastPrefix: 'became valid', futurePrefix: 'becomes valid' },
];

export default function JwtTokenInspectorClient() {
  const [token, setToken] = useState(SAMPLE);
  const [copied, setCopied] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<{ result: Decoded | null; error: string }>({ result: null, error: '' });

  useEffect(() => {
    setDecoded(decodeJwt(token));
  }, [token]);

  const { result, error } = decoded;

  const alg = useMemo(() => {
    if (!result || typeof result.header !== 'object' || !result.header) return 'unknown';
    const h = result.header as Record<string, unknown>;
    return typeof h.alg === 'string' ? h.alg : 'unknown';
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

  const signatureBytes = useMemo(() => {
    if (!result) return null;
    try {
      return base64UrlToBytes(result.signature).length;
    } catch {
      return null;
    }
  }, [result]);

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

          {claims && (
            <>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">Claims &amp; expiration</span>
              </div>
              <div className="tb-v2-tool-output-body">
                <div className="tb-v2-stats-grid">
                  {claims.iss && (
                    <div className="tb-v2-stat-pill">
                      <div className="tb-v2-stat-pill-lbl">iss</div>
                      <div className="tb-v2-stat-pill-val">{claims.iss}</div>
                    </div>
                  )}
                  {claims.sub && (
                    <div className="tb-v2-stat-pill">
                      <div className="tb-v2-stat-pill-lbl">sub</div>
                      <div className="tb-v2-stat-pill-val">{claims.sub}</div>
                    </div>
                  )}
                  {CLAIM_KEYS.map(({ key, label }) => {
                    const val = claims[key];
                    if (val === null) return null;
                    return (
                      <div className="tb-v2-stat-pill" key={key}>
                        <div className="tb-v2-stat-pill-lbl">{label} ({key})</div>
                        <div className="tb-v2-stat-pill-val">{fmtTime(val)}</div>
                        <div className="tb-v2-hash-stats">{relativeTime(val)}</div>
                      </div>
                    );
                  })}
                </div>
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
              Algorithm: <strong>{alg}</strong>
              {signatureBytes !== null && <> · Signature length: <strong>{signatureBytes} bytes</strong></>}
              {' '}· Decode-only view — signature is not cryptographically verified here.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
