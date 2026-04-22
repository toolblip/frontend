'use client';

import CodeBlock from '@/components/ui/CodeBlock';

// ─── Config ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.toolblip.com';
const FALLBACK_URL = 'https://toolblip-api-production.up.railway.app';

const ENDPOINTS = [
  { id: 'tools-list',    method: 'GET',    path: '/api/tools',           auth: false, status: 200, desc: 'List all tools' },
  { id: 'tools-detail',  method: 'GET',    path: '/api/tools/{slug}',    auth: false, status: 200, desc: 'Get a single tool by slug' },
  { id: 'auth-register', method: 'POST',   path: '/api/auth/register',   auth: false, status: 201, desc: 'Create a new account' },
  { id: 'auth-login',    method: 'POST',   path: '/api/auth/login',      auth: false, status: 200, desc: 'Sign in to your account' },
  { id: 'auth-logout',   method: 'POST',   path: '/api/auth/logout',     auth: true,  status: 200, desc: 'Revoke the current session' },
  { id: 'auth-user',     method: 'GET',    path: '/api/auth/user',       auth: true,  status: 200, desc: 'Get the authenticated user' },
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

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#090909] text-gray-900 dark:text-gray-100">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#090909]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
            REST v1
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Toolblip API</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block text-[11px] font-mono text-gray-400">{BASE_URL}</span>
            <span className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="border-b border-gray-100 dark:border-gray-800/60 bg-gray-50 dark:bg-[#090909]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">

            {/* Intro */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                Toolblip REST API
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-6">
                Browse developer tools and manage user accounts programmatically. All responses are JSON.
                Authenticate with a Bearer token to access protected endpoints.
              </p>

              {/* Endpoint pills */}
              <div className="flex flex-wrap gap-2">
                {ENDPOINTS.map(({ id, method, path }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <MethodPill method={method} />
                    <span className="font-mono">{path}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Base URL card */}
            <div className="shrink-0 lg:w-72">
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Base URL</p>
                <code className="block text-sm font-mono text-green-600 dark:text-green-400 break-all">{BASE_URL}</code>
                <p className="text-[10px] text-green-500 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Production — SSL active
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fallback</p>
                  <code className="block text-[11px] font-mono text-gray-400 break-all">{FALLBACK_URL}</code>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex gap-10 lg:gap-12">

        {/* Sidebar */}
        <aside className="w-36 xl:w-44 shrink-0 hidden md:block">
          <nav className="sticky top-20 space-y-0.5 text-sm max-h-[calc(100vh-5rem)] overflow-y-auto pb-8 pr-1">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">On this page</p>
            {[
              { id: 'quick-start',   label: 'Quick Start' },
              { id: 'auth',          label: 'Authentication' },
              { id: 'tools-list',    label: 'GET /api/tools' },
              { id: 'tools-detail',  label: 'GET /api/tools/{slug}' },
              { id: 'auth-register', label: 'POST /api/auth/register' },
              { id: 'auth-login',    label: 'POST /api/auth/login' },
              { id: 'auth-logout',   label: 'POST /api/auth/logout' },
              { id: 'auth-user',     label: 'GET /api/auth/user' },
              { id: 'errors',        label: 'Error Codes' },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-14 sm:space-y-16">

          {/* ── Quick Start ── */}
          <section id="quick-start" className="scroll-mt-16">
            <SectionHeading>Quick Start</SectionHeading>

            {/* Auth + format note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Authentication</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Pass your Bearer token in the <InlineCode>Authorization</InlineCode> header for protected routes.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Format</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  All responses are JSON. Include <InlineCode>Accept: application/json</InlineCode> on every request.
                </p>
              </div>
            </div>

            {/* Rate limit callout */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-6">
              <strong>Rate limiting:</strong> Avoid hammering the API. If you hit 429, back off and retry after the indicated delay.
            </div>

            {/* Endpoint table */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
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
                    <tr key={path} className="bg-white dark:bg-[#090909] hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                      <td className="px-4 py-3"><MethodPill method={method} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{path}</td>
                      <td className="px-4 py-3">{auth ? <LockPill /> : <PublicPill />}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Authentication ── */}
          <section id="auth" className="scroll-mt-16">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Protected endpoints require a Bearer token. Obtain one from{' '}
              <InlineCode>/api/auth/register</InlineCode> or{' '}
              <InlineCode>/api/auth/login</InlineCode>, then include it in the{' '}
              <InlineCode>Authorization</InlineCode> header:
            </p>
            <CodeBlock
              code="Authorization: Bearer 1|vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              title="Header — all authenticated requests"
            />
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>Keep your token secret.</strong> Never expose it in client-side code or public repositories.
              Store it securely — tokens are revoked on logout.
            </div>
          </section>

          {/* ── Tools ── */}
          <div className="space-y-14 sm:space-y-16">

            {/* GET /api/tools */}
            <section id="tools-list" className="scroll-mt-16">
              <EndpointHeader method="GET" path="/api/tools" auth={false} status={200} />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Returns a paginated list of all tools. Public — no authentication required.
              </p>

              <CodeBlock
                code={`curl "${BASE_URL}/api/tools?category=AI&page=1" \\
  -H "Accept: application/json"`}
                title="Request — curl"
              />

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Query parameters</p>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-28">Param</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-20">Type</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {[
                        { name: 'category', type: 'string',  desc: 'Filter by category (e.g. AI, DevOps, Analytics)' },
                        { name: 'page',      type: 'number',  desc: 'Page number (default: 1)' },
                        { name: 'per_page',  type: 'number',  desc: 'Results per page (default: 20)' },
                      ].map(({ name, type, desc }) => (
                        <tr key={name} className="bg-white dark:bg-[#090909]">
                          <td className="px-4 py-2.5 font-mono text-gray-700 dark:text-gray-300">{name}</td>
                          <td className="px-4 py-2.5 text-gray-400 dark:text-gray-500">{type}</td>
                          <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Response — 200</p>
                <CodeBlock
                  code={`{
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
        "created_at": "2026-01-01T00:00:00Z",
        "updated_at": "2026-01-01T00:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 20,
      "total": 42,
      "last_page": 3
    }
  }
}`}
                />
              </div>
            </section>

            {/* GET /api/tools/{slug} */}
            <section id="tools-detail" className="scroll-mt-16">
              <EndpointHeader method="GET" path="/api/tools/{slug}" auth={false} status={200} />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Fetch a single tool by its slug. Returns 404 if not found.
              </p>

              <CodeBlock
                code={`curl "${BASE_URL}/api/tools/claude-code" \\
  -H "Accept: application/json"`}
                title="Request — curl"
              />

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Path parameters</p>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-28">Param</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-[#090909]">
                        <td className="px-4 py-2.5 font-mono text-gray-700 dark:text-gray-300">slug</td>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">The unique slug identifier of the tool</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Response — 200</p>
                <CodeBlock
                  code={`{
  "tool": {
    "id": 1,
    "slug": "claude-code",
    "name": "Claude Code",
    "description": "AI coding assistant by Anthropic",
    "category": "AI",
    "is_pro": false,
    "emoji": "🤖",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
}`}
                />
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Error — 404</p>
                <CodeBlock
                  code={`{
  "message": "Tool not found"
}`}
                />
              </div>
            </section>

          </div>

          {/* ── Auth Endpoints ── */}
          <div className="space-y-14 sm:space-y-16">

            {/* POST /api/auth/register */}
            <section id="auth-register" className="scroll-mt-16">
              <EndpointHeader method="POST" path="/api/auth/register" auth={false} status={201} />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Create a new user account. Returns the user object and a Bearer token.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Request body</p>
                  <CodeBlock
                    code={`{
  "name": "Harun",
  "email": "harun@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Response — 201</p>
                  <CodeBlock
                    code={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "1|vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Request — curl</p>
                <CodeBlock
                  code={`curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Harun",
    "email": "harun@example.com",
    "password": "secret123",
    "password_confirmation": "secret123"
  }'`}
                />
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Error — 422</p>
                <CodeBlock
                  code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}`}
                />
              </div>
            </section>

            {/* POST /api/auth/login */}
            <section id="auth-login" className="scroll-mt-16">
              <EndpointHeader method="POST" path="/api/auth/login" auth={false} status={200} />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Sign in with existing credentials. Returns the user object and a Bearer token.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Request body</p>
                  <CodeBlock
                    code={`{
  "email": "harun@example.com",
  "password": "secret123"
}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Response — 200</p>
                  <CodeBlock
                    code={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "1|vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Request — curl</p>
                <CodeBlock
                  code={`curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"harun@example.com","password":"secret123"}'`}
                />
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Error — 401</p>
                <CodeBlock
                  code={`{
  "message": "Invalid credentials"
}`}
                />
              </div>
            </section>

            {/* POST /api/auth/logout */}
            <section id="auth-logout" className="scroll-mt-16">
              <EndpointHeader method="POST" path="/api/auth/logout" auth={true} status={200} />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Revoke the current Bearer token and end the session.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Headers</p>
                  <CodeBlock
                    code="Authorization: Bearer 1|vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Response — 200</p>
                  <CodeBlock
                    code={`{
  "message": "Logged out successfully"
}`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Request — curl</p>
                <CodeBlock
                  code={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer 1|vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"`}
                />
              </div>
            </section>

            {/* GET /api/auth/user */}
            <section id="auth-user" className="scroll-mt-16">
              <EndpointHeader method="GET" path="/api/auth/user" auth={true} status={200} />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Retrieve the currently authenticated user profile.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Headers</p>
                  <CodeBlock
                    code="Authorization: Bearer 1|vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Response — 200</p>
                  <CodeBlock
                    code={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  }
}`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Request — curl</p>
                <CodeBlock
                  code={`curl "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer 1|vXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"`}
                />
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Error — 401</p>
                <CodeBlock
                  code={`{
  "message": "Unauthenticated."
}`}
                />
              </div>
            </section>

          </div>

          {/* ── Errors ── */}
          <section id="errors" className="scroll-mt-16">
            <SectionHeading>Error Codes</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              All errors return a JSON body with a <InlineCode>message</InlineCode> field.
              Validation failures (422) include an <InlineCode>errors</InlineCode> object.
            </p>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-5">
              <div className="bg-gray-50 dark:bg-[#111] px-5 py-2.5 border-b border-gray-200 dark:border-gray-800">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Example — 422 Validation Error
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
                  className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2"
                >
                  <span className="font-mono font-bold text-sm text-gray-700 dark:text-gray-300">{code}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="pt-8 border-t border-gray-100 dark:border-gray-800/60 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-xs">
              Questions?{' '}
              <a href="mailto:harun@toolblip.com" className="text-green-600 dark:text-green-400 hover:underline transition-colors">
                harun@toolblip.com
              </a>
              <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
              <a href="https://github.com/toolblip" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline transition-colors">
                GitHub
              </a>
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  POST:   'bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-400',
  PUT:    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  DELETE: 'bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-400',
  PATCH:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2.5">
      <span className="w-1 h-6 bg-green-500 rounded-full shrink-0 mt-0.5" />
      {children}
    </h2>
  );
}

function EndpointHeader({ method, path, auth, status }: { method: string; path: string; auth: boolean; status: number }) {
  return (
    <div className="flex items-center gap-3 mb-3 flex-wrap">
      <MethodPill method={method} />
      <code className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">{path}</code>
      {auth ? <LockPill /> : <PublicPill />}
      <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">→ {status}</span>
    </div>
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
