import type { Metadata } from 'next';
import CodeBlock from '@/components/ui/CodeBlock';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description:
    'Toolblip REST API — free endpoints for browsing developer tools, MCP server registry, and user authentication.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API — free endpoints for browsing developer tools, MCP server registry, and user authentication.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'API Documentation | Toolblip', description: 'Toolblip REST API — free endpoints for browsing developer tools, MCP server registry, and user authentication.' },
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Topbar */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
            REST API v1
          </span>
          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Toolblip API Reference</h1>
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-600 font-mono">
            api.toolblip.com
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-12">

        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <nav className="sticky top-24 space-y-1 text-sm">
            {[
              { id: 'overview',    label: 'Overview' },
              { id: 'auth',        label: 'Authentication' },
              { id: 'tools',       label: 'Tools' },
              { id: 'errors',      label: 'Errors' },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="block px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {label}
              </a>
            ))}

            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wider">Endpoints</p>
            </div>
            {ENDPOINTS.map(({ method, path }) => (
              <a
                key={path}
                href={`#${path.replace(/\//g, '-').replace(/:/g, '')}`}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <MethodPill method={method} />
                <span className="font-mono text-xs truncate">{path}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* ── Overview ── */}
          <section id="overview">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              The Toolblip API is a free REST API for browsing developer tools and managing user authentication.
              All endpoints return JSON. No API key is required — register an account to get a Bearer token
              for protected endpoints.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Base URL (live)</p>
                <code className="text-sm font-mono text-green-600 dark:text-green-400 break-all">
                  https://toolblip-api-production.up.railway.app
                </code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Swift URL <span className="text-gray-400 italic font-normal normal-case">(coming soon)</span></p>
                <code className="text-sm font-mono text-gray-400 dark:text-gray-600 break-all line-through">
                  https://api.toolblip.com
                </code>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">Method</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Endpoint</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Auth</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ENDPOINTS.map(({ method, path, auth, desc }) => (
                    <tr key={path} className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
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
          <section id="auth">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
              Protected endpoints require a Bearer token obtained from{' '}
              <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/api/auth/register</code>{' '}
              or{' '}
              <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/api/auth/login</code>.
              Pass it as an <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">Authorization</code> header
              on every authenticated request.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 font-mono text-xs text-blue-800 dark:text-blue-300 overflow-x-auto">
              Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx
            </div>
          </section>

          {/* ── Auth Endpoints ── */}
          <section>
            <SectionHeading>Auth Endpoints</SectionHeading>
            <div className="space-y-8">

              <EndpointCard
                id="api-auth-register"
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
                response={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "tb_live_xxxxxxxxxxxxxxxx"
}`}
                curl={`curl -X POST https://toolblip-api-production.up.railway.app/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Harun","email":"harun@example.com","password":"secret123","password_confirmation":"secret123"}'`}
              />

              <EndpointCard
                id="api-auth-login"
                method="POST"
                path="/api/auth/login"
                auth={false}
                status={200}
                description="Sign in with email and password. Returns the user object and a Bearer token."
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
                curl={`curl -X POST https://toolblip-api-production.up.railway.app/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"harun@example.com","password":"secret123"}'`}
              />

              <EndpointCard
                id="api-auth-logout"
                method="POST"
                path="/api/auth/logout"
                auth={true}
                status={200}
                description="Revoke the current Bearer token, ending the session."
                response={`{
  "message": "Logged out successfully"
}`}
                curl={`curl -X POST https://toolblip-api-production.up.railway.app/api/auth/logout \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
              />

              <EndpointCard
                id="api-auth-user"
                method="GET"
                path="/api/auth/user"
                auth={true}
                status={200}
                description="Retrieve the currently authenticated user."
                response={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  }
}`}
                curl={`curl -X GET https://toolblip-api-production.up.railway.app/api/auth/user \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
              />

            </div>
          </section>

          {/* ── Tools Endpoints ── */}
          <section id="tools">
            <SectionHeading>Tools Endpoints</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              All tools endpoints are public — no authentication required.
            </p>
            <div className="space-y-8">

              <EndpointCard
                id="api-tools"
                method="GET"
                path="/api/tools"
                auth={false}
                status={200}
                description="Returns a list of all tools in the registry."
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
                curl={`curl -X GET https://toolblip-api-production.up.railway.app/api/tools`}
              />

              <EndpointCard
                id="api-tools-slug"
                method="GET"
                path="/api/tools/:slug"
                auth={false}
                status={200}
                description="Fetch a single tool by its slug. Returns 404 if not found."
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
                curl={`curl -X GET https://toolblip-api-production.up.railway.app/api/tools/claude-code`}
              />

            </div>
          </section>

          {/* ── Errors ── */}
          <section id="errors">
            <SectionHeading>Error Responses</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              All errors return a JSON body with a <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">message</code> field,
              and optionally an <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">errors</code> object for validation failures.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <CodeBlock code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}`} />
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ERROR_CODES.map(({ code, label, color }) => (
                  <div key={code} className="flex items-center gap-2.5">
                    <span className={`font-mono font-bold text-sm ${color}`}>{code}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Rate Limits ── */}
          <section>
            <SectionHeading>Rate Limits</SectionHeading>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex gap-4 items-start">
              <span className="text-amber-500 mt-0.5 shrink-0 text-lg">⚡</span>
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">60 requests / minute</p>
                <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                  Authenticated endpoints. Public read endpoints are more generous.
                  When limited, you receive a <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">429 Too Many Requests</code> — back off and retry.
                </p>
              </div>
            </div>
          </section>

          <footer className="pt-8 border-t border-gray-100 dark:border-gray-900 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-xs">
              Questions? <a href="mailto:harun@toolblip.com" className="text-green-600 dark:text-green-400 hover:text-green-700">harun@toolblip.com</a>
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────

const ENDPOINTS = [
  { method: 'GET',  path: '/api/tools',          auth: false, desc: 'List all tools'   },
  { method: 'GET',  path: '/api/tools/:slug',    auth: false, desc: 'Get a tool'       },
  { method: 'POST', path: '/api/auth/register',  auth: false, desc: 'Create account'   },
  { method: 'POST', path: '/api/auth/login',     auth: false, desc: 'Sign in'          },
  { method: 'POST', path: '/api/auth/logout',    auth: true,  desc: 'Revoke session'   },
  { method: 'GET',  path: '/api/auth/user',      auth: true,  desc: 'Current user'     },
] as const;

const ERROR_CODES = [
  { code: 400, label: 'Bad Request',         color: 'text-red-500'     },
  { code: 401, label: 'Unauthorized',         color: 'text-red-500'     },
  { code: 403, label: 'Forbidden',            color: 'text-amber-500'   },
  { code: 404, label: 'Not Found',            color: 'text-gray-500'    },
  { code: 422, label: 'Validation Error',     color: 'text-yellow-600'  },
  { code: 429, label: 'Too Many Requests',    color: 'text-amber-500'   },
  { code: 500, label: 'Server Error',         color: 'text-red-600'     },
];

// ─── Components ─────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
      <span className="w-1 h-6 bg-green-500 rounded-full shrink-0 mt-0.5" />
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
    <span className={`${METHOD_COLORS[method] ?? ''} text-xs font-mono font-bold px-1.5 py-0.5 rounded shrink-0`}>
      {method}
    </span>
  );
}

function LockPill() {
  return (
    <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full font-medium">
      🔒 auth
    </span>
  );
}

function PublicPill() {
  return (
    <span className="text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full">
      public
    </span>
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
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {body ? (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-3">Request body</p>
              <CodeBlock code={body} />
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-3">Headers</p>
              <CodeBlock code="Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx" />
            </div>
          )}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-3">Response</p>
            <CodeBlock code={response} />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-3">curl</p>
          <CodeBlock code={curl} />
        </div>
      </div>
    </div>
  );
}
