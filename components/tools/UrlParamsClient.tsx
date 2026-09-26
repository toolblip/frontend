'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import ToolExampleClearActions from './ToolExampleClearActions';
import { useMemo, useState } from 'react';

interface Parsed {
  scheme: string;
  host: string;
  pathname: string;
  hash: string;
  params: { key: string; value: string }[];
  error: string | null;
}

const SAMPLE = 'https://example.com/search?q=hello+world&utm_source=newsletter&utm_campaign=2026-spring&page=2#section-results';

function parseUrl(input: string, decode: boolean): Parsed {
  const empty: Parsed = {
    scheme: '', host: '', pathname: '', hash: '', params: [], error: null,
  };
  const v = input.trim();
  if (!v) return empty;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ...empty, error: 'Could not parse  -  check the URL.' };
  }

  const params: { key: string; value: string }[] = [];
  if (decode) url.searchParams.forEach((value,key)=>params.push({key,value}));
  else for (const pair of url.search.slice(1).split('&').filter(Boolean)) {const i=pair.indexOf('=');params.push({key:i<0?pair:pair.slice(0,i),value:i<0?'':pair.slice(i+1)});}
  let hash=url.hash.slice(1);
  try {if(decode)hash=decodeURIComponent(hash);}catch{return {...empty,error:'Malformed percent encoding in fragment.'};}

  return {
    scheme: url.protocol.replace(/:$/, ''),
    host: url.host,
    pathname: url.pathname,
    hash,
    params,
    error: null,
  };
}

export default function UrlParamsClient() {
  const [input, setInput] = useState(SAMPLE);
  const [decode, setDecode] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => parseUrl(input, decode), [input, decode]);

  const copy = (id: string, val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const json = useMemo(() => {
    if (parsed.error || parsed.params.length === 0) return '';
    const obj: Record<string, string | string[]> = Object.create(null);
    for (const { key, value } of parsed.params) {
      const cur = obj[key];
      if (cur === undefined) obj[key] = value;
      else if (Array.isArray(cur)) cur.push(value);
      else obj[key] = [cur, value];
    }
    return JSON.stringify(obj, null, 2);
  }, [parsed]);

  return (
    <DeveloperGeneralFrame><div>
      <ToolExampleClearActions onExample={() => {setInput(SAMPLE);setDecode(true);}} onClear={() => {setInput('');setCopied(null);}} />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">URL</span>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Decoding">
          <button
            type="button"
            onClick={() => setDecode(true)}
            className={`tb-v2-mode-tab ${decode ? 'on' : ''}`}
            aria-pressed={decode}
          >
            Decoded
          </button>
          <button
            type="button"
            onClick={() => setDecode(false)}
            className={`tb-v2-mode-tab ${!decode ? 'on' : ''}`}
            aria-pressed={!decode}
          >
            Raw
          </button>
        </div>
      </div>
      <textarea maxLength={100000}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={SAMPLE}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="URL to parse"
      />

      {parsed.error ? (
        <p className="tb-v2-error" role="alert" style={{ marginTop: 12 }}>
          <strong>Parse error:</strong> {parsed.error}
        </p>
      ) : input.trim() && (
        <>
          <div className="tb-v2-url-meta">
            <div><span className="tb-v2-url-key">Scheme</span><code>{parsed.scheme || ' - '}</code></div>
            <div><span className="tb-v2-url-key">Host</span><code>{parsed.host || ' - '}</code></div>
            <div><span className="tb-v2-url-key">Path</span><code>{parsed.pathname || ' - '}</code></div>
            <div><span className="tb-v2-url-key">Fragment</span><code>{parsed.hash || ' - '}</code></div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">
              Query parameters {parsed.params.length > 0 && <span className="tb-v2-hash-stats">({parsed.params.length})</span>}
            </span>
            <button
              type="button"
              onClick={() => copy('json', json)}
              disabled={!json}
              className={`tb-v2-copy-btn ${copied === 'json' ? 'done' : ''}`}
            >
              {copied === 'json' ? 'Copied JSON' : 'Copy as JSON'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            {parsed.params.length === 0 ? (
              <pre className="tb-v2-tool-pre"> -  no query parameters  - </pre>
            ) : (
              <ul className="tb-v2-url-params">
                {parsed.params.map((p, i) => (
                  <li key={`${p.key}-${i}`} className="tb-v2-url-param-row">
                    <code className="tb-v2-url-param-key">{p.key}</code>
                    <code className="tb-v2-url-param-val">{p.value}</code>
                    <button
                      type="button"
                      onClick={() => copy(`v-${i}`, p.value)}
                      className={`tb-v2-copy-btn ${copied === `v-${i}` ? 'done' : ''}`}
                      aria-label={`Copy value of ${p.key}`}
                    >
                      {copied === `v-${i}` ? 'Copied' : 'Copy'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div></DeveloperGeneralFrame>
  );
}
