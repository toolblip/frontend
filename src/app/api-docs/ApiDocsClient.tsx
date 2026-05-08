'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const FUTURE_BASE_URL = 'https://api.toolblip.com';

type HttpMethod = 'GET' | 'POST';

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  id: string;
  group: string;
  method: HttpMethod;
  path: string;
  auth: boolean;
  title: string;
  description: string;
  bodyParams?: Param[];
  queryParams?: Param[];
  responseShape?: string;
  curl: string;
  response: string;
}

const ENDPOINTS: Endpoint[] = [
  // ── Tools ─────────────────────────────────────────────────────────────
  {
    id: 'list-tools',
    group: 'tools',
    method: 'GET',
    path: '/api/tools',
    auth: false,
    title: 'List all tools',
    description:
      'Returns a paginated list of all tools. Optionally filter by category or search by keyword.',
    queryParams: [
      { name: 'category', type: 'string', required: false, description: 'Filter by category slug, e.g. developer, productivity, qr-codes' },
      { name: 'search', type: 'string', required: false, description: 'Full-text search across tool names and descriptions' },
      { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
      { name: 'per_page', type: 'integer', required: false, description: 'Results per page (default: 20, max: 100)' },
    ],
    responseShape: '{ tools: { tools: Tool[], meta: { current_page, total, per_page, last_page } } }',
    curl: `curl -X GET "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"

# With filters
curl -X GET "${BASE_URL}/api/tools?category=developer&search=json&page=1&per_page=10" \\
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
    title: 'Get a single tool',
    description: 'Returns a single tool by its URL-safe slug. Returns 404 if the slug does not exist.',
    responseShape: '{ tool: Tool }',
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

  // ── Auth ───────────────────────────────────────────────────────────────
  {
    id: 'register',
    group: 'auth',
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    title: 'Register',
    description: 'Create a new user account. Returns a Bearer token for use in authenticated requests.',
    bodyParams: [
      { name: 'name', type: 'string', required: true, description: 'Full display name' },
      { name: 'email', type: 'string', required: true, description: 'Email address — must be unique' },
      { name: 'password', type: 'string', required: true, description: 'Password — minimum 8 characters' },
      { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password exactly' },
    ],
    responseShape: '{ user: User, token: string }',
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
    responseShape: '{ user: User, token: string }',
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
    responseShape: '{ message: string }',
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Accept: application/json"`,
    response: `{
  "message": "Logged out"
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
    responseShape: '{ user: User }',
    curl: `curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
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
  { code: 200, label: 'OK', desc: 'Request succeeded.', color: 'text-green-600 dark:text-green-400' },
  { code: 201, label: 'Created', desc: 'Resource created successfully.', color: 'text-green-600 dark:text-green-400' },
  { code: 400, label: 'Bad Request', desc: 'Invalid request body or parameters.', color: 'text-red-600 dark:text-red-400' },
  { code: 401, label: 'Unauthorized', desc: 'Missing or invalid Bearer token.', color: 'text-red-600 dark:text-red-400' },
  { code: 403, label: 'Forbidden', desc: 'Authenticated but not permitted.', color: 'text-red-600 dark:text-red-400' },
  { code: 404, label: 'Not Found', desc: 'The requested resource does not exist.', color: 'text-amber-600 dark:text-amber-400' },
  { code: 422, label: 'Unprocessable Entity', desc: 'Request body failed validation.', color: 'text-amber-600 dark:text-amber-400' },
  { code: 429, label: 'Too Many Requests', desc: 'Rate limit exceeded.', color: 'text-amber-600 dark:text-amber-400' },
  { code: 500, label: 'Server Error', desc: 'Something went wrong on our end.', color: 'text-red-600 dark:text-red-400' },
];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
};

const METHOD_BORDER: Record<HttpMethod, string> = {
  GET: 'border-emerald-300 dark:border-emerald-800',
  POST: 'border-blue-300 dark:border-blue-800',
};

// ── Copy button ─────────────────────────────────────────────────────────────────

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
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-500">Copied</span>
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

// ── Code block ─────────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-[#0d1117] text-slate-300 rounded-xl p-4 text-[12.5px] font-mono overflow-x-auto leading-relaxed whitespace-pre">
      {code}
    </pre>
  );
}

