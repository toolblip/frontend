'use client';

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const API_BASE = 'api.toolblip.com'; // switch once SSL is ready

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#0d0d10] border border-[#2a2a32] my-3 text-sm">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a32]">
          <span className="text-xs text-[#6b6b7a] font-mono">{label}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[#e2e2ea] font-mono text-xs leading-relaxed">
        <code>{code}
        </code>
      </pre>
    </div>
  );
}

// ─── Method badge ─────────────────────────────────────────────────────────────
function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET:    'bg-[#dcf4ff] text-[#0c5790] dark:bg-[#12304a] dark:text-[#87c7f0]',
    POST:   'bg-[#d6f0df] text-[#1e6b42] dark:bg-[#1a3527] dark:text-[#7cd1a3]',
    PUT:    'bg-[#ffe7d4] text-[#b8430f] dark:bg-[#432518] dark:text-[#ffb07a]',
    DELETE: 'bg-[#fbdcda] text-[#9b1f1a] dark:bg-[#401917] dark:text-[#f09690]',
    PATCH:  'bg-[#ebe0ff] text-[#5f2fb5] dark:bg-[#2d1d48] dark:text-[#b49cff]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold font-mono ${colors[method] ?? 'bg-surface-2 text-fg-1'}`}>
      {method}
    </span>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-[--fg-0] mt-12 mb-4 pb-3 border-b border-[--line]">
      {children}
    </h2>
  );
}

