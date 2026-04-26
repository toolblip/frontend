'use client';

const BASE_URL = 'https://api.toolblip.com';

// ── Types ────────────────────────────────────────────────────────────────────

interface FieldDef {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ResponseField {
  name: string;
  type: string;
  description: string;
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: boolean;
  description: string;
  body?: { fields: FieldDef[] };
  responseFields?: ResponseField[];
  curl: string;
  response: string;
  responseNote?: string;
}

// ── Endpoint definitions ─────────────────────────────────────────────────────

const endpoints: Endpoint[] = [
  // ── Tools ──────────────────────────────────────────────────────────────────
  {
    method: 'GET',
    path: '/api/tools',
    auth: false,
    description: 'Returns a paginated list of all tools in the directory. Supports optional filtering by category slug and full-text search.',
    curl: `curl "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`,
    response: `{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "qr-code-generator",
        "name": "QR Code Generator",
        "description": "Generate QR codes for URLs, text, Wi-Fi, and more.",
        "category": "image",
        "is_pro": false,
        "emoji": "📱",
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
    responseFields: [
      { name: 'tools.tools', type: 'Tool[]', description: 'Array of tool objects (see GET /api/tools/{slug})' },
      { name: 'tools.meta', type: 'object', description: 'Pagination metadata — current_page, total, per_page, last_page' },
    ],
  },
  {
    method: 'GET',
    path: '/api/tools/{slug}',
    auth: false,
    description: 'Returns a single tool by its URL-safe slug identifier.',
    curl: `curl "${BASE_URL}/api/tools/qr-code-generator" \\
  -H "Accept: application/json"`,
    response: `{
  "tool": {
    "id": 1,
    "slug": "qr-code-generator",
    "name": "QR Code Generator",
    "description": "Generate QR codes for URLs, text, Wi-Fi, and more.",
    "category": "image",
    "is_pro": false,
    "emoji": "📱",
    "created_at": "2026-04-10T12:00:00.000000Z"
  }
}`,
    responseFields: [
      { name: 'tool.id', type: 'integer', description: 'Unique numeric identifier' },
      { name: 'tool.slug', type: 'string', description: 'URL-safe identifier, used in tool detail pages' },
      { name: 'tool.name', type: 'string', description: 'Display name of the tool' },
      { name: 'tool.description', type: 'string', description: 'Full description shown on the tool detail page' },
      { name: 'tool.category', type: 'string', description: 'Category slug: image, text, development, utility, etc.' },
      { name: 'tool.is_pro', type: 'boolean', description: 'Whether this tool requires a Pro subscription' },
      { name: 'tool.emoji', type: 'string', description: 'Emoji icon for the tool card (optional)' },
      { name: 'tool.created_at', type: 'string', description: 'ISO 8601 timestamp of when the tool was added' },
    ],
  },

  // ── Auth ────────────────────────────────────────────────────────────────────
  {
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    description: 'Creates a new user account and returns a Bearer token for authenticated requests.',
    body: {
      fields: [
        { name: 'name', type: 'string', required: true, description: 'Full display name (minimum 2 characters)' },
        { name: 'email', type: 'string', required: true, description: 'Unique, valid email address' },
        { name: 'password', type: 'string', required: true, description: 'Account password (minimum 8 characters)' },
        { name: 'password_confirmation', type: 'string', required: true, description: 'Must match the password field exactly' },
      ],
    },
    curl: `curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Harun Ray",
    "email": "harun@example.com",
    "password": "securepass123",
    "password_confirmation": "securepass123"
  }'`,
    response: `{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "1|abcdef1234567890..."
}`,
    responseFields: [
      { name: 'user.id', type: 'integer', description: 'Unique numeric identifier' },
      { name: 'user.name', type: 'string', description: 'Display name' },
      { name: 'user.email', type: 'string', description: 'Registered email address' },
      { name: 'user.is_pro', type: 'boolean', description: 'Whether the user has an active Pro subscription' },
      { name: 'token', type: 'string', description: 'Bearer token — pass in the Authorization header for authenticated requests' },
    ],
    responseNote: 'Save the token securely. It is required for all subsequent authenticated endpoints.',
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    auth: false,
    description: 'Authenticates an existing user with email and password, returning a Bearer token.',
    body: {
      fields: [
        { name: 'email', type: 'string', required: true, description: 'Registered email address' },
        { name: 'password', type: 'string', required: true, description: 'Account password' },
      ],
    },
    curl: `curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"email":"harun@example.com","password":"securepass123"}'`,
    response: `{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "2|ghijkl7890123456..."
}`,
    responseFields: [
      { name: 'user', type: 'object', description: 'Authenticated user object (same shape as /auth/register)' },
      { name: 'token', type: 'string', description: 'Bearer token for use in Authorization header' },
    ],
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    auth: true,
    description: 'Invalidates the current Bearer token server-side. The token can no longer be used after this call.',
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
    auth: true,
    description: 'Returns the profile of the currently authenticated user.',
    curl: `curl "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`,
    response: `{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@example.com",
    "is_pro": true
  }
}`,
    responseFields: [
      { name: 'user.id', type: 'integer', description: 'Unique numeric identifier' },
      { name: 'user.name', type: 'string', description: 'Display name' },
      { name: 'user.email', type: 'string', description: 'Registered email address' },
      { name: 'user.is_pro', type: 'boolean', description: 'Active Pro subscription status' },
    ],
  },
];

