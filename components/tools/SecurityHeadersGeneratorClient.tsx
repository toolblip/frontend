'use client';

import { useState, useMemo, useEffect } from 'react';

interface HeaderConfig {
  enabled: boolean;
  value: string;
  description: string;
}

const HEADER_PRESETS = [
  { name: 'Basic Security', description: 'Essential security headers for most websites' },
  { name: 'Strict CSP', description: 'Strict Content Security Policy with strict-dynamic' },
  { name: 'HSTS Preload', description: 'HTTP Strict Transport Security for preload list' },
  { name: 'Full Protection', description: 'Comprehensive security headers' },
];

export default function SecurityHeadersGeneratorClient() {
  const [preset, setPreset] = useState('Basic Security');
  const [copied, setCopied] = useState(false);

  const [headers, setHeaders] = useState<Record<string, HeaderConfig>>({
    'X-Frame-Options': {
      enabled: true,
      value: 'SAMEORIGIN',
      description: 'Prevents clickjacking by controlling iframe embedding',
    },
    'X-Content-Type-Options': {
      enabled: true,
      value: 'nosniff',
      description: 'Prevents MIME type sniffing',
    },
    'X-XSS-Protection': {
      enabled: true,
      value: '1; mode=block',
      description: 'Legacy XSS filter (replaced by CSP in modern browsers)',
    },
    'Referrer-Policy': {
      enabled: true,
      value: 'strict-origin-when-cross-origin',
      description: 'Controls how much referrer info is shared',
    },
    'Permissions-Policy': {
      enabled: true,
      value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
      description: 'Controls browser feature permissions',
    },
    'Content-Security-Policy': {
      enabled: false,
      value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'self';",
      description: 'Controls which resources can be loaded',
    },
    'Strict-Transport-Security': {
      enabled: false,
      value: 'max-age=31536000; includeSubDomains',
      description: 'Forces HTTPS connections (HSTS)',
    },
    'X-Permitted-Cross-Domain-Policies': {
      enabled: false,
      value: 'none',
      description: 'Controls Adobe Flash cross-domain requests',
    },
    'Cross-Origin-Embedder-Policy': {
      enabled: false,
      value: 'require-corp',
      description: 'Controls cross-origin resource loading',
    },
    'Cross-Origin-Opener-Policy': {
      enabled: false,
      value: 'same-origin',
      description: 'Isolates browsing context',
    },
    'Cross-Origin-Resource-Policy': {
      enabled: false,
      value: 'same-origin',
      description: 'Controls cross-origin resource sharing',
    },
  });

  const [customHeaders, setCustomHeaders] = useState<{ name: string; value: string }[]>([]);
  const [newHeaderName, setNewHeaderName] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const applyPreset = (presetName: string) => {
    setPreset(presetName);
    const reset = () => {
      Object.keys(headers).forEach((key) => {
        setHeaders((prev) => ({
          ...prev,
          [key]: { ...prev[key], enabled: false },
        }));
      });
    };

    reset();

    switch (presetName) {
      case 'Basic Security':
        setHeaders((prev) => ({
          ...prev,
          'X-Frame-Options': { ...prev['X-Frame-Options'], enabled: true },
          'X-Content-Type-Options': { ...prev['X-Content-Type-Options'], enabled: true },
          'X-XSS-Protection': { ...prev['X-XSS-Protection'], enabled: true },
          'Referrer-Policy': { ...prev['Referrer-Policy'], enabled: true },
        }));
        break;
      case 'Strict CSP':
        setHeaders((prev) => ({
          ...prev,
          'X-Frame-Options': { ...prev['X-Frame-Options'], enabled: true },
          'X-Content-Type-Options': { ...prev['X-Content-Type-Options'], enabled: true },
          'Content-Security-Policy': {
            ...prev['Content-Security-Policy'],
            enabled: true,
            value: "default-src 'self'; script-src 'self' 'strict-dynamic' 'nonce-{RANDOM}'; style-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
          },
          'Strict-Transport-Security': { ...prev['Strict-Transport-Security'], enabled: true },
        }));
        break;
      case 'HSTS Preload':
        setHeaders((prev) => ({
          ...prev,
          'Strict-Transport-Security': {
            ...prev['Strict-Transport-Security'],
            enabled: true,
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          'X-Content-Type-Options': { ...prev['X-Content-Type-Options'], enabled: true },
          'X-Frame-Options': { ...prev['X-Frame-Options'], enabled: true },
        }));
        break;
      case 'Full Protection':
        Object.keys(headers).forEach((key) => {
          setHeaders((prev) => ({
            ...prev,
            [key]: { ...prev[key], enabled: true },
          }));
        });
        break;
    }
  };

  const [generatedAt, setGeneratedAt] = useState<string>('…');

  useEffect(() => {
    setGeneratedAt(new Date().toISOString());
  }, []);

  const generate = () => {
    let output = '# Security Headers\n';
    output += `# Generated: ${generatedAt || '...'}\n\n`;

    Object.entries(headers).forEach(([name, config]) => {
      if (config.enabled) {
        output += `${name}: ${config.value}\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `${h.name}: ${h.value}\n`;
      }
    });

    return output;
  };

  const generateNginx = () => {
    let output = '# Nginx Security Headers\n';
    output += `# Generated: ${generatedAt || '...'}\n\n`;
    output += 'server {\n';

    Object.entries(headers).forEach(([name, config]) => {
      if (config.enabled) {
        const nginxName = name.toLowerCase().replace(/-/g, '_');
        output += `    add_header ${name} "${config.value}" always;\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `    add_header ${h.name} "${h.value}" always;\n`;
      }
    });

    output += '}\n';
    return output;
  };

  const generateApache = () => {
    let output = '# Apache Security Headers\n';
    output += `# Generated: ${generatedAt || '...'}\n\n`;
    output += '<IfModule mod_headers.c>\n';

    Object.entries(headers).forEach(([name, config]) => {
      if (config.enabled) {
        output += `    Header set ${name} "${config.value}"\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `    Header set ${h.name} "${h.value}"\n`;
      }
    });

    output += '</IfModule>\n';
    return output;
  };

  const generateNextJs = () => {
    let output = '// Next.js Security Headers (next.config.js)\n\n';
    output += 'const securityHeaders = [\n';

    Object.entries(headers).forEach(([name, config]) => {
      if (config.enabled) {
        output += `  {\n`;
        output += `    key: '${name}',\n`;
        output += `    value: '${config.value}',\n`;
        output += `  },\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `  {\n`;
        output += `    key: '${h.name}',\n`;
        output += `    value: '${h.value}',\n`;
        output += `  },\n`;
      }
    });

    output += '];\n\n';
    output += 'module.exports = {\n';
    output += '  async headers() {\n';
    output += '    return [\n';
    output += '      {\n';
    output += '        source: \'/(.*)\',\n';
    output += '        headers: securityHeaders,\n';
    output += '      },\n';
    output += '    ];\n';
    output += '  },\n';
    output += '};\n';
    return output;
  };

  // Guard clipboard access to prevent hydration mismatch
  const copy = (text: string) => {
    if (!isMounted) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addCustomHeader = () => {
    if (newHeaderName && newHeaderValue) {
      setCustomHeaders([...customHeaders, { name: newHeaderName, value: newHeaderValue }]);
      setNewHeaderName('');
      setNewHeaderValue('');
    }
  };

  const removeCustomHeader = (index: number) => {
    setCustomHeaders(customHeaders.filter((_, i) => i !== index));
  };

  const output = generate();
  const nginxOutput = generateNginx();
  const apacheOutput = generateApache();
  const nextJsOutput = generateNextJs();

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Presets</span>
      </div>
      <div className="tb-v2-mode-tabs" role="tablist">
        {HEADER_PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            role="tab"
            aria-selected={preset === p.name}
            onClick={() => applyPreset(p.name)}
            className={`tb-v2-mode-tab ${preset === p.name ? 'on' : ''}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Security Headers</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(headers).map(([name, config]) => (
            <div
              key={name}
              style={{
                padding: '12px',
                border: '1px solid var(--tb-border)',
                borderRadius: '8px',
                opacity: config.enabled ? '1' : '0.6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id={`header-${name}`}
                  checked={config.enabled}
                  onChange={(e) =>
                    setHeaders((prev) => ({
                      ...prev,
                      [name]: { ...prev[name], enabled: e.target.checked },
                    }))
                  }
                  style={{ width: '16px', height: '16px' }}
                />
                <label
                  htmlFor={`header-${name}`}
                  style={{ fontWeight: 600, cursor: 'pointer', flex: 1 }}
                >
                  {name}
                </label>
              </div>
              {config.enabled && (
                <input
                  type="text"
                  value={config.value}
                  onChange={(e) =>
                    setHeaders((prev) => ({
                      ...prev,
                      [name]: { ...prev[name], value: e.target.value },
                    }))
                  }
                  className="tb-v2-tool-input"
                  style={{ fontFamily: 'var(--f-mono)', fontSize: '12px' }}
                />
              )}
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
                {config.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px' }}>
          <div className="tb-v2-tool-label" style={{ marginBottom: '8px' }}>
            Custom Headers
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={newHeaderName}
              onChange={(e) => setNewHeaderName(e.target.value)}
              placeholder="Header-Name"
              className="tb-v2-tool-input"
              style={{ flex: 1 }}
            />
            <input
              type="text"
              value={newHeaderValue}
              onChange={(e) => setNewHeaderValue(e.target.value)}
              placeholder="Header value"
              className="tb-v2-tool-input"
              style={{ flex: 2 }}
            />
            <button
              type="button"
              onClick={addCustomHeader}
              className="tb-v2-copy-btn"
              style={{ background: '#2563eb', color: 'white' }}
            >
              Add
            </button>
          </div>
          {customHeaders.map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                padding: '8px',
                background: '#f8fafc',
                borderRadius: '6px',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '13px' }}>
                {h.name}: {h.value}
              </span>
              <button
                type="button"
                onClick={() => removeCustomHeader(i)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="tb-v2-tool-output-head" style={{ marginTop: '16px' }}>
        <span className="tb-v2-tool-label">Generated Headers</span>
        {output && (
          <button
            type="button"
            onClick={() => copy(output)}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre">{output}</pre>
      </div>

      <details style={{ marginTop: '16px' }}>
        <summary
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            background: '#f1f5f9',
            borderRadius: '6px',
            fontWeight: 500,
          }}
        >
          Nginx Configuration
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(nginxOutput)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Copy
          </button>
          <pre
            className="tb-v2-tool-pre"
            style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}
          >
            {nginxOutput}
          </pre>
        </div>
      </details>

      <details style={{ marginTop: '8px' }}>
        <summary
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            background: '#f1f5f9',
            borderRadius: '6px',
            fontWeight: 500,
          }}
        >
          Apache (.htaccess) Configuration
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(apacheOutput)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Copy
          </button>
          <pre
            className="tb-v2-tool-pre"
            style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}
          >
            {apacheOutput}
          </pre>
        </div>
      </details>

      <details style={{ marginTop: '8px' }}>
        <summary
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            background: '#f1f5f9',
            borderRadius: '6px',
            fontWeight: 500,
          }}
        >
          Next.js Configuration
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(nextJsOutput)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Copy
          </button>
          <pre
            className="tb-v2-tool-pre"
            style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}
          >
            {nextJsOutput}
          </pre>
        </div>
      </details>

      <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', fontSize: '13px' }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>💡 Security Tips</strong>
        <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
          <li>Test headers on <a href="https://securityheaders.com" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>securityheaders.com</a></li>
          <li>HSTS with preload is permanent - ensure HTTPS works across all subdomains first</li>
          <li>CSP 'strict-dynamic' requires a nonce or hash for script execution</li>
          <li>Monitor for false positives after deploying new CSP rules</li>
        </ul>
      </div>
    </div>
  );
}
