'use client';
import CodeBlock from '@/components/ui/CodeBlock';

// ─── Config ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
// TODO: switch to https://api.toolblip.com once SSL is provisioned
const FUTURE_BASE_URL = 'https://api.toolblip.com';

const ENDPOINTS = [
  {
    group: 'Tools',
    id: 'tools-list',
    method: 'GET',
    path: '/api/tools',
    auth: false,
    status: 200,
    desc: 'List all tools',
  },
  {
    group: 'Tools',
    id: 'tools-detail',
    method: 'GET',
    path: '/api/tools/{slug}',
    auth: false,
    status: 200,
    desc: 'Get a single tool by slug',
  },
  {
    group: 'Auth',
    id: 'auth-register',
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    status: 201,
    desc: 'Create a new account',
  },
  {
    group: 'Auth',
    id: 'auth-login',
    method: 'POST',
    path: '/api/auth/login',
    auth: false,
    status: 200,
    desc: 'Sign in',
  },
  {
    group: 'Auth',
    id: 'auth-logout',
    method: 'POST',
    path: '/api/auth/logout',
    auth: true,
    status: 200,
    desc: 'Revoke the current session',
  },
  {
    group: 'Auth',
    id: 'auth-user',
    method: 'GET',
    path: '/api/auth/user',
    auth: true,
    status: 200,
    desc: 'Get the authenticated user',
  },
] as const;

