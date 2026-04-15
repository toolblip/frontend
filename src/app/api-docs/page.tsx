import type { Metadata } from 'next';
import CodeBlock from '@/components/ui/CodeBlock';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description:
    'Toolblip REST API — free endpoints for browsing developer tools, MCP server registry, and user authentication.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API — free developer tools and MCP server registry.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API — free developer tools and MCP server registry.',
  },
};

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const SWIFT_URL = 'https://api.toolblip.com';

const ENDPOINTS = [
  { method: 'GET',    path: '/api/tools',           auth: false, desc: 'List all tools'        },
  { method: 'GET',    path: '/api/tools/:slug',      auth: false, desc: 'Get a single tool'      },
  { method: 'POST',   path: '/api/auth/register',   auth: false, desc: 'Create account'         },
  { method: 'POST',   path: '/api/auth/login',       auth: false, desc: 'Sign in'               },
  { method: 'POST',   path: '/api/auth/logout',      auth: true,  desc: 'Revoke session'        },
  { method: 'GET',    path: '/api/auth/user',        auth: true,  desc: 'Current user'          },
] as const;

export default function ApiDocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* ── Hero ── */}
      <header className="mb-16">
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-mono font-bold px-3 py-1 rounded-full mb-4 w-fit">
          REST API v1
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">API Documentation</h1>
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl">
          Free REST API for browsing developer tools and managing user authentication.
          No API key required — register an account and go.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <BaseUrlChip label="Base URL" url={BASE_URL} available />
          <BaseUrlChip label="Swift URL" url={SWIFT_URL} available={false} />
        </div>
      </header>

      {/* ── Quick Reference ── */}
      <section className="mb-14">
        <SectionTitle>Quick Reference</SectionTitle>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Auth</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {ENDPOINTS.map(({ method, path, auth, desc }) => (
                <tr key={path} className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-3"><MethodBadge method={method} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{path}</td>
                  <td className="px-4 py-3">{auth ? <AuthBadge /> : <PublicBadge />}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Base URL ── */}
      <section className="mb-14">
        <SectionTitle>Base URL</SectionTitle>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mt-3 font-mono text-sm text-gray-700 dark:text-gray-300">
          {BASE_URL}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Once SSL is ready, use <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{SWIFT_URL}</code> instead.
        </p>
      </section>

      {/* ── Authentication ── */}
      <section className="mb-14">
        <SectionTitle>Authentication</SectionTitle>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mt-3 flex gap-4 items-start">
          <div className="text-blue-500 mt-0.5 shrink-0 text-lg">🔑</div>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Bearer Token</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
              Protected endpoints require a token from{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">/api/auth/register</code>{' '}
              or{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">/api/auth/login</code>.
              Pass it as a header:
            </p>
            <div className="mt-3 bg-white/60 dark:bg-black/20 rounded-lg px-3 py-2 font-mono text-xs text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
              Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Auth Endpoints
      ══════════════════════════════════════════ */}
      <section className="mb-14">
        <SectionTitle>Auth Endpoints</SectionTitle>
        <div className="space-y-6 mt-4">

          {/* POST /api/auth/register */}
          <EndpointDetail
            method="POST"
            path="/api/auth/register"
            requiresAuth={false}
            status={201}
            description="Create a new user account. Returns the user object and a Bearer token."
            requestBody={`{
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
            curl={`curl -X POST ${BASE_URL}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Harun","email":"harun@example.com","password":"secret123","password_confirmation":"secret123"}'`}
          />

          {/* POST /api/auth/login */}
          <EndpointDetail
            method="POST"
            path="/api/auth/login"
            requiresAuth={false}
            status={200}
            description="Sign in with email and password. Returns the user object and a Bearer token."
            requestBody={`{
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
            curl={`curl -X POST ${BASE_URL}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"harun@example.com","password":"secret123"}'`}
          />

          {/* POST /api/auth/logout */}
          <EndpointDetail
            method="POST"
            path="/api/auth/logout"
            requiresAuth={true}
            status={200}
            description="Revoke the current Bearer token, invalidating the session."
            response={`{
  "message": "Logged out successfully"
}`}
            curl={`curl -X POST ${BASE_URL}/api/auth/logout \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
          />

          {/* GET /api/auth/user */}
          <EndpointDetail
            method="GET"
            path="/api/auth/user"
            requiresAuth={true}
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
            curl={`curl -X GET ${BASE_URL}/api/auth/user \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
          />

        </div>
      </section>

      {/* ══════════════════════════════════════════
          Tools Endpoints
      ══════════════════════════════════════════ */}
      <section className="mb-14">
        <SectionTitle>Tools Endpoints</SectionTitle>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">
          All tools endpoints are public — no authentication required.
        </p>

        <div className="space-y-6">

          {/* GET /api/tools */}
          <EndpointDetail
            method="GET"
            path="/api/tools"
            requiresAuth={false}
            status={200}
            description="Returns a paginated list of all tools in the registry."
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
            curl={`curl -X GET ${BASE_URL}/api/tools`}
          />

          {/* GET /api/tools/:slug */}
          <EndpointDetail
            method="GET"
            path="/api/tools/:slug"
            requiresAuth={false}
            status={200}
            description="Fetch a single tool by its URL-friendly slug identifier. Returns 404 if not found."
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
            curl={`curl -X GET ${BASE_URL}/api/tools/claude-code`}
          />

        </div>
      </section>

      {/* ── Rate Limits ── */}
      <section className="mb-14">
        <SectionTitle>Rate Limits</SectionTitle>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 mt-3 flex gap-4 items-start">
          <div className="text-amber-500 mt-0.5 shrink-0 text-lg">⚡</div>
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">Rate Limits</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              Authenticated endpoints: <strong>60 requests/minute</strong>. Public read endpoints are more generous. If you hit a limit, you&apos;ll receive a{' '}
              <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">429 Too Many Requests</code>{' '}
              response. Back off and retry.
            </p>
          </div>
        </div>
      </section>

      {/* ── Error Responses ── */}
      <section className="mb-14">
        <SectionTitle>Error Responses</SectionTitle>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mt-3">
          <CodeBlock code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}`} />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {[
              { code: 400, label: 'Bad Request',    color: 'text-red-500'    },
              { code: 401, label: 'Unauthorized',   color: 'text-red-500'    },
              { code: 403, label: 'Forbidden',      color: 'text-amber-500'  },
              { code: 404, label: 'Not Found',     color: 'text-gray-500'   },
              { code: 422, label: 'Validation Error', color: 'text-yellow-500' },
              { code: 429, label: 'Too Many Requests', color: 'text-amber-500' },
              { code: 500, label: 'Server Error',   color: 'text-red-600'    },
            ].map(({ code, label, color }) => (
              <div key={code} className="flex items-center gap-2">
                <span className={`font-bold ${color}`}>{code}</span>
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          Questions or issues?{' '}
          <a
            href="mailto:harun@toolblip.com"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            harun@toolblip.com
          </a>
        </p>
      </footer>
    </div>
  );
}

// ─── Components ────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
      <span className="w-1 h-5 bg-green-500 rounded-full shrink-0" />
      {children}
    </h2>
  );
}

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  POST:   'bg-blue-100  dark:bg-blue-900/30  text-blue-700  dark:text-blue-400',
  PUT:    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  PATCH:  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  DELETE: 'bg-red-100   dark:bg-red-900/30   text-red-700   dark:text-red-400',
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`${METHOD_COLORS[method] ?? ''} text-xs font-mono font-bold px-2 py-0.5 rounded inline-block`}>
      {method}
    </span>
  );
}

function AuthBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
      🔒 auth
    </span>
  );
}

function PublicBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">
      public
    </span>
  );
}

interface EndpointDetailProps {
  method: string;
  path: string;
  requiresAuth: boolean;
  status: number;
  description: string;
  requestBody?: string;
  response: string;
  curl: string;
}

function EndpointDetail({
  method,
  path,
  requiresAuth,
  status,
  description,
  requestBody,
  response,
  curl,
}: EndpointDetailProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-5 py-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 flex-wrap">
        <span className={`${METHOD_COLORS[method] ?? ''} text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0`}>
          {method}
        </span>
        <code className="text-gray-900 dark:text-white text-sm font-mono">{path}</code>
        {requiresAuth && <AuthBadge />}
        <span className="ml-auto text-xs font-mono text-gray-400 dark:text-gray-500">
          → {status}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requestBody ? (
            <Card label="Request body">
              <CodeBlock code={requestBody} />
            </Card>
          ) : (
            <Card label="Headers">
              <CodeBlock code="Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx" />
            </Card>
          )}
          <Card label="Response">
            <CodeBlock code={response} />
          </Card>
        </div>

        <Card label="curl">
          <CodeBlock code={curl} />
        </Card>
      </div>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 font-semibold">{label}</p>
      {children}
    </div>
  );
}

function BaseUrlChip({ label, url, available }: { label: string; url: string; available: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
      <span className={`text-xs font-semibold ${available ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
        {label}
      </span>
      <code className={`text-xs font-mono ${available ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600 line-through'}`}>
        {url}
      </code>
      {!available && (
        <span className="text-xs text-gray-400 dark:text-gray-600 italic">coming soon</span>
      )}
    </div>
  );
}
