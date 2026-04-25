'use client';

import { useState, useCallback } from 'react';

const BASE_URL = 'https://api.toolblip.com';
const ALT_URL = 'https://toolblip-api-production.up.railway.app';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/tools',
    summary: 'List all tools',
    auth: false,
    description: 'Returns a paginated list of all available tools. Supports optional filtering by category and search query.',
    curl: `curl -X GET "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`,
    response: `{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "json-formatter",
        "name": "JSON Formatter",
        "description": "Format, validate, and beautify JSON data instantly.",
        "category": "text",
        "is_pro": false,
        "emoji": "📋",
        "created_at": "2026-04-10T12:00:00.000000Z"
      },
      {
        "id": 2,
        "slug": "base64-encoder",
        "name": "Base64 Encoder / Decoder",
        "description": "Encode or decode Base64 strings with one click.",
        "category": "text",
        "is_pro": false,
        "emoji": "🔤",
        "created_at": "2026-04-10T12:00:00.000000Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "total": 24,
      "per_page": 15,
      "last_page": 2
    }
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/tools/{slug}',
    summary: 'Get single tool',
    auth: false,
    description: 'Returns detailed information for a specific tool by its slug identifier.',
    curl: `curl -X GET "${BASE_URL}/api/tools/json-formatter" \\
  -H "Accept: application/json"`,
    response: `{
  "data": {
    "id": 1,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format, validate, and beautify JSON data instantly.",
    "category": "text",
    "is_pro": false,
    "emoji": "📋",
    "created_at": "2026-04-10T12:00:00.000000Z"
  }
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    summary: 'Register new account',
    auth: false,
    description: 'Creates a new user account. Returns the authenticated user object and a Bearer token for subsequent requests.',
    curl: `curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123",
    "password_confirmation": "securepassword123"
  }'`,
    response: `{
  "user": {
    "id": 5,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  },
  "token": "1|laravel_sanctum_abc123xyz..."
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    summary: 'Login',
    auth: false,
    description: 'Authenticates a user with email and password. Returns the user object and a Bearer token.',
    curl: `curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "jane@example.com",
    "password": "securepassword123"
  }'`,
    response: `{
  "user": {
    "id": 5,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  },
  "token": "2|laravel_sanctum_abc456..."
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    summary: 'Logout',
    auth: true,
    description: 'Revokes the current Bearer token, logging the user out. Requires a valid Authorization header.',
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`,
    response: `{
  "message": "Logged out successfully"
}`,
  },
  {
    method: 'GET',
    path: '/api/auth/user',
    summary: 'Get authenticated user',
    auth: true,
    description: 'Returns the currently authenticated user based on the Bearer token in the Authorization header.',
    curl: `curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`,
    response: `{
  "user": {
    "id": 5,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  }
}`,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PATCH: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all
        bg-[var(--surface-2)] text-[var(--fg-2)] hover:bg-[var(--surface-3)] hover:text-[var(--fg-1)]
        dark:bg-[var(--surface-2)] dark:text-[var(--fg-2)] dark:hover:text-[var(--fg-1)]"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)]">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-2)] dark:bg-[var(--surface-2)] border-b border-[var(--line)] dark:border-[var(--line-2)]">
          <span className="text-xs font-semibold font-mono text-[var(--fg-2)] uppercase tracking-wider">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className={`overflow-x-auto p-4 text-sm leading-relaxed ${!label ? 'flex items-center justify-between' : ''}`}
        style={{ background: 'var(--surface)', fontFamily: 'var(--f-mono)', color: 'var(--fg-1)' }}>
        {!label && <CopyButton text={code} />}
        <code className="block whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: typeof ENDPOINTS[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)] transition-shadow hover:shadow-md"
      style={{ background: 'var(--surface)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--surface-2)] dark:hover:bg-[var(--surface-2)] transition-colors"
      >
        <span className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${METHOD_COLORS[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <code className="flex-1 text-sm font-semibold truncate" style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-0)' }}>
          {endpoint.path}
        </code>
        <span className="text-sm text-[var(--fg-2)] truncate hidden sm:block">{endpoint.summary}</span>
        {endpoint.auth && (
          <span className="shrink-0 px-2 py-0.5 rounded text-xs font-semibold bg-[var(--red-tint)] text-[var(--red)] dark:bg-[var(--red-tint)]">
            Auth
          </span>
        )}
        <svg
          className={`shrink-0 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--fg-3)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-[var(--line)] dark:border-[var(--line-2)]"
          style={{ borderTopColor: 'var(--line)' }}>
          <p className="pt-4 text-sm leading-relaxed" style={{ color: 'var(--fg-1)' }}>{endpoint.description}</p>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--fg-3)' }}>
              Request
            </h4>
            <CodeBlock code={endpoint.curl} label="curl" />
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--fg-3)' }}>
              Response
            </h4>
            <CodeBlock code={endpoint.response} label="JSON" />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-[var(--line)] dark:border-[var(--line-2)]"
      style={{ background: 'var(--surface)' }}>
      <span className="shrink-0 mt-0.5 w-5 h-5" style={{ color: 'var(--red)' }}>{icon}</span>
      <div>
        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--fg-0)' }}>{title}</h3>
        <div className="text-sm leading-relaxed" style={{ color: 'var(--fg-1)' }}>{children}</div>
      </div>
    </div>
  );
}

export default function ApiDocsClient() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="border-b border-[var(--line)]" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: 'var(--red-tint)', color: 'var(--red)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            REST API
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--fg-0)', fontFamily: 'var(--f-display)' }}>
            Toolblip API Reference
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--fg-2)' }}>
            Build integrations with Toolblip. Browse tools, manage user accounts, and access developer features — all via simple REST endpoints.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* Base URL */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--fg-0)' }}>Base URL</h2>
          <div className="rounded-xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)]"
            style={{ background: 'var(--surface)' }}>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-[var(--line)] dark:border-[var(--line-2)]">
                  <td className="px-4 py-3 font-semibold w-40 shrink-0" style={{ color: 'var(--fg-2)' }}>Production</td>
                  <td className="px-4 py-3">
                    <code className="text-sm font-semibold" style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-0)' }}>
                      {BASE_URL}
                    </code>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--fg-2)' }}>Railway (alt)</td>
                  <td className="px-4 py-3">
                    <code className="text-sm" style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-2)' }}>
                      {ALT_URL}
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Authentication */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--fg-0)' }}>Authentication</h2>
          <InfoBlock
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="Bearer Token Authentication"
          >
            All authenticated endpoints require an <code style={{ fontFamily: 'var(--f-mono)' }}>Authorization</code> header with a Bearer token.
            Tokens are returned from <code style={{ fontFamily: 'var(--f-mono)' }}>/api/auth/register</code> and{' '}
            <code style={{ fontFamily: 'var(--f-mono)' }}>/api/auth/login</code>.
          </InfoBlock>

          <div className="mt-4 p-4 rounded-xl border border-[var(--line)] dark:border-[var(--line-2)] overflow-hidden"
            style={{ background: 'var(--surface-2)' }}>
            <pre className="text-sm leading-relaxed" style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-1)' }}>
              <code>{'Authorization: Bearer {token}'}</code>
            </pre>
          </div>

          <div className="mt-3 space-y-2">
            {[
              { label: 'Register', path: '/api/auth/register', desc: 'Creates account, returns token' },
              { label: 'Login', path: '/api/auth/login', desc: 'Authenticates, returns token' },
              { label: 'Logout', path: '/api/auth/logout', desc: 'Requires auth — revokes token' },
              { label: 'Get user', path: '/api/auth/user', desc: 'Requires auth — returns current user' },
            ].map((r) => (
              <div key={r.path} className="flex items-center gap-3 text-sm">
                <span className="shrink-0 w-16 text-center px-2 py-0.5 rounded font-bold text-xs bg-[var(--surface)] text-[var(--fg-2)] border border-[var(--line)] dark:border-[var(--line-2)]">
                  {r.label}
                </span>
                <code style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-1)' }}>{r.path}</code>
                <span style={{ color: 'var(--fg-3)' }}>— {r.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Response Format */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--fg-0)' }}>Response Format</h2>
          <InfoBlock
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="All responses are JSON"
          >
            Every endpoint returns <code style={{ fontFamily: 'var(--f-mono)' }}>Content-Type: application/json</code>. Success
            responses follow the shapes shown below. Errors return an object with an optional <code style={{ fontFamily: 'var(--f-mono)' }}>message</code> field.
          </InfoBlock>
        </section>

        {/* Rate Limiting */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--fg-0)' }}>Rate Limiting</h2>
          <InfoBlock
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="60 requests per minute"
          >
            The API enforces a rate limit of 60 requests per minute per IP address. Exceeding this returns a{' '}
            <code style={{ fontFamily: 'var(--f-mono)' }}>429 Too Many Requests</code> response.
          </InfoBlock>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--fg-0)' }}>Endpoints</h2>
          <div className="space-y-3">
            {ENDPOINTS.map((ep) => (
              <EndpointCard key={`${ep.method}:${ep.path}`} endpoint={ep} />
            ))}
          </div>
        </section>

        {/* Error Codes */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--fg-0)' }}>Error Codes</h2>
          <div className="rounded-xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)]"
            style={{ background: 'var(--surface)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] dark:border-[var(--line-2)]" style={{ background: 'var(--surface-2)' }}>
                  <th className="px-4 py-2.5 text-left font-bold" style={{ color: 'var(--fg-2)' }}>Status</th>
                  <th className="px-4 py-2.5 text-left font-bold" style={{ color: 'var(--fg-2)' }}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: '200', msg: 'OK — request succeeded' },
                  { code: '201', msg: 'Created — resource was created' },
                  { code: '401', msg: 'Unauthorized — missing or invalid token' },
                  { code: '403', msg: 'Forbidden — authenticated but not allowed' },
                  { code: '404', msg: 'Not Found — resource does not exist' },
                  { code: '422', msg: 'Unprocessable Entity — validation failed' },
                  { code: '429', msg: 'Too Many Requests — rate limit exceeded' },
                  { code: '500', msg: 'Server Error — something went wrong on our end' },
                ].map((row, i) => (
                  <tr key={row.code} className={i > 0 ? 'border-t border-[var(--line)] dark:border-[var(--line-2)]' : ''}>
                    <td className="px-4 py-3 font-bold" style={{ fontFamily: 'var(--f-mono)', color: 'var(--red)' }}>
                      {row.code}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--fg-1)' }}>{row.msg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <section className="text-center pt-4">
          <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
            Questions? Open an issue at{' '}
            <a
              href="https://github.com/toolblip/api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: 'var(--fg-2)' }}
            >
              github.com/toolblip/api
            </a>
          </p>
        </section>

      </div>
    </main>
  );
}
