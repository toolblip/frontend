'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = 'https://api.toolblip.com';
const RAILWAY_DIRECT = 'https://toolblip-api-production.up.railway.app';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  group: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  auth: boolean;
  title: string;
  description: string;
  params?: Parameter[];
  bodyParams?: Parameter[];
  responseSchema?: { label: string; content: string }[];
  curl: string;
  response: string;
}

// ─── Endpoint Data ─────────────────────────────────────────────────────────────

const endpoints: Endpoint[] = [
  // ── Tools ──────────────────────────────────────────────────────────────────
  {
    group: 'tools',
    method: 'GET',
    path: '/api/tools',
    auth: false,
    title: 'List All Tools',
    description:
      'Returns a paginated list of all tools in the directory. Supports optional category filtering and full-text search across tool names and descriptions.',
    params: [
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Filter by category slug (e.g. "developer", "image", "writing")',
      },
      {
        name: 'search',
        type: 'string',
        required: false,
        description: 'Full-text search across tool name and description',
      },
      {
        name: 'page',
        type: 'integer',
        required: false,
        description: 'Page number for pagination (default: 1)',
      },
      {
        name: 'per_page',
        type: 'integer',
        required: false,
        description: 'Number of results per page (default: 20, max: 100)',
      },
    ],
    responseSchema: [
      { label: 'tools.tools[]', content: 'Array of Tool objects' },
      { label: 'tools.meta', content: 'Pagination metadata object (optional)' },
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
      },
      {
        "id": 2,
        "slug": "image-resizer",
        "name": "Image Resizer",
        "description": "Resize images to any dimension in seconds.",
        "category": "image",
        "is_pro": false,
        "emoji": "🖼️",
        "created_at": "2026-01-20T08:00:00Z"
      }
    ]
  }
}`,
  },
  {
    group: 'tools',
    method: 'GET',
    path: '/api/tools/{slug}',
    auth: false,
    title: 'Get Tool by Slug',
    description:
      'Returns a single tool by its URL-safe slug. Returns 404 if no matching tool is found.',
    params: [
      {
        name: 'slug',
        type: 'string',
        required: true,
        description:
          'Tool slug — the URL-safe identifier (e.g. "json-formatter", "image-resizer")',
      },
    ],
    responseSchema: [
      { label: 'tool.id', content: 'integer — Unique tool ID' },
      { label: 'tool.slug', content: 'string — URL-safe identifier' },
      { label: 'tool.name', content: 'string — Display name' },
      { label: 'tool.description', content: 'string — Full description' },
      { label: 'tool.category', content: 'string — Category slug' },
      { label: 'tool.is_pro', content: 'boolean — Requires Pro subscription' },
      { label: 'tool.emoji', content: 'string — Emoji icon (optional)' },
      { label: 'tool.created_at', content: 'string — ISO 8601 timestamp' },
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
    group: 'auth',
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    title: 'Register',
    description:
      'Create a new user account. Returns the user object and a Bearer token for use in subsequent authenticated requests.',
    bodyParams: [
      { name: 'name', type: 'string', required: true, description: 'Full display name' },
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'Email address — must be unique across all accounts',
      },
      {
        name: 'password',
        type: 'string',
        required: true,
        description: 'Password — minimum 8 characters',
      },
      {
        name: 'password_confirmation',
        type: 'string',
        required: true,
        description: 'Must match password exactly',
      },
    ],
    responseSchema: [
      { label: 'user.id', content: 'integer — User ID' },
      { label: 'user.name', content: 'string — Display name' },
      { label: 'user.email', content: 'string — Email address' },
      { label: 'user.is_pro', content: 'boolean — Pro subscription status' },
      { label: 'token', content: 'string — Bearer token for authenticated requests' },
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
    group: 'auth',
    method: 'POST',
    path: '/api/auth/login',
    auth: false,
    title: 'Login',
    description:
      'Authenticate an existing user. Returns a Bearer token to include in the Authorization header for all subsequent authenticated requests.',
    bodyParams: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'Account email address',
      },
      {
        name: 'password',
        type: 'string',
        required: true,
        description: 'Account password',
      },
    ],
    responseSchema: [
      { label: 'user.id', content: 'integer — User ID' },
      { label: 'user.name', content: 'string — Display name' },
      { label: 'user.email', content: 'string — Email address' },
      { label: 'user.is_pro', content: 'boolean — Pro subscription status' },
      { label: 'token', content: 'string — Bearer token for authenticated requests' },
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
    group: 'auth',
    method: 'POST',
    path: '/api/auth/logout',
    auth: true,
    title: 'Logout',
    description:
      'Invalidate the current session token. After calling this, the token can no longer be used for authenticated requests.',
    responseSchema: [{ label: 'message', content: 'string — Confirmation message' }],
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`,
    response: `{
  "message": "Logged out successfully"
}`,
  },
  {
    group: 'auth',
    method: 'GET',
    path: '/api/auth/user',
    auth: true,
    title: 'Get Authenticated User',
    description:
      'Returns the profile of the currently authenticated user. Use the Bearer token from the login or register response.',
    responseSchema: [
      { label: 'user.id', content: 'integer — User ID' },
      { label: 'user.name', content: 'string — Display name' },
      { label: 'user.email', content: 'string — Email address' },
      { label: 'user.is_pro', content: 'boolean — Pro subscription status' },
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  POST: 'bg-blue-50 text-blue-700 border border-blue-200',
  DELETE: 'bg-red-50 text-red-700 border border-red-200',
};

const groupMeta: Record<string, { label: string; icon: string }> = {
  tools: { label: 'Tools', icon: '🔧' },
  auth: { label: 'Authentication', icon: '🔑' },
};

const statusCodes = [
  {
    code: 200,
    label: 'OK',
    desc: 'Request succeeded. Response body contains the result.',
  },
  {
    code: 201,
    label: 'Created',
    desc: 'Resource created successfully (e.g. new user registered).',
  },
  {
    code: 400,
    label: 'Bad Request',
    desc: 'Invalid request body or parameters.',
  },
  {
    code: 401,
    label: 'Unauthorized',
    desc: 'Missing or invalid Bearer token.',
  },
  {
    code: 403,
    label: 'Forbidden',
    desc: 'Authenticated but not permitted to access this resource.',
  },
  {
    code: 404,
    label: 'Not Found',
    desc: 'The requested resource does not exist.',
  },
  {
    code: 422,
    label: 'Validation Error',
    desc: 'Request body failed validation. Check the message field for details.',
  },
  {
    code: 429,
    label: 'Too Many Requests',
    desc: 'Rate limit exceeded. Slow down and retry.',
  },
  {
    code: 500,
    label: 'Server Error',
    desc: 'Something went wrong on our end. Please retry.',
  },
];

// ─── UI Primitives ─────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
        methodColors[method] ?? 'bg-gray-100 text-gray-700 border border-gray-200'
      }`}
    >
      {method}
    </span>
  );
}

function AuthPill({ required }: { required: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        required
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-slate-100 text-slate-500 border-slate-200'
      }`}
    >
      {required ? (
        <>
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Auth required
        </>
      ) : (
        <>
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Public
        </>
      )}
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-[#0d1117] text-gray-100 rounded-xl p-4 text-sm font-mono overflow-x-auto leading-relaxed whitespace-pre">
      {code}
    </pre>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-gray-200 hover:bg-white/10 text-xs rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <svg
            className="w-3.5 h-3.5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function SectionDivider({ group }: { group: string }) {
  const meta = groupMeta[group];
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">{meta?.icon}</span>
      <h2 className="text-base font-bold text-slate-800">{meta?.label}</h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  const [openEndpoint, setOpenEndpoint] = useState<number | null>(null);
  const groups = [...new Set(endpoints.map((ep) => ep.group))];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
              <p className="text-slate-500 text-sm mt-0.5">Toolblip REST API Reference</p>
            </div>
          </div>

          <p className="text-slate-600 max-w-2xl mb-6 text-[15px] leading-relaxed">
            Integrate Toolblip into your apps. Browse the tool directory, register accounts,
            and manage authenticated sessions — all via simple JSON REST calls.
          </p>

          {/* ── Base URL + meta pills ──────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="inline-flex flex-col gap-1.5 bg-slate-900 rounded-xl px-5 py-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Base URL
              </span>
              <code className="text-sm font-mono text-emerald-400">{BASE_URL}</code>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Auth
              </span>
              <code className="text-sm font-mono text-slate-700">Bearer token</code>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">
                SSL
              </span>
              <span className="text-sm text-emerald-700">✅ Verified</span>
            </div>
          </div>

          {/* ── Infrastructure note ─────────────────────────────────────────── */}
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 max-w-xl">
            <svg
              className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Direct deploy URL:{' '}
              <code className="font-mono text-slate-600">{RAILWAY_DIRECT}</code>.
              Use this if {BASE_URL} is unavailable.
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                Endpoints
              </p>
              <nav className="space-y-5">
                {groups.map((group) => (
                  <div key={group}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
                      {groupMeta[group]?.icon} {groupMeta[group]?.label}
                    </p>
                    <div className="space-y-0.5">
                      {endpoints
                        .map((ep, i) => ({ ep, i }))
                        .filter(({ ep }) => ep.group === group)
                        .map(({ ep, i }) => (
                          <button
                            key={i}
                            onClick={() => {
                              setOpenEndpoint(openEndpoint === i ? null : i);
                              document
                                .getElementById(`endpoint-${i}`)
                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                              openEndpoint === i
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <MethodBadge method={ep.method} />
                            <span className="truncate font-mono text-xs flex-1">{ep.path}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </nav>

              {/* ── Quick nav ──────────────────────────────────────────────── */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                  On this page
                </p>
                <div className="space-y-1">
                  <a
                    href="#overview"
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Overview
                  </a>
                  <a
                    href="#tools"
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Tools
                  </a>
                  <a
                    href="#auth"
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Authentication
                  </a>
                  <a
                    href="#status-codes"
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Status Codes
                  </a>
                  <a
                    href="#help"
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Get Help
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <main className="lg:col-span-3 space-y-12">

            {/* ── Overview cards ────────────────────────────────────────── */}
            <section id="overview">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">Bearer Token Auth</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Pass the token from register or login in the Authorization header.
                  </p>
                  <CodeBlock code="Authorization: Bearer {token}" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">JSON Throughout</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    All requests and responses use JSON. Always include both headers.
                  </p>
                  <CodeBlock code="Content-Type: application/json\nAccept: application/json" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">Rate Limits</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Public: <strong>60 req/min</strong>. Authenticated: <strong>120 req/min</strong>.
                    Pro users enjoy higher limits.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">Error Format</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Errors return JSON with a{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1 rounded">message</code>{' '}
                    field. Codes: 400, 401, 403, 404, 422, 500.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Endpoint groups ─────────────────────────────────────────── */}
            {groups.map((group) => (
              <section key={group} id={group}>
                <SectionDivider group={group} />
                <div className="space-y-3">
                  {endpoints
                    .map((ep, i) => ({ ep, i }))
                    .filter(({ ep }) => ep.group === group)
                    .map(({ ep, i }) => (
                      <EndpointCard
                        key={i}
                        ep={ep}
                        i={i}
                        openEndpoint={openEndpoint}
                        toggleEndpoint={(idx) => setOpenEndpoint(idx === i ? null : idx)}
                      />
                    ))}
                </div>
              </section>
            ))}

            {/* ── HTTP Status Codes ──────────────────────────────────────── */}
            <section id="status-codes">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">📡</span>
                <h2 className="text-base font-bold text-slate-800">HTTP Status Codes</h2>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold text-slate-700 text-xs w-24">
                        Code
                      </th>
                      <th className="px-5 py-3 text-left font-semibold text-slate-700 text-xs w-32">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left font-semibold text-slate-700 text-xs">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {statusCodes.map((s) => (
                      <tr key={s.code} className="hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold ${
                              s.code >= 500
                                ? 'bg-red-50 text-red-700'
                                : s.code >= 400
                                  ? 'bg-amber-50 text-amber-700'
                                  : s.code >= 300
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {s.code}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs font-medium text-slate-700">{s.label}</td>
                        <td className="px-5 py-3 text-xs text-slate-600">{s.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Help CTA ───────────────────────────────────────────────── */}
            <section
              id="help"
              className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-6"
            >
              <h2 className="text-base font-bold text-slate-900 mb-1">Need help?</h2>
              <p className="text-sm text-slate-600 mb-4">
                Questions about the API? Reach out at{' '}
                <a href="mailto:api@toolblip.com" className="text-indigo-600 hover:underline">
                  api@toolblip.com
                </a>{' '}
                or open an issue on GitHub.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/toolblip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Explore Toolblip →
                </Link>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700">Toolblip API</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link
                href="/api-docs"
                className="hover:text-indigo-600 transition-colors"
              >
                Documentation
              </Link>
              <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
                Privacy
              </Link>
              <a
                href="mailto:api@toolblip.com"
                className="hover:text-indigo-600 transition-colors"
              >
                api@toolblip.com
              </a>
            </div>
            <span className="text-xs text-slate-400">© {new Date().getFullYear()} Toolblip</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// ─── Endpoint Card ─────────────────────────────────────────────────────────────

function ParamTable({ params, body }: { params: Parameter[]; body?: boolean }) {
  if (params.length === 0) return null;
  return (
    <div>
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {body ? 'Body Parameters' : 'Query Parameters'}
      </h4>
      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs">
                Name
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs">
                Type
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs">
                Required
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {params.map((p, pi) => (
              <tr key={pi}>
                <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">{p.name}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500">{p.type}</td>
                <td className="px-4 py-2.5 text-xs">
                  {p.required ? (
                    <span className="text-red-500 font-medium">Yes</span>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-xs text-slate-600">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResponseSchema({ schema }: { schema: { label: string; content: string }[] }) {
  if (!schema || schema.length === 0) return null;
  return (
    <div>
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        Response Schema
      </h4>
      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs">
                Field
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs">
                Type / Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schema.map((s, si) => (
              <tr key={si}>
                <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">{s.label}</td>
                <td className="px-4 py-2.5 text-xs text-slate-600">{s.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointCard({
  ep,
  i,
  openEndpoint,
  toggleEndpoint,
}: {
  ep: Endpoint;
  i: number;
  openEndpoint: number | null;
  toggleEndpoint: (i: number) => void;
}) {
  const isOpen = openEndpoint === i;

  return (
    <div id={`endpoint-${i}`} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => toggleEndpoint(i)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <MethodBadge method={ep.method} />
        <code className="font-mono text-sm text-slate-800">{ep.path}</code>
        <span className="text-sm text-slate-500 flex-1 truncate">{ep.title}</span>
        <AuthPill required={ep.auth} />
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 px-5 py-5 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed">{ep.description}</p>

          {ep.params && ep.params.length > 0 && <ParamTable params={ep.params} />}
          {ep.bodyParams && ep.bodyParams.length > 0 && (
            <ParamTable params={ep.bodyParams} body />
          )}
          {ep.responseSchema && <ResponseSchema schema={ep.responseSchema} />}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Example Request
              </h4>
              <CopyButton text={ep.curl} />
            </div>
            <CodeBlock code={ep.curl} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Example Response
              </h4>
              <CopyButton text={ep.response} />
            </div>
            <CodeBlock code={ep.response} />
          </div>
        </div>
      )}
    </div>
  );
}
