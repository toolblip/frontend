'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = 'https://api.toolblip.com';

// ─── Endpoint definitions ────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type AuthRequired = boolean;

interface QueryParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface BodyParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ResponseField {
  field: string;
  type: string;
  description: string;
}

interface Endpoint {
  id: string;
  group: string;
  method: HttpMethod;
  path: string;
  auth: AuthRequired;
  title: string;
  description: string;
  queryParams?: QueryParam[];
  bodyParams?: BodyParam[];
  responseFields?: ResponseField[];
  curl: string;
  response: string;
}

const ENDPOINTS: Endpoint[] = [
  // ── Tools ──────────────────────────────────────────────────────────────────
  {
    id: 'list-tools',
    group: 'tools',
    method: 'GET',
    path: '/api/tools',
    auth: false,
    title: 'List all tools',
    description: 'Returns a paginated list of all available tools. Supports filtering by category and full-text search.',
    queryParams: [
      { name: 'category', type: 'string', required: false, description: 'Filter by category slug (e.g. "developer", "image", "writing")' },
      { name: 'search', type: 'string', required: false, description: 'Full-text search across tool name and description' },
      { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
      { name: 'per_page', type: 'integer', required: false, description: 'Results per page (default: 20, max: 100)' },
    ],
    responseFields: [
      { field: 'tools.tools[]', type: 'array', description: 'Array of Tool objects' },
      { field: 'tools.meta', type: 'object', description: 'Pagination metadata: current_page, total, per_page, last_page' },
    ],
    curl: `curl -X GET "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`,
    response: `{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "json-formatter",
        "name": "JSON Formatter",
        "description": "Format, validate, and prettify JSON data instantly.",
        "category": "developer",
        "is_pro": false,
        "emoji": "📋",
        "created_at": "2026-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "total": 48,
      "per_page": 20,
      "last_page": 3
    }
  }
}`,
  },
  {
    id: 'get-tool',
    group: 'tools',
    method: 'GET',
    path: '/api/tools/{slug}',
    auth: false,
    title: 'Get tool by slug',
    description: 'Returns a single tool by its URL-safe slug. Returns 404 if not found.',
    queryParams: [
      { name: 'slug', type: 'string', required: true, description: 'URL-safe identifier (e.g. "json-formatter", "image-resizer")' },
    ],
    responseFields: [
      { field: 'tool.id', type: 'integer', description: 'Unique tool ID' },
      { field: 'tool.slug', type: 'string', description: 'URL-safe identifier' },
      { field: 'tool.name', type: 'string', description: 'Display name' },
      { field: 'tool.description', type: 'string', description: 'Full description' },
      { field: 'tool.category', type: 'string', description: 'Category slug' },
      { field: 'tool.is_pro', type: 'boolean', description: 'Requires Pro subscription' },
      { field: 'tool.emoji', type: 'string', description: 'Emoji icon (optional)' },
      { field: 'tool.created_at', type: 'string', description: 'ISO 8601 timestamp' },
    ],
    curl: `curl -X GET "${BASE_URL}/api/tools/json-formatter" \\
  -H "Accept: application/json"`,
    response: `{
  "tool": {
    "id": 1,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format, validate, and prettify JSON data instantly.",
    "category": "developer",
    "is_pro": false,
    "emoji": "📋",
    "created_at": "2026-01-15T10:30:00Z"
  }
}`,
  },

  // ── Auth ────────────────────────────────────────────────────────────────────
  {
    id: 'register',
    group: 'auth',
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    title: 'Register new account',
    description: 'Create a new user account. Returns a Bearer token to use in authenticated requests.',
    bodyParams: [
      { name: 'name', type: 'string', required: true, description: 'Full display name' },
      { name: 'email', type: 'string', required: true, description: 'Email address — must be unique' },
      { name: 'password', type: 'string', required: true, description: 'Password — minimum 8 characters' },
      { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password exactly' },
    ],
    responseFields: [
      { field: 'user.id', type: 'integer', description: 'User ID' },
      { field: 'user.name', type: 'string', description: 'Display name' },
      { field: 'user.email', type: 'string', description: 'Email address' },
      { field: 'user.is_pro', type: 'boolean', description: 'Pro subscription status' },
      { field: 'token', type: 'string', description: 'Bearer token for authenticated requests' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secretpass123",
    "password_confirmation": "secretpass123"
  }'`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  },
  "token": "1|Xr8KbP9mNoPqRsTuVwXyZaBcDeFgHiJkL"
}`,
  },
  {
    id: 'login',
    group: 'auth',
    method: 'POST',
    path: '/api/auth/login',
    auth: false,
    title: 'Login',
    description: 'Authenticate an existing user. Returns a Bearer token for subsequent authenticated requests.',
    bodyParams: [
      { name: 'email', type: 'string', required: true, description: 'Account email address' },
      { name: 'password', type: 'string', required: true, description: 'Account password' },
    ],
    responseFields: [
      { field: 'user.id', type: 'integer', description: 'User ID' },
      { field: 'user.name', type: 'string', description: 'Display name' },
      { field: 'user.email', type: 'string', description: 'Email address' },
      { field: 'user.is_pro', type: 'boolean', description: 'Pro subscription status' },
      { field: 'token', type: 'string', description: 'Bearer token for authenticated requests' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "jane@example.com",
    "password": "secretpass123"
  }'`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  },
  "token": "2|Yz7LcQ3aMbNcOdPeQfGhRiJsTkL"
}`,
  },
  {
    id: 'logout',
    group: 'auth',
    method: 'POST',
    path: '/api/auth/logout',
    auth: true,
    title: 'Logout',
    description: 'Invalidate the current session token. After calling this, the token can no longer be used.',
    responseFields: [
      { field: 'message', type: 'string', description: 'Confirmation message' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`,
    response: `{
  "message": "Logged out successfully"
}`,
  },
  {
    id: 'get-user',
    group: 'auth',
    method: 'GET',
    path: '/api/auth/user',
    auth: true,
    title: 'Get authenticated user',
    description: 'Returns the profile of the currently authenticated user.',
    responseFields: [
      { field: 'user.id', type: 'integer', description: 'User ID' },
      { field: 'user.name', type: 'string', description: 'Display name' },
      { field: 'user.email', type: 'string', description: 'Email address' },
      { field: 'user.is_pro', type: 'boolean', description: 'Pro subscription status' },
    ],
    curl: `curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  }
}`,
  },
];

