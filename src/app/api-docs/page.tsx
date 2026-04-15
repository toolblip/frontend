import type { Metadata } from 'next';
import Link from 'next/link';
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
};

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const SWIFT_URL = 'api.toolblip.com';

export default function ApiDocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* ── Hero ── */}
      <header className="mb-16">
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-mono font-bold px-3 py-1 rounded-full mb-4 w-fit">
          REST API v1
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">API Documentation</h1>
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl">
          Free REST API for browsing developer tools and managing user authentication.
          No API key required — register an account and go.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <UrlChip label="Base URL" url={BASE_URL} available />
          <UrlChip label="Swift URL" url={`https://${SWIFT_URL}`} available={false} />
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-4 items-start">
          <div className="text-blue-500 mt-0.5 shrink-0">🔑</div>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Bearer Token Authentication</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">
              Protected endpoints require a token from{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">/api/auth/register</code>{' '}
              or{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">/api/auth/login</code>.
              Pass it as:{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">
                Authorization: Bearer tb_xxxx
              </code>
            </p>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          TABLE OF CONTENTS
      ══════════════════════════════════════════ */}
      <nav className="mb-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold mb-3">On this page</p>
        <ol className="space-y-1.5">
          {[
            { num: '01', label: 'Authentication' },
            { num: '02', label: 'Tools' },
            { num: '03', label: 'Quick Links' },
          ].map(({ num, label }) => (
            <li key={num}>
              <a href={`#section-${num}`} className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-mono">
                <span className="text-gray-400 dark:text-gray-600">{num}</span> {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ══════════════════════════════════════════
          SECTION 01 — Authentication
      ══════════════════════════════════════════ */}
      <SectionHeader number="01" title="Authentication" />

      <div className="space-y-2 mb-10">
        <EndpointRow method="POST" path="/api/auth/register" auth={false} description="Create a new account" />
        <EndpointRow method="POST" path="/api/auth/login" auth={false} description="Sign in and receive a Bearer token" />
        <EndpointRow method="POST" path="/api/auth/logout" auth={true} description="Revoke the current token" />
        <EndpointRow method="GET" path="/api/auth/user" auth={true} description="Get the authenticated user" />
      </div>

      <EndpointDetail
        id="register"
        method="POST"
        path="/api/auth/register"
        requiresAuth={false}
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
  -d '{
    "name": "Harun",
    "email": "harun@example.com",
    "password": "secret123",
    "password_confirmation": "secret123"
  }'`}
      />

      <EndpointDetail
        id="login"
        method="POST"
        path="/api/auth/login"
        requiresAuth={false}
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
  -d '{
    "email": "harun@example.com",
    "password": "secret123"
  }'`}
      />

      <EndpointDetail
        id="logout"
        method="POST"
        path="/api/auth/logout"
        requiresAuth={true}
        description="Revoke the current Bearer token, invalidating the session."
        response={`{
  "message": "Logged out successfully"
}`}
        curl={`curl -X POST ${BASE_URL}/api/auth/logout \\
  -H "Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx"`}
      />

      <EndpointDetail
        id="user"
        method="GET"
        path="/api/auth/user"
        requiresAuth={true}
        description="Retrieve the currently authenticated user. Requires a valid Bearer token."
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

      {/* ══════════════════════════════════════════
          SECTION 02 — Tools
      ══════════════════════════════════════════ */}
      <SectionHeader number="02" title="Tools" />
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Browse all developer tools in the Toolblip registry. Public — no authentication required.
      </p>

      <div className="space-y-2 mb-10">
        <EndpointRow method="GET" path="/api/tools" auth={false} description="List all tools" />
        <EndpointRow method="GET" path="/api/tools/{slug}" auth={false} description="Get a single tool by its slug" />
      </div>

      <EndpointDetail
        id="list-tools"
        method="GET"
        path="/api/tools"
        requiresAuth={false}
        description="Returns a paginated list of all tools. No authentication required."
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

      <EndpointDetail
        id="get-tool"
        method="GET"
        path="/api/tools/{slug}"
        requiresAuth={false}
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

      {/* ══════════════════════════════════════════
          SECTION 03 — Quick Links
      ══════════════════════════════════════════ */}
      <SectionHeader number="03" title="Quick Links" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/tools"
          className="group flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl px-5 py-4 transition-all duration-200"
        >
          <div>
            <p className="text-gray-900 dark:text-white text-sm font-medium">Browse Tools</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Explore the full catalog</p>
          </div>
          <span className="text-green-600 dark:text-green-400 text-xs font-mono group-hover:translate-x-1 transition-transform">
            GET /api/tools →
          </span>
        </Link>
        <Link
          href="/directory"
          className="group flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl px-5 py-4 transition-all duration-200"
        >
          <div>
            <p className="text-gray-900 dark:text-white text-sm font-medium">MCP Directory</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Browse MCP servers</p>
          </div>
          <span className="text-green-600 dark:text-green-400 text-xs font-mono group-hover:translate-x-1 transition-transform">
            /directory →
          </span>
        </Link>
      </div>

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

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <h2
      id={`section-${number}`}
      className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3 scroll-mt-8"
    >
      <span className="text-green-600 dark:text-green-400 text-sm font-mono bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
        {number}
      </span>
      {title}
    </h2>
  );
}

function EndpointRow({
  method,
  path,
  auth,
  description,
}: {
  method: string;
  path: string;
  auth: boolean;
  description: string;
}) {
  const colors: Record<string, string> = {
    GET: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    POST: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    PUT: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    PATCH: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    DELETE: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-4">
      <span className={`${colors[method] || ''} text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0`}>
        {method}
      </span>
      <code className="text-gray-700 dark:text-gray-300 text-xs font-mono shrink-0">{path}</code>
      <span className="text-gray-500 dark:text-gray-400 text-xs flex-1">{description}</span>
      {auth ? (
        <span className="text-xs text-amber-600 dark:text-amber-400 shrink-0">🔒 auth</span>
      ) : (
        <span className="text-xs text-gray-400 dark:text-gray-600 shrink-0">public</span>
      )}
    </div>
  );
}

interface EndpointDetailProps {
  id: string;
  method: string;
  path: string;
  requiresAuth: boolean;
  description: string;
  requestBody?: string;
  response: string;
  curl: string;
}

function EndpointDetail({
  id,
  method,
  path,
  requiresAuth,
  description,
  requestBody,
  response,
  curl,
}: EndpointDetailProps) {
  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    POST: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    PUT: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    PATCH: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    DELETE: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return (
    <section id={id} className="mb-14 scroll-mt-8">
      {/* Method + path header */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`${methodColors[method]} text-xs font-mono font-bold px-2 py-0.5 rounded`}>
          {method}
        </span>
        <code className="text-gray-900 dark:text-white text-sm font-mono">{path}</code>
        {requiresAuth && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
            🔒 requires auth
          </span>
        )}
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">{description}</p>

      {/* Body + Response grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {requestBody ? (
          <Card label="Request body">
            <CodeBlock code={requestBody} />
          </Card>
        ) : (
          <Card label="Headers">
            <CodeBlock code={`Authorization: Bearer tb_live_xxxxxxxxxxxxxxxx`} />
          </Card>
        )}
        <Card label="Response">
          <CodeBlock code={response} />
        </Card>
      </div>

      {/* curl */}
      <Card label="curl">
        <CodeBlock code={curl} />
      </Card>
    </section>
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

function UrlChip({ label, url, available }: { label: string; url: string; available: boolean }) {
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
