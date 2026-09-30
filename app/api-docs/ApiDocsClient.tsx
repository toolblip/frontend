'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';

const BASE_URL = 'https://api.toolblip.com';

type Method = 'GET' | 'POST';
type AuthMode = 'No auth required' | 'Bearer token required';
type HeaderSpec = { name: string; value: string; when: string };

type Field = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type Endpoint = {
  id: string;
  group: 'Tools' | 'Authentication';
  method: Method;
  path: string;
  title: string;
  description: string;
  auth: AuthMode;
  status: string;
  responseShape: string;
  headers: HeaderSpec[];
  pathParams?: Field[];
  query?: Field[];
  body?: Field[];
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
    description: 'Returns a paginated list of public API tool records. The array is in data and pagination details are in meta.',
    auth: 'No auth required',
    status: '200 OK',
    responseShape: '{ data: [...], meta: { ... } }',
    headers: [{ name: 'Accept', value: 'application/json', when: 'Recommended for all requests' }],
    query: [
      { name: 'category', type: 'string', required: false, description: 'Filter by exact category value, for example formatter.' },
      { name: 'search', type: 'string', required: false, description: 'Search tool names and descriptions.' },
      { name: 'page', type: 'number', required: false, description: 'Pagination page number.' },
      { name: 'per_page', type: 'number', required: false, description: 'Number of tools per page (default 20, maximum 100).' },
    ],
    curl: `curl "${BASE_URL}/api/tools?per_page=1" \\\n  -H "Accept: application/json"`,
    response: `{
  "data": [
    {
      "id": 2,
      "slug": "base64",
      "name": "Base64 Encoder/Decoder",
      "category": "encoder",
      "is_pro": false
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 1,
    "per_page": 1,
    "last_page": 1
  }
}`,
  },
  {
    id: 'get-tool',
    group: 'Tools',
    method: 'GET',
    path: '/api/tools/{slug}',
    title: 'Get a single tool',
    description: 'Fetch metadata for one tool by slug. Use the slug returned by GET /api/tools.',
    auth: 'No auth required',
    status: '200 OK',
    responseShape: '{ data: { ... } }',
    headers: [{ name: 'Accept', value: 'application/json', when: 'Recommended for all requests' }],
    pathParams: [
      { name: 'slug', type: 'string', required: true, description: 'Tool slug, for example json-formatter.' },
    ],
    curl: `curl "${BASE_URL}/api/tools/json-formatter" \\\n  -H "Accept: application/json"`,
    response: `{
  "data": {
    "id": 1,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format and validate JSON data with syntax highlighting.",
    "category": "formatter",
    "icon": "{}",
    "is_pro": false,
    "view_count": 0,
    "share_count": 0,
    "favorite_count": 0
  }
}`,
  },
  {
    id: 'register',
    group: 'Authentication',
    method: 'POST',
    path: '/api/auth/register',
    title: 'Register',
    description: 'If registration is enabled, create an account after the person accepts the terms and receive a Bearer token.',
    auth: 'No auth required',
    status: '201 Created',
    responseShape: '{ user, token }',
    headers: [
      { name: 'Content-Type', value: 'application/json', when: 'Required when sending JSON body' },
      { name: 'Accept', value: 'application/json', when: 'Recommended for all requests' },
    ],
    body: [
      { name: 'name', type: 'string', required: true, description: 'Display name for the account.' },
      { name: 'email', type: 'string', required: true, description: 'Unique email address.' },
      { name: 'password', type: 'string', required: true, description: 'Account password, at least 8 characters.' },
      { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password.' },
      { name: 'accepted_terms', type: 'boolean', required: true, description: 'Send true only after the person registering has accepted the terms.' },
    ],
    curl: `# Run only after the person registering has accepted the terms.
curl -X POST "${BASE_URL}/api/auth/register" \\\n  -H "Content-Type: application/json" \\\n  -H "Accept: application/json" \\\n  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "correct-horse-battery-staple",
    "password_confirmation": "correct-horse-battery-staple",
    "accepted_terms": true
  }'`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false,
    "requires_terms_acceptance": false
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
    description: 'Exchange an email and password for a Bearer token.',
    auth: 'No auth required',
    status: '200 OK',
    responseShape: '{ user, token }',
    headers: [
      { name: 'Content-Type', value: 'application/json', when: 'Required when sending JSON body' },
      { name: 'Accept', value: 'application/json', when: 'Recommended for all requests' },
    ],
    body: [
      { name: 'email', type: 'string', required: true, description: 'Account email address.' },
      { name: 'password', type: 'string', required: true, description: 'Account password.' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/login" \\\n  -H "Content-Type: application/json" \\\n  -H "Accept: application/json" \\\n  -d '{
    "email": "jane@example.com",
    "password": "correct-horse-battery-staple"
  }'`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false,
    "requires_terms_acceptance": false
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
    description: 'Revoke the current token. The token used for the request stops working immediately.',
    auth: 'Bearer token required',
    status: '200 OK',
    responseShape: '{ message }',
    headers: [
      { name: 'Authorization', value: 'Bearer YOUR_TOKEN', when: 'Required' },
      { name: 'Accept', value: 'application/json', when: 'Recommended for all requests' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Accept: application/json"`,
    response: `{
  "message": "Logged out"
}`,
  },
  {
    id: 'auth-user',
    group: 'Authentication',
    method: 'GET',
    path: '/api/auth/me',
    title: 'Get authenticated user',
    description: 'Return the user profile attached to the supplied Bearer token.',
    auth: 'Bearer token required',
    status: '200 OK',
    responseShape: '{ user }',
    headers: [
      { name: 'Authorization', value: 'Bearer YOUR_TOKEN', when: 'Required' },
      { name: 'Accept', value: 'application/json', when: 'Recommended for all requests' },
    ],
    curl: `curl "${BASE_URL}/api/auth/me" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Accept: application/json"`,
    response: `{
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_pro": false,
    "requires_terms_acceptance": false
  }
}`,
  },
];

const methodClass: Record<Method, string> = {
  GET: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
  POST: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
};

const endpointGroups = [
  { label: 'Tools', endpoints: endpoints.filter((endpoint) => endpoint.group === 'Tools') },
  { label: 'Authentication', endpoints: endpoints.filter((endpoint) => endpoint.group === 'Authentication') },
];

const starterRequest = `curl "${BASE_URL}/api/tools?per_page=1" \\\n  -H "Accept: application/json"`;

const authenticatedRequest = `curl "${BASE_URL}/api/auth/me" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Accept: application/json"`;

const tokenFlow = `# 1. Register or login to receive a token
TOKEN=$(curl -s -X POST "${BASE_URL}/api/auth/login" \\\n  -H "Content-Type: application/json" \\\n  -H "Accept: application/json" \\\n  -d '{"email":"jane@example.com","password":"your-password"}' \\\n  | jq -r .token)

# 2. Use the token on protected endpoints
curl "${BASE_URL}/api/auth/me" \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Accept: application/json"

# 3. Revoke the token when done
curl -X POST "${BASE_URL}/api/auth/logout" \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Accept: application/json"`;

const unauthorizedResponse = `{
  "error": {
    "code": "AUTH_INVALID",
    "message": "Unauthenticated."
  },
  "message": "Unauthenticated."
}`;

const baseUrlSetup = `BASE_URL="${BASE_URL}"`;

const quickFacts = [
  { label: 'API base URL', value: BASE_URL, detail: 'Use this host for the direct Laravel API endpoints below.' },
  { label: 'Path prefix', value: '/api', detail: 'Every documented endpoint below is relative to the active base URL.' },
  { label: 'Auth header', value: 'Authorization: Bearer YOUR_TOKEN', detail: 'Required only on protected auth endpoints.' },
  { label: 'Content type', value: 'application/json', detail: 'Send and receive JSON for POST requests.' },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${value.split('\n')[0]}`}
      className="shrink-0 whitespace-nowrap rounded-md border border-slate-700/70 px-2 py-1 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#58D65D]"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">{children}</code>;
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100"><code>{code}</code></pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <article id={endpoint.id} className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-medium text-[#58D65D] dark:text-emerald-400">{endpoint.group}</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{endpoint.title}</h3>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{endpoint.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
            {endpoint.auth}
          </span>
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
            {endpoint.status}
          </span>
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
            Response: <code className="font-mono">{endpoint.responseShape}</code>
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-3 font-mono text-sm dark:bg-slate-950/60">
        <span className={`rounded-lg border px-2.5 py-1 text-xs font-black ${methodClass[endpoint.method]}`}>{endpoint.method}</span>
        <span className="break-all text-slate-900 dark:text-slate-100">{endpoint.path}</span>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Headers</h4>
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="hidden grid-cols-[1fr_1.4fr_1.4fr] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400 md:grid">
            <span>Name</span><span>Value</span><span>When</span>
          </div>
          {endpoint.headers.map((header) => (
            <div key={`${endpoint.id}-${header.name}`} className="grid gap-2 border-t border-slate-200 px-4 py-3 text-sm first:border-t-0 dark:border-slate-800 md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-3 md:first:border-t">
              <code className="text-slate-900 dark:text-slate-100">{header.name}</code>
              <code className="break-all text-slate-700 dark:text-slate-300">{header.value}</code>
              <span className="text-slate-600 dark:text-slate-300">{header.when}</span>
            </div>
          ))}
        </div>
      </div>

      {endpoint.pathParams ? (
        <div className="mt-6">
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Path parameters</h4>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="hidden grid-cols-[1.1fr_0.8fr_0.7fr_2fr] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400 md:grid">
              <span>Parameter</span><span>Type</span><span>Required</span><span>Description</span>
            </div>
            {endpoint.pathParams.map((field) => (
              <div key={field.name} className="grid gap-2 border-t border-slate-200 px-4 py-3 text-sm first:border-t-0 dark:border-slate-800 md:grid-cols-[1.1fr_0.8fr_0.7fr_2fr] md:gap-3 md:first:border-t">
                <code className="text-slate-900 dark:text-slate-100">{field.name}</code>
                <span className="text-slate-600 dark:text-slate-400">{field.type}</span>
                <span className={field.required ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-500'}>{field.required ? 'Required' : 'Optional'}</span>
                <span className="text-slate-600 dark:text-slate-300">{field.description}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {endpoint.query ? (
        <div className="mt-6">
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Query parameters</h4>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="hidden grid-cols-[1.1fr_0.8fr_0.7fr_2fr] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400 md:grid">
              <span>Parameter</span><span>Type</span><span>Required</span><span>Description</span>
            </div>
            {endpoint.query.map((field) => (
              <div key={field.name} className="grid gap-2 border-t border-slate-200 px-4 py-3 text-sm first:border-t-0 dark:border-slate-800 md:grid-cols-[1.1fr_0.8fr_0.7fr_2fr] md:gap-3 md:first:border-t">
                <code className="text-slate-900 dark:text-slate-100">{field.name}</code>
                <span className="text-slate-600 dark:text-slate-400">{field.type}</span>
                <span className={field.required ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-500'}>{field.required ? 'Required' : 'Optional'}</span>
                <span className="text-slate-600 dark:text-slate-300">{field.description}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {endpoint.body ? (
        <div className="mt-6">
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Request body</h4>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="hidden grid-cols-[1.1fr_0.8fr_0.7fr_2fr] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400 md:grid">
              <span>Field</span><span>Type</span><span>Required</span><span>Description</span>
            </div>
            {endpoint.body.map((field) => (
              <div key={field.name} className="grid gap-2 border-t border-slate-200 px-4 py-3 text-sm first:border-t-0 dark:border-slate-800 md:grid-cols-[1.1fr_0.8fr_0.7fr_2fr] md:gap-3 md:first:border-t">
                <code className="text-slate-900 dark:text-slate-100">{field.name}</code>
                <span className="text-slate-600 dark:text-slate-400">{field.type}</span>
                <span className={field.required ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-500'}>{field.required ? 'Required' : 'Optional'}</span>
                <span className="text-slate-600 dark:text-slate-300">{field.description}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <CodeBlock label="curl" code={endpoint.curl} />
        <CodeBlock label="Illustrative JSON response" code={endpoint.response} />
      </div>
    </article>
  );
}

export default function ApiDocsClient() {
  const tools = endpointGroups.find((group) => group.label === 'Tools')?.endpoints ?? [];
  const auth = endpointGroups.find((group) => group.label === 'Authentication')?.endpoints ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <section className="border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#58D65D] dark:text-slate-400 dark:hover:text-emerald-400">
            ← Back to Toolblip
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#58D65D] dark:text-emerald-400">REST API Reference</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl">Toolblip API Docs</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Integrate with the Toolblip API to list tools, fetch tool metadata, and authenticate users using simple JSON requests.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a href="#list-tools" className="rounded-full bg-[#58D65D] px-4 py-2 font-bold text-slate-950 transition hover:bg-emerald-400">View endpoints</a>
                <a href="#authentication" className="rounded-full border border-slate-300 px-4 py-2 font-bold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500">Auth quick start</a>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">API base URL</p>
              <code className="mt-3 block break-all rounded-xl bg-white p-3 text-sm text-slate-900 dark:bg-slate-950 dark:text-slate-100">{BASE_URL}</code>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                These examples call the direct Laravel API. Sample responses and credentials are illustrative; pagination totals and tool data change over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Endpoints</p>
            <nav className="mt-4 space-y-2">
              {endpointGroups.map((group) => (
                <div key={group.label} className="pt-2 first:pt-0">
                  <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{group.label}</p>
                  {group.endpoints.map((endpoint) => (
                    <a key={endpoint.id} href={`#${endpoint.id}`} className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                      <span className="mr-2 font-mono text-xs font-black text-[#58D65D] dark:text-emerald-400">{endpoint.method}</span>
                      {endpoint.path}
                    </a>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 space-y-12 [overflow-wrap:anywhere]">
          <section id="authentication" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Authentication</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Register or log in to receive a token, then send it in the <InlineCode>Authorization</InlineCode> header as <InlineCode>Bearer YOUR_TOKEN</InlineCode>. Keep tokens private and never send them in query strings. Only send <InlineCode>accepted_terms: true</InlineCode> during registration after the person has accepted the terms.
            </p>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <CodeBlock label="Authorization header" code={'Authorization: Bearer YOUR_TOKEN'} />
              <CodeBlock label="Token lifecycle" code={tokenFlow} />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Before you start</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              These direct Laravel API endpoints use JSON over HTTPS under <InlineCode>/api</InlineCode>. Prefix each path with <InlineCode>{BASE_URL}</InlineCode>. Frontend same-origin session routes, where used, have separate request and response contracts.
            </p>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <CodeBlock label="Public request" code={starterRequest} />
              <CodeBlock label="Authenticated request" code={authenticatedRequest} />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{fact.label}</p>
                <code className="mt-3 block break-all rounded-xl bg-slate-50 p-3 text-sm text-slate-900 dark:bg-slate-950 dark:text-slate-100">{fact.value}</code>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{fact.detail}</p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Base URL</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Set the direct API host once when using the curl examples below.
            </p>
            <div className="mt-5">
              <CodeBlock label="Environment setup" code={baseUrlSetup} />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Response models</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              The directory returns <InlineCode>data</InlineCode> as an array with a <InlineCode>meta</InlineCode> pagination object. A single tool returns <InlineCode>data</InlineCode> as an object. Authentication returns <InlineCode>user</InlineCode>, and register and login also return <InlineCode>token</InlineCode>.
            </p>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <CodeBlock label="Tool" code={`{
  "id": 1,
  "slug": "json-formatter",
  "name": "JSON Formatter",
  "description": "Format and validate JSON data with syntax highlighting.",
  "category": "formatter",
  "icon": "{}",
  "is_pro": false,
  "view_count": 0,
  "share_count": 0,
  "favorite_count": 0
}`} />
              <CodeBlock label="User" code={`{
  "id": 42,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "is_pro": false,
  "requires_terms_acceptance": false
}`} />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Endpoint overview</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="hidden grid-cols-[0.7fr_1.55fr_1fr_1.2fr_1.8fr] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400 md:grid">
                <span>Method</span><span>Path</span><span>Auth</span><span>Response</span><span>Purpose</span>
              </div>
              {endpoints.map((endpoint) => (
                <a key={endpoint.id} href={`#${endpoint.id}`} className="grid gap-2 border-t border-slate-200 px-4 py-3 text-sm first:border-t-0 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 md:grid-cols-[0.7fr_1.55fr_1fr_1.2fr_1.8fr] md:gap-3 md:first:border-t">
                  <span className="font-mono font-black text-[#58D65D] dark:text-emerald-400">{endpoint.method}</span>
                  <code className="break-all text-slate-900 dark:text-slate-100">{endpoint.path}</code>
                  <span className="text-slate-600 dark:text-slate-300">{endpoint.auth === 'No auth required' ? 'None' : 'Bearer token'}</span>
                  <code className="break-all text-slate-600 dark:text-slate-300">{endpoint.responseShape}</code>
                  <span className="text-slate-600 dark:text-slate-300">{endpoint.title}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Format</p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Send JSON bodies and set <InlineCode>Content-Type: application/json</InlineCode> for POST requests.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Responses</p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Set <InlineCode>Accept: application/json</InlineCode> for consistent JSON responses.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Auth</p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Protected endpoints require <InlineCode>Authorization: Bearer YOUR_TOKEN</InlineCode>. Tokens are returned by register and login.</p>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#58D65D] dark:text-emerald-400">Tools</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Tool endpoints</h2>
            </div>
            {tools.map((endpoint) => <EndpointCard key={endpoint.id} endpoint={endpoint} />)}
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#58D65D] dark:text-emerald-400">Auth</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Authentication endpoints</h2>
            </div>
            {auth.map((endpoint) => <EndpointCard key={endpoint.id} endpoint={endpoint} />)}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Errors</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">The API exception handlers return <InlineCode>error.code</InlineCode> and <InlineCode>error.message</InlineCode>. Validation errors also include <InlineCode>error.details</InlineCode> and legacy top-level <InlineCode>errors</InlineCode> and <InlineCode>message</InlineCode>; authentication errors also include a top-level <InlineCode>message</InlineCode>. Some controller responses, including explicit 403 responses, may contain only <InlineCode>message</InlineCode>. Prefer <InlineCode>error.message</InlineCode> and fall back to the top-level <InlineCode>message</InlineCode>.</p>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <CodeBlock label="Validation error" code={`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field is required.",
    "details": {
      "email": ["The email field is required."]
    }
  },
  "errors": {
    "email": ["The email field is required."]
  },
  "message": "The email field is required."
}`} />
              <CodeBlock label="Unauthorized" code={unauthorizedResponse} />
              <div className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                <p className="font-semibold text-slate-950 dark:text-white">Common status codes</p>
                <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
                  <li><strong>200</strong> OK</li>
                  <li><strong>201</strong> Created</li>
                  <li><strong>401</strong> Missing or invalid token</li>
                  <li><strong>403</strong> Forbidden</li>
                  <li><strong>404</strong> Resource not found</li>
                  <li><strong>422</strong> Validation failed</li>
                  <li><strong>429</strong> Rate limited</li>
                  <li><strong>500</strong> Server error</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
