'use client';

import { useState } from 'react';
import CodeBlock from '@/components/ui/CodeBlock';

const API_BASE = 'https://toolblip-api-production.up.railway.app';
const API_BASE_PROD = 'https://api.toolblip.com';

const ENDPOINTS = [
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
          { name: 'category', type: 'string', in: 'query', optional: true, description: 'Filter by category (e.g. text, image, dev)' },
          { name: 'search', type: 'string', in: 'query', optional: true, description: 'Search by name or description' },
          { name: 'page', type: 'integer', in: 'query', optional: true, description: 'Page number (default: 1)' },
          { name: 'per_page', type: 'integer', in: 'query', optional: true, description: 'Items per page (default: 20)' },
        ],
        curl: `curl -X GET "${API_BASE}/api/tools" \\
  -H "Accept: application/json"`,
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
        description: 'Returns a single tool by its slug identifier.',
        params: [
          { name: 'slug', type: 'string', in: 'path', optional: false, description: 'URL-friendly tool identifier (e.g. json-formatter)' },
        ],
        curl: `curl -X GET "${API_BASE}/api/tools/json-formatter" \\
  -H "Accept: application/json"`,
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
          { name: 'name', type: 'string', in: 'body', optional: false, description: 'Full name (min 2 characters)' },
          { name: 'email', type: 'string', in: 'body', optional: false, description: 'Valid email address (unique)' },
          { name: 'password', type: 'string', in: 'body', optional: false, description: 'Password (min 8 characters)' },
          { name: 'password_confirmation', type: 'string', in: 'body', optional: false, description: 'Must match password exactly' },
        ],
        curl: `curl -X POST "${API_BASE}/api/auth/register" \\
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
          { name: 'email', type: 'string', in: 'body', optional: false, description: 'Registered email address' },
          { name: 'password', type: 'string', in: 'body', optional: false, description: 'Account password' },
        ],
        curl: `curl -X POST "${API_BASE}/api/auth/login" \\
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
        curl: `curl -X POST "${API_BASE}/api/auth/logout" \\
  -H "Accept: application/json" \\
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
        curl: `curl -X GET "${API_BASE}/api/auth/user" \\
  -H "Accept: application/json" \\
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
  GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  DELETE: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${METHOD_COLORS[method] ?? 'bg-gray-100 text-gray-700'}`}>
      {method}
    </span>
  );
}

function EndpointCard({ endpoint }: { endpoint: typeof ENDPOINTS[0]['items'][0] }) {
  const hasBody = endpoint.params.some(p => p.in === 'body');
  const pathParams = endpoint.params.filter(p => p.in === 'path');
  const queryParams = endpoint.params.filter(p => p.in === 'query');
  const bodyParams = endpoint.params.filter(p => p.in === 'body');

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--line)]">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-mono font-semibold text-[var(--fg-0)]">{endpoint.path}</code>
          {endpoint.auth && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              🔒 Auth
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--fg-2)] leading-relaxed">{endpoint.description}</p>
      </div>

      <div className="p-5 space-y-5">

        {/* Path params */}
        {pathParams.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Path Parameters</h4>
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
                  {pathParams.map((p, i) => (
                    <tr key={i} className="border-t border-[var(--line)]">
                      <td className="px-3 py-2"><code className="font-mono text-xs text-[var(--fg-0)]">{p.name}</code></td>
                      <td className="px-3 py-2 text-xs text-[var(--fg-2)] font-mono">{p.type}</td>
                      <td className="px-3 py-2 text-xs text-[var(--fg-2)]">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Query params */}
        {queryParams.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Query Parameters</h4>
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
                  {queryParams.map((p, i) => (
                    <tr key={i} className="border-t border-[var(--line)]">
                      <td className="px-3 py-2">
                        <code className="font-mono text-xs text-[var(--fg-0)]">{p.name}</code>
                        {p.optional && <span className="ml-1.5 text-[var(--fg-3)] text-xs">optional</span>}
                      </td>
                      <td className="px-3 py-2 text-xs text-[var(--fg-2)] font-mono">{p.type}</td>
                      <td className="px-3 py-2 text-xs text-[var(--fg-2)]">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Body params */}
        {bodyParams.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Request Body</h4>
            <div className="rounded-xl border border-[var(--line)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Field</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Type</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {bodyParams.map((p, i) => (
                    <tr key={i} className="border-t border-[var(--line)]">
                      <td className="px-3 py-2">
                        <code className="font-mono text-xs text-[var(--fg-0)]">{p.name}</code>
                        {p.optional && <span className="ml-1.5 text-[var(--fg-3)] text-xs">optional</span>}
                      </td>
                      <td className="px-3 py-2 text-xs text-[var(--fg-2)] font-mono">{p.type}</td>
                      <td className="px-3 py-2 text-xs text-[var(--fg-2)]">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* curl */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Example Request</h4>
          <CodeBlock code={endpoint.curl} language="bash" />
        </div>

        {/* Response */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Example Response</h4>
          <CodeBlock code={endpoint.response} language="json" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="text-xl font-bold text-[var(--fg-0)] scroll-mt-6" style={{ fontFamily: 'var(--f-display)' }}>
      {title}
    </h2>
  );
}

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

      {/* Hero */}
      <div className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            API Live — v1
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg-0)] mb-3" style={{ fontFamily: 'var(--f-display)' }}>
            Toolblip REST API
          </h1>
          <p className="text-[var(--fg-2)] text-base sm:text-lg max-w-2xl leading-relaxed">
            Build integrations with the Toolblip API. All endpoints return JSON and are REST-compliant.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">

          {/* Sidebar */}
          <aside>
            <div className="lg:sticky lg:top-8 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3 px-2">Reference</p>
              {ENDPOINTS.map(group => (
                <a
                  key={group.groupSlug}
                  href={`#${group.groupSlug}`}
                  className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] px-2 py-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                >
                  {group.group}
                </a>
              ))}
              <div className="pt-5 mt-5 border-t border-[var(--line)]">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3 px-2">On this page</p>
                {[
                  { href: '#base-url', label: 'Base URL' },
                  { href: '#authentication', label: 'Authentication' },
                  { href: '#errors', label: 'Errors' },
                  { href: '#rate-limits', label: 'Rate Limits' },
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] px-2 py-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-14">

            {/* Base URL */}
            <section id="base-url">
              <SectionHeader id="base-url" title="Base URL" />
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--fg-0)]">Production (recommended)</p>
                    <code className="text-sm font-mono text-[var(--fg-1)] mt-0.5 block">{API_BASE_PROD}</code>
                    <p className="text-xs text-[var(--fg-3)] mt-1">Active once SSL provisioning is complete on api.toolblip.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                  <span className="text-amber-500 mt-0.5 shrink-0">⚡</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--fg-0)]">Railway direct (available now)</p>
                    <code className="text-sm font-mono text-[var(--fg-1)] mt-0.5 block">{API_BASE}</code>
                    <p className="text-xs text-[var(--fg-3)] mt-1">Production deployment — use this while SSL is being provisioned</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <SectionHeader id="authentication" title="Authentication" />
              <div className="mt-4 space-y-4">
                <p className="text-[var(--fg-1)] text-sm leading-relaxed">
                  The Toolblip API uses <strong>Bearer token authentication</strong>. After logging in or registering, you receive a token. Include it in the <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-sm font-mono border border-[var(--line)]">Authorization</code> header on every protected request.
                </p>
                <CodeBlock
                  code={`Authorization: Bearer {your_token_here}`}
                  language="bash"
                  title="Header format"
                />
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-[var(--fg-1)]">
                  <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
                  <span>
                    Never expose your token in public client-side code. Use the API from a server or secure backend.
                    Tokens are revoked by calling <code className="font-mono text-xs">POST /api/auth/logout</code>.
                  </span>
                </div>
              </div>
            </section>

            {/* Errors */}
            <section id="errors">
              <SectionHeader id="errors" title="Errors" />
              <div className="mt-4 space-y-4">
                <p className="text-[var(--fg-1)] text-sm leading-relaxed">
                  The API returns standard HTTP status codes. 2xx indicates success; 4xx indicates a client error; 5xx indicates a server error. Error bodies always include a <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-sm font-mono border border-[var(--line)]">message</code> field.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { code: '200', label: 'OK', color: 'text-emerald-600 dark:text-emerald-400' },
                    { code: '201', label: 'Created', color: 'text-emerald-600 dark:text-emerald-400' },
                    { code: '401', label: 'Unauthorized', color: 'text-rose-600 dark:text-rose-400' },
                    { code: '403', label: 'Forbidden', color: 'text-rose-600 dark:text-rose-400' },
                    { code: '404', label: 'Not Found', color: 'text-yellow-600 dark:text-yellow-400' },
                    { code: '422', label: 'Validation Error', color: 'text-orange-600 dark:text-orange-400' },
                    { code: '429', label: 'Rate Limited', color: 'text-orange-600 dark:text-orange-400' },
                    { code: '500', label: 'Server Error', color: 'text-rose-600 dark:text-rose-400' },
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
                <div className="flex items-center justify-between mb-6">
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

                {openGroups[group.groupSlug] && (
                  <div className="space-y-8">
                    {group.items.map((endpoint, idx) => (
                      <EndpointCard key={idx} endpoint={endpoint} />
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Rate Limits */}
            <section id="rate-limits">
              <SectionHeader id="rate-limits" title="Rate Limits" />
              <div className="mt-4 bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { tier: 'Unauthenticated', limit: '60 req / min', color: 'text-[var(--fg-2)]' },
                    { tier: 'Authenticated (Free)', limit: '120 req / min', color: 'text-emerald-600 dark:text-emerald-400' },
                    { tier: 'Pro Members', limit: '500 req / min', color: 'text-blue-600 dark:text-blue-400' },
                  ].map(t => (
                    <div key={t.tier} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                      <p className="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide mb-1">{t.tier}</p>
                      <p className={`font-bold text-sm ${t.color}`}>{t.limit}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--fg-3)] mt-3">
                  Check remaining calls with response headers: <code className="font-mono text-xs">X-RateLimit-Remaining</code> and <code className="font-mono text-xs">X-RateLimit-Reset</code>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