function EndpointHeading({ method, path, auth }: { method: string; path: string; auth?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <MethodBadge method={method} />
      <code className="font-mono text-base font-semibold text-[--fg-0]">{path}</code>
      {auth && (
        <span className="ml-1 inline-flex items-center gap-1 text-xs text-[--fg-2] border border-[--line] rounded-full px-2 py-0.5">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="4.5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M3 4.5V3a2 2 0 1 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Auth required
        </span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ApiDocsClient() {
  return (
    <main className="min-h-screen bg-[--bg]">
      {/* ── Hero ── */}
      <div className="border-b border-[--line] bg-[--surface]">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[--fg-2] border border-[--line] rounded-full px-3 py-1 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            REST API v1
          </div>
          <h1 className="text-4xl font-black text-[--fg-0] tracking-tight mb-3">
            Toolblip API
          </h1>
          <p className="text-[--fg-1] text-lg leading-relaxed max-w-2xl">
            Build on top of Toolblip. Browse the full catalog of free developer tools, manage user accounts, and integrate toolblip into your own apps and workflows.
          </p>

          {/* Base URL chip */}
          <div className="mt-6 inline-flex items-center gap-2 bg-[--surface-2] border border-[--line] rounded-xl px-4 py-2.5 font-mono text-sm">
            <span className="text-[--fg-2] text-xs">Base URL</span>
            <span className="text-[--fg-0] font-semibold">{BASE_URL}</span>
            <span className="text-[--fg-3] text-xs">/ {API_BASE}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── Authentication ── */}
        <SectionHeading>Authentication</SectionHeading>
        <p className="text-[--fg-1] leading-relaxed mb-4">
          All authenticated endpoints require a <strong>Bearer token</strong> passed in the{' '}
          <code className="font-mono text-sm bg-[--surface-2] px-1.5 py-0.5 rounded border border-[--line]">Authorization</code> header.
        </p>
        <CodeBlock
          label="Authorization header"
          code="Authorization: Bearer YOUR_TOKEN_HERE"
        />
        <p className="text-sm text-[--fg-2]">
          Tokens are returned on successful <strong>register</strong> or <strong>login</strong> and must be stored securely by your app.
        </p>

        {/* ── Response format ── */}
        <SectionHeading>Response format</SectionHeading>
        <p className="text-[--fg-1] leading-relaxed mb-4">
          All responses are JSON with <code className="font-mono text-sm bg-[--surface-2] px-1.5 py-0.5 rounded border border-[--line]">Content-Type: application/json</code>.
          Errors return a top-level <code className="font-mono text-sm bg-[--surface-2] px-1.5 py-0.5 rounded border border-[--line]">message</code> field.
        </p>

        {/* ── Tools ── */}
        <SectionHeading>Tools</SectionHeading>

        {/* GET /api/tools */}
        <div className="mb-10">
          <EndpointHeading method="GET" path="/api/tools" />
          <p className="text-[--fg-1] leading-relaxed mb-4">
            Returns a paginated list of all available tools. Supports optional filters for category and search query.
          </p>

          <h3 className="text-sm font-bold text-[--fg-0] mb-2">Query parameters</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[--line] text-left">
                  <th className="py-2 pr-4 font-mono text-[--fg-2] text-xs">Parameter</th>
                  <th className="py-2 pr-4 font-mono text-[--fg-2] text-xs">Type</th>
                  <th className="py-2 font-mono text-[--fg-2] text-xs">Description</th>
                </tr>
              </thead>
              <tbody className="text-[--fg-1]">
                <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#b8430f]">category</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Filter by category, e.g. <code className="text-xs">text</code>, <code className="text-xs">image</code>, <code className="text-xs">mcp</code></td></tr>
                <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#b8430f]">search</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Full-text search against tool name and description</td></tr>
                <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#b8430f]">page</td><td className="py-2 pr-4 font-mono text-xs">integer</td><td className="py-2 text-sm">Page number (default: 1)</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-[#b8430f]">per_page</td><td className="py-2 pr-4 font-mono text-xs">integer</td><td className="py-2 text-sm">Results per page (default: 20)</td></tr>
              </tbody>
            </table>
          </div>

          <CodeBlock
            label="curl — List all tools"
            code={`curl -X GET "${BASE_URL}/api/tools?category=text&page=1" \\
  -H "Accept: application/json"`}
          />
          <CodeBlock
            label="200 OK — Response body"
            code={`{
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
        </div>

        {/* GET /api/tools/:slug */}
        <div className="mb-10">
          <EndpointHeading method="GET" path="/api/tools/{slug}" />
          <p className="text-[--fg-1] leading-relaxed mb-4">
            Fetch a single tool by its URL-safe slug. Returns full tool details including the <code className="font-mono text-sm bg-[--surface-2] px-1.5 py-0.5 rounded border border-[--line]">id</code> and <code className="font-mono text-sm bg-[--surface-2] px-1.5 py-0.5 rounded border border-[--line]">is_pro</code> flag.
          </p>

          <CodeBlock
            label="curl — Get single tool"
            code={`curl -X GET "${BASE_URL}/api/tools/json-formatter" \\
  -H "Accept: application/json"`}
          />
          <CodeBlock
            label="200 OK — Response body"
            code={`{
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
        </div>

        {/* ── Auth ── */}
        <SectionHeading>Authentication</SectionHeading>

        {/* POST /api/auth/register */}
        <div className="mb-10">
          <EndpointHeading method="POST" path="/api/auth/register" />
          <p className="text-[--fg-1] leading-relaxed mb-4">
            Create a new user account. Returns the user object and a Bearer token you should persist for subsequent authenticated requests.
          </p>

          <h3 className="text-sm font-bold text-[--fg-0] mb-2">Request body</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[--line] text-left">
                  <th className="py-2 pr-4 font-mono text-[--fg-2] text-xs">Field</th>
                  <th className="py-2 pr-4 font-mono text-[--fg-2] text-xs">Type</th>
                  <th className="py-2 font-mono text-[--fg-2] text-xs">Description</th>
                </tr>
              </thead>
              <tbody className="text-[--fg-1]">
                <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#b8430f]">name</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Full display name (required)</td></tr>
                <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#b8430f]">email</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Valid email address (required, unique)</td></tr>
                <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#b8430f]">password</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Min 8 characters (required)</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-[#b8430f]">password_confirmation</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Must match password (required)</td></tr>
              </tbody>
            </table>
          </div>

          <CodeBlock
            label="curl — Register"
            code={`curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "password": "secretpass123",
    "password_confirmation": "secretpass123"
  }'`}
          />
          <CodeBlock
            label="201 Created — Response body"
            code={`{
  "user": {
    "id": 42,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "1|abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV"
}`}
          />
        </div>

        {/* POST /api/auth/login */}
        <div className="mb-10">
          <EndpointHeading method="POST" path="/api/auth/login" />
          <p className="text-[--fg-1] leading-relaxed mb-4">
            Authenticate an existing user with email and password. Returns the user object and a fresh Bearer token.
          </p>

          <h3 className="text-sm font-bold text-[--fg-0] mb-2">Request body</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[--line] text-left">
                  <th className="py-2 pr-4 font-mono text-[--fg-2] text-xs">Field</th>
                  <th className="py-2 pr-4 font-mono text-[--fg-2] text-xs">Type</th>
                  <th className="py-2 font-mono text-[--fg-2] text-xs">Description</th>
                </tr>
              </thead>
              <tbody className="text-[--fg-1]">
                <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#b8430f]">email</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Registered email address (required)</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-[#b8430f]">password</td><td className="py-2 pr-4 font-mono text-xs">string</td><td className="py-2 text-sm">Account password (required)</td></tr>
              </tbody>
            </table>
          </div>

          <CodeBlock
            label="curl — Login"
            code={`curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "alex@example.com",
    "password": "secretpass123"
  }'`}
          />
          <CodeBlock
            label="200 OK — Response body"
            code={`{
  "user": {
    "id": 42,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "2|newtokenuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456"
}`}
          />
        </div>

        {/* POST /api/auth/logout */}
        <div className="mb-10">
          <EndpointHeading method="POST" path="/api/auth/logout" auth />
          <p className="text-[--fg-1] leading-relaxed mb-4">
            Revoke the current session token. The token passed in the Authorization header will be invalidated immediately and can no longer be used.
          </p>

          <CodeBlock
            label="curl — Logout"
            code={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`}
          />
          <CodeBlock
            label="200 OK — Response body"
            code={`{
  "message": "Session revoked successfully."
}`}
          />
        </div>

        {/* GET /api/auth/user */}
        <div className="mb-10">
          <EndpointHeading method="GET" path="/api/auth/user" auth />
          <p className="text-[--fg-1] leading-relaxed mb-4">
            Return the currently authenticated user based on the Bearer token. Use this to verify a token or fetch fresh user data.
          </p>

          <CodeBlock
            label="curl — Get current user"
            code={`curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`}
          />
          <CodeBlock
            label="200 OK — Response body"
            code={`{
  "user": {
    "id": 42,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "is_pro": true
  }
}`}
          />
        </div>

        {/* ── Error responses ── */}
        <SectionHeading>Error responses</SectionHeading>
        <p className="text-[--fg-1] leading-relaxed mb-4">
          Failed requests return an appropriate HTTP status code and a JSON body with a <code className="font-mono text-sm bg-[--surface-2] px-1.5 py-0.5 rounded border border-[--line]">message</code> field describing the error.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[--line] text-left">
                <th className="py-2 pr-4 font-mono text-[--fg-2] text-xs">Status</th>
                <th className="py-2 font-mono text-[--fg-2] text-xs">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-[--fg-1]">
              <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#9b1f1a]">401</td><td className="py-2 text-sm">Missing or invalid token</td></tr>
              <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#9b1f1a]">403</td><td className="py-2 text-sm">Token valid but insufficient permissions</td></tr>
              <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#9b1f1a]">404</td><td className="py-2 text-sm">Resource not found</td></tr>
              <tr className="border-b border-[--line-2]"><td className="py-2 pr-4 font-mono text-[#9b1f1a]">422</td><td className="py-2 text-sm">Validation error (check <code className="font-mono text-xs">message</code> field)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-[#9b1f1a]">500</td><td className="py-2 text-sm">Internal server error</td></tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          label="Error response (422 example)"
          code={`{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}`}
        />
      </div>
    </main>
  );
}
