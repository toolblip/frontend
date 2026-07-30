'use client';

import { useState } from 'react';

type AuthType = 'bearer' | 'basic' | 'api-key';

export default function ApiAuthHeaderGeneratorClient() {
  const [authType, setAuthType] = useState<AuthType>('bearer');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKeyName, setApiKeyName] = useState('X-API-Key');
  const [apiKey, setApiKey] = useState('');
  const [prefix, setPrefix] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHeader = (): string => {
    switch (authType) {
      case 'bearer':
        return token ? `Authorization: Bearer ${token}` : '';
      case 'basic':
        const encoded = btoa(`${username}:${password}`);
        return username || password ? `Authorization: Basic ${encoded}` : '';
      case 'api-key':
        const keyHeader = apiKeyName || 'X-API-Key';
        return apiKey ? `Authorization: ${prefix ? prefix + ' ' : ''}${keyHeader} ${apiKey}` : '';
      default:
        return '';
    }
  };

  const copy = () => {
    const header = generateHeader();
    if (!header) return;
    navigator.clipboard.writeText(header).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const header = generateHeader();
  const curlExample = header ? `curl -H "${header}" https://api.example.com/v1/resource` : '';

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-mode-tabs">
        <button type="button" onClick={() => setAuthType('bearer')} className={`tb-v2-mode-tab ${authType === 'bearer' ? 'on' : ''}`}>
          Bearer Token
        </button>
        <button type="button" onClick={() => setAuthType('basic')} className={`tb-v2-mode-tab ${authType === 'basic' ? 'on' : ''}`}>
          Basic Auth
        </button>
        <button type="button" onClick={() => setAuthType('api-key')} className={`tb-v2-mode-tab ${authType === 'api-key' ? 'on' : ''}`}>
          API Key
        </button>
      </div>

      {authType === 'bearer' && (
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Bearer Token</span>
            <button type="button" onClick={() => setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example')} className="tb-v2-btn-sm">
              Load Example
            </button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your bearer token..."
            className="tb-v2-tool-textarea"
            style={{ minHeight: 80 }}
          />
        </div>
      )}

      {authType === 'basic' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <div className="tb-v2-tool-input-head">
              <span className="tb-v2-tool-label">Username</span>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="tb-v2-input"
            />
          </div>
          <div>
            <div className="tb-v2-tool-input-head">
              <span className="tb-v2-tool-label">Password</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="tb-v2-input"
            />
          </div>
        </>
      )}

      {authType === 'api-key' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <div className="tb-v2-tool-input-head">
              <span className="tb-v2-tool-label">API Key Header Name</span>
            </div>
            <input
              type="text"
              value={apiKeyName}
              onChange={(e) => setApiKeyName(e.target.value)}
              placeholder="X-API-Key"
              className="tb-v2-input"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div className="tb-v2-tool-input-head">
              <span className="tb-v2-tool-label">API Key Prefix (optional)</span>
            </div>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Token"
              className="tb-v2-input"
            />
          </div>
          <div>
            <div className="tb-v2-tool-input-head">
              <span className="tb-v2-tool-label">API Key</span>
            </div>
            <textarea
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="your-api-key-here"
              className="tb-v2-tool-textarea"
              style={{ minHeight: 80 }}
            />
          </div>
        </>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Authorization Header</span>
        {header && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      {header ? (
        <>
          <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{header}</pre>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Example curl Request</span>
          </div>
          <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{curlExample}</pre>
        </>
      ) : (
        <p className="tb-v2-empty">Fill in the fields above to generate the Authorization header.</p>
      )}
    </div>
  );
}
