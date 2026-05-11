'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const FUTURE_BASE_URL = 'https://api.toolblip.com';

type Method = 'GET' | 'POST';

type Endpoint = {
  id: string;
  group: 'Tools' | 'Authentication';
  method: Method;
  path: string;
  title: string;
  description: string;
  auth: boolean;
  status: string;
  responseShape: string;
  pathParams?: { name: string; type: string; required: boolean; description: string }[];
  query?: { name: string; type: string; required: boolean; description: string }[];
  body?: { name: string; type: string; required: boolean; description: string }[];
  curl: string;
  response: string;
};

const endpoints: Endpoint[] = [
  {
    id: 'list-tools',
    group: 'Tools',
    method: 'GET',
    path: '/api/tools',
    title: 'List all tools',
    description: 'Returns the full public directory. Tools are nested at tools.tools to match the app client contract.',
    auth: false,
    status: '200 OK',
    responseShape: '{ tools: { tools: [...] } }',
    query: [
      { name: 'category', type: 'string', required: false, description: 'Filter by category slug or name.' },
      { name: 'search', type: 'string', required: false, description: 'Search tool names and descriptions.' },
      { name: 'page', type: 'number', required: false, description: 'Pagination page number.' },
      { name: 'per_page', type: 'number', required: false, description: 'Items per page.' },
    ],
    curl: `curl "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`,
    response: `{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "json-formatter",
        "name": "JSON Formatter",
        "description": "Format, validate, and prettify JSON data instantly.",
        "category": "Developer",
        "is_pro": false,
        "emoji": "🧰",
        "created_at": "2026-01-15T10:30:00.000000Z"
      }
    ]
  }
}`,
  },
  {
    id: 'get-tool',
    group: 'Tools',
    method: 'GET',
    path: '/api/tools/{slug}',
    title: 'Get a single tool',
    description: 'Fetch metadata for one tool by its slug. Use the slug returned by GET /api/tools.',
    auth: false,
    status: '200 OK',
    responseShape: '{ tool }',
    pathParams: [
      { name: 'slug', type: 'string', required: true, description: 'Tool slug, e.g. json-formatter.' },
    ],
    curl: `curl "${BASE_URL}/api/tools/json-formatter" \\
  -H "Accept: application/json"`,
    response: `{
  "tool": {
    "id": 1,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format, validate, and prettify JSON data instantly.",
    "category": "Developer",
    "is_pro": false,
    "emoji": "🧰",
    "created_at": "2026-01-15T10:30:00.000000Z"
  }
}`,
  },
  {
    id: 'register',
    group: 'Authentication',
    method: 'POST',
    path: '/api/auth/register',
    title: 'Register',
    description: 'Create a new account and receive a Bearer token for authenticated requests.',
    auth: false,
    status: '201 Created',
    responseShape: '{ user, token }',
    body: [
      { name: 'name', type: 'string', required: true, description: 'Display name for the account.' },
      { name: 'email', type: 'string', required: true, description: 'Unique email address.' },
      { name: 'password', type: 'string', required: true, description: 'Account password.' },
      { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password.' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "correct-horse-battery-staple",
    "password_confirmation": "correct-horse-battery-staple"
  }'`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  },
  "token": "1|exampleBearerToken"
}`,
  },
  {
    id: 'login',
    group: 'Authentication',
    method: 'POST',
    path: '/api/auth/login',
    title: 'Login',
    description: 'Exchange email and password for a Bearer token.',
    auth: false,
    status: '200 OK',
    responseShape: '{ user, token }',
    body: [
      { name: 'email', type: 'string', required: true, description: 'Account email address.' },
      { name: 'password', type: 'string', required: true, description: 'Account password.' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "jane@example.com",
    "password": "correct-horse-battery-staple"
  }'`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false
  },
  "token": "2|exampleBearerToken"
}`,
  },
  {
    id: 'logout',
    group: 'Authentication',
    method: 'POST',
    path: '/api/auth/logout',
    title: 'Logout',
    description: 'Revoke the current token. It stops working immediately.',
    auth: true,
    status: '200 OK',
    responseShape: '{ message }',
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Accept: application/json"`,
    response: `{
  "message": "Logged out successfully"
}`,
  },
  {
    id: 'auth-user',
    group: 'Authentication',
    method: 'GET',
    path: '/api/auth/user',
    title: 'Get authenticated user',
    description: 'Return the user profile attached to the supplied Bearer token.',
    auth: true,
    status: '200 OK',
    responseShape: '{ user }',
    curl: `curl "${BASE_URL}/api/auth/user" \\
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

const methodColors: Record<Method, string> = {
  GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-slate-700/60 px-2.5 py-1 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white active:scale-95"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-200"><code>{code}</code></pre>
    </div>
  );
}

function ParamsTable({ params, title }: { params: { name: string; type: string; required: boolean; description: string }[]; title: string }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Field</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.name} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-2.5">
                  <code className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</code>
                  {p.required && <span className="ml-1.5 text-xs font-bold text-rose-500">*</span>}
                </td>
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{p.type}</td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <article id={endpoint.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#58D65D]">{endpoint.group}</p>
          <h3 className="mt-1.5 text-2xl font-black text-slate-950 dark:text-white">{endpoint.title}</h3>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-300">{endpoint.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${endpoint.auth ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
            {endpoint.auth ? '🔒 Auth required' : 'Public'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {endpoint.status}
          </span>
        </div>
      </div>

      {/* Method + Path */}
      <div className="mx-6 mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/70">
        <span className={`rounded-lg px-2.5 py-1 text-xs font-black uppercase ${methodColors[endpoint.method]}`}>{endpoint.method}</span>
        <code className="font-mono text-sm text-slate-900 dark:text-slate-100">{endpoint.path}</code>
        <span className="hidden h-4 w-px bg-slate-300 dark:bg-slate-700 sm:block" />
        <code className="hidden text-xs text-slate-400 sm:block">{BASE_URL}{endpoint.path}</code>
      </div>

      {/* Params */}
      {endpoint.pathParams && <ParamsTable params={endpoint.pathParams} title="Path parameters" />}
      {endpoint.query && <ParamsTable params={endpoint.query} title="Query parameters" />}
      {endpoint.body && <ParamsTable params={endpoint.body} title="Request body" />}

      {/* Examples */}
      <div className="mt-5 grid gap-3 px-6 pb-6 sm:grid-cols-2">
        <CodeBlock label="curl" code={endpoint.curl} />
        <CodeBlock label="JSON response" code={endpoint.response} />
      </div>
    </article>
  );
}

const authSection = `# 1. Register or login to get a token
RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"email":"jane@example.com","password":"your-password"}')

