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

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Authentication Type</span>
      </div>
      <select
        value={authType}
        onChange={(e) => setAuthType(e.target.value as AuthType)}
        className="tb-v2-input"
        style={{ marginBottom: 12 }}
      >
        <option value="bearer">Bearer Token</option>
        <option value="basic">Basic Auth</option>
        <option value="api-key">API Key</option>
      </select>

      {authType === 'bearer' && (
        <div>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Bearer Token</span>
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

      <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
        <span className="tb-v2-tool-label">Authorization Header</span>
        {generateHeader() && (
          <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {generateHeader() ? (
          <div style={{
            padding: '12px',
            background: 'var(--tb-bg-primary)',
            borderRadius: 8,
            fontFamily: 'var(--f-mono)',
            fontSize: 13,
            wordBreak: 'break-all'
          }}>
            {generateHeader()}
          </div>
        ) : (
          <div style={{ color: 'var(--tb-text-muted)', fontSize: 13 }}>
            Fill in the fields above to generate the header
          </div>
        )}
      </div>
    </div>
  );
}
