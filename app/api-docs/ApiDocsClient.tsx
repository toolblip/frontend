'use client';

import { useState } from 'react';
import CodeBlock from '@/components/ui/CodeBlock';

const API_BASE = 'https://api.toolblip.com';

// ─── Endpoint definitions ───────────────────────────────────────────────────

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Param {
  name: string;
  type: string;
  in: 'path' | 'query' | 'body';
  optional?: boolean;
  description: string;
}

interface Endpoint {
  method: Method;
  path: string;
  auth: boolean;
  summary: string;
  params: Param[];
  curl: string;
  response: string;
}

interface Group {
  group: string;
  groupSlug: string;
  items: Endpoint[];
}

const ENDPOINTS: Group[] = [
  {
    group: 'Tools',
    groupSlug: 'tools',
    items: [
      {
        method: 'GET',
        path: '/api/tools',
        auth: false,
        summary: 'List all tools',
        params: [
          { name: 'category', type: 'string', in: 'query', optional: true, description: 'Filter by category (e.g. text, image, dev)' },
          { name: 'search', type: 'string', in: 'query', optional: true, description: 'Search by name or description' },
          { name: 'page', type: 'integer', in: 'query', optional: true, description: 'Page number (default: 1)' },
          { name: 'per_page', type: 'integer', in: 'query', optional: true, description: 'Items per page (default: 20)' },
        ],
        curl: `curl -X GET "${API_BASE}/api/tools?category=dev&page=1" \\
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
      },
      {
        "id": 2,
        "slug": "image-compressor",
        "name": "Image Compressor",
        "description": "Compress images without losing quality.",
        "category": "image",
        "is_pro": true,
        "emoji": "🖼️",
        "created_at": "2026-04-11T09:30:00.000000Z"
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
        summary: 'Get a single tool',
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
        summary: 'Create a new account',
        params: [
          { name: 'name', type: 'string', in: 'body', optional: false, description: 'Full name (min 2 characters)' },
          { name: 'email', type: 'string', in: 'body', optional: false, description: 'Valid email address (must be unique)' },
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
        summary: 'Sign in to your account',
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
        summary: 'Revoke the current session token',
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
        summary: 'Get the authenticated user',
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

// ─── Method colours ──────────────────────────────────────────────────────────

const METHOD_COLORS: Record<Method, { bg: string; text: string; border: string }> = {
  GET:    { bg: 'bg-emerald-50 dark:bg-emerald-950/40',  text: 'text-emerald-700 dark:text-emerald-400',  border: 'border-emerald-200 dark:border-emerald-800' },
  POST:   { bg: 'bg-blue-50 dark:bg-blue-950/40',        text: 'text-blue-700 dark:text-blue-400',        border: 'border-blue-200 dark:border-blue-800' },
  PUT:    { bg: 'bg-amber-50 dark:bg-amber-950/40',     text: 'text-amber-700 dark:text-amber-400',     border: 'border-amber-200 dark:border-amber-800' },
  PATCH:  { bg: 'bg-orange-50 dark:bg-orange-950/40',    text: 'text-orange-700 dark:text-orange-400',    border: 'border-orange-200 dark:border-orange-800' },
  DELETE: { bg: 'bg-rose-50 dark:bg-rose-950/40',       text: 'text-rose-700 dark:text-rose-400',       border: 'border-rose-200 dark:border-rose-800' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  '2xx': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400' },
  '4xx': { bg: 'bg-amber-50 dark:bg-amber-950/40',    text: 'text-amber-700 dark:text-amber-400' },
  '5xx': { bg: 'bg-rose-50 dark:bg-rose-950/40',      text: 'text-rose-700 dark:text-rose-400' },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: Method }) {
  const { bg, text } = METHOD_COLORS[method];
  return (
    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md shrink-0 ${bg} ${text}`}>
      {method}
    </span>
  );
}

function AuthBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Auth required
    </span>
  );
}

function ParamTable({ params }: { params: Param[] }) {
  if (params.length === 0) return null;
  const pathParams = params.filter((p) => p.in === 'path');
  const queryParams = params.filter((p) => p.in === 'query');
  const bodyParams = params.filter((p) => p.in === 'body');

  return (
    <div className="space-y-4">
      {pathParams.length > 0 && <ParamGroup title="Path Parameters" params={pathParams} />}
      {queryParams.length > 0 && <ParamGroup title="Query Parameters" params={queryParams} />}
      {bodyParams.length > 0 && <ParamGroup title="Request Body" params={bodyParams} />}
    </div>
  );
}