// ── Method styles ────────────────────────────────────────────────────────────

const METHOD_STYLES: Record<string, string> = {
  GET:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  POST:   'bg-blue-100 text-blue-700    dark:bg-blue-900/30    dark:text-blue-400',
  PUT:    'bg-amber-100 text-amber-700  dark:bg-amber-900/30  dark:text-amber-400',
  DELETE: 'bg-red-100 text-red-700      dark:bg-red-900/30    dark:text-red-400',
};

// ── Copy button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  function handleCopy() {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--fg-2)] hover:border-[var(--fg-3)] hover:text-[var(--fg-0)] transition-all active:scale-95"
    >
      Copy
    </button>
  );
}

// ── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-[var(--line)]">
      <div className="bg-[var(--surface-2)] px-4 py-3 flex items-center justify-between border-b border-[var(--line)]">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)]">JSON</span>
        <CopyButton text={children} />
      </div>
      <div className="bg-[var(--surface-2)] overflow-x-auto p-4">
        <pre className="font-mono text-xs leading-relaxed text-[var(--fg-1)] whitespace-pre">{children}</pre>
      </div>
    </div>
  );
}

function CurlBlock({ children }: { children: string }) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-[var(--line)]">
      <div className="bg-[var(--surface-2)] px-4 py-3 flex items-center justify-between border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)]">cURL</span>
        </div>
        <CopyButton text={children} />
      </div>
      <div className="bg-[#0d0d10] overflow-x-auto p-4">
        <pre className="font-mono text-xs leading-relaxed text-[#e4e4e7] whitespace-pre">{children}</pre>
      </div>
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-sm font-semibold text-[var(--fg-0)] mb-4">
      {children}
    </h2>
  );
}

// ── Endpoint card ────────────────────────────────────────────────────────────

