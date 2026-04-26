'use client';

const BASE_URL = 'https://api.toolblip.com';

// ── Types ────────────────────────────────────────────────────────────────────

interface FieldDef {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: boolean;
  description: string;
  body?: { fields: FieldDef[] };
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
    description: 'Returns a paginated list of all available tools in the directory. Supports filtering by category and search query.',
    curl: `curl "${BASE_URL}/api/tools" -H "Accept: application/json"`,
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
  },
  {
    method: 'GET',
    path: '/api/tools/{slug}',
    auth: false,
    description: 'Returns a single tool by its URL-safe slug identifier.',
    curl: `curl "${BASE_URL}/api/tools/qr-code-generator" -H "Accept: application/json"`,
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
  },

  // ── Auth ────────────────────────────────────────────────────────────────────
  {
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    description: 'Creates a new user account and returns a Bearer token for subsequent authenticated requests.',
    body: {
      fields: [
        { name: 'name', type: 'string', required: true, description: 'Full name (min 2 characters)' },
        { name: 'email', type: 'string', required: true, description: 'Unique, valid email address' },
        { name: 'password', type: 'string', required: true, description: 'Minimum 8 characters' },
        { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password exactly' },
      ],
    },
    curl: `curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"name":"Harun Ray","email":"harun@example.com","password":"securepass123","password_confirmation":"securepass123"}'`,
    response: `{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "1|abcdef123456..."
}`,
    responseNote: 'Save the token — use it as Bearer {token} in the Authorization header for all authenticated requests.',
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
  "token": "2|ghijkl789012..."
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    auth: true,
    description: 'Invalidates the current user\'s Bearer token server-side.',
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
  },
];

// ── Method styles ────────────────────────────────────────────────────────────

const METHOD_STYLES: Record<string, string> = {
  GET:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  POST:   'bg-blue-100 text-blue-700    dark:bg-blue-900/30    dark:text-blue-400',
  PUT:    'bg-amber-100 text-amber-700   dark:bg-amber-900/30  dark:text-amber-400',
  DELETE: 'bg-red-100 text-red-700       dark:bg-red-900/30     dark:text-red-400',
};

// ── Components ───────────────────────────────────────────────────────────────

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

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="relative group">
      <div className="overflow-x-auto rounded-xl bg-[var(--surface-2)] p-4 text-xs font-mono leading-relaxed text-[var(--fg-1)]">
        <pre className="whitespace-pre">{children}</pre>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={children} />
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-4">
      {children}
    </h2>
  );
}

function EndpointCard({ ep, index }: { ep: Endpoint; index: number }) {
  return (
    <div
      id={`endpoint-${index}`}
      className="scroll-mt-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden"
    >
      {/* Header strip */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] bg-[var(--surface-2)] px-5 py-3">
        <span
          className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${METHOD_STYLES[ep.method]}`}
        >
          {ep.method}
        </span>
        <code className="font-mono text-sm font-medium text-[var(--fg-0)]">{ep.path}</code>
        {ep.auth && (
          <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            🔒 Auth required
          </span>
        )}
      </div>

      <div className="p-5 space-y-5">
        <p className="text-sm text-[var(--fg-2)] leading-relaxed">{ep.description}</p>

        {/* Request body fields */}
        {ep.body && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
              Request Body
            </p>
            <div className="overflow-hidden rounded-xl border border-[var(--line)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--fg-1)]">Field</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--fg-1)]">Type</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--fg-1)]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {ep.body.fields.map((f) => (
                    <tr key={f.name}>
                      <td className="px-4 py-2.5">
                        <code className="font-mono text-xs text-[var(--fg-0)]">{f.name}</code>
                        {f.required && (
                          <span className="ml-1 text-[var(--red)] text-xs font-bold">*</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-2)]">
                          {f.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[var(--fg-2)]">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* curl example */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
            Example Request
          </p>
          <CodeBlock>{ep.curl}</CodeBlock>
        </div>

        {/* Response */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
            Example Response
          </p>
          <CodeBlock>{ep.response}</CodeBlock>
          {ep.responseNote && (
            <p className="mt-2 text-xs text-[var(--fg-3)] italic">{ep.responseNote}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TableOfContents() {
  return (
    <nav className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">Contents</p>
      {endpoints.map((ep, i) => (
        <a
          key={i}
          href={`#endpoint-${i}`}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[var(--fg-2)] hover:bg-[var(--surface-2)] hover:text-[var(--fg-0)] transition-colors"
        >
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${METHOD_STYLES[ep.method]}`}
          >
            {ep.method}
          </span>
          <code className="font-mono truncate">{ep.path}</code>
        </a>
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
        <div className="mx-auto max-w-5xl px-6 py-14">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--red-tint)] px-3 py-1 text-xs font-semibold text-[var(--red)] mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--red)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--red)]" />
            </span>
            API Reference
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--fg-0)] mb-3">
            Toolblip REST API
          </h1>
          <p className="text-base text-[var(--fg-2)] mb-10 max-w-2xl leading-relaxed">
            Integrate with Toolblip. Browse tools, register accounts, and authenticate users via a clean
            token-based REST API.
          </p>

          {/* Key info cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
                Base URL
              </p>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm text-[var(--fg-0)] break-all">{BASE_URL}</code>
                <CopyButton text={BASE_URL} />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
                Authentication
              </p>
              <p className="text-xs text-[var(--fg-2)] mb-2">
                Pass your Bearer token in the{' '}
                <code className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-1)]">
                  Authorization
                </code>{' '}
                header on every authenticated request.
              </p>
              <code className="font-mono text-xs text-[var(--fg-1)]">
                Authorization: Bearer {'{'}token{'}'}
              </code>
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
              <TableOfContents />
            </div>
            {/* Mobile TOC */}
            <details className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--fg-1)] select-none">
                📑 Jump to endpoint
              </summary>
              <div className="mt-3">
                <TableOfContents />
              </div>
            </details>
          </aside>

          {/* Endpoint list */}
          <div className="flex-1 space-y-6 min-w-0">

            {/* Tools */}
            <div>
              <SectionHeading>Tools</SectionHeading>
              <div className="space-y-4">
                {endpoints
                  .filter((e) => e.path.startsWith('/api/tools'))
                  .map((ep, _, arr) => (
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
              <SectionHeading>Authentication</SectionHeading>
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

            {/* ── Rate limits ── */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-3">
              <h3 className="font-semibold text-[var(--fg-0)]">Rate Limits</h3>
              <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                No strict rate limit is currently enforced, but please cache responses where possible
                and avoid abusive usage. For higher limits on commercial integrations, reach us at{' '}
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
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-3">
              <h3 className="font-semibold text-[var(--fg-0)]">Error Responses</h3>
              <p className="text-sm text-[var(--fg-2)] leading-relaxed">
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
                      <th className="px-4 py-2.5 text-left font-semibold text-[var(--fg-1)]">Status</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-[var(--fg-1)]">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)] text-[var(--fg-2)]">
                    {[
                      [400, 'Bad request — missing or invalid fields'],
                      [401, 'Unauthenticated — token missing or invalid'],
                      [403, 'Forbidden — authenticated but insufficient permissions'],
                      [404, 'Not found — resource does not exist'],
                      [422, 'Validation error — request body failed validation'],
                      [500, 'Server error — something went wrong on our end'],
                    ].map(([code, meaning]) => (
                      <tr key={code}>
                        <td className="px-4 py-2.5">
                          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-1)]">
                            {code}
                          </code>
                        </td>
                        <td className="px-4 py-2.5 text-xs">{meaning as string}</td>
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
