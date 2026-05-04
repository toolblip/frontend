'use client';

import { useState } from 'react';

type CorsScenario =
  | 'public'
  | 'credentials'
  | 'restricted'
  | 'dynamic'
  | 'wordpress'
  | 'nextjs'
  | 'express'
  | 'django'
  | 'flask';

interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge: number;
  credentials: boolean;
  wildcard: boolean;
}

const SCENARIOS: { value: CorsScenario; label: string; description: string }[] = [
  { value: 'public', label: 'Public API', description: 'Fully open CORS for public APIs' },
  { value: 'credentials', label: 'With Credentials', description: 'Authenticated requests with credentials' },
  { value: 'restricted', label: 'Restricted', description: 'Specific allowed origins only' },
  { value: 'dynamic', label: 'Dynamic Origin', description: 'Allow any origin (wildcard)' },
  { value: 'wordpress', label: 'WordPress', description: 'WordPress REST API configuration' },
  { value: 'nextjs', label: 'Next.js', description: 'Next.js API routes CORS' },
  { value: 'express', label: 'Express.js', description: 'Express.js CORS middleware' },
  { value: 'django', label: 'Django', description: 'Django CORS headers' },
  { value: 'flask', label: 'Flask', description: 'Flask CORS configuration' },
];

const COMMON_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
const COMMON_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'X-CSRF-Token',
  'Accept',
  'Accept-Language',
  'Origin',
  'Cache-Control',
];

