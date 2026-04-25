'use client';

const BASE_URL = 'https://toolblip-api-production.up.railway.app';

// ─── Method badge ──────────────────────────────────────────────────────────────
function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    POST:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    PUT:    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    PATCH:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono tracking-wide ${colors[method] ?? 'bg-surface-2 text-fg-1'}`}>
      {method}
    </span>
  );
}

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ label, code }: { label?: string; code: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[--line] my-3 text-sm">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[--line] bg-surface-2">
          <span className="text-xs text-fg-2 font-mono">{label}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 bg-[#0d0d10] text-[#e2e2ea] font-mono text-xs leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-14 scroll-mt-20">
      <h2 className="text-lg font-bold text-fg-0 mb-5 pb-3 border-b border-[--line]">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Endpoint block ───────────────────────────────────────────────────────────
function Endpoint({
  method,
  path,
  auth,
  description,
  params,
  curl,
  response,
}: {
  method: string;
  path: string;
  auth?: boolean;
  description: string;
  params?: React.ReactNode;
  curl: string;
  response: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <MethodBadge method={method} />
        <code className="font-mono text-sm font-semibold text-fg-0">{path}</code>
        {auth && (
          <span className="ml-1 inline-flex items-center gap-1 text-xs text-fg-2 border border-[--line] rounded-full px-2 py-0.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1.5" y="4.5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M3 4.5V3a2 2 0 1 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Auth required
          </span>
        )}
      </div>
      <p className="text-fg-1 text-sm leading-relaxed mb-4">{description}</p>
      {params}
      <CodeBlock label="curl" code={curl} />
      <CodeBlock label="Response" code={response} />
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
function ParamTable({ rows }: { rows: { name: string; type: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[--line] text-left">
            <th className="py-2 pr-4 font-mono text-fg-2 text-xs">Field / Param</th>
            <th className="py-2 pr-4 font-mono text-fg-2 text-xs">Type</th>
            <th className="py-2 font-mono text-fg-2 text-xs">Description</th>
          </tr>
        </thead>
        <tbody className="text-fg-1">
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[--line-2]">
              <td className="py-2 pr-4 font-mono text-red-600 dark:text-red-400 text-xs">{r.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-fg-2">{r.type}</td>
              <td className="py-2 text-sm">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────────
function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block px-3 py-1.5 rounded-lg text-sm text-fg-2 hover:text-fg-0 hover:bg-surface-2 transition-colors"
    >
      {label}
    </a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ApiDocsClient() {
  return (
    <main className="min-h-screen bg-[--bg]">
      {/* ── Hero ── */}
      <div className="border-b border-[--line] bg-[--surface]">
        <div className="max-w-6xl mx-auto px-6 py-14 flex items-start gap-8">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-fg-2 border border-[--line] rounded-full px-3 py-1 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              REST API v1
            </div>
            <h1 className="text-4xl font-black text-fg-0 tracking-tight mb-3" style={{ fontFamily: 'var(--f-display)', letterSpacing: '-0.025em' }}>
              Toolblip API
            </h1>
            <p className="text-fg-1 text-base leading-relaxed max-w-xl">
              Build on top of Toolblip. Browse the full catalog of free developer tools, manage user accounts, and integrate Toolblip into your own apps.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-mono text-xs text-fg-2 bg-surface-2 border border-[--line] rounded-lg px-3 py-1.5">
                Base URL:{' '}
                <span className="text-fg-0 font-semibold">{BASE_URL}</span>
              </span>
            </div>
          </div>
          {/* Quick stats */}
          <div className="hidden md:flex flex-col gap-3 shrink-0">
            {[
              { label: 'Endpoints', value: '6' },
              { label: 'Auth type', value: 'Bearer' },
              { label: 'Format', value: 'JSON' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center min-w-[80px]">
                <div className="text-xl font-bold text-fg-0" style={{ fontFamily: 'var(--f-display)' }}>{value}</div>
                <div className="text-xs text-fg-2 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10">
        {/* ── Sidebar nav ── */}
        <aside className="hidden lg:block w-44 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-bold text-fg-3 uppercase tracking-widest mb-3 px-3">On this page</p>
            <nav className="flex flex-col gap-0.5">
              <NavItem href="#introduction" label="Introduction" />
              <NavItem href="#tools" label="Tools" />
              <NavItem href="#auth" label="Authentication" />
              <NavItem href="#errors" label="Errors" />
            </nav>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 max-w-3xl">

          {/* ── Introduction ── */}
          <section id="introduction" className="mb-14 scroll-mt-20">
            <h2 className="text-lg font-bold text-fg-0 mb-5 pb-3 border-b border-[--line]">Introduction</h2>
            <p className="text-fg-1 text-sm leading-relaxed mb-4">
              The Toolblip API is a RESTful interface for accessing tool metadata and managing user accounts. All endpoints are served over HTTPS.
            </p>

            <h3 className="text-sm font-bold text-fg-0 mb-2">Authentication</h3>
            <p className="text-fg-1 text-sm leading-relaxed mb-3">
              All authenticated endpoints require a <strong>Bearer token</strong> in the <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-[--line]">Authorization</code> header.
            </p>
            <CodeBlock
              label="Authorization header"
              code="Authorization: Bearer YOUR_TOKEN_HERE"
            />
            <p className="text-sm text-fg-2">
              Tokens are returned on successful <strong>register</strong> or <strong>login</strong> and must be stored securely by your app.
            </p>

            <h3 className="text-sm font-bold text-fg-0 mb-2 mt-6">Response format</h3>
            <p className="text-fg-1 text-sm leading-relaxed mb-3">
              All responses are JSON. Every response carries <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-[--line]">Content-Type: application/json</code>.
            </p>
          </section>

          {/* ── Tools ── */}
          <Section id="tools" title="Tools">
            <Endpoint
              method="GET"
              path="/api/tools"
              description="Returns a paginated list of all available tools. Supports optional filters for category and full-text search."
              params={
                <ParamTable rows={[
                  { name: 'category', type: 'string', desc: 'Filter by category, e.g. text, image, mcp' },
                  { name: 'search', type: 'string', desc: 'Search against tool name and description' },
                  { name: 'page', type: 'integer', desc: 'Page number (default: 1)' },
                  { name: 'per_page', type: 'integer', desc: 'Results per page (default: 20)' },
                ]} />
              curl={`curl -X GET "${BASE_URL}/api/tools?category=text&page=1" \\
  -H "Accept: application/json"`}
              response={`{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "json-formatter",
        "name": "JSON Formatter",
        "description": "Format, validate and minify JSON data instantly.",
        "category": "text",
        "is_pro": false,
        "emoji": "🔧",
        "created_at": "2026-01-10T09:00:00Z"
      },
      {
        "id": 2,
        "slug": "image-compressor",
        "name": "Image Compressor",
        "description": "Compress PNG and JPEG images without losing quality.",
        "category": "image",
        "is_pro": true,
        "emoji": "🖼️",
        "created_at": "2026-01-12T14:30:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "total": 48,
      "per_page": 20,
      "last_page": 3
    }
  }
}`}
            />

            <Endpoint
              method="GET"
              path="/api/tools/{slug}"
              description="Fetch a single tool by its URL-safe slug. Returns full tool details including the is_pro flag."
              curl={`curl -X GET "${BASE_URL}/api/tools/json-formatter" \\
  -H "Accept: application/json"`}
              response={`{
  "data": {
    "id": 1,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format, validate and minify JSON data instantly.",
    "category": "text",
    "is_pro": false,
    "emoji": "🔧",
    "created_at": "2026-01-10T09:00:00Z"
  }
}`}
            />
          </Section>

          {/* ── Authentication ── */}
          <Section id="auth" title="Authentication">

            <Endpoint
              method="POST"
              path="/api/auth/register"
              description="Create a new user account. Returns the user object and a Bearer token for authenticated requests."
              params={
                <ParamTable rows={[
                  { name: 'name', type: 'string', desc: 'Full display name (required)' },
                  { name: 'email', type: 'string', desc: 'Valid email address (required, unique)' },
                  { name: 'password', type: 'string', desc: 'Minimum 8 characters (required)' },
                  { name: 'password_confirmation', type: 'string', desc: 'Must match password (required)' },
                ]} />
              curl={`curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "password": "secretpass123",
    "password_confirmation": "secretpass123"
  }'`}
              response={`{
  "user": {
    "id": 42,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "1|abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV"
}`}
            />

            <Endpoint
              method="POST"
              path="/api/auth/login"
              description="Authenticate an existing user with email and password. Returns the user object and a fresh Bearer token."
              params={
                <ParamTable rows={[
                  { name: 'email', type: 'string', desc: 'Registered email address (required)' },
                  { name: 'password', type: 'string', desc: 'Account password (required)' },
                ]} />
              curl={`curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "alex@example.com",
    "password": "secretpass123"
  }'`}
              response={`{
  "user": {
    "id": 42,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "2|newtokenuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456"
}`}
            />

            <Endpoint
              method="POST"
              path="/api/auth/logout"
              auth
              description="Revoke the current session token. The token passed in the Authorization header will be invalidated immediately."
              curl={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`}
              response={`{
  "message": "Session revoked successfully."
}`}
            />

            <Endpoint
              method="GET"
              path="/api/auth/user"
              auth
              description="Return the currently authenticated user based on the Bearer token. Use to verify a token or fetch fresh user data."
              curl={`curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`}
              response={`{
  "user": {
    "id": 42,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "is_pro": true
  }
}`}
            />
          </Section>

          {/* ── Errors ── */}
          <Section id="errors" title="Error Responses">
            <p className="text-fg-1 text-sm leading-relaxed mb-4">
              Failed requests return an appropriate HTTP status code and a JSON body with a <code className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded border border-[--line]">message</code> field describing the error.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[--line] text-left">
                    <th className="py-2 pr-4 font-mono text-fg-2 text-xs">Status</th>
                    <th className="py-2 font-mono text-fg-2 text-xs">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-fg-1">
                  {[
                    { s: '401', m: 'Missing or invalid token' },
                    { s: '403', m: 'Valid token but insufficient permissions' },
                    { s: '404', m: 'Resource not found' },
                    { s: '422', m: 'Validation error — check message and errors fields' },
                    { s: '429', m: 'Rate limit exceeded — slow down requests' },
                    { s: '500', m: 'Internal server error' },
                  ].map(({ s, m }) => (
                    <tr key={s} className="border-b border-[--line-2]">
                      <td className="py-2 pr-4 font-mono text-red-600 dark:text-red-400">{s}</td>
                      <td className="py-2 text-sm">{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock
              label="422 Validation error — response"
              code={`{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}`}
            />
            <CodeBlock
              label="401 Unauthorized — response"
              code={`{
  "message": "Unauthenticated."
}`}
            />
          </Section>

        </div>
      </div>
    </main>
  );
}