function EndpointCard({ ep, index }: { ep: Endpoint; index: number }) {
  return (
    <div
      id={`endpoint-${index}`}
      className="scroll-mt-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden"
    >
      {/* Header strip */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-2)] px-5 py-4">
        <span
          className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${METHOD_STYLES[ep.method]}`}
        >
          {ep.method}
        </span>
        <code className="font-mono text-sm font-medium text-[var(--fg-0)]">{ep.path}</code>
        {ep.auth && (
          <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            🔒 Auth
          </span>
        )}
        {!ep.auth && (
          <span className="ml-auto shrink-0 rounded-full bg-[var(--surface-3)] px-3 py-1 text-xs font-medium text-[var(--fg-3)]">
            Public
          </span>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        <p className="text-sm text-[var(--fg-2)] leading-relaxed">{ep.description}</p>

        {/* Request body fields */}
        {ep.body && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">
              Request Body
            </p>
            <div className="overflow-hidden rounded-xl border border-[var(--line)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Field</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {ep.body.fields.map((f) => (
                    <tr key={f.name}>
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs text-[var(--fg-0)]">{f.name}</code>
                        {f.required && (
                          <span className="ml-1.5 text-[var(--red)] text-xs font-bold">*</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-2)]">
                          {f.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--fg-2)]">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* curl example */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">
            Example Request
          </p>
          <CurlBlock>{ep.curl}</CurlBlock>
        </div>

        {/* Response */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">
            Example Response
          </p>
          <CodeBlock>{ep.response}</CodeBlock>

          {/* Response field documentation */}
          {ep.responseFields && ep.responseFields.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-xl border border-[var(--line)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Field</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {ep.responseFields.map((f) => (
                    <tr key={f.name}>
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs text-[var(--fg-0)]">{f.name}</code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-2)]">
                          {f.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--fg-2)]">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {ep.responseNote && (
            <p className="mt-3 text-xs text-[var(--fg-3)] flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">⚠️</span>
              {ep.responseNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Table of contents ────────────────────────────────────────────────────────

function TableOfContents() {
  const groups = [
    { label: 'Tools', filter: (e: Endpoint) => e.path.startsWith('/api/tools') },
    { label: 'Authentication', filter: (e: Endpoint) => e.path.startsWith('/api/auth') },
  ];

  return (
    <nav className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {endpoints
              .filter(group.filter)
              .map((ep, _) => {
                const idx = endpoints.indexOf(ep);
                return (
                  <a
                    key={ep.path}
                    href={`#endpoint-${idx}`}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-[var(--fg-2)] hover:bg-[var(--surface-2)] hover:text-[var(--fg-0)] transition-colors"
                  >
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${METHOD_STYLES[ep.method]}`}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono truncate">{ep.path}</code>
                  </a>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ── */}
      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {/* API badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-4 py-1.5 text-xs font-semibold text-[var(--fg-2)] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            API Live — api.toolblip.com
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--fg-0)] mb-4">
            Toolblip REST API
          </h1>
          <p className="text-base text-[var(--fg-2)] mb-10 max-w-2xl leading-relaxed">
            Integrate with Toolblip. Browse tools, register accounts, and authenticate users via a clean token-based REST API. All responses are JSON.
          </p>

          {/* Key info cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">
                Base URL
              </p>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-xs text-[var(--fg-0)] break-all">{BASE_URL}</code>
                <CopyButton text={BASE_URL} />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">
                Auth Method
              </p>
              <code className="font-mono text-xs text-[var(--fg-0)]">
                Bearer {'{token}'}
              </code>
              <p className="text-[10px] text-[var(--fg-3)] mt-1.5">via Authorization header</p>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">
                Content Type
              </p>
              <code className="font-mono text-xs text-[var(--fg-0)]">
                application/json
              </code>
              <p className="text-[10px] text-[var(--fg-3)] mt-1.5">Accept &amp; Content-Type</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">

          {/* Sidebar TOC */}
          <aside className="lg:w-52 shrink-0">
            <div className="sticky top-6 hidden lg:block rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-4">
                On this page
              </p>
              <TableOfContents />
            </div>
            {/* Mobile TOC */}
            <details className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--fg-1)] select-none">
                📑 Jump to endpoint
              </summary>
              <div className="mt-4">
                <TableOfContents />
              </div>
            </details>
          </aside>

          {/* Endpoint list */}
          <div className="flex-1 space-y-8 min-w-0">

            {/* Tools */}
            <div>
              <SectionHeading>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-3)]">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                Tools
              </SectionHeading>
              <div className="space-y-4">
                {endpoints
                  .filter((e) => e.path.startsWith('/api/tools'))
                  .map((ep) => (
                    <EndpointCard
                      key={ep.path}
                      ep={ep}
                      index={endpoints.indexOf(ep)}
                    />
                  ))}
              </div>
            </div>

            {/* Auth */}
            <div>
              <SectionHeading>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-3)]">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Authentication
              </SectionHeading>
              <div className="space-y-4">
                {endpoints
                  .filter((e) => e.path.startsWith('/api/auth'))
                  .map((ep) => (
                    <EndpointCard
                      key={ep.path}
                      ep={ep}
                      index={endpoints.indexOf(ep)}
                    />
                  ))}
              </div>
            </div>

            {/* ── Auth header snippet ── */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <h3 className="font-semibold text-[var(--fg-0)] mb-2">Authenticated requests</h3>
              <p className="text-sm text-[var(--fg-2)] mb-4 leading-relaxed">
                For endpoints marked <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">🔒 Auth</span>, include the token returned from <code className="font-mono text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded">/api/auth/login</code> or <code className="font-mono text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded">/api/auth/register</code> in every request:
              </p>
              <CurlBlock>{`curl "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`}</CurlBlock>
            </div>

            {/* ── Rate limits ── */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <h3 className="font-semibold text-[var(--fg-0)] mb-2">Rate Limits</h3>
              <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                No strict rate limit is currently enforced, but please cache responses where possible and avoid abusive usage. For higher limits on commercial integrations, reach us at{' '}
                <a
                  href="mailto:info@toolblip.com"
                  className="font-medium text-[var(--fg-1)] hover:text-[var(--red)] transition-colors"
                >
                  info@toolblip.com
                </a>
                .
              </p>
            </div>

            {/* ── Errors ── */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <h3 className="font-semibold text-[var(--fg-0)] mb-4">Error Responses</h3>
              <p className="text-sm text-[var(--fg-2)] mb-4 leading-relaxed">
                All errors return a JSON object with a{' '}
                <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-1)]">
                  message
                </code>{' '}
                field describing what went wrong.
              </p>
              <div className="overflow-hidden rounded-xl border border-[var(--line)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-2)]">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-[var(--fg-1)]">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {[
                      [400, 'Bad request — missing or invalid fields'],
                      [401, 'Unauthenticated — token missing or invalid'],
                      [403, 'Forbidden — authenticated but insufficient permissions'],
                      [404, 'Not found — resource does not exist'],
                      [422, 'Validation error — request body failed validation'],
                      [429, 'Too many requests — slow down and retry'],
                      [500, 'Server error — something went wrong on our end'],
                    ].map(([code, meaning]) => (
                      <tr key={code}>
                        <td className="px-4 py-3">
                          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-1)]">
                            {code}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--fg-2)]">{meaning as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