TOKEN=$(echo $RESPONSE | jq -r .token)

# 2. Use the token on protected endpoints
curl "${BASE_URL}/api/auth/user" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Accept: application/json"

# 3. Revoke the token when done
curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Accept: application/json"`;

export default function ApiDocsClient() {
  const tools = endpoints.filter((e) => e.group === 'Tools');
  const auth = endpoints.filter((e) => e.group === 'Authentication');

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tools: true,
    authentication: true,
  });

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#58D65D]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Toolblip
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#58D65D]">REST API Reference</p>
              <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl">Toolblip API Docs</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Integrate the Toolblip API into your app or script. Authenticate with Bearer tokens, query tools, and manage user accounts — with copy-ready curl examples and real JSON responses.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#endpoints" className="rounded-full bg-[#58D65D] px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20">
                  Browse endpoints
                </a>
                <a href="#auth" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  Auth quick start
                </a>
              </div>
            </div>

            {/* Base URL card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Base URL</p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Production</p>
                  <code className="block break-all rounded-xl bg-slate-50 p-3 text-sm font-mono text-slate-900 dark:bg-slate-950 dark:text-emerald-400">{BASE_URL}</code>
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Custom domain{' '}
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">SSL pending</span>
                  </p>
                  <code className="block break-all rounded-xl bg-slate-50 p-3 text-sm font-mono text-slate-900 dark:bg-slate-950 dark:text-emerald-400">{FUTURE_BASE_URL}</code>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Use the Railway URL for all requests today. Switch to api.toolblip.com once SSL is ready — paths and responses are identical.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr] lg:px-8">
        {/* Sidebar nav */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">On this page</p>
            <nav className="mt-4 space-y-1">
              <a href="#auth" className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                Authentication
              </a>
              {endpoints.map((ep) => (
                <a key={ep.id} href={`#${ep.id}`} className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                  <span className={`mr-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${methodColors[ep.method]}`}>{ep.method}</span>
                  {ep.title}
                </a>
              ))}
              <a href="#errors" className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                Errors
              </a>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-8">
          {/* Auth quick start */}
          <section id="auth" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Authentication</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              Pass your token as{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">Authorization: Bearer YOUR_TOKEN</code>{' '}
              on protected endpoints. Tokens are returned by{' '}
              <a href="#register" className="font-semibold text-[#58D65D] hover:underline">register</a> and{' '}
              <a href="#login" className="font-semibold text-[#58D65D] hover:underline">login</a>. Keep tokens private — never put them in URLs.
            </p>
            <div className="mt-5">
              <CodeBlock label="Auth workflow (bash)" code={authSection} />
            </div>
          </section>

          {/* Endpoint overview table */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Endpoint overview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Method</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Path</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Auth</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Response</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((ep) => (
                    <tr key={ep.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`rounded px-2 py-1 text-xs font-black uppercase ${methodColors[ep.method]}`}>{ep.method}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <a href={`#${ep.id}`} className="font-mono text-slate-900 hover:text-[#58D65D] dark:text-slate-100 dark:hover:text-emerald-400">{ep.path}</a>
                      </td>
                      <td className="px-5 py-3.5">
                        {ep.auth ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                            Bearer token
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <code className="text-xs text-slate-500 dark:text-slate-400">{ep.responseShape}</code>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{ep.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Endpoint sections */}
          <section id="endpoints">
            {/* Tools */}
            <button
              onClick={() => toggleSection('tools')}
              className="mb-5 flex w-full items-center gap-3 text-left"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Endpoints</p>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white">Tools</h2>
              <svg
                className={`ml-auto h-5 w-5 text-slate-400 transition-transform duration-200 ${openSections.tools ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`space-y-5 transition-all duration-200 ${openSections.tools ? 'opacity-100' : 'hidden opacity-0'}`}>
              {tools.map((ep) => <EndpointCard key={ep.id} endpoint={ep} />)}
            </div>

            {/* Authentication */}
            <button
              onClick={() => toggleSection('authentication')}
              className="mb-5 mt-8 flex w-full items-center gap-3 text-left"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Endpoints</p>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white">Authentication</h2>
              <svg
                className={`ml-auto h-5 w-5 text-slate-400 transition-transform duration-200 ${openSections.authentication ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`space-y-5 transition-all duration-200 ${openSections.authentication ? 'opacity-100' : 'hidden opacity-0'}`}>
              {auth.map((ep) => <EndpointCard key={ep.id} endpoint={ep} />)}
            </div>
          </section>

          {/* Errors */}
          <section id="errors" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Errors</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              All errors return JSON with a <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">message</code> field. Validation errors include an <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">errors</code> object keyed by field name.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CodeBlock label="401 Unauthorized" code={`{
  "message": "Unauthenticated."
}`} />
              <CodeBlock label="422 Validation error" code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}`} />
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Common status codes</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><code className="font-mono font-semibold text-slate-900 dark:text-slate-100">200</code> — OK</li>
                  <li><code className="font-mono font-semibold text-slate-900 dark:text-slate-100">201</code> — Created</li>
                  <li><code className="font-mono font-semibold text-slate-900 dark:text-slate-100">401</code> — Unauthenticated</li>
                  <li><code className="font-mono font-semibold text-slate-900 dark:text-slate-100">404</code> — Not found</li>
                  <li><code className="font-mono font-semibold text-slate-900 dark:text-slate-100">422</code> — Validation failed</li>
                  <li><code className="font-mono font-semibold text-slate-900 dark:text-slate-100">500</code> — Server error</li>
                </ul>
              </div>
              <CodeBlock label="404 Not found" code={`{
  "message": "Tool not found."
}`} />
            </div>
          </section>

          {/* Model reference */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Model reference</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              Toolblip wraps all resources in top-level objects. A single tool is{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">&#123; tool: &#123;...&#125; &#125;</code>. The directory is{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">&#123; tools: &#123; tools: [...] &#125; &#125;</code>.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CodeBlock label="Tool object" code={`{
  "id": 1,
  "slug": "json-formatter",
  "name": "JSON Formatter",
  "description": "Format, validate, and prettify JSON data instantly.",
  "category": "Developer",
  "is_pro": false,
  "emoji": "🧰",
  "created_at": "2026-01-15T10:30:00.000000Z"
}`} />
              <CodeBlock label="User object" code={`{
  "id": 42,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "is_pro": false
}`} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
