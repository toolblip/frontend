'use client';
import { useState } from 'react';
import CodeBlock from '@/components/ui/CodeBlock';

// ─── Config ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const SSL_URL = 'api.toolblip.com';

const ENDPOINTS = [
  { id: 'tools-list',    method: 'GET',    path: '/api/tools',         auth: false, status: 200, desc: 'List all tools'                     },
  { id: 'tools-detail',  method: 'GET',    path: '/api/tools/{slug}',   auth: false, status: 200, desc: 'Get a single tool by slug'           },
  { id: 'auth-register', method: 'POST',   path: '/api/auth/register',  auth: false, status: 201, desc: 'Create a new account'                },
  { id: 'auth-login',    method: 'POST',   path: '/api/auth/login',     auth: false, status: 200, desc: 'Sign in'                            },
  { id: 'auth-logout',   method: 'POST',   path: '/api/auth/logout',    auth: true,  status: 200, desc: 'Revoke the current session'         },
  { id: 'auth-user',     method: 'GET',    path: '/api/auth/user',      auth: true,  status: 200, desc: 'Get the authenticated user'          },
] as const;

const ERROR_CODES = [
  { code: 400, label: 'Bad Request'       },
  { code: 401, label: 'Unauthorized'      },
  { code: 403, label: 'Forbidden'         },
  { code: 404, label: 'Not Found'        },
  { code: 422, label: 'Validation Error'  },
  { code: 429, label: 'Too Many Requests' },
  { code: 500, label: 'Server Error'      },
] as const;

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c] text-gray-900 dark:text-gray-100">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
            REST v1
          </span>
          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Toolblip API</h1>
          <span className="ml-auto hidden sm:block text-xs font-mono text-gray-400 font-medium">{BASE_URL}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-16">

        {/* ── Sidebar ── */}
        <aside className="w-44 shrink-0 hidden md:block">
          <nav className="sticky top-24 space-y-0.5 text-sm">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contents</p>
            {[
              { id: 'overview',       label: 'Overview'       },
              { id: 'authentication', label: 'Authentication' },
              { id: 'tools',          label: 'Tools'          },
              { id: 'auth',           label: 'Auth'           },
              { id: 'errors',         label: 'Errors'         },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs ${
                  activeSection === id
                    ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                {label}
              </a>
            ))}

            <div className="pt-5 pb-1">
              <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Endpoints</p>
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
        <main className="flex-1 min-w-0 space-y-16">

          {/* ── Overview ── */}
          <section id="overview" className="scroll-mt-16">
            <SectionHeading>Overview</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Toolblip is a free REST API for browsing developer tools and managing user accounts. All responses are JSON. Public read endpoints require no auth — register or sign in to get a Bearer token for protected routes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <p className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest mb-2">Base URL (production)</p>
                <code className="text-sm font-mono text-green-700 dark:text-green-400 break-all">{BASE_URL}</code>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">SSL URL (pending)</p>
                <code className="text-sm font-mono text-gray-400 break-all">https://{SSL_URL}</code>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Method</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endpoint</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Auth</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
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
          <section id="authentication" className="scroll-mt-16">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Authenticated endpoints require a Bearer token. Obtain one from{' '}
              <InlineCode>/api/auth/register</InlineCode> or{' '}
              <InlineCode>/api/auth/login</InlineCode>, then include it in every protected request:
            </p>
            <CodeBlock
              code="Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"
              title="Header — all authenticated requests"
            />
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>Keep your token secret.</strong> Never expose it in client-side code or public repositories. Tokens expire when you log out.
              </p>
            </div>
          </section>

          {/* ── Tools ── */}
          <section id="tools" className="scroll-mt-16">
            <SectionHeading>Tools</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              All tools endpoints are public — no authentication required.
            </p>

            <div className="space-y-12">

              <EndpointCard
                id="tools-list"
                method="GET"
                path="/api/tools"
                auth={false}
                status={200}
                description="Returns a paginated list of all tools in the registry."
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

              <EndpointCard
                id="tools-detail"
                method="GET"
                path="/api/tools/{slug}"
                auth={false}
                status={200}
                description="Fetch a single tool by its slug. Returns 404 if not found."
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
}

// 404 Not Found
{
  "message": "Tool not found"
}`}
                curl={`curl -X GET "${BASE_URL}/api/tools/claude-code"`}
              />

            </div>
          </section>

          {/* ── Auth ── */}
          <section id="auth" className="scroll-mt-16">
            <SectionHeading>Auth</SectionHeading>

            <div className="space-y-12">

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
          <section id="errors" className="scroll-mt-16">
            <SectionHeading>Errors</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              All errors return a JSON body with a <InlineCode>message</InlineCode> field.
              Validation failures also include an <InlineCode>errors</InlineCode> object.
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
              title="Validation error response"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {ERROR_CODES.map(({ code, label }) => (
                <div
                  key={code}
                  className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2"
                >
                  <span className="font-mono font-bold text-sm text-gray-700 dark:text-gray-300">{code}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-xs">
              Questions?{' '}
              <a
                href="mailto:harun@toolblip.com"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                harun@toolblip.com
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
  body?: string;
  response: string;
  curl: string;
}

function EndpointCard({
  id, method, path, auth, status, description, body, response, curl,
}: EndpointCardProps) {
  return (
    <div id={id} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden scroll-mt-20">
      {/* Header bar */}
      <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <MethodPill method={method} />
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{path}</code>
        {auth && <LockPill />}
        <span className="ml-auto text-xs font-mono text-gray-400 dark:text-gray-500">→ {status}</span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>

        {/* Request body / headers + Response */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {body ? (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Request body</p>
              <CodeBlock code={body} />
            </div>
          ) : auth ? (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Headers</p>
              <CodeBlock code="Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx" />
            </div>
          ) : null}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">Response</p>
            <CodeBlock code={response} />
          </div>
        </div>

        {/* curl */}
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 px-1">curl</p>
          <CodeBlock code={curl} />
        </div>
      </div>
    </div>
  );
}
