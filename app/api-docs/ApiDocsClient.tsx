'use client';

import { useState, useCallback, useEffect } from 'react';

const BASE_URL = 'https://api.toolblip.com';
const RAILWAY_URL = 'https://toolblip-api-production.up.railway.app';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/tools',
    summary: 'List all tools',
    auth: false,
    description: 'Returns a paginated list of all available tools in the Toolblip directory. Supports optional filtering by category and search query.',
    params: [
      { name: 'category', type: 'string', required: false, desc: 'Filter by category slug (e.g. "image", "text", "developer")' },
      { name: 'search', type: 'string', required: false, desc: 'Full-text search across tool names and descriptions' },
      { name: 'page', type: 'integer', required: false, desc: 'Page number for pagination (default: 1)' },
      { name: 'per_page', type: 'integer', required: false, desc: 'Items per page (default: 15, max: 100)' },
    ],
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
    description: 'Returns detailed information for a specific tool identified by its unique slug.',
    params: [
      { name: 'slug', type: 'string', required: true, desc: 'The unique URL-safe identifier for the tool' },
    ],
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
    description: 'Creates a new user account. Returns the authenticated user object and a Bearer token to use in subsequent authenticated requests.',
    params: [
      { name: 'name', type: 'string', required: true, desc: 'Full name of the new user' },
      { name: 'email', type: 'string', required: true, desc: 'Valid email address (must be unique)' },
      { name: 'password', type: 'string', required: true, desc: 'Account password (min. 8 characters)' },
      { name: 'password_confirmation', type: 'string', required: true, desc: 'Must match the password field exactly' },
    ],
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
    description: 'Authenticates a user with email and password. Returns the user object and a Bearer token for all subsequent authenticated requests.',
    params: [
      { name: 'email', type: 'string', required: true, desc: 'Registered email address' },
      { name: 'password', type: 'string', required: true, desc: 'Account password' },
    ],
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
    description: 'Revokes the current Bearer token, logging the user out. The token can no longer be used after this call.',
    params: [],
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
    description: 'Returns the currently authenticated user based on the Bearer token provided in the Authorization header.',
    params: [],
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
  GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  PATCH: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'tools', label: 'Tools' },
  { id: 'auth', label: 'Auth' },
  { id: 'errors', label: 'Error Codes' },
];

// ── Copy Button ───────────────────────────────────────────────────────────────
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
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all shrink-0
        bg-[var(--surface-2)] text-[var(--fg-2)] hover:bg-[var(--surface-3)] hover:text-[var(--fg-1)]"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
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

