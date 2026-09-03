'use client';

import { useState, useEffect } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface HeaderConfig {
  enabled: boolean;
  value: string;
  description: string;
}

const HEADER_PRESETS = [
  { name: 'Basic Security', description: 'Essential security headers for most websites' },
  { name: 'Strict CSP', description: 'Content Security Policy without inline scripts' },
  { name: 'HSTS Preload', description: 'HTTP Strict Transport Security for preload list' },
  { name: 'Full Protection', description: 'Comprehensive security headers' },
];

const createInitialHeaders = (): Record<string, HeaderConfig> => ({
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
    value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'self';",
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

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function quoteConfigValue(value: string): string {
  return singleLine(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function isValidHeaderName(value: string): boolean {
  return /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(value);
}

export default function SecurityHeadersGeneratorClient() {
  const [preset, setPreset] = useState('Basic Security');
  const [copiedFormat, setCopiedFormat] = useState<'headers' | 'nginx' | 'apache' | 'next' | null>(null);

  const [headers, setHeaders] = useState<Record<string, HeaderConfig>>(createInitialHeaders);

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
          'Permissions-Policy': { ...prev['Permissions-Policy'], enabled: true },
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
            value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
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

  const [generatedAt, setGeneratedAt] = useState<string>('...');

  useEffect(() => {
    setGeneratedAt(new Date().toISOString());
  }, []);

  const generate = () => {
    let output = '# Security Headers\n';
    output += `# Generated: ${generatedAt || '...'}\n\n`;

    Object.entries(headers).forEach(([name, config]) => {
      if (config.enabled) {
        output += `${name}: ${singleLine(config.value)}\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `${singleLine(h.name)}: ${singleLine(h.value)}\n`;
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
        output += `    add_header ${name} "${quoteConfigValue(config.value)}" always;\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `    add_header ${singleLine(h.name)} "${quoteConfigValue(h.value)}" always;\n`;
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
        output += `    Header set ${name} "${quoteConfigValue(config.value)}"\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `    Header set ${singleLine(h.name)} "${quoteConfigValue(h.value)}"\n`;
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
        output += `    key: ${JSON.stringify(name)},\n`;
        output += `    value: ${JSON.stringify(singleLine(config.value))},\n`;
        output += `  },\n`;
      }
    });

    customHeaders.forEach((h) => {
      if (h.name && h.value) {
        output += `  {\n`;
        output += `    key: ${JSON.stringify(singleLine(h.name))},\n`;
        output += `    value: ${JSON.stringify(singleLine(h.value))},\n`;
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
  const copy = (format: 'headers' | 'nginx' | 'apache' | 'next', text: string) => {
    if (!isMounted) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  const addCustomHeader = () => {
    const name = singleLine(newHeaderName);
    const value = singleLine(newHeaderValue);
    if (name && value && isValidHeaderName(name)) {
      setCustomHeaders((current) => [
        ...current.filter((header) => header.name.toLowerCase() !== name.toLowerCase()),
        { name, value },
      ]);
      setNewHeaderName('');
      setNewHeaderValue('');
    }
  };

  const removeCustomHeader = (index: number) => {
    setCustomHeaders(customHeaders.filter((_, i) => i !== index));
  };

  const loadExample = () => {
    applyPreset('Strict CSP');
    setCustomHeaders([{ name: 'Cache-Control', value: 'no-store' }]);
    setNewHeaderName('');
    setNewHeaderValue('');
  };

  const clear = () => {
    setPreset('Basic Security');
    setHeaders(createInitialHeaders());
    setCustomHeaders([]);
    setNewHeaderName('');
    setNewHeaderValue('');
    setCopiedFormat(null);
  };

  const output = generate();
  const nginxOutput = generateNginx();
  const apacheOutput = generateApache();
  const nextJsOutput = generateNextJs();
  const initialHeaders = createInitialHeaders();
  const canClear = preset !== 'Basic Security'
    || customHeaders.length > 0
    || Boolean(newHeaderName || newHeaderValue)
    || Object.entries(headers).some(([name, config]) => {
      const initial = initialHeaders[name];
      return !initial || config.enabled !== initial.enabled || config.value !== initial.value;
    });

  if (!isMounted) {
    return (
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Presets</span>
          <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={canClear} exampleCount={1} />
        </div>
        <div className="tb-v2-mode-tabs" role="tablist">
          {HEADER_PRESETS.map((p) => (
            <button key={p.name} type="button" role="tab" className="tb-v2-mode-tab">
              {p.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Presets</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={canClear} exampleCount={1} />
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
                border: '1px solid var(--line)',
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
                    id={`header-value-${name}`}
                    aria-label={`${name} value`}
                    value={config.value}
                  onChange={(e) =>
                    setHeaders((prev) => ({
                      ...prev,
                      [name]: { ...prev[name], value: e.target.value },
                    }))
                  }
                  className="tb-v2-input"
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              aria-label="Custom header name"
              value={newHeaderName}
              onChange={(e) => setNewHeaderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomHeader()}
              placeholder="Header-Name"
              className="tb-v2-input"
              style={{ flex: '1 1 180px', minWidth: 0 }}
            />
            <input
              type="text"
              aria-label="Custom header value"
              value={newHeaderValue}
              onChange={(e) => setNewHeaderValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomHeader()}
              placeholder="Header value"
              className="tb-v2-input"
              style={{ flex: '2 1 240px', minWidth: 0 }}
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
                aria-label={`Remove ${h.name} header`}
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
              onClick={() => copy('headers', output)}
              className={`tb-v2-copy-btn ${copiedFormat === 'headers' ? 'done' : ''}`}
            >
              {copiedFormat === 'headers' ? 'Copied' : 'Copy'}
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
            onClick={() => copy('nginx', nginxOutput)}
            className={copiedFormat === 'nginx' ? 'done' : undefined}
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
            {copiedFormat === 'nginx' ? 'Copied' : 'Copy'}
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
            onClick={() => copy('apache', apacheOutput)}
            className={copiedFormat === 'apache' ? 'done' : undefined}
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
            {copiedFormat === 'apache' ? 'Copied' : 'Copy'}
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
            onClick={() => copy('next', nextJsOutput)}
            className={copiedFormat === 'next' ? 'done' : undefined}
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
            {copiedFormat === 'next' ? 'Copied' : 'Copy'}
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
          <li>A strict CSP blocks inline scripts unless you explicitly allow them</li>
          <li>Monitor for false positives after deploying new CSP rules</li>
        </ul>
      </div>
    </div>
  );
}
