'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useState, useMemo } from 'react';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

const EXAMPLE_URL = 'https://api.example.com/v1/users';
const EXAMPLE_HEADERS = 'Content-Type: application/json\nAccept: application/json';
const EXAMPLE_BODY = '{\n  "name": "Ada Lovelace"\n}';

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function buildCurl(opts: {
  url: string;
  method: string;
  headers: string;
  body: string;
  user: string;
  insecure: boolean;
  followRedirects: boolean;
  verbose: boolean;
  compressed: boolean;
  multiline: boolean;
}): string {
  if (!opts.url.trim()) return '';

  const parsed=new URL(opts.url);if(!['http:','https:'].includes(parsed.protocol))throw new Error('Use an HTTP(S) URL');
  if(opts.headers.split('\n').filter(h=>h.trim()).some(h=>!/^[-!#$%&'*+.^_`|~\da-zA-Z]+:\s*[^\r\n]*$/.test(h)))throw new Error('Invalid header; use Name: value');
  const parts: string[] = ['curl'];
  if (opts.method !== 'GET') parts.push(`-X ${opts.method}`);

  opts.headers
    .split('\n')
    .map(h => h.trim())
    .filter(Boolean)
    .forEach(h => parts.push(`-H ${shellQuote(h)}`));

  if (opts.user.trim()) parts.push(`-u ${shellQuote(opts.user.trim())}`);
  if (opts.insecure) parts.push('-k');
  if (opts.followRedirects) parts.push('-L');
  if (opts.verbose) parts.push('-v');
  if (opts.compressed) parts.push('--compressed');

  if (opts.body.trim() && opts.method !== 'GET' && opts.method !== 'HEAD') {
    parts.push(`-d ${shellQuote(opts.body.trim())}`);
  }

  parts.push(shellQuote(opts.url.trim()));

  if (!opts.multiline) return parts.join(' ');

  return [parts[0], ...parts.slice(1).map(p => `  ${p}`)].join(' \\\n');
}

export default function CurlCommandBuilderClient() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [user, setUser] = useState('');
  const [insecure, setInsecure] = useState(false);
  const [followRedirects, setFollowRedirects] = useState(true);
  const [verbose, setVerbose] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const [multiline, setMultiline] = useState(true);
  const [copied, setCopied] = useState(false);

  const {output,error} = useMemo(
    () => {try{return {output:buildCurl({ url, method, headers, body, user, insecure, followRedirects, verbose, compressed, multiline }),error:''};}catch(e){return {output:'',error:(e as Error).message};}},
    [url, method, headers, body, user, insecure, followRedirects, verbose, compressed, multiline]
  );

  const loadExample = () => {
    setUrl(EXAMPLE_URL);
    setMethod('POST');
    setHeaders(EXAMPLE_HEADERS);
    setBody(EXAMPLE_BODY);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DeveloperGeneralFrame><div className="tb-v2-tool-card">
      <ToolExampleClearActions onExample={() => {loadExample();}} onClear={() => {setUrl('');setBody('');setHeaders('');setUser('');setCopied(false);}} />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Request</span>

      </div>
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <select aria-label="Method" value={method} onChange={e => setMethod(e.target.value)} className="tb-v2-input" style={{ maxWidth: 140 }}>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input aria-label="Url" maxLength={8000}
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/users"
            className="tb-v2-input"
            style={{ flex: 1, fontFamily: 'var(--f-mono)' }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Headers (one per line)</label>
          <textarea aria-label="Headers" maxLength={100000}
            value={headers}
            onChange={e => setHeaders(e.target.value)}
            placeholder={'Content-Type: application/json\nAuthorization: Bearer token'}
            className="tb-v2-tool-textarea"
            style={{ minHeight: 80, fontFamily: 'var(--f-mono)', fontSize: 13 }}
          />
        </div>

        {method !== 'GET' && method !== 'HEAD' && (
          <div className="flex flex-col gap-1">
            <label className="tb-v2-tool-label">Body</label>
            <textarea aria-label="Body" maxLength={100000}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder='{"key":"value"}'
              className="tb-v2-tool-textarea"
              style={{ minHeight: 100, fontFamily: 'var(--f-mono)', fontSize: 13 }}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Basic auth (user:pass, optional)</label>
          <input aria-label="User" maxLength={8000}
            type="text"
            value={user}
            onChange={e => setUser(e.target.value)}
            placeholder="user:pass"
            className="tb-v2-input"
            style={{ fontFamily: 'var(--f-mono)' }}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="tb-v2-checkbox" checked={followRedirects} onChange={e => setFollowRedirects(e.target.checked)} />
            <span className="tb-v2-tool-label" style={{ margin: 0 }}>Follow redirects (-L)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="tb-v2-checkbox" checked={insecure} onChange={e => setInsecure(e.target.checked)} />
            <span className="tb-v2-tool-label" style={{ margin: 0 }}>Insecure (-k)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="tb-v2-checkbox" checked={verbose} onChange={e => setVerbose(e.target.checked)} />
            <span className="tb-v2-tool-label" style={{ margin: 0 }}>Verbose (-v)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="tb-v2-checkbox" checked={compressed} onChange={e => setCompressed(e.target.checked)} />
            <span className="tb-v2-tool-label" style={{ margin: 0 }}>Compressed</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="tb-v2-checkbox" checked={multiline} onChange={e => setMultiline(e.target.checked)} />
            <span className="tb-v2-tool-label" style={{ margin: 0 }}>Multi-line output</span>
          </label>
        </div>
      </div>

      {error&&<p role="alert" className="tb-v2-error">{error}</p>}
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">curl Command</span>
        <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {output ? (
          <pre className="tb-v2-tool-pre">{output}</pre>
        ) : (
          <p className="tb-v2-empty">Enter a URL above to build a curl command.</p>
        )}
      </div>
    </div></DeveloperGeneralFrame>
  );
}
