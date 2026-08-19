'use client';

import { useMemo, useState } from 'react';

const DEFAULT_HEADER = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}';
const DEFAULT_PAYLOAD = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": ' + Math.floor(Date.now() / 1000) + '\n}';

const HMAC_ALGS: Record<string, string> = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function stringToBase64Url(s: string): string {
  return bytesToBase64Url(new TextEncoder().encode(s));
}

function parseJson(label: string, text: string): { value: Record<string, unknown> | null; error: string } {
  if (!text.trim()) return { value: null, error: `${label} is empty` };
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { value: null, error: `${label} must be a JSON object` };
    }
    return { value: parsed as Record<string, unknown>, error: '' };
  } catch (e) {
    return { value: null, error: `${label} — ${(e as Error).message}` };
  }
}

type BuildState =
  | { status: 'idle' }
  | { status: 'building' }
  | { status: 'done'; token: string }
  | { status: 'error'; message: string };

export default function TokenBuilderClient() {
  const [headerText, setHeaderText] = useState(DEFAULT_HEADER);
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [build, setBuild] = useState<BuildState>({ status: 'idle' });
  const [copied, setCopied] = useState(false);

  const header = useMemo(() => parseJson('Header', headerText), [headerText]);
  const payload = useMemo(() => parseJson('Payload', payloadText), [payloadText]);

  const alg = useMemo(() => {
    if (!header.value) return null;
    const a = header.value.alg;
    return typeof a === 'string' ? a : null;
  }, [header.value]);

  const canGenerate = !!header.value && !!payload.value && !!alg && alg in HMAC_ALGS;

  const generate = async () => {
    if (!header.value || !payload.value) return;
    if (!alg) {
      setBuild({ status: 'error', message: 'Header must include an "alg" field.' });
      return;
    }
    if (!(alg in HMAC_ALGS)) {
      setBuild({
        status: 'error',
        message: `"${alg}" isn't supported for client-side signing — only HS256, HS384, and HS512 (shared-secret HMAC) can be generated in the browser. Asymmetric algorithms (RS256, ES256, etc.) need a private key held server-side.`,
      });
      return;
    }
    setBuild({ status: 'building' });
    try {
      const headerPart = stringToBase64Url(JSON.stringify(header.value));
      const payloadPart = stringToBase64Url(JSON.stringify(payload.value));
      const signingInput = `${headerPart}.${payloadPart}`;
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: HMAC_ALGS[alg] },
        false,
        ['sign']
      );
      const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
      const signature = bytesToBase64Url(new Uint8Array(sigBuf));
      setBuild({ status: 'done', token: `${signingInput}.${signature}` });
    } catch (e) {
      setBuild({ status: 'error', message: (e as Error).message });
    }
  };

  const copy = () => {
    if (build.status !== 'done') return;
    navigator.clipboard.writeText(build.token).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-grid-2">
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Header</span>
          </div>
          <textarea
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 140 }}
            aria-label="JWT header JSON"
            spellCheck={false}
          />
          {header.error && <p className="tb-v2-error" role="alert">{header.error}</p>}
        </div>
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Payload</span>
          </div>
          <textarea
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)', minHeight: 140 }}
            aria-label="JWT payload JSON"
            spellCheck={false}
          />
          {payload.error && <p className="tb-v2-error" role="alert">{payload.error}</p>}
        </div>
      </div>

      <div className="tb-v2-tool-input-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Secret ({alg && alg in HMAC_ALGS ? alg : 'HMAC'})</span>
      </div>
      <input
        type="text"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        placeholder="Secret used to sign the token…"
        className="tb-v2-input"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Signing secret"
      />

      <button
        type="button"
        onClick={generate}
        disabled={!canGenerate || build.status === 'building'}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        style={{ marginTop: 12 }}
      >
        {build.status === 'building' ? 'Generating…' : 'Generate token'}
      </button>

      {!canGenerate && alg && !(alg in HMAC_ALGS) && (
        <p className="tb-v2-hash-stats" style={{ marginTop: 8 }}>
          Only HS256 / HS384 / HS512 can be signed client-side. Change &quot;alg&quot; in the header to one of these to generate a token.
        </p>
      )}

      {build.status === 'error' && (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>{build.message}</p>
      )}

      {build.status === 'done' && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Token</span>
            <button
              type="button"
              onClick={copy}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{build.token}</pre>
          </div>
        </>
      )}
    </div>
  );
}