function ParamGroup({ title, params }: { title: string; params: Param[] }) {
  return (
    <div>
      <h5 className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2">{title}</h5>
      <div className="rounded-xl border border-[var(--line)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-2)]">
            <tr>
              <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)] w-44">Name</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)] w-32">Type</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p, i) => (
              <tr key={i} className="border-t border-[var(--line)]">
                <td className="px-3 py-2">
                  <code className="font-mono text-xs text-[var(--fg-0)]">{p.name}</code>
                  {p.optional && <span className="ml-2 text-xs text-[var(--fg-3)]">optional</span>}
                </td>
                <td className="px-3 py-2 text-xs text-[var(--fg-2)] font-mono">{p.type}</td>
                <td className="px-3 py-2 text-xs text-[var(--fg-2)]">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--line)] bg-[var(--surface-2)]/50">
        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-mono font-semibold text-[var(--fg-0)]">{endpoint.path}</code>
          {endpoint.auth && <AuthBadge />}
        </div>
        <p className="text-sm text-[var(--fg-2)] leading-relaxed">{endpoint.summary}</p>
      </div>

      <div className="p-5 space-y-5">

        {endpoint.params.length > 0 && <ParamTable params={endpoint.params} />}

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2">Example Request</h5>
          <CodeBlock code={endpoint.curl} language="bash" />
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2">Example Response</h5>
          <CodeBlock code={endpoint.response} language="json" />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (slug: string) => setCollapsed((c) => ({ ...c, [slug]: !c[slug] }));

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ── */}
      <div className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            API Live — v1
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--fg-0)] mb-3" style={{ fontFamily: 'var(--f-display)' }}>
            Toolblip REST API
          </h1>
          <p className="text-[var(--fg-2)] text-base sm:text-lg max-w-2xl leading-relaxed">
            Base URL: <code className="font-mono text-[var(--fg-1)]">{API_BASE}</code>. All requests and responses use JSON.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">

          {/* ── Sidebar ── */}
          <aside>
            <div className="lg:sticky lg:top-8 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3 px-2">Endpoints</p>
              {ENDPOINTS.map((group) => (
                <a
                  key={group.groupSlug}
                  href={`#${group.groupSlug}`}
                  className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] hover:bg-[var(--surface-2)] px-2 py-1.5 rounded-lg transition-colors"
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
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-[var(--fg-2)] hover:text-[var(--fg-0)] hover:bg-[var(--surface-2)] px-2 py-1.5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Content ── */}
          <div className="space-y-14">

            {/* Base URL */}
            <section id="base-url">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Base URL
              </h2>
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-3">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--fg-0)]">Production</p>
                  <code className="text-sm font-mono text-[var(--fg-1)] mt-0.5 block">{API_BASE}</code>
                  <p className="text-xs text-[var(--fg-3)] mt-1">Primary base URL — use this for all requests.</p>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Authentication
              </h2>
              <p className="text-[var(--fg-1)] text-sm leading-relaxed mb-4">
                The API uses <strong>Bearer token authentication</strong>. Pass your token in the{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-sm font-mono border border-[var(--line)]">
                  Authorization
                </code>{' '}
                header on every protected request.
              </p>
              <CodeBlock
                code={`Authorization: Bearer {your_token_here}`}
                language="bash"
                title="Header format"
              />
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-[var(--fg-1)] mt-4">
                <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
                <span>
                  Keep your token secure — never expose it in public or client-side code.
                  Revoke it anytime with{' '}
                  <code className="font-mono text-xs">POST /api/auth/logout</code>.
                </span>
              </div>
            </section>

            {/* Errors */}
            <section id="errors">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Errors
              </h2>
              <p className="text-[var(--fg-1)] text-sm leading-relaxed mb-4">
                The API returns standard HTTP status codes. Error responses always include a{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-sm font-mono border border-[var(--line)]">
                  message
                </code>{' '}
                field. Validation errors (422) also include an{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-sm font-mono border border-[var(--line)]">
                  errors
                </code>{' '}
                object.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { code: '200', label: 'OK', cls: '2xx' },
                  { code: '201', label: 'Created', cls: '2xx' },
                  { code: '401', label: 'Unauthorized', cls: '4xx' },
                  { code: '403', label: 'Forbidden', cls: '4xx' },
                  { code: '404', label: 'Not Found', cls: '4xx' },
                  { code: '422', label: 'Validation Error', cls: '4xx' },
                  { code: '429', label: 'Rate Limited', cls: '4xx' },
                  { code: '500', label: 'Server Error', cls: '5xx' },
                ].map((s) => {
                  const { bg, text } = STATUS_COLORS[s.cls];
                  return (
                    <div key={s.code} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                      <span className={`font-mono font-bold text-sm ${text}`}>{s.code}</span>
                      <span className="text-xs text-[var(--fg-2)]">{s.label}</span>
                    </div>
                  );
                })}
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
            </section>

            {/* Endpoint groups */}
            {ENDPOINTS.map((group) => {
              const isCollapsed = collapsed[group.groupSlug];
              return (
                <section key={group.groupSlug} id={group.groupSlug}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--fg-0)]" style={{ fontFamily: 'var(--f-display)' }}>
                      {group.group}
                    </h2>
                    <button
                      onClick={() => toggle(group.groupSlug)}
                      className="text-xs text-[var(--fg-3)] hover:text-[var(--fg-1)] transition-colors flex items-center gap-1"
                    >
                      {isCollapsed ? 'expand' : 'collapse'}
                      <span className="text-xs">{isCollapsed ? '▷' : '△'}</span>
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-8">
                      {group.items.map((endpoint, idx) => (
                        <EndpointCard key={idx} endpoint={endpoint} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="text-xl font-bold text-[var(--fg-0)] mb-4" style={{ fontFamily: 'var(--f-display)' }}>
                Rate Limits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { tier: 'Unauthenticated', limit: '60 req / min', note: 'IP-based' },
                  { tier: 'Authenticated (Free)', limit: '120 req / min', note: 'Per account' },
                  { tier: 'Pro Members', limit: '500 req / min', note: 'Per account' },
                ].map((t) => (
                  <div key={t.tier} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <p className="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide mb-1">{t.tier}</p>
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{t.limit}</p>
                    <p className="text-xs text-[var(--fg-3)] mt-0.5">{t.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--fg-3)]">
                Rate limit headers:{' '}
                <code className="font-mono text-xs">X-RateLimit-Remaining</code> and{' '}
                <code className="font-mono text-xs">X-RateLimit-Reset</code>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