// ── Code Block ────────────────────────────────────────────────────────────────
function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--line)] dark:border-[var(--line-2)]">
        <span className="text-xs font-semibold font-mono text-[var(--fg-3)] uppercase tracking-wider">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre
        className="overflow-x-auto p-4 text-sm leading-relaxed max-h-80"
        style={{ background: 'var(--surface)', fontFamily: 'var(--f-mono)', color: 'var(--fg-1)' }}
      >
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ── Endpoint Card ─────────────────────────────────────────────────────────────
function EndpointCard({ endpoint }: { endpoint: typeof ENDPOINTS[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      id={endpoint.path.replace(/\//g, '-').replace(/\{|\}/g, '')}
      className="rounded-2xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)] transition-all hover:shadow-sm"
      style={{ background: 'var(--surface)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--surface-2)] dark:hover:bg-[var(--surface-2)] transition-colors"
      >
        <span className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${METHOD_COLORS[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <code
          className="flex-1 text-sm font-semibold truncate"
          style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-0)' }}
        >
          {endpoint.path}
        </code>
        <span className="text-sm text-[var(--fg-2)] hidden md:block flex-1 min-w-0 ml-2">
          {endpoint.summary}
        </span>
        {endpoint.auth && (
          <span className="shrink-0 ml-2 px-2 py-0.5 rounded text-xs font-bold bg-[var(--red-tint)] text-[var(--red)]">
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
        <div
          className="px-5 pb-5 space-y-5 border-t border-[var(--line)] dark:border-[var(--line-2)]"
          style={{ borderTopColor: 'var(--line)' }}
        >
          <p className="pt-4 text-sm leading-relaxed" style={{ color: 'var(--fg-1)' }}>
            {endpoint.description}
          </p>

          {endpoint.params.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--fg-3)' }}>
                Request Parameters
              </h4>
              <div className="rounded-xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--surface-2)' }} className="border-b border-[var(--line)] dark:border-[var(--line-2)]">
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fg-2)' }}>Name</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fg-2)' }}>Type</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fg-2)' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.params.map((p, i) => (
                      <tr key={p.name} className={i > 0 ? 'border-t border-[var(--line)] dark:border-[var(--line-2)]' : ''}>
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold" style={{ color: 'var(--red)' }}>
                          {p.name}
                          {p.required ? <span className="ml-1 text-[10px] font-bold text-red-400">*</span> : ''}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-[var(--fg-3)]">{p.type}</td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--fg-1)' }}>{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--fg-3)' }}>
              Example curl
            </h4>
            <CodeBlock code={endpoint.curl} label="curl" />
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--fg-3)' }}>
              Example Response
            </h4>
            <CodeBlock code={endpoint.response} label="JSON" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sticky Sidebar Nav ────────────────────────────────────────────────────────
function SidebarNav() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const links: Record<string, string> = {
    overview: '#overview',
    authentication: '#authentication',
    tools: '#tools',
    auth: '#auth',
    errors: '#errors',
  };

  return (
    <nav className="hidden xl:flex flex-col gap-1 w-44 shrink-0">
      <span className="text-xs font-bold uppercase tracking-widest mb-2 px-2" style={{ color: 'var(--fg-3)' }}>On this page</span>
      {NAV_SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={links[id]}
          className="px-2 py-1.5 text-sm rounded-lg transition-all text-left"
          style={{
            color: active === id ? 'var(--red)' : 'var(--fg-2)',
            background: active === id ? 'var(--red-tint)' : 'transparent',
            fontWeight: active === id ? 600 : 400,
          }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="text-base font-bold mb-5 flex items-center gap-2.5 scroll-mt-20" style={{ color: 'var(--fg-0)' }}>
      <span className="w-1 h-4 rounded-full shrink-0" style={{ background: 'var(--red)' }} />
      {title}
    </h2>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'green' | 'red' | 'default' }) {
  const styles = {
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    default: 'bg-[var(--surface-2)] text-[var(--fg-2)]',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${styles[variant]}`}>
      {children}
    </span>
  );
}

export default function ApiDocsClient() {
  const [env, setEnv] = useState<'production' | 'railway'>('production');

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--line)]" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: 'var(--red-tint)', color: 'var(--red)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            REST API
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: 'var(--fg-0)', fontFamily: 'var(--f-display)' }}
          >
            Toolblip API Reference
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-8" style={{ color: 'var(--fg-2)' }}>
            Build integrations with Toolblip. Browse tools, manage user accounts, and access developer features — all via simple REST endpoints.
          </p>

          {/* Quick-start code block */}
          <div className="rounded-xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)] max-w-2xl"
            style={{ background: 'var(--surface-2)' }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)] dark:border-[var(--line-2)]">
              <span className="text-xs font-semibold" style={{ color: 'var(--fg-3)' }}>Quick start — list all tools</span>
              <CopyButton text={`curl -X GET "${BASE_URL}/api/tools" -H "Accept: application/json"`} />
            </div>
            <div className="p-4">
              <pre className="text-sm" style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-1)' }}>
                <code>{`curl -X GET "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex gap-16">
        {/* Sticky sidebar */}
        <SidebarNav />

        <div className="flex-1 min-w-0 space-y-14">

          {/* ── Environments ─────────────────────────────────────────────── */}
          <section id="overview">
            <SectionHeader id="overview" title="Base URL & Environments" />
            <div className="space-y-3">
              {/* Production */}
              <div
                className="p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all"
                style={{
                  background: env === 'production' ? 'var(--surface)' : 'var(--surface-2)',
                  borderColor: env === 'production' ? 'var(--red)' : 'var(--line)',
                }}
                onClick={() => setEnv('production')}
              >
                <input
                  type="radio"
                  name="env"
                  checked={env === 'production'}
                  onChange={() => setEnv('production')}
                  className="mt-0.5 shrink-0 accent-red-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: 'var(--fg-0)' }}>Production</span>
                    <Badge variant="green">Recommended</Badge>
                  </div>
                  <code className="text-sm font-mono" style={{ color: 'var(--fg-1)' }}>{BASE_URL}</code>
                  <p className="text-xs mt-1" style={{ color: 'var(--fg-3)' }}>
                    Primary endpoint. Use this for all production integrations.
                  </p>
                </div>
              </div>

              {/* Railway fallback */}
              <div
                className="p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all"
                style={{
                  background: env === 'railway' ? 'var(--surface)' : 'var(--surface-2)',
                  borderColor: env === 'railway' ? 'var(--fg-3)' : 'var(--line)',
                }}
                onClick={() => setEnv('railway')}
              >
                <input
                  type="radio"
                  name="env"
                  checked={env === 'railway'}
                  onChange={() => setEnv('railway')}
                  className="mt-0.5 shrink-0 accent-red-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: 'var(--fg-0)' }}>Railway (interim)</span>
                    <Badge variant="default">Fallback</Badge>
                  </div>
                  <code className="text-sm font-mono" style={{ color: 'var(--fg-1)' }}>{RAILWAY_URL}</code>
                  <p className="text-xs mt-1" style={{ color: 'var(--fg-3)' }}>
                    Raw Railway deployment. Switch to <code style={{ fontFamily: 'var(--f-mono)' }}>{BASE_URL}</code> once your DNS SSL propagates.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--surface-2)' }}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--fg-3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--fg-2)' }}>
                All API requests go to the selected base URL. No trailing slash. All responses are JSON with <code style={{ fontFamily: 'var(--f-mono)' }}>Content-Type: application/json</code>.
              </p>
            </div>
          </section>

          {/* ── Authentication ───────────────────────────────────────────── */}
          <section id="authentication">
            <SectionHeader id="authentication" title="Authentication" />
            <div
              className="p-5 rounded-xl border border-[var(--line)] dark:border-[var(--line-2)] mb-5"
              style={{ background: 'var(--surface)' }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--red-tint)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--red)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--fg-0)' }}>
                    Bearer Token (Laravel Sanctum)
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--fg-1)' }}>
                    Include your token as a <strong>Bearer</strong> token in the <code style={{ fontFamily: 'var(--f-mono)' }}>Authorization</code> header on every protected request.
                    Tokens are obtained from <strong>/api/auth/register</strong> or <strong>/api/auth/login</strong>.
                  </p>
                  <div className="p-3 rounded-lg border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}>
                    <pre className="text-sm" style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-1)' }}>
                      <code>Authorization: Bearer <span style={{ color: 'var(--red)' }}>{'{token}'}</span></code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { method: 'Public', path: '/api/auth/register', desc: 'Create account → get token', auth: false },
                { method: 'Public', path: '/api/auth/login', desc: 'Login → get token', auth: false },
                { method: 'Auth', path: '/api/auth/logout', desc: 'Revoke token', auth: true },
                { method: 'Auth', path: '/api/auth/user', desc: 'Get current user', auth: true },
              ].map((r) => (
                <div key={r.path} className="flex items-center gap-2.5 text-sm p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold ${r.auth ? 'bg-[var(--red-tint)] text-[var(--red)]' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {r.method}
                  </span>
                  <code style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-1)', fontSize: '13px' }}>{r.path}</code>
                  <span className="hidden sm:inline text-xs truncate" style={{ color: 'var(--fg-3)' }}>— {r.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tools Endpoints ──────────────────────────────────────────── */}
          <section id="tools">
            <SectionHeader id="tools" title="Tools" />
            <div className="space-y-3">
              {ENDPOINTS.filter((e) => e.path.startsWith('/api/tools')).map((ep) => (
                <EndpointCard key={`${ep.method}:${ep.path}`} endpoint={ep} />
              ))}
            </div>
          </section>

          {/* ── Auth Endpoints ────────────────────────────────────────────── */}
          <section id="auth">
            <SectionHeader id="auth" title="Auth" />
            <div className="space-y-3">
              {ENDPOINTS.filter((e) => e.path.startsWith('/api/auth')).map((ep) => (
                <EndpointCard key={`${ep.method}:${ep.path}`} endpoint={ep} />
              ))}
            </div>
          </section>

          {/* ── Rate Limiting ─────────────────────────────────────────────── */}
          <section>
            <SectionHeader id="rate-limiting" title="Rate Limiting" />
            <div
              className="p-5 rounded-xl border border-[var(--line)] dark:border-[var(--line-2)] flex items-start gap-4"
              style={{ background: 'var(--surface)' }}
            >
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--fg-2)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-1)' }}>
                  <strong>60 requests per minute</strong> per IP address. Exceeding this returns a{' '}
                  <code style={{ fontFamily: 'var(--f-mono)' }}>429 Too Many Requests</code> with a{' '}
                  <code style={{ fontFamily: 'var(--f-mono)' }}>Retry-After</code> header indicating when to resume.
                </p>
              </div>
            </div>
          </section>

          {/* ── Error Codes ───────────────────────────────────────────────── */}
          <section id="errors">
            <SectionHeader id="errors" title="Error Codes" />
            <div
              className="rounded-xl overflow-hidden border border-[var(--line)] dark:border-[var(--line-2)]"
              style={{ background: 'var(--surface)' }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] dark:border-[var(--line-2)]" style={{ background: 'var(--surface-2)' }}>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--fg-2)' }}>Status</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--fg-2)' }}>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: '200', msg: 'OK — request succeeded' },
                    { code: '201', msg: 'Created — resource was created successfully' },
                    { code: '401', msg: 'Unauthorized — missing or invalid Bearer token' },
                    { code: '403', msg: 'Forbidden — authenticated but insufficient permissions' },
                    { code: '404', msg: 'Not Found — resource does not exist' },
                    { code: '422', msg: 'Unprocessable Entity — validation failed (check response body)' },
                    { code: '429', msg: 'Too Many Requests — rate limit exceeded, check Retry-After header' },
                    { code: '500', msg: 'Server Error — something went wrong on our end, try again later' },
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

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <section className="text-center pt-2 pb-8">
            <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
              Questions or bugs? Open an issue at{' '}
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
      </div>
    </main>
  );
}