const GROUPS = [
  { id: 'tools', label: 'Tools', icon: '🔧' },
  { id: 'auth', label: 'Authentication', icon: '🔑' },
];

const STATUS_CODES = [
  { code: 200, label: 'OK', desc: 'Request succeeded.', color: 'text-emerald-600' },
  { code: 201, label: 'Created', desc: 'Resource created successfully.', color: 'text-emerald-600' },
  { code: 400, label: 'Bad Request', desc: 'Invalid request body or parameters.', color: 'text-red-600' },
  { code: 401, label: 'Unauthorized', desc: 'Missing or invalid Bearer token.', color: 'text-red-600' },
  { code: 403, label: 'Forbidden', desc: 'Authenticated but not permitted.', color: 'text-red-600' },
  { code: 404, label: 'Not Found', desc: 'The requested resource does not exist.', color: 'text-amber-600' },
  { code: 422, label: 'Unprocessable Entity', desc: 'Request body failed validation.', color: 'text-amber-600' },
  { code: 429, label: 'Too Many Requests', desc: 'Rate limit exceeded.', color: 'text-amber-600' },
  { code: 500, label: 'Server Error', desc: 'Something went wrong on our end.', color: 'text-red-600' },
];

// ─── Method colors ────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<HttpMethod, { bg: string; text: string; darkBg: string; darkText: string }> = {
  GET:    { bg: 'bg-emerald-50',    text: 'text-emerald-700',    darkBg: 'bg-emerald-500/10', darkText: 'text-emerald-400' },
  POST:   { bg: 'bg-blue-50',      text: 'text-blue-700',       darkBg: 'bg-blue-500/10',   darkText: 'text-blue-400'   },
  PUT:    { bg: 'bg-amber-50',     text: 'text-amber-700',      darkBg: 'bg-amber-500/10',  darkText: 'text-amber-400'  },
  DELETE: { bg: 'bg-red-50',       text: 'text-red-700',         darkBg: 'bg-red-500/10',    darkText: 'text-red-400'   },
  PATCH:  { bg: 'bg-violet-50',   text: 'text-violet-700',     darkBg: 'bg-violet-500/10', darkText: 'text-violet-400' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: HttpMethod }) {
  const c = METHOD_COLORS[method];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${c.bg} ${c.text}`}>
      {method}
    </span>
  );
}

function AuthBadge({ required }: { required: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
      required
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-slate-100 text-slate-500 border-slate-200'
    }`}>
      {required ? '🔒 Auth' : '🌐 Public'}
    </span>
  );
}

