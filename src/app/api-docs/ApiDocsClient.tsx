'use client';

import { useState } from 'react';
import Link from 'next/link';

const BASE_URL = 'https://toolblip-api-production.up.railway.app';
const FUTURE_BASE_URL = 'https://api.toolblip.com';

type Method = 'GET' | 'POST';

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
  auth: 'None' | 'Bearer token';
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
    description: 'Returns the public Toolblip directory. The response is nested as tools.tools for compatibility with the app client.',
    auth: 'None',
    curl: `curl "${BASE_URL}/api/tools" \\\n  -H "Accept: application/json"`,
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
        "emoji": "{}",
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
    description: 'Fetch one tool by its URL slug. Use the slug value returned by the list endpoint.',
    auth: 'None',
    curl: `curl "${BASE_URL}/api/tools/json-formatter" \\\n  -H "Accept: application/json"`,
    response: `{
  "tool": {
    "id": 1,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format, validate, and prettify JSON data instantly.",
    "category": "developer",
    "is_pro": false,
    "emoji": "{}",
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
    description: 'Create a user account and receive an API token for authenticated requests.',
    auth: 'None',
    body: [
      { name: 'name', type: 'string', required: true, description: 'Display name for the account.' },
      { name: 'email', type: 'string', required: true, description: 'Unique email address.' },
      { name: 'password', type: 'string', required: true, description: 'Account password.' },
      { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password.' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/auth/register" \\\n  -H "Content-Type: application/json" \\\n  -H "Accept: application/json" \\\n  -d '{
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
    description: 'Exchange valid account credentials for a Bearer token.',
    auth: 'None',
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
    description: 'Revoke the current token. The token used for this request will stop working immediately.',
    auth: 'Bearer token',
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Accept: application/json"`,
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
    description: 'Returns the user profile attached to the supplied Bearer token.',
    auth: 'Bearer token',
    curl: `curl "${BASE_URL}/api/auth/user" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Accept: application/json"`,
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

const methodClass: Record<Method, string> = {
  GET: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
  POST: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-slate-700/70 px-2 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100"><code>{code}</code></pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <article id={endpoint.id} className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#58D65D] dark:text-emerald-400">{endpoint.group}</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{endpoint.title}</h3>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{endpoint.description}</p>
        </div>
        <span className="w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 dark:border-slate-700">
          Auth: {endpoint.auth}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-3 font-mono text-sm dark:bg-slate-950/60">
        <span className={`rounded-lg border px-2.5 py-1 text-xs font-black ${methodClass[endpoint.method]}`}>{endpoint.method}</span>
        <span className="text-slate-900 dark:text-slate-100">{endpoint.path}</span>
      </div>

      {endpoint.body ? (
        <div className="mt-6">
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Request body</h4>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-[1.1fr_0.8fr_0.7fr_2fr] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <span>Field</span><span>Type</span><span>Required</span><span>Description</span>
            </div>
            {endpoint.body.map((field) => (
              <div key={field.name} className="grid grid-cols-[1.1fr_0.8fr_0.7fr_2fr] gap-3 border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
                <code className="text-slate-900 dark:text-slate-100">{field.name}</code>
                <span className="text-slate-600 dark:text-slate-400">{field.type}</span>
                <span className={field.required ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-500'}>{field.required ? 'Yes' : 'No'}</span>
                <span className="text-slate-600 dark:text-slate-300">{field.description}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <CodeBlock label="curl" code={endpoint.curl} />
        <CodeBlock label="JSON response" code={endpoint.response} />
      </div>
    </article>
  );
}

export default function ApiDocsClient() {
  const tools = endpoints.filter((endpoint) => endpoint.group === 'Tools');
  const auth = endpoints.filter((endpoint) => endpoint.group === 'Authentication');

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#58D65D] dark:text-slate-400 dark:hover:text-emerald-400">
            ← Back to Toolblip
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#58D65D] dark:text-emerald-400">REST API Reference</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl">Toolblip API Docs</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Use the Toolblip API to list tools, fetch individual tool metadata, and authenticate users with Bearer tokens.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Base URL</p>
              <code className="mt-3 block break-all rounded-xl bg-white p-3 text-sm text-slate-900 dark:bg-slate-950 dark:text-slate-100">{BASE_URL}</code>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Custom API domain coming once SSL is ready: <code className="font-mono">{FUTURE_BASE_URL}</code>
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
              {endpoints.map((endpoint) => (
                <a key={endpoint.id} href={`#${endpoint.id}`} className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                  <span className="mr-2 font-mono text-xs font-black text-[#58D65D] dark:text-emerald-400">{endpoint.method}</span>
                  {endpoint.path}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-12">
          <section id="authentication" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Authentication</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Register or log in to receive a token, then send it in the <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm dark:bg-slate-800">Authorization</code> header.
            </p>
            <CodeBlock label="Authorization header" code={'Authorization: Bearer YOUR_TOKEN'} />
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
            <p className="mt-3 text-slate-600 dark:text-slate-300">Errors are returned as JSON with a message. Validation errors may include an errors object keyed by field name.</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <CodeBlock label="Validation error" code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}`} />
              <div className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
                <p className="font-semibold text-slate-950 dark:text-white">Common status codes</p>
                <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
                  <li><strong>200</strong> OK</li>
                  <li><strong>201</strong> Created</li>
                  <li><strong>401</strong> Missing or invalid token</li>
                  <li><strong>404</strong> Resource not found</li>
                  <li><strong>422</strong> Validation failed</li>
                  <li><strong>500</strong> Server error</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
