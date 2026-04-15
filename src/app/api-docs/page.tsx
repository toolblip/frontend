import type { Metadata } from 'next';
import Link from 'next/link';
import CodeBlock from '@/components/ui/CodeBlock';

export const metadata: Metadata = {
  title: 'API Documentation | Toolblip',
  description:
    'Toolblip REST API documentation. Free access to developer tools, MCP server registry, and user authentication.',
  openGraph: {
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API documentation. Free access to developer tools, MCP server registry, and user authentication.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary',
    title: 'API Documentation | Toolblip',
    description: 'Toolblip REST API docs. Free developer tools and MCP server registry.',
  },
};

const BASE_URL = 'https://toolblip-api-production.up.railway.app';

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-mono font-bold px-3 py-1 rounded-full mb-4">
          REST API
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">API Documentation</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Free REST API for browsing developer tools and managing user authentication.
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Base URL</span>
          <code className="bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-400 px-3 py-1 rounded text-xs font-mono">
            {BASE_URL}
          </code>
        </div>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="text-gray-500 dark:text-gray-400">SSL URL</span>
          <code className="bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-400 px-3 py-1 rounded text-xs font-mono">
            api.toolblip.com (coming soon)
          </code>
        </div>
      </header>

      {/* ── Authentication ── */}
      <section className="mb-14">
        <SectionHeader number="01" title="Authentication" />
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          The API uses Bearer token authentication via Laravel Sanctum. After registering or logging in, you
          receive a token. Include it in the{' '}
          <code className="text-green-600 dark:text-green-400 text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
            Authorization
          </code>{' '}
          header on all protected routes:
        </p>
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Example header</p>
          <CodeBlock code="Authorization: Bearer tb_your_token_here" />
        </div>
        <div className="space-y-3">
          <EndpointRow
            method="POST"
            path="/api/auth/register"
            auth={false}
            description="Create a new account"
          />
          <EndpointRow method="POST" path="/api/auth/login" auth={false} description="Sign in and receive a token" />
          <EndpointRow method="POST" path="/api/auth/logout" auth={true} description="Revoke the current token" />
          <EndpointRow method="GET" path="/api/auth/user" auth={true} description="Get the authenticated user" />
        </div>
      </section>

      {/* ── Auth: Register ── */}
      <section className="mb-14">
        <h3 className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          POST /api/auth/register
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Create a new user account.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Request body</p>
            <CodeBlock
              code={`{
  "name": "Harun",
  "email": "harun@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}`}
            />
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Response</p>
            <CodeBlock
              code={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "tb_1a2b3c4d5e..."
}`}
            />
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">curl</p>
          <CodeBlock
            code={`curl -X POST ${BASE_URL}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Harun",
    "email": "harun@example.com",
    "password": "secret123",
    "password_confirmation": "secret123"
  }'`}
          />
        </div>
      </section>

      {/* ── Auth: Login ── */}
      <section className="mb-14">
        <h3 className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          POST /api/auth/login
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Sign in with your email and password.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Request body</p>
            <CodeBlock
              code={`{
  "email": "harun@example.com",
  "password": "secret123"
}`}
            />
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Response</p>
            <CodeBlock
              code={`{
  "user": {
    "id": 1,
    "name": "Harun",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "tb_1a2b3c4d5e..."
}`}
            />
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">curl</p>
          <CodeBlock
            code={`curl -X POST ${BASE_URL}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "harun@example.com",
    "password": "secret123"
  }'`}
          />
        </div>
      </section>

      {/* ── Auth: Logout ── */}
      <section className="mb-14">
        <h3 className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          POST /api/auth/logout
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Revoke the current Bearer token. Requires authentication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Headers</p>
            <CodeBlock code={`Authorization: Bearer tb_your_token_here`} />
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Response</p>
            <CodeBlock code={`{ "message": "Logged out successfully" }`} />
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">curl</p>
          <CodeBlock
            code={`curl -X POST ${BASE_URL}/api/auth/logout \\
  -H "Authorization: Bearer tb_your_token_here"`}
          />
        </div>
      </section>

      {/* ── Auth: User ── */}
      <section className="mb-14">
        <h3 className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          GET /api/auth/user
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Retrieve the currently authenticated user. Requires authentication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Headers</p>
            <CodeBlock code={`Authorization: Bearer tb_your_token_here`} />
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Response</p>
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

        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">curl</p>
          <CodeBlock
            code={`curl -X GET ${BASE_URL}/api/auth/user \\
  -H "Authorization: Bearer tb_your_token_here"`}
          />
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="mb-14">
        <SectionHeader number="02" title="Tools" />
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Public endpoints for browsing Toolblip&apos;s developer tools. No authentication required.
        </p>
        <div className="space-y-3 mb-8">
          <EndpointRow method="GET" path="/api/tools" auth={false} description="List all tools" />
          <EndpointRow method="GET" path="/api/tools/{slug}" auth={false} description="Get a single tool by slug" />
        </div>

        {/* GET /api/tools */}
        <h3 className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          GET /api/tools
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Returns all tools. Response wraps tools in a nested{' '}
          <code className="text-green-600 dark:text-green-400 text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
            tools
          </code>{' '}
          key.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Response</p>
            <CodeBlock
              code={`{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "claude-code",
        "name": "Claude Code",
        "description": "AI coding assistant",
        "category": "AI",
        "is_pro": false,
        "emoji": "🤖",
        "created_at": "2026-01-01T00:00:00Z"
      }
    ]
  }
}`}
            />
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">curl</p>
            <CodeBlock code={`curl -X GET ${BASE_URL}/api/tools`} />
          </div>
        </div>

        {/* GET /api/tools/{slug} */}
        <h3 className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider mt-10">
          GET /api/tools/{'{slug}'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Fetch a single tool by its slug identifier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Response</p>
            <CodeBlock
              code={`{
  "tool": {
    "id": 1,
    "slug": "claude-code",
    "name": "Claude Code",
    "description": "AI coding assistant",
    "category": "AI",
    "is_pro": false,
    "emoji": "🤖",
    "created_at": "2026-01-01T00:00:00Z"
  }
}`}
            />
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">curl</p>
            <CodeBlock code={`curl -X GET ${BASE_URL}/api/tools/claude-code`} />
          </div>
        </div>
      </section>

      {/* ── Try It ── */}
      <section className="mb-14">
        <SectionHeader number="03" title="Try It" />
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Test the API directly from your browser — no token required for public endpoints.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/tools"
            className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl px-5 py-4 transition-colors"
          >
            <span className="text-gray-900 dark:text-white text-sm font-medium">List tools</span>
            <span className="text-green-600 dark:text-green-400 text-xs font-mono">GET /api/tools</span>
          </Link>
          <Link
            href="/directory"
            className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl px-5 py-4 transition-colors"
          >
            <span className="text-gray-900 dark:text-white text-sm font-medium">Browse MCP servers</span>
            <span className="text-green-600 dark:text-green-400 text-xs font-mono">Directory</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          Questions or issues?{' '}
          <a
            href="mailto:harun@toolblip.com"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            harun@toolblip.com
          </a>
        </p>
      </footer>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
      <span className="text-green-600 dark:text-green-400 text-sm font-mono">{number}</span>
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
        <span className="text-xs text-yellow-600 dark:text-yellow-400 shrink-0">🔒 auth</span>
      ) : (
        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">public</span>
      )}
    </div>
  );
}