function CodeBlock({ code, className = '' }: { code: string; className?: string }) {
  return (
    <pre className={`bg-[#0d1117] text-slate-300 rounded-xl p-4 text-[12.5px] font-mono overflow-x-auto leading-relaxed ${className}`}>
      {code}
    </pre>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/10 text-xs rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function ParamTable({ params, body }: { params: QueryParam[] | BodyParam[]; body?: boolean }) {
  return (
    <div className="mb-5">
      <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {body ? 'Body Parameters' : 'Query Parameters'}
      </h4>
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs w-44">Name</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs w-20">Type</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs w-20">Required</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {params.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                <td className="px-4 py-2.5 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-medium">{p.name}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-500">{p.type}</td>
                <td className="px-4 py-2.5 text-xs">{p.required ? <span className="text-red-500 font-medium">Yes</span> : <span className="text-slate-400">No</span>}</td>
                <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResponseFieldsTable({ fields }: { fields: ResponseField[] }) {
  return (
    <div className="mb-5">
      <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Response Fields</h4>
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs w-44">Field</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs w-20">Type</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {fields.map((f, i) => (
              <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                <td className="px-4 py-2.5 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-medium">{f.field}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-500">{f.type}</td>
                <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:border-indigo-200 dark:hover:border-indigo-800">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
      >
        <MethodBadge method={ep.method} />
        <code className="font-mono text-sm text-slate-800 dark:text-slate-200 font-medium">{ep.path}</code>
        <span className="text-sm text-slate-500 dark:text-slate-400 flex-1 truncate">{ep.title}</span>
        <AuthBadge required={ep.auth} />
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-6 space-y-6 bg-slate-50/40 dark:bg-slate-900/50">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{ep.description}</p>

          {ep.queryParams && ep.queryParams.length > 0 && <ParamTable params={ep.queryParams} />}
          {ep.bodyParams && ep.bodyParams.length > 0 && <ParamTable params={ep.bodyParams} body />}
          {ep.responseFields && ep.responseFields.length > 0 && <ResponseFieldsTable fields={ep.responseFields} />}

          {/* Example request */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Example Request</h4>
              <CopyButton text={ep.curl} />
            </div>
            <CodeBlock code={ep.curl} />
          </div>

          {/* Example response */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Example Response</h4>
              <CopyButton text={ep.response} />
            </div>
            <CodeBlock code={ep.response} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApiDocsClient() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">Toolblip</span>
              </Link>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">API Docs</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                v1
              </span>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <Link href="/tools" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Browse Tools</Link>
              <Link href="/pricing" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
              <a href="https://github.com/toolblip" target="_blank" rel="noopener noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">API Documentation</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">Toolblip REST API — integrate tools, auth, and more</p>
            </div>
          </div>

          {/* Key facts */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex flex-col gap-1 bg-slate-900 dark:bg-slate-800 rounded-xl px-5 py-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Base URL</span>
              <code className="text-sm font-mono text-emerald-400 dark:text-emerald-300">{BASE_URL}</code>
            </div>
            <div className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Auth:</span>{' '}
                <code className="font-mono text-slate-700 dark:text-slate-300">Bearer token</code>
              </span>
            </div>
            <div className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Format:</span>{' '}
                JSON only
              </span>
            </div>
            <div className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Rate limit:</span>{' '}
                60 req/min public, 120 req/min authed
              </span>
            </div>
          </div>

          {/* Auth callout */}
          <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-0.5">Authentication</p>
              <p className="text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed">
                After registering or logging in, include the returned{' '}
                <code className="font-mono text-xs bg-indigo-100 dark:bg-indigo-900/50 px-1 rounded">token</code>
                {' '}in every authenticated request as:
              </p>
              <code className="mt-2 block bg-slate-900 dark:bg-slate-800 text-emerald-400 dark:text-emerald-300 rounded-lg px-3 py-2 text-xs font-mono">
                Authorization: Bearer &lt;your-token&gt;
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 px-1">Endpoints</p>
              <nav className="space-y-5">
                {GROUPS.map((g) => (
                  <div key={g.id}>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider mb-1.5 px-1">
                      {g.icon} {g.label}
                    </p>
                    <div className="space-y-0.5">
                      {ENDPOINTS.filter((ep) => ep.group === g.id).map((ep) => {
                        const c = METHOD_COLORS[ep.method];
                        return (
                          <a
                            key={ep.id}
                            href={`#${ep.id}`}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-400"
                          >
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text} flex-shrink-0`}>
                              {ep.method}
                            </span>
                            <span className="truncate font-mono text-xs flex-1">{ep.path}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Quick nav */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 px-1">On this page</p>
                <div className="space-y-0.5">
                  {[
                    { href: '#overview', label: 'Overview' },
                    { href: '#status-codes', label: 'Status Codes' },
                    { href: '#help', label: 'Get Help' },
                  ].map((item) => (
                    <a key={item.href} href={item.href}
                      className="block px-3 py-1.5 text-xs text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="lg:col-span-4 space-y-14">

            {/* Overview */}
            <section id="overview">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-lg">📖</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Overview</h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: 'Bearer Token Auth',
                    desc: 'Pass the token from register or login in the Authorization header of every authenticated request.',
                    code: 'Authorization: Bearer {token}',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    ),
                    title: 'JSON Throughout',
                    desc: 'All requests and responses use JSON. Always include both headers.',
                    code: 'Content-Type: application/json\nAccept: application/json',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: 'Rate Limits',
                    desc: 'Public: 60 req/min. Authenticated: 120 req/min. Pro users enjoy higher limits.',
                    code: undefined,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ),
                    title: 'Error Format',
                    desc: 'Errors return JSON with a message field. Common codes: 400, 401, 403, 404, 422, 500.',
                    code: undefined,
                  },
                ].map((card, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl flex items-center justify-center flex-shrink-0">{card.icon}</div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{card.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{card.desc}</p>
                    {card.code && <CodeBlock code={card.code} />}
                  </div>
                ))}
              </div>
            </section>

            {/* Endpoint groups */}
            {GROUPS.map((g) => (
              <section key={g.id} id={g.id}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-lg">{g.icon}</span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{g.label}</h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-3">
                  {ENDPOINTS.filter((ep) => ep.group === g.id).map((ep) => (
                    <div key={ep.id} id={ep.id}>
                      <EndpointCard ep={ep} />
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* HTTP Status Codes */}
            <section id="status-codes">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-lg">📡</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">HTTP Status Codes</h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs w-24">Code</th>
                      <th className="px-5 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs w-36">Status</th>
                      <th className="px-5 py-3.5 text-left font-semibold text-slate-600 dark:text-slate-400 text-xs">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {STATUS_CODES.map((s) => (
                      <tr key={s.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold ${s.color} bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700`}>
                            {s.code}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">{s.label}</td>
                        <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400">{s.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Help CTA */}
            <section id="help" className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900 p-7">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Need help with the API?</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                Questions about integration? Reach out at{' '}
                <a href="mailto:api@toolblip.com" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">api@toolblip.com</a>
                {' '}or open an issue on GitHub.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/toolblip" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  View on GitHub
                </a>
                <Link href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                  Explore Toolblip →
                </Link>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Toolblip API</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-slate-400 dark:text-slate-600">
              <Link href="/api-docs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Docs</Link>
              <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</Link>
              <a href="mailto:api@toolblip.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">api@toolblip.com</a>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-600">© {new Date().getFullYear()} Toolblip</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