export default function CorsHeaderGeneratorClient() {
  const [scenario, setScenario] = useState<CorsScenario>('public');
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  const [config, setConfig] = useState<CorsConfig>({
    allowedOrigins: ['https://example.com'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400,
    credentials: false,
    wildcard: false,
  });

  const [newOrigin, setNewOrigin] = useState('');
  const [newMethod, setNewMethod] = useState('GET');
  const [newHeader, setNewHeader] = useState('Content-Type');
  const [newExposedHeader, setNewExposedHeader] = useState('');

  const applyScenario = (s: CorsScenario) => {
    setScenario(s);

    switch (s) {
      case 'public':
        setConfig({
          allowedOrigins: ['*'],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['*'],
          exposedHeaders: [],
          maxAge: 0,
          credentials: false,
          wildcard: true,
        });
        break;
      case 'credentials':
        setConfig({
          allowedOrigins: ['https://example.com', 'https://www.example.com'],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
          exposedHeaders: ['X-Custom-Header'],
          maxAge: 3600,
          credentials: true,
          wildcard: false,
        });
        break;
      case 'restricted':
        setConfig({
          allowedOrigins: ['https://example.com'],
          allowedMethods: ['GET', 'POST'],
          allowedHeaders: ['Content-Type'],
          exposedHeaders: [],
          maxAge: 86400,
          credentials: false,
          wildcard: false,
        });
        break;
      case 'dynamic':
        setConfig({
          allowedOrigins: [],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['*'],
          exposedHeaders: [],
          maxAge: 0,
          credentials: false,
          wildcard: true,
        });
        break;
      case 'wordpress':
        setConfig({
          allowedOrigins: [],
          allowedMethods: ['GET', 'POST'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-WP-Nonce'],
          exposedHeaders: ['X-WP-Total', 'X-WP-TotalPages'],
          maxAge: 86400,
          credentials: true,
          wildcard: true,
        });
        break;
      case 'nextjs':
        setConfig({
          allowedOrigins: ['http://localhost:3000'],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          exposedHeaders: [],
          maxAge: 3600,
          credentials: true,
          wildcard: false,
        });
        break;
      case 'express':
        setConfig({
          allowedOrigins: ['http://localhost:3000'],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          exposedHeaders: [],
          maxAge: 3600,
          credentials: true,
          wildcard: false,
        });
        break;
      case 'django':
        setConfig({
          allowedOrigins: ['http://localhost:8000'],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRFToken'],
          exposedHeaders: ['X-CSRFToken'],
          maxAge: 86400,
          credentials: true,
          wildcard: false,
        });
        break;
      case 'flask':
        setConfig({
          allowedOrigins: ['http://localhost:5000'],
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          exposedHeaders: [],
          maxAge: 3600,
          credentials: false,
          wildcard: false,
        });
        break;
    }
  };

  const addOrigin = () => {
    if (newOrigin && !config.allowedOrigins.includes(newOrigin)) {
      setConfig({ ...config, allowedOrigins: [...config.allowedOrigins, newOrigin] });
      setNewOrigin('');
    }
  };

  const removeOrigin = (index: number) => {
    setConfig({
      ...config,
      allowedOrigins: config.allowedOrigins.filter((_, i) => i !== index),
    });
  };

  const toggleMethod = (method: string) => {
    const methods = config.allowedMethods.includes(method)
      ? config.allowedMethods.filter((m) => m !== method)
      : [...config.allowedMethods, method];
    setConfig({ ...config, allowedMethods: methods });
  };

  const toggleHeader = (header: string) => {
    const headers = config.allowedHeaders.includes(header)
      ? config.allowedHeaders.filter((h) => h !== header)
      : [...config.allowedHeaders, header];
    setConfig({ ...config, allowedHeaders: headers });
  };

  const addExposedHeader = () => {
    if (newExposedHeader && !config.exposedHeaders.includes(newExposedHeader)) {
      setConfig({
        ...config,
        exposedHeaders: [...config.exposedHeaders, newExposedHeader],
      });
      setNewExposedHeader('');
    }
  };

  const removeExposedHeader = (index: number) => {
    setConfig({
      ...config,
      exposedHeaders: config.exposedHeaders.filter((_, i) => i !== index),
    });
  };

  const generateHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};

    if (config.wildcard || config.allowedOrigins.includes('*')) {
      headers['Access-Control-Allow-Origin'] = '*';
    } else {
      headers['Access-Control-Allow-Origin'] = config.allowedOrigins.join(', ');
    }

    if (config.credentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }

    headers['Access-Control-Allow-Methods'] = config.allowedMethods.join(', ');

    if (config.allowedHeaders.includes('*')) {
      headers['Access-Control-Allow-Headers'] = '*';
    } else {
      headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ');
    }

    if (config.exposedHeaders.length > 0) {
      headers['Access-Control-Expose-Headers'] = config.exposedHeaders.join(', ');
    }

    if (config.maxAge > 0) {
      headers['Access-Control-Max-Age'] = config.maxAge.toString();
    }

    return headers;
  };

  const generateRawHeaders = () => {
    const headers = generateHeaders();
    let output = '# CORS Headers\n\n';
    Object.entries(headers).forEach(([name, value]) => {
      output += `${name}: ${value}\n`;
    });
    return output;
  };

  const generateNginx = () => {
    const headers = generateHeaders();
    let output = '# Nginx CORS Configuration\n\n';
    output += 'location / {\n';

    Object.entries(headers).forEach(([name, value]) => {
      const nginxName = name.replace(/-/g, '_').replace(/[A-Z]/g, (m) => m.toLowerCase());
      if (name === 'Access-Control-Allow-Origin' && value === '*') {
        output += `    add_header ${name} "$${nginxName}" always;\n`;
        output += `    set $${nginxName} "*";\n`;
      } else if (name === 'Access-Control-Allow-Origin') {
        output += `    set $${nginxName} "${value}";\n`;
        output += `    add_header ${name} "$${nginxName}" always;\n`;
      } else {
        output += `    add_header ${name} "${value}" always;\n`;
      }
    });

    output += '\n    # Handle preflight requests\n';
    output += '    if ($request_method = OPTIONS) {\n';
    Object.entries(headers).forEach(([name, value]) => {
      const nginxName = name.replace(/-/g, '_').replace(/[A-Z]/g, (m) => m.toLowerCase());
      if (name === 'Access-Control-Allow-Origin') {
        output += `        add_header ${name} "$${nginxName}" always;\n`;
      } else if (name !== 'Access-Control-Allow-Credentials') {
        output += `        add_header ${name} "${value}" always;\n`;
      }
    });
    output += '        add_header Access-Control-Allow-Credentials "true" always;\n';
    output += '        add_header Content-Length 0;\n';
    output += '        add_header Content-Type text/plain;\n';
    output += '        return 204;\n';
    output += '    }\n';
    output += '}\n';

    return output;
  };

  const generateApache = () => {
    const headers = generateHeaders();
    let output = '# Apache CORS Configuration\n\n';
    output += '<IfModule mod_headers.c>\n';
    output += '    # CORS Headers\n';

    Object.entries(headers).forEach(([name, value]) => {
      output += `    Header set ${name} "${value}"\n`;
    });

    output += '\n    # Handle preflight requests\n';
    output += '    RewriteEngine On\n';
    output += '    RewriteCond %{REQUEST_METHOD} OPTIONS\n';
    output += '    RewriteRule ^(.*)$ $1 [R=200,L]\n';
    output += '</IfModule>\n';

    return output;
  };

  const generateExpress = () => {
    const origins = config.wildcard
      ? "'*'"
      : config.allowedOrigins.length > 0
        ? config.allowedOrigins.map((o) => `'${o}'`).join(', ')
        : "'http://localhost:3000'";

    return `// Express.js CORS Middleware Configuration

const cors = require('cors');

const corsOptions = {
  origin: [${origins}],
  methods: ${JSON.stringify(config.allowedMethods)},
  allowedHeaders: ${JSON.stringify(config.allowedHeaders)},
  exposedHeaders: ${JSON.stringify(config.exposedHeaders)},
  credentials: ${config.credentials},
  maxAge: ${config.maxAge},
};

app.use(cors(corsOptions));

// Or with more control:
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (${config.wildcard ? 'true' : `config.allowedOrigins.includes(origin)`}) {
    res.setHeader('Access-Control-Allow-Origin', ${config.wildcard ? "'*'" : 'origin'});
  }
  if (${config.credentials}) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', '${config.allowedMethods.join(', ')}');
  res.setHeader('Access-Control-Allow-Headers', '${config.allowedHeaders.join(', ')}');
  ${
    config.exposedHeaders.length > 0
      ? `res.setHeader('Access-Control-Expose-Headers', '${config.exposedHeaders.join(', ')}');`
      : ''
  }
  ${
    config.maxAge > 0
      ? `res.setHeader('Access-Control-Max-Age', '${config.maxAge}');`
      : ''
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});`;
  };

  const generateNextjs = () => {
    const origins = config.wildcard
      ? "'*'"
      : config.allowedOrigins.map((o) => `'${o}'`).join(', ');

    return `// Next.js API Route CORS Configuration

import { NextResponse } from 'next/server';

const corsOptions = {
  origin: [${origins}],
  methods: ${JSON.stringify(config.allowedMethods)},
  allowedHeaders: ${JSON.stringify(config.allowedHeaders)},
  exposedHeaders: ${JSON.stringify(config.exposedHeaders)},
  credentials: ${config.credentials},
};

export function middleware(request: Request) {
  const response = NextResponse.next();

  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', ${config.wildcard ? "'*'" : `request.headers.get('origin') || ''`});
  ${
    config.credentials
      ? "response.headers.set('Access-Control-Allow-Credentials', 'true');"
      : ''
  }
  response.headers.set('Access-Control-Allow-Methods', '${config.allowedMethods.join(', ')}');
  response.headers.set('Access-Control-Allow-Headers', '${config.allowedHeaders.join(', ')}');
  ${
    config.exposedHeaders.length > 0
      ? `response.headers.set('Access-Control-Expose-Headers', '${config.exposedHeaders.join(', ')}');`
      : ''
  }
  ${
    config.maxAge > 0
      ? `response.headers.set('Access-Control-Max-Age', '${config.maxAge}');`
      : ''
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};`;
  };

  const generateDjango = () => {
    const origins = config.wildcard ? "'*'" : config.allowedOrigins.map((o) => `'${o}'`).join(', ');

    return `# Django CORS Configuration

# Install: pip install django-cors-headers

# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOW_ALL_ORIGINS = ${config.wildcard}
CORS_ALLOWED_ORIGINS = ${config.wildcard ? '[]' : `[${origins}]`}
CORS_ALLOW_METHODS = ${JSON.stringify(config.allowedMethods.map(m => m.toUpperCase()))}
CORS_ALLOW_HEADERS = ${JSON.stringify(config.allowedHeaders.map(h => h.toLowerCase()))}
CORS_EXPOSE_HEADERS = ${JSON.stringify(config.exposedHeaders)}
CORS_ALLOW_CREDENTIALS = ${config.credentials}
CORS_PREFLIGHT_MAX_AGE = ${config.maxAge}

# Or in middleware.py for more control:
from django.http import JsonResponse

class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get('Origin')
        if ${config.wildcard ? 'True' : `origin in [${origins}]`}:
            response = self.get_response(request)
            response['Access-Control-Allow-Origin'] = ${config.wildcard ? "'*'" : 'origin'}
            ${
              config.credentials
                ? "response['Access-Control-Allow-Credentials'] = 'true'"
                : ''
            }
            response['Access-Control-Allow-Methods'] = '${config.allowedMethods.join(', ')}'
            response['Access-Control-Allow-Headers'] = '${config.allowedHeaders.join(', ')}'
            ${
              config.exposedHeaders.length > 0
                ? `response['Access-Control-Expose-Headers'] = '${config.exposedHeaders.join(', ')}'`
                : ''
            }
            return response
        return self.get_response(request)`;
  };

  const generateFlask = () => {
    const origins = config.wildcard ? "'*'" : config.allowedOrigins.map((o) => `'${o}'`).join(', ');

    return `# Flask CORS Configuration

# Install: pip install flask-cors

from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ${origins},
        "methods": ${JSON.stringify(config.allowedMethods)},
        "allow_headers": ${JSON.stringify(config.allowedHeaders)},
        "expose_headers": ${JSON.stringify(config.exposedHeaders)},
        "supports_credentials": ${config.credentials},
        "max_age": ${config.maxAge},
    }
})

# Or manual configuration:
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin')
    if ${config.wildcard ? 'True' : `origin in [${origins}]`}:
        response.headers['Access-Control-Allow-Origin'] = ${config.wildcard ? "'*'" : 'origin'}
    ${
      config.credentials
        ? "response.headers['Access-Control-Allow-Credentials'] = 'true'"
        : ''
    }
    response.headers['Access-Control-Allow-Methods'] = '${config.allowedMethods.join(', ')}'
    response.headers['Access-Control-Allow-Headers'] = '${config.allowedHeaders.join(', ')}'
    ${
      config.exposedHeaders.length > 0
        ? `response.headers['Access-Control-Expose-Headers'] = '${config.exposedHeaders.join(', ')}'`
        : ''
    }
    ${
      config.maxAge > 0
        ? `response.headers['Access-Control-Max-Age'] = '${config.maxAge}'`
        : ''
    }
    return response`;
  };

  const rawHeaders = generateRawHeaders();
  const nginxConfig = generateNginx();
  const apacheConfig = generateApache();
  const expressConfig = generateExpress();
  const nextjsConfig = generateNextjs();
  const djangoConfig = generateDjango();
  const flaskConfig = generateFlask();

  const copy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 1500);
  };

  const headers = generateHeaders();

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Scenario</span>
      </div>
      <div className="tb-v2-mode-tabs" role="tablist">
        {SCENARIOS.map((s) => (
          <button
            key={s.value}
            type="button"
            role="tab"
            aria-selected={scenario === s.value}
            onClick={() => applyScenario(s.value)}
            className={`tb-v2-mode-tab ${scenario === s.value ? 'on' : ''}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        {/* Origins */}
        <div style={{ marginBottom: '16px' }}>
          <div className="tb-v2-tool-label" style={{ marginBottom: '8px' }}>
            Allowed Origins
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {config.allowedOrigins.map((origin, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'var(--f-mono)',
                }}
              >
                {origin}
                <button
                  type="button"
                  onClick={() => removeOrigin(i)}
                  style={{ marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
              placeholder="https://example.com"
              className="tb-v2-tool-input"
              style={{ flex: 1 }}
            />
            <button type="button" onClick={addOrigin} className="tb-v2-copy-btn" style={{ background: '#2563eb', color: 'white' }}>
              Add
            </button>
          </div>
        </div>

        {/* Credentials */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.credentials}
              onChange={(e) => setConfig({ ...config, credentials: e.target.checked })}
              style={{ width: '16px', height: '16px' }}
            />
            <span className="tb-v2-tool-label">Allow Credentials</span>
          </label>
        </div>

        {/* Methods */}
        <div style={{ marginBottom: '16px' }}>
          <div className="tb-v2-tool-label" style={{ marginBottom: '8px' }}>
            Allowed Methods
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {COMMON_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => toggleMethod(method)}
                className={`tb-v2-mode-tab ${config.allowedMethods.includes(method) ? 'on' : ''}`}
                style={{ minWidth: '60px' }}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Headers */}
        <div style={{ marginBottom: '16px' }}>
          <div className="tb-v2-tool-label" style={{ marginBottom: '8px' }}>
            Allowed Headers
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {COMMON_HEADERS.map((header) => (
              <button
                key={header}
                type="button"
                onClick={() => toggleHeader(header)}
                className={`tb-v2-mode-tab ${config.allowedHeaders.includes(header) ? 'on' : ''}`}
                style={{ fontSize: '12px' }}
              >
                {header}
              </button>
            ))}
          </div>
        </div>

        {/* Exposed Headers */}
        <div style={{ marginBottom: '16px' }}>
          <div className="tb-v2-tool-label" style={{ marginBottom: '8px' }}>
            Exposed Headers
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {config.exposedHeaders.map((header, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 8px',
                  background: '#fef3c7',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'var(--f-mono)',
                }}
              >
                {header}
                <button
                  type="button"
                  onClick={() => removeExposedHeader(i)}
                  style={{ marginLeft: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newExposedHeader}
              onChange={(e) => setNewExposedHeader(e.target.value)}
              placeholder="X-Custom-Header"
              className="tb-v2-tool-input"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={addExposedHeader}
              className="tb-v2-copy-btn"
              style={{ background: '#2563eb', color: 'white' }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Max Age */}
        <div style={{ marginBottom: '16px' }}>
          <div className="tb-v2-tool-label" style={{ marginBottom: '8px' }}>
            Preflight Max Age (seconds)
          </div>
          <input
            type="number"
            value={config.maxAge}
            onChange={(e) => setConfig({ ...config, maxAge: parseInt(e.target.value) || 0 })}
            className="tb-v2-tool-input"
            style={{ width: '200px' }}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CORS Headers Preview</span>
        <button
          type="button"
          onClick={() => copy(rawHeaders, 'raw')}
          className={`tb-v2-copy-btn ${copiedCode === 'raw' ? 'done' : ''}`}
        >
          {copiedCode === 'raw' ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.entries(headers).map(([name, value]) => (
            <div key={name} style={{ display: 'flex', gap: '8px', fontFamily: 'var(--f-mono)', fontSize: '13px' }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>{name}:</span>
              <span style={{ color: '#059669', wordBreak: 'break-all' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Generation */}
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
            onClick={() => copy(nginxConfig, 'nginx')}
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
            {copiedCode === 'nginx' ? 'Copied' : 'Copy'}
          </button>
          <pre className="tb-v2-tool-pre" style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}>
            {nginxConfig}
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
          Apache Configuration
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(apacheConfig, 'apache')}
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
            {copiedCode === 'apache' ? 'Copied' : 'Copy'}
          </button>
          <pre className="tb-v2-tool-pre" style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}>
            {apacheConfig}
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
          Express.js
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(expressConfig, 'express')}
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
            {copiedCode === 'express' ? 'Copied' : 'Copy'}
          </button>
          <pre className="tb-v2-tool-pre" style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}>
            {expressConfig}
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
          Next.js
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(nextjsConfig, 'nextjs')}
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
            {copiedCode === 'nextjs' ? 'Copied' : 'Copy'}
          </button>
          <pre className="tb-v2-tool-pre" style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}>
            {nextjsConfig}
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
          Django
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(djangoConfig, 'django')}
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
            {copiedCode === 'django' ? 'Copied' : 'Copy'}
          </button>
          <pre className="tb-v2-tool-pre" style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}>
            {djangoConfig}
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
          Flask
        </summary>
        <div style={{ marginTop: '8px', position: 'relative' }}>
          <button
            type="button"
            onClick={() => copy(flaskConfig, 'flask')}
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
            {copiedCode === 'flask' ? 'Copied' : 'Copy'}
          </button>
          <pre className="tb-v2-tool-pre" style={{ maxHeight: '300px', overflow: 'auto', paddingTop: '40px' }}>
            {flaskConfig}
          </pre>
        </div>
      </details>

      <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', fontSize: '13px' }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>💡 CORS Tips</strong>
        <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
          <li>Never use <code>*</code> for credentials requests</li>
          <li>Preflight requests (OPTIONS) are cached with max-age</li>
          <li>Test CORS with browser DevTools Network tab</li>
          <li>For production, specify exact origins instead of wildcards</li>
        </ul>
      </div>
    </div>
  );
}
