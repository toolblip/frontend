'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Config ──────────────────────────────────────────────────────────────────

const PRIMARY_BASE = 'https://api.toolblip.com';
const LEGACY_BASE  = 'https://toolblip-api-production.up.railway.app';

// ─── Types ───────────────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST';

interface Param {
  name: string;
  type: string;
  in: 'path' | 'query' | 'body';
  optional?: boolean;
  description: string;
  example?: string;
}

interface Endpoint {
  method: HttpMethod;
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
  description: string;
  items: Endpoint[];
}

// ─── Endpoint data ────────────────────────────────────────────────────────────

const ENDPOINTS: Group[] = [
  {
    group: 'Tools',
    groupSlug: 'tools',
    description: 'Browse and retrieve developer tools from the Toolblip directory.',
    items: [
      {
        method: 'GET',
        path: '/api/tools',
        auth: false,
        summary: 'List all tools',
        params: [
          { name: 'category', type: 'string', in: 'query', optional: true, description: 'Filter by category (e.g. text, image, dev)', example: 'dev' },
          { name: 'search', type: 'string', in: 'query', optional: true, description: 'Search by name or description', example: 'json' },
          { name: 'page', type: 'integer', in: 'query', optional: true, description: 'Page number (default: 1)', example: '1' },
          { name: 'per_page', type: 'integer', in: 'query', optional: true, description: 'Items per page (default: 20)', example: '20' },
        ],
        curl: `curl -X GET "${PRIMARY_BASE}/api/tools?category=dev&page=1" \\
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
        summary: 'Get a single tool by slug',
        params: [
          { name: 'slug', type: 'string', in: 'path', optional: false, description: 'URL-friendly tool identifier', example: 'json-formatter' },
        ],
        curl: `curl -X GET "${PRIMARY_BASE}/api/tools/json-formatter" \\
  -H "Accept: application/json"`,
        response: `{
  "tool": {
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
    description: 'Register an account, sign in, manage sessions, and fetch the authenticated user.',
    items: [
      {
        method: 'POST',
        path: '/api/auth/register',
        auth: false,
        summary: 'Create a new account',
        params: [
          { name: 'name', type: 'string', in: 'body', optional: false, description: 'Full name (min 2 characters)', example: 'Alex Johnson' },
          { name: 'email', type: 'string', in: 'body', optional: false, description: 'Valid email address (must be unique)', example: 'alex@example.com' },
          { name: 'password', type: 'string', in: 'body', optional: false, description: 'Password (min 8 characters)', example: 'securepass123' },
          { name: 'password_confirmation', type: 'string', in: 'body', optional: false, description: 'Must match password exactly', example: 'securepass123' },
        ],
        curl: `curl -X POST "${PRIMARY_BASE}/api/auth/register" \\
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
          { name: 'email', type: 'string', in: 'body', optional: false, description: 'Registered email address', example: 'alex@example.com' },
          { name: 'password', type: 'string', in: 'body', optional: false, description: 'Account password', example: 'securepass123' },
        ],
        curl: `curl -X POST "${PRIMARY_BASE}/api/auth/login" \\
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
        curl: `curl -X POST "${PRIMARY_BASE}/api/auth/logout" \\
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
        curl: `curl -X GET "${PRIMARY_BASE}/api/auth/user" \\
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

// ─── Design tokens ───────────────────────────────────────────────────────────

const t = {
  bg:        'var(--bg)',
  surface:   'var(--surface)',
  surface2:  'var(--surface-2)',
  line:      'var(--line)',
  fg0:      'var(--fg-0)',
  fg1:      'var(--fg-1)',
  fg2:      'var(--fg-2)',
  fg3:      'var(--fg-3)',
  accent:   'var(--accent)',
  accentFg: 'var(--accent-fg)',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function copyToClipboard(text: string, setter: (v: string) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setter('Copied!');
    setTimeout(() => setter('Copy'), 1500);
  });
}

function highlightJSON(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-amber-600 dark:text-amber-400'; // number / bool / null
        if (/^"/.test(match)) {
          cls = /:$/.test(match)
            ? 'text-sky-600 dark:text-sky-400'  // key
            : 'text-emerald-600 dark:text-emerald-400'; // string value
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: HttpMethod }) {
  const base: Record<HttpMethod, string> = {
    GET:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  };
  return (
    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md shrink-0 ${base[method]}`}>
      {method}
    </span>
  );
}

function AuthPill() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
      🔒 Auth required
    </span>
  );
}

function ParamTable({ params }: { params: Param[] }) {
  if (!params.length) return null;

  const byLocation = {
    path:  params.filter((p) => p.in === 'path'),
    query: params.filter((p) => p.in === 'query'),
    body:  params.filter((p) => p.in === 'body'),
  };

  return (
    <div className="space-y-4">
      {(['body', 'path', 'query'] as const).map((loc) => {
        const rows = byLocation[loc];
        if (!rows.length) return null;
        const label = { body: 'Request Body', path: 'Path Parameters', query: 'Query Parameters' }[loc];
        return (
          <div key={loc}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2">{label}</p>
            <div className="rounded-xl border border-[var(--line)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)] w-44">Name</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)] w-32">Type</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-[var(--fg-2)]">Description / Example</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p, i) => (
                    <tr key={i} className="border-t border-[var(--line)]">
                      <td className="px-3 py-2.5">
                        <code className="font-mono text-xs text-[var(--fg-0)]">{p.name}</code>
                        {p.optional && <span className="ml-1.5 text-xs text-[var(--fg-3)]">optional</span>}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-[var(--fg-2)] font-mono">{p.type}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-[var(--fg-2)]">{p.description}</span>
                        {p.example && (
                          <span className="ml-2 text-xs text-[var(--fg-3)] font-mono">
                            e.g. <span className="text-[var(--fg-2)]">{p.example}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CodeBlock({ code, language, title }: { code: string; language: string; title?: string }) {
  const [copyLabel, setCopyLabel] = useState('Copy');
  const isJSON = language === 'json';

  return (
    <div className="rounded-xl border border-[var(--line)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--line)]">
        <span className="text-xs font-medium text-[var(--fg-3)]">{title ?? language.toUpperCase()}</span>
        <button
          onClick={() => copyToClipboard(code, setCopyLabel)}
          className="text-xs text-[var(--fg-3)] hover:text-[var(--fg-1)] transition-colors font-medium"
        >
          {copyLabel}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        {isJSON ? (
          <pre
            className="text-xs leading-relaxed font-mono"
            dangerouslySetInnerHTML={{ __html: highlightJSON(code) }}
          />
        ) : (
          <pre className="text-xs leading-relaxed font-mono text-[var(--fg-1)] whitespace-pre">{code}</pre>
        )}
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
          {endpoint.auth && <AuthPill />}
        </div>
        <p className="text-sm text-[var(--fg-2)] leading-relaxed">{endpoint.summary}</p>
      </div>

      <div className="p-5 space-y-6">
        {endpoint.params.length > 0 && <ParamTable params={endpoint.params} />}

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
            Example — cURL
          </p>
          <CodeBlock code={endpoint.curl} language="bash" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
            Example — Response
          </p>
          <CodeBlock code={endpoint.response} language="json" />
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection observer for active section highlighting
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const toggle = (slug: string) =>
    setCollapsed((c) => ({ ...c, [slug]: !c[slug] }));

  const navLinks = [
    ...ENDPOINTS.map((g) => ({ href: `#${g.groupSlug}`, label: g.group })),
    { href: '#getting-started', label: 'Getting Started' },
    { href: '#errors', label: 'Errors' },
    { href: '#rate-limits', label: 'Rate Limits' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ── */}
      <div className="relative border-b border-[var(--line)] bg-[var(--surface)] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--fg-3) 1px, transparent 1px), linear-gradient(90deg, var(--fg-3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          {/* Live badge */}
          <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-6 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            API Live — v1
          </div>

          <h1
            className="text-4xl sm:text-5xl font-black text-[var(--fg-0)] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--f-display)' }}
          >
            Toolblip REST API
          </h1>
          <p className="text-[var(--fg-2)] text-base sm:text-lg max-w-2xl leading-relaxed">
            Base URL:{' '}
            <code className="font-mono text-[var(--fg-1)] font-medium">{PRIMARY_BASE}</code>
            {' '}&middot; All requests and responses use JSON &middot; Bearer token auth.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Endpoints', value: '6' },
              { label: 'Auth methods', value: '2' },
              { label: 'Rate limit (auth)', value: '120/min' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                <span className="text-lg font-black text-[var(--fg-0)]" style={{ fontFamily: 'var(--f-display)' }}>{s.value}</span>
                <span className="text-xs text-[var(--fg-3)]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">

          {/* Sidebar nav */}
          <aside>
            <div className="lg:sticky lg:top-8 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3 px-2">
                Contents
              </p>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block text-sm px-2 py-1.5 rounded-lg transition-all ${
                    activeSection === link.href.slice(1)
                      ? 'text-[var(--accent)] bg-[var(--accent)]/8 font-medium'
                      : 'text-[var(--fg-2)] hover:text-[var(--fg-0)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-16">

            {/* ── Getting Started ── */}
            <section id="getting-started">
              <h2 className="text-2xl font-black text-[var(--fg-0)] mb-6 tracking-tight" style={{ fontFamily: 'var(--f-display)' }}>
                Getting Started
              </h2>

              <div className="space-y-5">
                {/* Base URLs */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--fg-1)] mb-3">Base URL</h3>
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 shrink-0 text-sm">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--fg-0)]">Primary — use this</p>
                      <code className="text-sm font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">{PRIMARY_BASE}</code>
                    </div>
                  </div>
                  <div className="mt-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-start gap-3 opacity-60">
                    <span className="text-[var(--fg-3)] mt-0.5 shrink-0 text-sm">○</span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--fg-0)]">Legacy fallback</p>
                      <code className="text-sm font-mono text-[var(--fg-2)] mt-0.5 block">{LEGACY_BASE}</code>
                    </div>
                  </div>
                </div>

                {/* Auth */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--fg-1)] mb-3">Authentication</h3>
                  <p className="text-sm text-[var(--fg-2)] leading-relaxed mb-3">
                    The API uses <strong className="text-[var(--fg-0)]">Bearer token authentication</strong>.
                    After registering or logging in, you receive a token. Include it in the{' '}
                    <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-xs font-mono border border-[var(--line)]">
                      Authorization
                    </code>{' '}
                    header on every protected request.
                  </p>
                  <CodeBlock
                    code={`Authorization: Bearer YOUR_TOKEN_HERE`}
                    language="bash"
                    title="Header format"
                  />
                  <div className="flex items-start gap-2.5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300 mt-3">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
                    <span className="text-xs leading-relaxed">
                      Keep your token secure — never expose it in public or client-side code.
                      Revoke it anytime with{' '}
                      <code className="font-mono text-xs bg-amber-100 dark:bg-amber-950/60 px-1 py-0.5 rounded">POST /api/auth/logout</code>.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Error codes ── */}
            <section id="errors">
              <h2 className="text-2xl font-black text-[var(--fg-0)] mb-6 tracking-tight" style={{ fontFamily: 'var(--f-display)' }}>
                Errors
              </h2>
              <p className="text-sm text-[var(--fg-2)] leading-relaxed mb-4">
                The API returns standard HTTP status codes. Error responses always include a{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-xs font-mono border border-[var(--line)]">
                  message
                </code>{' '}
                field. Validation errors (422) also include a nested{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-0)] text-xs font-mono border border-[var(--line)]">
                  errors
                </code>{' '}
                object.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { code: '200', label: 'OK',               cls: 'emerald' },
                  { code: '201', label: 'Created',          cls: 'emerald' },
                  { code: '401', label: 'Unauthorized',      cls: 'amber' },
                  { code: '403', label: 'Forbidden',        cls: 'amber' },
                  { code: '404', label: 'Not Found',        cls: 'amber' },
                  { code: '422', label: 'Validation Error', cls: 'amber' },
                  { code: '429', label: 'Rate Limited',     cls: 'rose' },
                  { code: '500', label: 'Server Error',     cls: 'rose' },
                ].map((s) => {
                  const colors: Record<string, string> = {
                    emerald: 'text-emerald-600 dark:text-emerald-400',
                    amber:   'text-amber-600 dark:text-amber-400',
                    rose:    'text-rose-600 dark:text-rose-400',
                  };
                  return (
                    <div key={s.code} className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                      <code className={`font-mono font-bold text-sm ${colors[s.cls]}`}>{s.code}</code>
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
                title="Error response — 422 Validation Error"
              />
            </section>

            {/* ── Endpoint groups ── */}
            {ENDPOINTS.map((group) => {
              const isCollapsed = !!collapsed[group.groupSlug];
              return (
                <section key={group.groupSlug} id={group.groupSlug}>
                  {/* Group header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-black text-[var(--fg-0)] tracking-tight" style={{ fontFamily: 'var(--f-display)' }}>
                        {group.group}
                      </h2>
                      {group.description && (
                        <p className="text-sm text-[var(--fg-2)] mt-1.5 leading-relaxed">{group.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggle(group.groupSlug)}
                      className="text-xs text-[var(--fg-3)] hover:text-[var(--fg-1)] transition-colors flex items-center gap-1.5 mt-1.5 shrink-0 border border-[var(--line)] rounded-lg px-2.5 py-1 hover:bg-[var(--surface-2)]"
                    >
                      {isCollapsed ? 'Expand' : 'Collapse'}
                      <span className="text-xs">{isCollapsed ? '▷' : '△'}</span>
                    </button>
                  </div>

                  <div className="mt-6 space-y-8">
                    {!isCollapsed && group.items.map((endpoint, idx) => (
                      <EndpointCard key={idx} endpoint={endpoint} />
                    ))}
                    {isCollapsed && (
                      <p className="text-xs text-[var(--fg-3)] italic py-2">
                        {group.items.length} endpoint{group.items.length > 1 ? 's' : ''} — click Expand to view
                      </p>
                    )}
                  </div>
                </section>
              );
            })}

            {/* ── Rate Limits ── */}
            <section id="rate-limits">
              <h2 className="text-2xl font-black text-[var(--fg-0)] mb-6 tracking-tight" style={{ fontFamily: 'var(--f-display)' }}>
                Rate Limits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { tier: 'Unauthenticated',       limit: '60 req / min',  note: 'Per IP address' },
                  { tier: 'Authenticated (Free)', limit: '120 req / min', note: 'Per account' },
                  { tier: 'Pro Members',           limit: '500 req / min', note: 'Per account' },
                ].map((t) => (
                  <div key={t.tier} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <p className="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide mb-1.5">
                      {t.tier}
                    </p>
                    <p className="font-black text-base text-emerald-600 dark:text-emerald-400" style={{ fontFamily: 'var(--f-display)' }}>
                      {t.limit}
                    </p>
                    <p className="text-xs text-[var(--fg-3)] mt-1">{t.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--fg-3)]">
                Rate limit headers:{' '}
                <code className="font-mono bg-[var(--surface-2)] px-1.5 py-0.5 rounded border border-[var(--line)] text-[var(--fg-2)]">X-RateLimit-Remaining</code>{' '}
                and{' '}
                <code className="font-mono bg-[var(--surface-2)] px-1.5 py-0.5 rounded border border-[var(--line)] text-[var(--fg-2)]">X-RateLimit-Reset</code>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