// ── Param table ────────────────────────────────────────────────────────────────

function ParamTable({ params, body }: { params: Param[]; body?: boolean }) {
  return (
    <div className="mb-5">
      <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {body ? 'Body Parameters' : 'Query Parameters'}
      </h4>
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs w-44">Name</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs w-20">Type</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs w-20">Required</th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {params.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                <td className="px-4 py-2.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium">{p.name}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-500">{p.type}</td>
                <td className="px-4 py-2.5 text-xs">
                  {p.required ? (
                    <span className="text-red-500 font-medium">Yes</span>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Response shape badge ───────────────────────────────────────────────────────

function ResponseShape({ shape }: { shape: string }) {
  return (
    <div className="mb-5">
      <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Response Shape</h4>
      <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 block">
        {shape}
      </code>
    </div>
  );
}

// ── Endpoint card ─────────────────────────────────────────────────────────────

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      id={ep.id}
      className={`bg-white dark:bg-slate-900 rounded-2xl border ${METHOD_BORDER[ep.method]} dark:border-slate-800 overflow-hidden transition-all hover:shadow-sm scroll-mt-20`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        aria-expanded={open}
      >
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold flex-shrink-0 ${METHOD_COLORS[ep.method]}`}>
          {ep.method}
        </span>
        <code className="font-mono text-sm text-slate-800 dark:text-slate-200 font-medium">{ep.path}</code>
        <span className="text-sm text-slate-500 dark:text-slate-400 flex-1 truncate">{ep.title}</span>
        {ep.auth && (
          <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 px-2 py-0.5 rounded-full flex-shrink-0">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Auth
          </span>
        )}
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-6 space-y-5 bg-slate-50/40 dark:bg-slate-900/50">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{ep.description}</p>

          {ep.bodyParams && ep.bodyParams.length > 0 && <ParamTable params={ep.bodyParams} body />}
          {ep.queryParams && ep.queryParams.length > 0 && <ParamTable params={ep.queryParams} />}
          {ep.responseShape && <ResponseShape shape={ep.responseShape} />}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Example Request</h4>
              <CopyButton text={ep.curl} />
            </div>
            <CodeBlock code={ep.curl} />
          </div>

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

// ── Main component ─────────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    ENDPOINTS.forEach((ep) => {
      const el = document.getElementById(ep.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-start gap-4 mb-10">
            <div className="w-12 h-12 bg-[#58D65D] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">API Documentation</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Toolblip REST API — integrate tools and user auth into any app
              </p>
            </div>
          </div>

          {/* Key info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-xl px-4 py-3.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Base URL</span>
              <code className="text-sm font-mono text-[#58D65D] break-all">{BASE_URL}</code>
              <span className="text-xs text-slate-500 mt-0.5 block">{FUTURE_BASE_URL} once SSL is ready</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Auth</span>
                <code className="text-xs font-mono text-slate-700 dark:text-slate-300">Bearer token</code>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Format</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">JSON only</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Rate Limit</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">60 req/min (public) · 300 req/min (auth)</span>
              </div>
            </div>
          </div>

          {/* Auth callout */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#58D65D] dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-0.5">Authentication</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Pass the token from{' '}
                <code className="font-mono text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">register</code>{' '}
                or{' '}
                <code className="font-mono text-xs bg-emerald-100 dark:bg-emerald-900/50 px-1 rounded">login</code>{' '}
                in every authenticated request:
              </p>
              <code className="mt-2 block bg-slate-900 dark:bg-slate-800 text-[#58D65D] dark:text-emerald-300 rounded-lg px-3 py-2 text-xs font-mono">
                Authorization: Bearer &lt;your-token&gt;
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 px-1">
                  Endpoints
                </p>
                <nav className="space-y-5">
                  {GROUPS.map((g) => (
                    <div key={g.id}>
                      <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider mb-1.5 px-1">
                        {g.icon} {g.label}
                      </p>
                      <div className="space-y-0.5">
                        {ENDPOINTS.filter((ep) => ep.group === g.id).map((ep) => {
                          const isActive = activeId === ep.id;
                          return (
                            <button
                              key={ep.id}
                              onClick={() => scrollTo(ep.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                                isActive
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                              }`}
                            >
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${METHOD_COLORS[ep.method]}`}>
                                {ep.method}
                              </span>
                              <span className="truncate font-mono text-xs flex-1">{ep.path}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 px-1">
                  On this page
                </p>
                <nav className="space-y-0.5">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'quick-start', label: 'Quick Start' },
                    { id: 'tools', label: 'Tools' },
                    { id: 'auth', label: 'Authentication' },
                    { id: 'status-codes', label: 'Status Codes' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className="block w-full px-3 py-1.5 text-xs text-slate-500 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="lg:col-span-4 space-y-14">

            {/* Overview */}
            <section id="overview">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Overview</h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#58D65D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: 'Bearer Token Auth',
                    desc: 'Pass the token from register or login in the Authorization header.',
                    code: 'Authorization: Bearer {token}',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#58D65D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    ),
                    title: 'JSON Throughout',
                    desc: 'All requests and responses use JSON. Always include both headers.',
                    code: 'Content-Type: application/json\nAccept: application/json',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#58D65D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: 'Rate Limits',
                    desc: 'Public endpoints: 60 requests/minute. Authenticated: 300 requests/minute.',
                    code: undefined,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#58D65D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ),
                    title: 'Error Format',
                    desc: 'Errors return JSON with a message field. Common codes: 400, 401, 403, 404, 422, 500.',
                    code: undefined,
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center flex-shrink-0">
                        {card.icon}
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{card.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{card.desc}</p>
                    {card.code && <CodeBlock code={card.code} />}
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Start */}
            <section id="quick-start">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Start</h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-900 dark:bg-slate-800 px-5 py-3 border-b border-slate-700/50 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">bash</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-500">3-step example</span>
                </div>
                <pre className="text-[12.5px] font-mono text-slate-300 p-5 overflow-x-auto leading-relaxed whitespace-pre">{`# 1. Register a new account
curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secretpass123","password_confirmation":"secretpass123"}'

# Response: { "user": {...}, "token": "1|Xr8Kb..." }
# → Save the token — you need it for authenticated requests

# 2. Fetch your user profile
curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Accept: application/json"

# 3. List all tools (no auth required)
curl -X GET "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`}</pre>
              </div>
            </section>

            {/* Endpoint sections */}
            {GROUPS.map((g) => (
              <section key={g.id} id={g.id} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {g.icon} {g.label}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-3">
                  {ENDPOINTS.filter((ep) => ep.group === g.id).map((ep) => (
                    <EndpointCard key={ep.id} ep={ep} />
                  ))}
                </div>
              </section>
            ))}

            {/* HTTP Status Codes */}
            <section id="status-codes">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">HTTP Status Codes</h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs w-24">Code</th>
                      <th className="px-5 py-3.5 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs w-36">Status</th>
                      <th className="px-5 py-3.5 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {STATUS_CODES.map((s) => (
                      <tr key={s.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${s.color}`}>
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
            <section
              id="get-help"
              className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900 p-7"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Need help with the API?</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                Questions about integration? Reach out at{' '}
                <a href="mailto:api@toolblip.com" className="text-[#58D65D] dark:text-emerald-400 hover:underline font-medium">
                  api@toolblip.com
                </a>{' '}
                or open an issue on GitHub.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/toolblip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#58D65D] dark:bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-[#4bc44e] dark:hover:bg-emerald-500 transition-colors"
                >
                  Explore Toolblip →
                </Link>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
