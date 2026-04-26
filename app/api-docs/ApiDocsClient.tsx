'use client';

import { useState } from 'react';

const BASE_URL = 'https://toolblip-api-production.up.railway.app';

const endpoints = [
  {
    method: 'GET',
    path: '/api/tools',
    auth: false,
    title: 'List Tools',
    description: 'Returns a paginated list of all tools in the directory.',
    params: [
      { name: 'category', type: 'string', required: false, description: 'Filter by category slug (e.g. "writing", "productivity")' },
      { name: 'search', type: 'string', required: false, description: 'Search tool name and description' },
      { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
      { name: 'per_page', type: 'integer', required: false, description: 'Items per page (default: 20, max: 100)' },
    ],
    curl: `curl -X GET "${BASE_URL}/api/tools?category=writing&page=1" \\
  -H "Accept: application/json"`,
    response: `{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "chatgpt",
        "name": "ChatGPT",
        "description": "AI-powered conversational assistant by OpenAI.",
        "category": "ai",
        "is_pro": false,
        "emoji": "🤖",
        "created_at": "2026-01-15T10:30:00Z"
      },
      {
        "id": 2,
        "slug": "claude-ai",
        "name": "Claude AI",
        "description": "Helpful, harmless, and honest AI assistant.",
        "category": "ai",
        "is_pro": false,
        "emoji": "✨",
        "created_at": "2026-01-20T14:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "total": 120,
      "per_page": 20,
      "last_page": 6
    }
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/tools/{slug}',
    auth: false,
    title: 'Get Tool',
    description: 'Returns a single tool by its slug.',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'Tool slug URL identifier' },
    ],
    curl: `curl -X GET "${BASE_URL}/api/tools/chatgpt" \\
  -H "Accept: application/json"`,
    response: `{
  "tool": {
    "id": 1,
    "slug": "chatgpt",
    "name": "ChatGPT",
    "description": "AI-powered conversational assistant by OpenAI.",
    "category": "ai",
    "is_pro": false,
    "emoji": "🤖",
    "created_at": "2026-01-15T10:30:00Z"
  }
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    auth: false,
    title: 'Register',
    description: 'Create a new user account. Returns the user object and a Bearer token.',
    params: [
      { name: 'name', type: 'string', required: true, description: 'Full name' },
      { name: 'email', type: 'string', required: true, description: 'Email address (must be unique)' },
      { name: 'password', type: 'string', required: true, description: 'Password (min. 8 characters)' },
      { name: 'password_confirmation', type: 'string', required: true, description: 'Must match password' },
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
  "token": "1|Xr8KbP9...aBcDeFgHiJkL"
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    auth: false,
    title: 'Login',
    description: 'Authenticate an existing user. Returns the user object and a Bearer token.',
    params: [
      { name: 'email', type: 'string', required: true, description: 'Email address' },
      { name: 'password', type: 'string', required: true, description: 'Account password' },
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
  "token": "2|Yz7LcQ3...mNoPqRsTuVwX"
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    auth: true,
    title: 'Logout',
    description: 'Invalidate the current session token. Requires a valid Bearer token.',
    params: [],
    curl: `curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Authorization: Bearer {token}" \\
  -H "Accept: application/json"`,
    response: `{
  "message": "Logged out successfully"
}`,
  },
  {
    method: 'GET',
    path: '/api/auth/user',
    auth: true,
    title: 'Get Authenticated User',
    description: 'Returns the currently authenticated user profile.',
    params: [],
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

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    PATCH: 'bg-orange-100 text-orange-800',
    DELETE: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[method] || 'bg-gray-100 text-gray-800'}`}>
      {method}
    </span>
  );
}

function AuthBadge({ required }: { required: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${required ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
      {required ? (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Auth
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Public
        </>
      )}
    </span>
  );
}

function CodeBlock({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <pre className={`bg-[#1a1a2e] text-gray-100 rounded-xl p-4 text-sm font-mono overflow-x-auto ${className}`}>
      {children}
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
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 text-xs rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function ApiDocsClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints'>('overview');
  const [openEndpoint, setOpenEndpoint] = useState<number | null>(null);

  const toggleEndpoint = (i: number) => setOpenEndpoint(openEndpoint === i ? null : i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Toolblip REST API — browse and manage tools programmatically. All endpoints return JSON and follow REST conventions.
          </p>

          {/* Base URL pill */}
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Base URL</span>
            <code className="text-sm font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {BASE_URL}
            </code>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-8 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Reference</p>
              {endpoints.map((ep, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveTab('endpoints');
                    setOpenEndpoint(i);
                    document.getElementById(`endpoint-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left group"
                >
                  <MethodBadge method={ep.method} />
                  <span className="truncate font-mono text-xs">{ep.path.split('/').pop()?.replace('{slug}', 'slug') || ep.path}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-6">

            {/* Overview card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <h3 className="font-semibold text-slate-800 text-sm">Authentication</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Use Bearer token authentication. Pass your token in the <code className="font-mono text-xs bg-slate-200 px-1 rounded">Authorization</code> header.
                  </p>
                  <CodeBlock className="mt-3 text-xs !p-3">
                    {`Authorization: Bearer {token}`}
                  </CodeBlock>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                    <h3 className="font-semibold text-slate-800 text-sm">Content Type</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    All requests and responses use JSON. Always include the header below.
                  </p>
                  <CodeBlock className="mt-3 text-xs !p-3">
                    {`Content-Type: application/json\nAccept: application/json`}
                  </CodeBlock>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="font-semibold text-slate-800 text-sm">Rate Limits</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Public endpoints are limited to 60 requests per minute. Authenticated endpoints allow 120 req/min. Pro users get higher limits.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    <h3 className="font-semibold text-slate-800 text-sm">Errors</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Errors return a JSON object with <code className="font-mono text-xs bg-slate-200 px-1 rounded">message</code>. HTTP status codes follow REST conventions (400, 401, 403, 404, 422, 500).
                  </p>
                </div>
              </div>
            </div>

            {/* Endpoints */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 px-1">Endpoints</h2>
              {endpoints.map((ep, i) => (
                <div key={i} id={`endpoint-${i}`} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => toggleEndpoint(i)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <MethodBadge method={ep.method} />
                    <code className="font-mono text-sm text-slate-800">{ep.path}</code>
                    <span className="text-sm text-slate-500 flex-1 truncate">{ep.title}</span>
                    <AuthBadge required={ep.auth} />
                    <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${openEndpoint === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {openEndpoint === i && (
                    <div className="border-t border-slate-100 px-5 py-5 space-y-5">
                      <p className="text-sm text-slate-600">{ep.description}</p>

                      {ep.params.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parameters</h4>
                          <div className="border border-slate-100 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Name</th>
                                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Type</th>
                                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Required</th>
                                  <th className="px-4 py-2 text-left font-semibold text-slate-700">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {ep.params.map((p, pi) => (
                                  <tr key={pi}>
                                    <td className="px-4 py-2.5 font-mono text-xs text-indigo-700">{p.name}</td>
                                    <td className="px-4 py-2.5 text-xs text-slate-500">{p.type}</td>
                                    <td className="px-4 py-2.5 text-xs">
                                      {p.required
                                        ? <span className="text-red-600 font-medium">Yes</span>
                                        : <span className="text-slate-400">No</span>}
                                    </td>
                                    <td className="px-4 py-2.5 text-xs text-slate-600">{p.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example Request</h4>
                          <CopyButton text={ep.curl} />
                        </div>
                        <CodeBlock>{ep.curl}</CodeBlock>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Example Response</h4>
                          <CopyButton text={ep.response} />
                        </div>
                        <CodeBlock>{ep.response}</CodeBlock>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* SDK / Quick links */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Need help?</h2>
              <p className="text-sm text-slate-600 mb-4">
                Questions about the API? Reach out at{' '}
                <a href="mailto:api@toolblip.com" className="text-indigo-600 hover:underline">api@toolblip.com</a>
                {' '}or open an issue on GitHub.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/toolblip" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a href="https://toolblip.com" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  toolblip.com →
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
