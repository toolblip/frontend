import type { Metadata } from 'next';
import CodeBlock from '@/components/ui/CodeBlock';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description:
    'Toolblip REST API — free endpoints for browsing developer tools and user authentication.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API — free endpoints for browsing developer tools and user authentication.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API — free endpoints for browsing developer tools and user authentication.',
  },
};

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const CLEAN_URL = 'https://api.toolblip.com';

const ENDPOINTS = [
  { id: 'tools-list',    method: 'GET',  path: '/api/tools',          auth: false, desc: 'List all tools' },
  { id: 'tools-detail',  method: 'GET',  path: '/api/tools/{slug}',   auth: false, desc: 'Get a single tool' },
  { id: 'auth-register', method: 'POST', path: '/api/auth/register',  auth: false, desc: 'Create account' },
  { id: 'auth-login',    method: 'POST', path: '/api/auth/login',     auth: false, desc: 'Sign in' },
  { id: 'auth-logout',   method: 'POST', path: '/api/auth/logout',    auth: true,  desc: 'Revoke session' },
  { id: 'auth-user',     method: 'GET',  path: '/api/auth/user',     auth: true,  desc: 'Current authenticated user' },
] as const;

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c] text-gray-900 dark:text-gray-100">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
            REST API v1
          </span>
          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Toolblip API Reference</h1>
          <span className="ml-auto hidden sm:block text-xs font-mono text-green-600 dark:text-green-400 font-semibold">
            {BASE_URL}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 flex gap-16">

        {/* ── Sidebar ── */}
        <aside className="w-44 shrink-0 hidden md:block">
          <nav className="sticky top-28 space-y-0.5 text-sm">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">On this page</p>
            {[
              { id: 'overview',       label: 'Overview' },
              { id: 'authentication', label: 'Authentication' },
              { id: 'tools',          label: 'Tools' },
              { id: 'auth',           label: 'Auth' },
              { id: 'errors',         label: 'Errors' },
              { id: 'rate-limits',    label: 'Rate Limits' },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {label}
              </a>
            ))}

            <div className="pt-6 pb-2">
              <p className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Endpoints</p>
            </div>
            {ENDPOINTS.map(({ id, method, path }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <MethodPill method={method} />
                <span className="font-mono text-xs truncate">{path}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 space-y-20">

          {/* ── Overview ── */}
          <section id="overview" className="scroll-mt-20">
            <SectionHeading>Overview</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              The Toolblip API is a free REST API for browsing developer tools and managing user accounts.
              All endpoints return JSON. Public read endpoints require no authentication —
              register an account to get a Bearer token for protected routes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest mb-2">Base URL (active)</p>
                <code className="text-sm font-mono text-green-700 dark:text-green-400 break-all leading-relaxed">
                  {BASE_URL}
                </code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">
                  Clean domain <span className="text-gray-400 italic font-normal normal-case ml-1">(SSL pending)</span>
                </p>
                <code className="text-sm font-mono text-gray-500 dark:text-gray-500 break-all leading-relaxed">
                  {CLEAN_URL}
                </code>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Method</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endpoint</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Auth</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ENDPOINTS.map(({ id, method, path, auth, desc }) => (
                    <tr key={id} className="bg-white dark:bg-[#0c0c0c] hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
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
          <section id="authentication" className="scroll-mt-20">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
              Protected endpoints require a Bearer token obtained from{' '}
              <InlineCode>/api/auth/register</InlineCode> or{' '}
              <InlineCode>/api/auth/login</InlineCode>.
              Pass it in the <InlineCode>Authorization</InlineCode> header on every authenticated request.
            </p>
            <CodeBlock
              code={`Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx`}
              title="Header — all authenticated requests"
            />
          </section>

          {/* ── Tools ── */}
          <section id="tools" className="scroll-mt-20">
            <SectionHeading>Tools</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              All tools endpoints are public — no authentication required.
            </p>

            <div className="space-y-12">

              {/* GET /api/tools */}
              <EndpointCard
                id="tools-list"
                method="GET"
                path="/api/tools"
                auth={false}
                status={200}
                description="Returns a paginated list of all tools in the registry. Supports optional query params: category, page."
                response={`// 200 OK
{
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
                curl={`curl -X GET "${BASE_URL}/api/tools"`}
              />

              {/* GET /api/tools/{slug} */}
              <EndpointCard
                id="tools-detail"
                method="GET"
                path="/api/tools/{slug}"
                auth={false}
                status={200}
                description="Fetch a single tool by its slug (e.g. claude-code). Returns 404 if not found."
                response={`// 200 OK
{
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
                curl={`curl -X GET "${BASE_URL}/api/tools/claude-code"`}
              />

            </div>
          </section>

          {/* ── Auth Endpoints ── */}
          <section id="auth" className="scroll-mt-20">
            <SectionHeading>Auth</SectionHeading>

            <div className="space-y-12">

              {/* POST /api/auth/register */}
              <EndpointCard
                id="auth-register"
                method="POST"
                path="/api/auth/register"
                auth={false}
                status={201}
                description="Create a new user account. Returns the user object and a Bearer token."
                body={`{
  "name": "Harun",
  "email": "harun@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}`}
                response={`// 201 Created
{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "tb_live_xxxxxxxxxxxxxxxx"
}`}
                curl={`curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Harun","email":"harun@example.com","password":"secret123","password_confirmation":"secret123"}'`}
              />

              {/* POST /api/auth/login */}
              <EndpointCard
                id="auth-login"
                method="POST"
                path="/api/auth/login"
                auth={false}
                status={200}
                description="Sign in with email and password. Returns the user object and a Bearer token."
                body={`{
  "email": "harun@example.com",
  "password": "secret123"
}`}
                response={`// 200 OK
{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "tb_live_xxxxxxxxxxxxxxxx"
}`}
                curl={`curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"harun@example.com","password":"secret123"}'`}
              />

              {/* POST /api/auth/logout */}
              <EndpointCard
                id="auth-logout"
                method="POST"
                path="/api/auth/logout"
                auth={true}
                status={200}
                description="Revoke the current Bearer token and end the session."
                response={`// 200 OK
{
  "message": "Logged out successfully"
}`}
                curl={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
              />

              {/* GET /api/auth/user */}
              <EndpointCard
                id="auth-user"
                method="GET"
                path="/api/auth/user"
                auth={true}
                status={200}
                description="Retrieve the currently authenticated user."
                response={`// 200 OK
{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  }
}`}
                curl={`curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
              />

            </div>
          </section>

          {/* ── Errors ── */}
          <section id="errors" className="scroll-mt-20">
            <SectionHeading>Error Responses</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              All errors return a JSON body with a <InlineCode>message</InlineCode> field,
              and optionally an <InlineCode>errors</InlineCode> object for validation failures.
            </p>
            <CodeBlock
              code={`// 422 Unprocessable Entity
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}`}
              title="Validation error"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {ERROR_CODES.map(({ code, label, color }) => (
                <div key={code} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
                  <span className={`font-mono font-bold text-sm ${color}`}>{code}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Rate Limits ── */}
          <section id="rate-limits" className="scroll-mt-20">
            <SectionHeading>Rate Limits</SectionHeading>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 flex gap-5 items-start">
              <span className="text-green-500 shrink-0 text-xl mt-0.5">⚡</span>
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
                  60 requests / minute
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                  Authenticated endpoints. Public read endpoints have more generous limits.
                  When limited, the API returns{' '}
                  <InlineCode>429 Too Many Requests</InlineCode> — back off and retry.
                </p>
              </div>
            </div>
          </section>

          <footer className="pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-xs">
              Questions?{' '}
              <a href="mailto:harun@toolblip.com" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
                harun@toolblip.com
              </a>
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────

const ERROR_CODES = [
  { code: 400, label: 'Bad Request',        color: 'text-red-500'    },
  { code: 401, label: 'Unauthorized',       color: 'text-red-500'    },
  { code: 403, label: 'Forbidden',          color: 'text-amber-500'  },
  { code: 404, label: 'Not Found',          color: 'text-gray-500'   },
  { code: 422, label: 'Validation Error',   color: 'text-yellow-600' },
  { code: 429, label: 'Too Many Requests',   color: 'text-amber-500'  },
  { code: 500, label: 'Server Error',       color: 'text-red-600'    },
];

// ─── Components ─────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
      <span className="w-1 h-7 bg-green-500 rounded-full shrink-0 mt-0.5" />
      {children}
    </h2>
  );
}

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  POST:   'bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-400',
  PUT:    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  DELETE: 'bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-400',
};

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

interface EndpointCardProps {
  id: string;
  method: string;
  path: string;
  auth: boolean;
  status: number;
  description: string;
  body?: string;
  response: string;
  curl: string;
}

function EndpointCard({ id, method, path, auth, status, description, body, response, curl }: EndpointCardProps) {
  return (
    <div id={id} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden scroll-mt-24">
      {/* Header bar */}
      <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <MethodPill method={method} />
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{path}</code>
        {auth && <LockPill />}
        <span className="ml-auto text-xs font-mono text-gray-400 dark:text-gray-500">
          → {status}
        </span>
      </div>

      <div className="p-5 space-y-4">

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>

        {/* Body + Response */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {body ? (
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest font-bold mb-2 px-1">Request body</p>
              <CodeBlock code={body} />
            </div>
          ) : auth ? (
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest font-bold mb-2 px-1">Headers</p>
              <CodeBlock code="Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx" />
            </div>
          ) : null}
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest font-bold mb-2 px-1">Response</p>
            <CodeBlock code={response} />
          </div>
        </div>

        {/* curl */}
        <div>
          <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest font-bold mb-2 px-1">curl</p>
          <CodeBlock code={curl} />
        </div>

      </div>
    </div>
  );
}
