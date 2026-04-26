'use client';

const BASE_URL = 'https://api.toolblip.com';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: boolean;
  description: string;
  body?: { fields: { name: string; type: string; required: boolean; description: string }[] };
  curl: string;
  response: string;
  responseLabel?: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/tools',
    auth: false,
    description: 'Returns a paginated list of all available tools.',
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
    responseLabel: 'Save the token — use it as Bearer {token} in subsequent requests.',
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
    description: 'Invalidates the current user\'s token. Requires valid Bearer authentication.',
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
    description: 'Returns the currently authenticated user\'s profile.',
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

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ApiDocsClient() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--red-tint)] px-3 py-1 text-xs font-medium text-[var(--red)] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--red)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--red)]" />
            </span>
            API Reference
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--fg-0)] mb-3">
            Toolblip REST API
          </h1>
          <p className="text-lg text-[var(--fg-2)] mb-8 max-w-2xl">
            Build integrations with Toolblip. Browse tools, manage users, and access developer features
            via a clean, token-based REST API.
          </p>

          {/* Base URL */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Base URL</p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--line-2)] bg-[var(--surface-2)] px-4 py-2 font-mono text-sm text-[var(--fg-1)]">
              <span className="text-[var(--fg-3)]">$</span>
              {BASE_URL}
            </div>
          </div>

          {/* Auth */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Authentication</p>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-sm text-[var(--fg-1)] mb-2">
                All authenticated endpoints require a Bearer token in the{' '}
                <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-0)]">
                  Authorization
                </code>{' '}
                header:
              </p>
              <div className="rounded-md bg-[var(--surface-2)] px-3 py-2 font-mono text-xs text-[var(--fg-1)]">
                Authorization: Bearer {'{'}your_token{'}'}
              </div>
              <p className="mt-2 text-xs text-[var(--fg-2)]">
                Tokens are returned from{' '}
                <span className="font-medium text-[var(--fg-1)]">POST /api/auth/register</span> and{' '}
                <span className="font-medium text-[var(--fg-1)]">POST /api/auth/login</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="text-2xl font-bold text-[var(--fg-0)] mb-8">Endpoints</h2>

        <div className="space-y-8">
          {endpoints.map((ep, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden"
            >
              {/* Endpoint header */}
              <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-2)] px-6 py-4">
                <span
                  className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${METHOD_COLORS[ep.method]}`}
                >
                  {ep.method}
                </span>
                <code className="font-mono text-sm font-medium text-[var(--fg-0)]">{ep.path}</code>
                {ep.auth && (
                  <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Requires auth
                  </span>
                )}
              </div>

              <div className="p-6">
                <p className="text-sm text-[var(--fg-1)] mb-5">{ep.description}</p>

                {/* Request body */}
                {ep.body && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">
                      Request Body
                    </p>
                    <div className="overflow-hidden rounded-lg border border-[var(--line)]">
                      <table className="w-full text-sm">
                        <thead className="bg-[var(--surface-2)]">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-[var(--fg-1)]">Field</th>
                            <th className="px-4 py-2 text-left font-semibold text-[var(--fg-1)]">Type</th>
                            <th className="px-4 py-2 text-left font-semibold text-[var(--fg-1)]">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--line)]">
                          {ep.body.fields.map((f) => (
                            <tr key={f.name}>
                              <td className="px-4 py-2">
                                <code className="font-mono text-xs text-[var(--fg-0)]">{f.name}</code>
                                {f.required && (
                                  <span className="ml-1 text-[var(--red)] text-xs">*</span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                <span className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-xs text-[var(--fg-2)]">
                                  {f.type}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-xs text-[var(--fg-2)]">{f.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* curl example */}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">Example</p>
                  <div className="overflow-x-auto rounded-lg bg-[#1a1a2e] p-4">
                    <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
                      {ep.curl}
                    </pre>
                  </div>
                </div>

                {/* Response */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-3)] mb-2">
                    Response
                  </p>
                  <div className="overflow-x-auto rounded-lg bg-[var(--surface-2)] p-4">
                    <pre className="text-xs text-[var(--fg-1)] font-mono leading-relaxed whitespace-pre-wrap">
                      {ep.response}
                    </pre>
                  </div>
                  {ep.responseLabel && (
                    <p className="mt-2 text-xs text-[var(--fg-2)] italic">{ep.responseLabel}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rate limits footer */}
        <div className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold text-[var(--fg-0)] mb-2">Rate Limits</h3>
          <p className="text-sm text-[var(--fg-2)]">
            The API currently has no strict rate limit, but please be respectful and cache responses
            where possible. If you need higher limits for a commercial integration, contact us at{' '}
            <span className="font-medium text-[var(--fg-1)]">info@toolblip.com</span>.
          </p>
        </div>
      </section>
    </main>
  );
}
