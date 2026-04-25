'use client';

import { useState } from 'react';
import CodeBlock from '@/components/ui/CodeBlock';

const BASE_URL = 'https://api.toolblip.com';

const ENDPOINTS = [
  // Tools
  {
    group: 'Tools',
    groupSlug: 'tools',
    items: [
      {
        method: 'GET',
        path: '/api/tools',
        auth: false,
        description: 'Returns a paginated list of all available tools.',
        params: [
          { name: 'category', type: 'string', optional: true, description: 'Filter by category (e.g. text, image, dev)' },
          { name: 'search', type: 'string', optional: true, description: 'Search by name or description' },
          { name: 'page', type: 'integer', optional: true, description: 'Page number (default: 1)' },
          { name: 'per_page', type: 'integer', optional: true, description: 'Items per page (default: 20)' },
        ],
        curl: `curl -X GET "${BASE_URL}/api/tools" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json"`,
        response: `{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "json-formatter",
        "name": "JSON Formatter",
        "description": "Format and validate JSON data instantly.",
        "category": "dev",
        "is_pro": false,
        "emoji": "📋",
        "created_at": "2026-04-10T12:00:00.000000Z"
      },
      {
        "id": 2,
        "slug": "base64-encoder",
        "name": "Base64 Encoder",
        "description": "Encode and decode Base64 strings.",
        "category": "dev",
        "is_pro": false,
        "emoji": "🔤",
        "created_at": "2026-04-10T12:00:00.000000Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "total": 48,
      "per_page": 20,
      "last_page": 3
    }
  }
}`,
      },
      {
        method: 'GET',
        path: '/api/tools/{slug}',
        auth: false,
        description: 'Returns a single tool by its slug.',
        params: [
          { name: 'slug', type: 'string', optional: false, description: 'URL-friendly tool identifier (e.g. json-formatter)' },
        ],
        curl: `curl -X GET "${BASE_URL}/api/tools/json-formatter" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json"`,
        response: `{
  "data": {
    "id": 1,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format and validate JSON data instantly.",
    "category": "dev",
    "is_pro": false,
    "emoji": "📋",
    "created_at": "2026-04-10T12:00:00.000000Z"
  }
}`,
      },
    ],
  },

  // Auth
  {
    group: 'Authentication',
    groupSlug: 'auth',
    items: [
      {
        method: 'POST',
        path: '/api/auth/register',
        auth: false,
        description: 'Create a new user account and receive a Bearer token.',
        params: [
          { name: 'name', type: 'string', optional: false, description: 'Full name (min 2 characters)' },
          { name: 'email', type: 'string', optional: false, description: 'Valid email address (unique)' },
          { name: 'password', type: 'string', optional: false, description: 'Password (min 8 characters)' },
          { name: 'password_confirmation', type: 'string', optional: false, description: 'Must match password exactly' },
        ],
        curl: `curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "securepass123",
    "password_confirmation": "securepass123"
  }'`,
        response: `{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "1|laravel_sanctum_abcdef1234567890..."
}`,
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        auth: false,
        description: 'Authenticate with email and password to receive a Bearer token.',
        params: [
          { name: 'email', type: 'string', optional: false, description: 'Registered email address' },
          { name: 'password', type: 'string', optional: false, description: 'Account password' },
        ],
        curl: `curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "alex@example.com",
    "password": "securepass123"
  }'`,
        response: `{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "2|laravel_sanctum_abcdef1234567890..."
}`,
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        auth: true,
        description: 'Revoke the current Bearer token. The token can no longer be used after this call.',
        params: [],
        curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {token}"`,
        response: `{
  "message": "Logged out successfully"
}`,
      },
      {
        method: 'GET',
        path: '/api/auth/user',
        auth: true,
        description: 'Return the currently authenticated user profile.',
        params: [],
        curl: `curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {token}"`,
        response: `{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": true
  }
}`,
      },
    ],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ApiDocsClient() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    tools: true,
    auth: true,
  });

  const toggleGroup = (slug: string) => {
    setOpenGroups(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--fg-2)] border border-[var(--line)] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
            API Live — v1
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg-0)] mb-3" style={{ fontFamily: 'var(--f-display)' }}>
            Toolblip REST API
          </h1>
          <p className="text-[var(--fg-2)] text-base sm:text-lg max-w-2xl">
            Build integrations with the Toolblip API. All endpoints return JSON and are REST-compliant.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">

          {/* Sidebar nav */}
          <aside>
            <div className="lg:sticky lg:top-8 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3 px-2">
                Reference
              </p>
              {ENDPOINTS.map(group => (
                <a
                  key={group.groupSlug}
                  href={`#${group.groupSlug}`}
                  className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] px-2 py-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                >
                  {group.group}
                </a>
              ))}

              <div className="pt-6 mt-6 border-t border-[var(--line)]">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3 px-2">
                  Quick Links
                </p>
                <a
                  href="#base-url"
                  className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] px-2 py-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                >
                  Base URL
                </a>
                <a
                  href="#auth"
                  className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] px-2 py-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                >
                  Authentication
                </a>
                <a
                  href="#errors"
                  className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] px-2 py-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                >
                  Errors
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-16">

            {/* Base URL */}
            <section id="base-url">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Base URL
              </h2>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4">
                <CodeBlock
                  code={`${BASE_URL}`}
                  title="Base URL"
                />
              </div>
            </section>

            {/* Auth */}
            <section id="auth">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Authentication
              </h2>
              <div className="space-y-4">
                <p className="text-[var(--fg-1)] text-sm leading-relaxed">
                  The Toolblip API uses <strong>Bearer token authentication</strong>. After logging in or registering, you receive a token. Include it in the <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-sm font-mono border border-[var(--line)]">Authorization</code> header on every protected request.
                </p>
                <CodeBlock
                  code={`Authorization: Bearer {token}`}
                  title="Header format"
                />
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--fg-1)]">
                  <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
                  <span>
                    Never expose your token in public client-side code. Use the API from a server or secure backend.
                    Tokens never expire unless explicitly revoked via <code className="font-mono text-xs">POST /api/auth/logout</code>.
                  </span>
                </div>
              </div>
            </section>

            {/* Errors */}
            <section id="errors">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Errors
              </h2>
              <div className="space-y-4">
                <p className="text-[var(--fg-1)] text-sm leading-relaxed">
                  The API returns standard HTTP status codes. 2xx indicates success; 4xx indicates a client error; 5xx indicates a server error. Error bodies always include a <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-sm font-mono border border-[var(--line)]">message</code> field.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { code: '200', label: 'OK', color: 'text-green-600 dark:text-green-400' },
                    { code: '201', label: 'Created', color: 'text-green-600 dark:text-green-400' },
                    { code: '401', label: 'Unauthorized', color: 'text-red-600 dark:text-red-400' },
                    { code: '403', label: 'Forbidden', color: 'text-red-600 dark:text-red-400' },
                    { code: '404', label: 'Not Found', color: 'text-yellow-600 dark:text-yellow-400' },
                    { code: '422', label: 'Validation Error', color: 'text-orange-600 dark:text-orange-400' },
                    { code: '429', label: 'Rate Limited', color: 'text-orange-600 dark:text-orange-400' },
                    { code: '500', label: 'Server Error', color: 'text-red-600 dark:text-red-400' },
                  ].map(s => (
                    <div key={s.code} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                      <span className={`font-mono font-bold text-sm ${s.color}`}>{s.code}</span>
                      <span className="text-xs text-[var(--fg-2)]">{s.label}</span>
                    </div>
                  ))}
                </div>
                <CodeBlock
                  code={`{
  "message": "The selected email is already in use.",
  "errors": {
    "email": ["The selected email is already in use."]
  }
}`}
                  language="json"
                  title="Error response (422)"
                />
              </div>
            </section>

            {/* Endpoint groups */}
            {ENDPOINTS.map(group => (
              <section key={group.groupSlug} id={group.groupSlug}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-[var(--fg-0)]" style={{ fontFamily: 'var(--f-display)' }}>
                    {group.group}
                  </h2>
                  <button
                    onClick={() => toggleGroup(group.groupSlug)}
                    className="text-xs text-[var(--fg-3)] hover:text-[var(--fg-1)] transition-colors flex items-center gap-1"
                  >
                    {openGroups[group.groupSlug] ? 'collapse' : 'expand'}
                    <span className="text-xs">{openGroups[group.groupSlug] ? '▲' : '▼'}</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {group.items.map((endpoint, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden"
                    >
                      {/* Endpoint header */}
                      <div className="px-5 py-4 border-b border-[var(--line)] bg-[var(--surface)]">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${METHOD_COLORS[endpoint.method]}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono font-semibold text-[var(--fg-0)]">
                            {endpoint.path}
                          </code>
                          {endpoint.auth && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                              🔒 Auth required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--fg-2)]">{endpoint.description}</p>
                      </div>

                      <div className="p-5 space-y-5">
                        {/* Params */}
                        {endpoint.params.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">
                              {endpoint.params.some(p => !p.optional) ? 'Parameters' : 'Query Parameters'}
                            </h4>
                            <div className="rounded-xl border border-[var(--line)] overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-[var(--surface-2)]">
                                  <tr>
                                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Name</th>
                                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Type</th>
                                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.params.map((param, pi) => (
                                    <tr key={pi} className="border-t border-[var(--line)]">
                                      <td className="px-3 py-2">
                                        <code className="font-mono text-xs text-[var(--fg-0)]">{param.name}</code>
                                        {param.optional && (
                                          <span className="ml-1.5 text-[var(--fg-3)] text-xs">optional</span>
                                        )}
                                      </td>
                                      <td className="px-3 py-2 text-xs text-[var(--fg-2)] font-mono">{param.type}</td>
                                      <td className="px-3 py-2 text-xs text-[var(--fg-2)]">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Request body note */}
                        {endpoint.method === 'POST' && endpoint.params.some(p => !p.optional) && (
                          <div className="bg-[var(--surface-2)] rounded-xl p-4 text-sm text-[var(--fg-2)]">
                            <strong className="text-[var(--fg-1)]">Body:</strong> Send a JSON object with the required fields listed in the Parameters table above.
                          </div>
                        )}

                        {/* curl */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">
                            Request
                          </h4>
                          <CodeBlock
                            code={endpoint.curl}
                            language="bash"
                            title={`${endpoint.method} ${endpoint.path}`}
                          />
                        </div>

                        {/* Response */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">
                            Response
                          </h4>
                          <CodeBlock
                            code={endpoint.response}
                            language="json"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Rate Limits
              </h2>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { tier: 'Unauthenticated', limit: '60 requests / minute', color: 'text-[var(--fg-2)]' },
                    { tier: 'Authenticated (Free)', limit: '120 requests / minute', color: 'text-green-600 dark:text-green-400' },
                    { tier: 'Pro Members', limit: '500 requests / minute', color: 'text-blue-600 dark:text-blue-400' },
                  ].map(t => (
                    <div key={t.tier} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                      <p className="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide mb-1">{t.tier}</p>
                      <p className={`font-bold text-sm ${t.color}`}>{t.limit}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--fg-3)] mt-3">
                  Rate limit status is returned in response headers: <code className="font-mono">X-RateLimit-Remaining</code> and <code className="font-mono">X-RateLimit-Reset</code>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