const ERROR_CODES = [
  { code: 400, label: 'Bad Request' },
  { code: 401, label: 'Unauthorized' },
  { code: 403, label: 'Forbidden' },
  { code: 404, label: 'Not Found' },
  { code: 422, label: 'Validation Error' },
  { code: 429, label: 'Too Many Requests' },
  { code: 500, label: 'Server Error' },
] as const;

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c] text-gray-900 dark:text-gray-100">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
            REST v1
          </span>
          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Toolblip API</h1>
          <span className="ml-auto hidden sm:block text-[11px] font-mono text-gray-400 truncate max-w-[240px]">
            {BASE_URL}
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-[#0c0c0c] dark:to-[#111]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Toolblip REST API
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                Browse developer tools and manage user accounts. All responses are JSON.
                Public read endpoints require no authentication — register or sign in to get a
                Bearer token for protected routes.
              </p>
            </div>
            <div className="shrink-0">
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-3 text-center shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Base URL
                </p>
                <code className="text-sm font-mono text-green-600 dark:text-green-400 break-all">
                  {BASE_URL}
                </code>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5">
                  <span className="font-semibold">Upcoming:</span> SSL pending →{' '}
                  <InlineCode>{FUTURE_BASE_URL}</InlineCode>
                </p>
              </div>
            </div>
          </div>

          {/* Quick nav pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {ENDPOINTS.map(({ id, method, path }) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <MethodPill method={method} />
                <span className="font-mono">{path}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex gap-8 lg:gap-12">

        {/* ── Sidebar ── */}
        <aside className="w-36 xl:w-44 shrink-0 hidden md:block">
          <nav className="sticky top-20 space-y-0.5 text-sm max-h-[calc(100vh-5rem)] overflow-y-auto pb-8 pr-1">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              On this page
            </p>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'authentication', label: 'Authentication' },
              { id: 'tools', label: 'Tools' },
              { id: 'auth', label: 'Auth' },
              { id: 'errors', label: 'Errors' },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {label}
              </a>
            ))}

            <div className="pt-5 pb-1">
              <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Endpoints
              </p>
            </div>
            {ENDPOINTS.map(({ id, method, path }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <MethodPill method={method} />
                <span className="font-mono text-[11px] truncate">{path}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 space-y-14 sm:space-y-16">

          {/* ── Overview ── */}
          <section id="overview" className="scroll-mt-16">
            <SectionHeading>Overview</SectionHeading>

            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              The Toolblip API follows REST conventions. All endpoints return JSON. Read-only
              tool endpoints are public; account management endpoints require a Bearer token.
            </p>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Method</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endpoint</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Auth</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ENDPOINTS.map(({ method, path, auth, desc }) => (
                    <tr
                      key={path}
                      className="bg-white dark:bg-[#0c0c0c] hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="px-4 py-3"><MethodPill method={method} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{path}</td>
                      <td className="px-4 py-3">{auth ? <LockPill /> : <PublicPill />}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-400">
              <strong>JSON only.</strong> Every request must include{' '}
              <InlineCode>Accept: application/json</InlineCode> and{' '}
              <InlineCode>Content-Type: application/json</InlineCode> (for POST/PUT/PATCH bodies).
            </div>
          </section>

          {/* ── Authentication ── */}
          <section id="authentication" className="scroll-mt-16">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Authenticated endpoints require a Bearer token. Obtain one from{' '}
              <InlineCode>/api/auth/register</InlineCode> or{' '}
              <InlineCode>/api/auth/login</InlineCode>, then include it in the{' '}
              <InlineCode>Authorization</InlineCode> header on every protected request:
            </p>
            <CodeBlock
              code="Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"
              title="Header — all authenticated requests"
            />
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
              <strong>Keep your token secret.</strong> Never expose it in client-side code or
              public repositories. Tokens are revoked when you log out.
            </div>
          </section>

          {/* ── Tools ── */}
          <section id="tools" className="scroll-mt-16">
            <SectionHeading>Tools</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              All tools endpoints are public — no authentication required.
            </p>

            <div className="space-y-8 sm:space-y-10">

              <EndpointCard
                id="tools-list"
                method="GET"
                path="/api/tools"
                auth={false}
                status={200}
                description="Returns a list of all tools in the registry. The tools array is nested inside a &quot;tools&quot; key."
                response={`{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "claude-code",
        "name": "Claude Code",
        "description": "AI coding assistant by Anthropic",
        "category": "AI",
        "is_pro": false,
        "emoji": "🤖",
        "created_at": "2026-01-01T00:00:00Z"
      },
      {
        "id": 2,
        "slug": "cursor",
        "name": "Cursor",
        "description": "AI-first code editor built around pair programming",
        "category": "AI",
        "is_pro": true,
        "emoji": "💻",
        "created_at": "2026-01-15T00:00:00Z"
      }
    ]
  }
}`}
                curl={`curl -X GET "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`}
              />

              <EndpointCard
                id="tools-detail"
                method="GET"
                path="/api/tools/{slug}"
                auth={false}
                status={200}
                description="Fetch a single tool by its slug identifier. Returns 404 if the tool does not exist."
                response={`{
  "tool": {
    "id": 1,
    "slug": "claude-code",
    "name": "Claude Code",
    "description": "AI coding assistant by Anthropic",
    "category": "AI",
    "is_pro": false,
    "emoji": "🤖",
    "created_at": "2026-01-01T00:00:00Z"
  }
}`}
                errorResponse={`{
  "message": "Tool not found"
}`}
                curl={`curl -X GET "${BASE_URL}/api/tools/claude-code" \\
  -H "Accept: application/json"`}
              />

            </div>
          </section>

          {/* ── Auth ── */}
          <section id="auth" className="scroll-mt-16">
            <SectionHeading>Auth</SectionHeading>

            <div className="space-y-8 sm:space-y-10">

              <EndpointCard
                id="auth-register"
                method="POST"
                path="/api/auth/register"
                auth={false}
                status={201}
                description="Create a new user account. Returns the user object and a Bearer token for use in authenticated requests."
                body={`{
  "name": "Harun",
  "email": "harun@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}`}
                response={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "tb_live_xxxxxxxxxxxxxxxx"
}`}
                errorResponse={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}`}
                curl={`curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Harun",
    "email": "harun@example.com",
    "password": "secret123",
    "password_confirmation": "secret123"
  }'`}
              />

              <EndpointCard
                id="auth-login"
                method="POST"
                path="/api/auth/login"
                auth={false}
                status={200}
                description="Sign in with existing credentials. Returns the user object and a Bearer token."
                body={`{
  "email": "harun@example.com",
  "password": "secret123"
}`}
                response={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "tb_live_xxxxxxxxxxxxxxxx"
}`}
                errorResponse={`{
  "message": "Invalid credentials"
}`}
                curl={`curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"harun@example.com","password":"secret123"}'`}
              />

              <EndpointCard
                id="auth-logout"
                method="POST"
                path="/api/auth/logout"
                auth={true}
                status={200}
                description="Revoke the current Bearer token and end the session. The token can no longer be used after this call."
                response={`{
  "message": "Logged out successfully"
}`}
                curl={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
              />

              <EndpointCard
                id="auth-user"
                method="GET"
                path="/api/auth/user"
                auth={true}
                status={200}
                description="Retrieve the currently authenticated user profile."
                response={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  }
}`}
                curl={`curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
              />

            </div>
          </section>

          {/* ── Errors ── */}
          <section id="errors" className="scroll-mt-16">
            <SectionHeading>Errors</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              All errors return a JSON body with a <InlineCode>message</InlineCode> field.
              Validation failures (422) also include an <InlineCode>errors</InlineCode> object
              mapping field names to arrays of error strings.
            </p>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-4">
              <div className="bg-gray-50 dark:bg-gray-900 px-5 py-2.5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  422 Validation Error
                </span>
              </div>
              <CodeBlock
                code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ERROR_CODES.map(({ code, label }) => (
                <div
                  key={code}
                  className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2"
                >
                  <span className="font-mono font-bold text-sm text-gray-700 dark:text-gray-300">
                    {code}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-xs">
              Questions?{' '}
              <a
                href="mailto:harun@toolblip.com"
                className="text-green-600 dark:text-green-400 hover:underline transition-colors"
              >
                harun@toolblip.com
              </a>
              <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
              <a
                href="https://github.com/toolblip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline transition-colors"
              >
                GitHub
              </a>
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ─── Method colors ───────────────────────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  POST:   'bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-400',
  PUT:    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  DELETE: 'bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-400',
  PATCH:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

// ─── Components ─────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2.5">
      <span className="w-1 h-6 bg-green-500 rounded-full shrink-0 mt-0.5" />
      {children}
    </h2>
  );
}

function MethodPill({ method }: { method: string }) {
  return (
    <span className={`${METHOD_COLORS[method] ?? ''} text-[11px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0`}>
      {method}
    </span>
  );
}

function LockPill() {
  return (
    <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full font-medium">
      🔒 auth
    </span>
  );
}

function PublicPill() {
  return (
    <span className="text-[11px] text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full">
      public
    </span>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

// ─── Endpoint Card ─────────────────────────────────────────────────────────

interface EndpointCardProps {
  id: string;
  method: string;
  path: string;
  auth: boolean;
  status: number;
  description: string;
  query?: string;
  body?: string;
  response: string;
  errorResponse?: string;
  curl: string;
}

function EndpointCard({
  id, method, path, auth, status, description, query, body, response, errorResponse, curl,
}: EndpointCardProps) {
  return (
    <div
      id={id}
      className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden scroll-mt-20"
    >
      {/* Header bar */}
      <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <MethodPill method={method} />
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{path}</code>
        {auth && <LockPill />}
        <span className="ml-auto text-[11px] font-mono text-gray-400 dark:text-gray-500">
          → {status}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>

        {/* Query params */}
        {query && (
          <div>
            <div className="mb-2 px-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Query parameters
              </p>
            </div>
            <CodeBlock code={`category  string  Filter by category (e.g. AI, DevOps, Analytics)\npage      number  Page number for pagination`} />
          </div>
        )}

        {/* Request body + Response */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {body ? (
            <div>
              <div className="mb-2 px-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Request body
                </p>
              </div>
              <CodeBlock code={body} />
            </div>
          ) : auth ? (
            <div>
              <div className="mb-2 px-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Headers
                </p>
              </div>
              <CodeBlock code="Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx" />
            </div>
          ) : null}

          <div>
            <div className="mb-2 px-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Response — {status}
              </p>
            </div>
            <CodeBlock code={response} />
          </div>
        </div>

        {/* Error response */}
        {errorResponse && (
          <div>
            <div className="mb-2 px-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Error — 422 / 404 / 401
              </p>
            </div>
            <CodeBlock code={errorResponse} />
          </div>
        )}

        {/* curl */}
        <div>
          <div className="mb-2 px-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">curl</p>
          </div>
          <CodeBlock code={curl} />
        </div>

      </div>
    </div>
  );
}
