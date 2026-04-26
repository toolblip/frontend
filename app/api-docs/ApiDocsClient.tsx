'use client';

const BASE_URL = 'https://api.toolblip.com';

interface FieldDef {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  auth: boolean;
  description: string;
  body?: { fields: FieldDef[] };
  curl: string;
  response: string;
  responseNote?: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/tools',
    auth: false,
    description: 'Returns a paginated list of all available tools in the directory.',
    curl: `curl -X GET "${BASE_URL}/api/tools" \\
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
  },
  {
    method: 'GET',
    path: '/api/tools/{slug}',
    auth: false,
    description: 'Returns a single tool by its slug identifier.',
    curl: `curl -X GET "${BASE_URL}/api/tools/qr-code-generator" \\
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
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    description: 'Creates a new user account and returns an authentication token.',
    body: {
      fields: [
        { name: 'name', type: 'string', required: true, description: 'Full name (min 2 characters)' },
        { name: 'email', type: 'string', required: true, description: 'Valid email address' },
        { name: 'password', type: 'string', required: true, description: 'Minimum 8 characters' },
        { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password' },
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
  "token": "1|abcdef123456..."
}`,
    responseNote: 'Save the token — use it as Bearer {token} in subsequent authenticated requests.',
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    auth: false,
    description: 'Authenticates an existing user and returns a token.',
    body: {
      fields: [
        { name: 'email', type: 'string', required: true, description: 'Registered email address' },
        { name: 'password', type: 'string', required: true, description: 'Account password' },
      ],
    },
    curl: `curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "harun@example.com",
    "password": "securepass123"
  }'`,
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
    description: "Invalidates the current user's token.",
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
    description: 'Returns the currently authenticated user profile.',
    curl: `curl -X GET "${BASE_URL}/api/auth/user" \\
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

const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function CodeBlock({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div
      className={`overflow-x-auto rounded-xl p-4 text-xs font-mono leading-relaxed ${
        dark
          ? 'bg-[var(--fg-0)] text-emerald-400'
          : 'bg-[var(--surface-2)] text-[var(--fg-1)]'
      }`}
    >
      {children}
    </div>
  );
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] bg-[var(--surface-2)] px-5 py-3.5">
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
                        {f.required && <span className="ml-1 text-[var(--red)] text-xs">*</span>}
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
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">Example</p>
          <CodeBlock dark>{ep.curl}</CodeBlock>
        </div>

        {/* Response */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">Response</p>
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
    <nav className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-3">Contents</p>
      {endpoints.map((ep, i) => (
        <a
          key={i}
          href={`#endpoint-${i}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--fg-2)] hover:bg-[var(--surface-2)] hover:text-[var(--fg-0)] transition-colors"
        >
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold ${METHOD_STYLES[ep.method]}`}
          >
            {ep.method}
          </span>
          <code className="font-mono text-xs truncate">{ep.path}</code>
        </a>
      ))}
    </nav>
  );
}

export default function ApiDocsClient() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* ── Hero ── */}
      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          {/* Pill badge */}
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
            Integrate with Toolblip. Browse tools, manage accounts, and authenticate users via a clean
            token-based REST API served at{' '}
            <code className="font-mono text-[var(--fg-1)]">api.toolblip.com</code>.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Base URL */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
                Base URL
              </p>
              <code className="font-mono text-sm text-[var(--fg-0)] break-all">{BASE_URL}</code>
            </div>

            {/* Auth */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-3)] mb-2.5">
                Authentication
              </p>
              <p className="text-xs text-[var(--fg-2)] mb-2.5">
                Bearer token in the{' '}
                <code className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-1)]">
                  Authorization
                </code>{' '}
                header.
              </p>
              <code className="font-mono text-xs text-[var(--fg-1)]">
                Authorization: Bearer {'{'}token{'}'}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body: sidebar + content ── */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">

          {/* Sidebar TOC */}
          <aside className="lg:w-52 shrink-0">
            <div className="sticky top-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 lg:block hidden">
              <TableOfContents />
            </div>
            {/* Mobile TOC */}
            <details className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--fg-1)]">
                📑 Jump to endpoint
              </summary>
              <div className="mt-3">
                <TableOfContents />
              </div>
            </details>
          </aside>

          {/* Endpoints */}
          <div className="flex-1 space-y-6 min-w-0">
            {endpoints.map((ep, i) => (
              <div key={i} id={`endpoint-${i}`} className="scroll-mt-6">
                <EndpointCard ep={ep} />
              </div>
            ))}

            {/* ── Rate limits & contact ── */}
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

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-3">
              <h3 className="font-semibold text-[var(--fg-0)]">Errors</h3>
              <p className="text-sm text-[var(--fg-2)] leading-relaxed">
                All errors return a JSON object with a{' '}
                <code className="font-mono text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded text-[var(--fg-1)]">
                  message
                </code>{' '}
                field. HTTP status codes follow REST conventions:{' '}
                <span className="font-mono text-xs text-[var(--fg-1)]">400</span> for bad request,{' '}
                <span className="font-mono text-xs text-[var(--fg-1)]">401</span> for unauthenticated,{' '}
                <span className="font-mono text-xs text-[var(--fg-1)]">404</span> for not found, and{' '}
                <span className="font-mono text-xs text-[var(--fg-1)]">500</span> for server errors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
