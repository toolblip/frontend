'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Config ────────────────────────────────────────────────────────────────

// Base URL — Railway production deployment (api.toolblip.com SSL pending)
const BASE_URL = 'https://toolblip-api-production.up.railway.app';

const SECTIONS = [
  { id: 'overview',       label: 'Overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'tools',         label: 'Tools' },
  { id: 'auth',          label: 'Auth' },
  { id: 'errors',        label: 'Error Codes' },
] as const;

const ENDPOINTS = [
  { method: 'GET',  path: '/api/tools',             desc: 'List all tools',          auth: false },
  { method: 'GET',  path: '/api/tools/{slug}',      desc: 'Get single tool',         auth: false },
  { method: 'POST', path: '/api/auth/register',     desc: 'Create account',          auth: false },
  { method: 'POST', path: '/api/auth/login',        desc: 'Sign in',                 auth: false },
  { method: 'POST', path: '/api/auth/logout',       desc: 'Revoke session',           auth: true  },
  { method: 'GET',  path: '/api/auth/user',         desc: 'Get authenticated user',  auth: true  },
] as const;

const METHOD_STYLES: Record<string, string> = {
  GET:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  POST:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  PUT:    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  DELETE: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
  PATCH:  'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
};

// ─── Shared helpers ──────────────────────────────────────────────────────────

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ApiDocsClient() {
  const [activeSection, setActiveSection] = useState('overview');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    }
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold bg-[#58D65D] text-white px-2.5 py-1 rounded-full">REST v1</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Toolblip API</span>
          <div className="ml-auto flex items-center gap-3">
            <code className="hidden sm:block text-[11px] font-mono text-gray-400">{BASE_URL}</code>
            <span className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-gray-50 dark:bg-[#0f0f11] border-b border-gray-100 dark:border-gray-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">
            API Reference
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mb-8">
            HTTP REST API for browsing developer tools and managing user accounts.
            All responses are JSON. Authenticate with a Bearer token for protected endpoints.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { label: 'Base URL', value: BASE_URL },
              { label: 'Auth', value: 'Bearer token' },
              { label: 'Format', value: 'JSON only' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</span>
                <code className="text-xs font-mono text-gray-700 dark:text-gray-300">{value}</code>
              </div>
            ))}
          </div>

          {/* Endpoint pills */}
          <div className="flex flex-wrap gap-2">
            <EndpointPill method="GET"    path="/api/tools"         targetId="tools" />
            <EndpointPill method="GET"    path="/api/tools/{slug}"  targetId="tool-detail" />
            <EndpointPill method="POST"   path="/api/auth/register" targetId="auth" />
            <EndpointPill method="POST"   path="/api/auth/login"   targetId="auth" />
            <EndpointPill method="POST"   path="/api/auth/logout"  targetId="auth" />
            <EndpointPill method="GET"    path="/api/auth/user"    targetId="auth" />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex gap-10 lg:gap-12">

        {/* Sidebar */}
        <aside className="w-36 xl:w-44 shrink-0 hidden md:block">
          <nav className="sticky top-20 space-y-0.5 text-sm max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-1">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">On this page</p>
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs text-left cursor-pointer ${
                  activeSection === id
                    ? 'text-[#58D65D] dark:text-[#58D65D] bg-emerald-50 dark:bg-[#58D65D]/10 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/30'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* ── Overview ── */}
          <section id="overview" className="scroll-mt-16">
            <SectionHeading>Overview</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              The Toolblip API is a RESTful HTTP API. All requests go to the base URL below.
              Every response is JSON. Include <InlineCode>Accept: application/json</InlineCode> on all requests.
            </p>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Base URL</p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-gray-800 rounded-xl">
                <code className="text-sm font-mono text-[#58D65D] font-semibold">{BASE_URL}</code>
                <span className="text-xs text-gray-400 dark:text-gray-500">— all API endpoints</span>
              </div>
            </div>

            {/* Endpoint table */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#111113] border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Method</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endpoint</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Auth</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ENDPOINTS.map(({ method, path, auth, desc }) => (
                    <tr key={path} className="bg-white dark:bg-[#09090b] hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-4 py-3"><MethodPill method={method} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{path}</td>
                      <td className="px-4 py-3">{auth ? <LockPill /> : <PublicPill />}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Authentication ── */}
          <section id="authentication" className="scroll-mt-16">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">
              Protected endpoints require a Bearer token. Obtain one from{' '}
              <InlineCode>/api/auth/register</InlineCode> or{' '}
              <InlineCode>/api/auth/login</InlineCode>, then include it in every authenticated request:
            </p>
            <CodeBlock
              code={`Authorization: Bearer 1|abcd1234efgh5678ijkl9012mnop3456qrst`}
              title="Header — all authenticated requests"
              language="bash"
            />
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>Keep your token secret.</strong> Never expose it in client-side code or public repositories.
              Tokens are permanently revoked on logout.
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TOOLS                                                            */}
          {/* ═══════════════════════════════════════════════════════════════ */}

          <section id="tools" className="scroll-mt-16 space-y-12">

            {/* ── GET /api/tools ── */}
            <div>
              <SectionHeading>Tools — GET /api/tools</SectionHeading>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Returns a paginated list of all available tools. Public — no authentication required.
              </p>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
                <CodeBlock
                  code={`curl "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`}
                  title="bash"
                  language="bash"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Query parameters</p>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#111113] border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-28">Param</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-20">Type</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {[
                        { name: 'category',  type: 'string',  desc: 'Filter by category (e.g. ai, devops, analytics)' },
                        { name: 'search',   type: 'string',  desc: 'Full-text search across name and description' },
                        { name: 'page',     type: 'number',  desc: 'Page number (default: 1)' },
                        { name: 'per_page', type: 'number',  desc: 'Results per page (default: 20, max: 100)' },
                      ].map(({ name, type, desc }) => (
                        <tr key={name} className="bg-white dark:bg-[#09090b]">
                          <td className="px-4 py-2.5 font-mono text-gray-700 dark:text-gray-300">{name}</td>
                          <td className="px-4 py-2.5 text-gray-400 dark:text-gray-500">{type}</td>
                          <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example response — 200</p>
                <CodeBlock
                  code={`{
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
        "created_at": "2026-01-15T08:30:00.000000Z"
      },
      {
        "id": 2,
        "slug": "cursor",
        "name": "Cursor",
        "description": "AI-first code editor built on VS Code",
        "category": "AI",
        "is_pro": true,
        "emoji": "💻",
        "created_at": "2026-01-20T14:00:00.000000Z"
      }
    ]
  }
}`}
                  language="json"
                />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Response fields</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  {[
                    { field: 'tools.tools[]',    desc: 'Array of tool objects' },
                    { field: 'tools.tools[].id',          desc: 'Unique numeric ID' },
                    { field: 'tools.tools[].slug',        desc: 'URL-friendly identifier' },
                    { field: 'tools.tools[].name',        desc: 'Display name' },
                    { field: 'tools.tools[].description', desc: 'Short description' },
                    { field: 'tools.tools[].category',    desc: 'Tool category' },
                    { field: 'tools.tools[].is_pro',     desc: 'Requires pro subscription' },
                    { field: 'tools.tools[].emoji',       desc: 'Icon emoji (optional)' },
                    { field: 'tools.tools[].created_at',  desc: 'ISO 8601 timestamp' },
                  ].map(({ field, desc }) => (
                    <div key={field} className="flex gap-2 py-0.5">
                      <code className="font-mono text-gray-700 dark:text-gray-300 shrink-0">{field}</code>
                      <span className="text-gray-400 dark:text-gray-500">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── GET /api/tools/{slug} ── */}
            <div id="tool-detail">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <MethodPill method="GET" />
                <code className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">/api/tools/{'{slug}'}</code>
                <PublicPill />
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">→ 200 · 404</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Fetch a single tool by its slug identifier. Returns 404 if not found.
              </p>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
                <CodeBlock
                  code={`curl "${BASE_URL}/api/tools/claude-code" \\
  -H "Accept: application/json"`}
                  title="bash"
                  language="bash"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Path parameters</p>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#111113] border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-28">Param</th>
                        <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-[#09090b]">
                        <td className="px-4 py-2.5 font-mono text-gray-700 dark:text-gray-300">slug</td>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">The unique slug identifier of the tool</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example response — 200</p>
                <CodeBlock
                  code={`{
  "data": {
    "id": 1,
    "slug": "claude-code",
    "name": "Claude Code",
    "description": "AI coding assistant by Anthropic",
    "category": "AI",
    "is_pro": false,
    "emoji": "🤖",
    "created_at": "2026-01-15T08:30:00.000000Z"
  }
}`}
                  language="json"
                />
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Error — 404</p>
                <CodeBlock
                  code={`{
  "message": "No query results for model [App\\\\Models\\\\Tool]."
}`}
                  language="json"
                />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* AUTH                                                             */}
          {/* ═══════════════════════════════════════════════════════════════ */}

          <section id="auth" className="scroll-mt-16 space-y-12">

            {/* ── POST /api/auth/register ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <MethodPill method="POST" />
                <code className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">/api/auth/register</code>
                <PublicPill />
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">→ 201 · 422</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Create a new user account. Returns the user object and a Bearer token on success.
              </p>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
                <CodeBlock
                  code={`curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Harun Ray",
    "email": "harun@example.com",
    "password": "securepassword123",
    "password_confirmation": "securepassword123"
  }'`}
                  title="bash"
                  language="bash"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Request body</p>
                <CodeBlock
                  code={`{
  "name": "Harun Ray",                   // required, min 2 chars
  "email": "harun@example.com",          // required, valid email, unique
  "password": "securepassword123",        // required, min 8 chars
  "password_confirmation": "securepassword123"  // required, must match password
}`}
                  language="json"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example response — 201</p>
                <CodeBlock
                  code={`{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@example.com",
    "is_pro": false
  },
  "token": "1|abcd1234efgh5678ijkl9012mnop3456qrst"
}`}
                  language="json"
                />
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Error — 422 (validation)</p>
                <CodeBlock
                  code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}`}
                  language="json"
                />
              </div>
            </div>

            {/* ── POST /api/auth/login ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <MethodPill method="POST" />
                <code className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">/api/auth/login</code>
                <PublicPill />
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">→ 200 · 401</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Sign in with existing credentials. Returns the user object and a Bearer token on success.
              </p>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
                <CodeBlock
                  code={`curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "harun@example.com",
    "password": "securepassword123"
  }'`}
                  title="bash"
                  language="bash"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Request body</p>
                <CodeBlock
                  code={`{
  "email": "harun@example.com",    // required
  "password": "securepassword123"  // required
}`}
                  language="json"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example response — 200</p>
                <CodeBlock
                  code={`{
  "token": "1|abcd1234efgh5678ijkl9012mnop3456qrst",
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@example.com",
    "is_pro": false
  }
}`}
                  language="json"
                />
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Error — 401</p>
                <CodeBlock
                  code={`{
  "message": "Invalid credentials"
}`}
                  language="json"
                />
              </div>
            </div>

            {/* ── POST /api/auth/logout ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <MethodPill method="POST" />
                <code className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">/api/auth/logout</code>
                <LockPill />
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">→ 200 · 401</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Revoke the current Bearer token and end the session. The token becomes permanently invalid.
              </p>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
                <CodeBlock
                  code={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer 1|abcd1234efgh5678ijkl9012mnop3456qrst"`}
                  title="bash"
                  language="bash"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example response — 200</p>
                <CodeBlock
                  code={`{
  "message": "Logged out"
}`}
                  language="json"
                />
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                <strong>Token revoked.</strong> The Bearer token used in this request is now permanently invalid.
              </div>

              <div className="mt-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Error — 401</p>
                <CodeBlock
                  code={`{
  "message": "Unauthenticated."
}`}
                  language="json"
                />
              </div>
            </div>

            {/* ── GET /api/auth/user ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <MethodPill method="GET" />
                <code className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">/api/auth/user</code>
                <LockPill />
                <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">→ 200 · 401</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Retrieve the currently authenticated user profile.
              </p>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
                <CodeBlock
                  code={`curl "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer 1|abcd1234efgh5678ijkl9012mnop3456qrst"`}
                  title="bash"
                  language="bash"
                />
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example response — 200</p>
                <CodeBlock
                  code={`{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@example.com",
    "is_pro": false
  }
}`}
                  language="json"
                />
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Error — 401</p>
                <CodeBlock
                  code={`{
  "message": "Unauthenticated."
}`}
                  language="json"
                />
              </div>
            </div>
          </section>

          {/* ── Error Codes ── */}
          <section id="errors" className="scroll-mt-16">
            <SectionHeading>Error Codes</SectionHeading>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              All errors return a JSON body with a <InlineCode>message</InlineCode> field.
              Validation failures (422) include an <InlineCode>errors</InlineCode> object listing field-level issues.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
              {[
                { code: 400, label: 'Bad Request' },
                { code: 401, label: 'Unauthorized' },
                { code: 403, label: 'Forbidden' },
                { code: 404, label: 'Not Found' },
                { code: 422, label: 'Validation Error' },
                { code: 429, label: 'Too Many Requests' },
                { code: 500, label: 'Server Error' },
              ].map(({ code, label }) => (
                <div
                  key={code}
                  className="flex items-center gap-2.5 bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5"
                >
                  <span className="font-mono font-bold text-sm text-gray-700 dark:text-gray-300">{code}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example — 422 Validation Error</p>
              <CodeBlock
                code={`{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}`}
                language="json"
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-gray-100 dark:border-gray-800/60 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-xs">
              Questions?{' '}
              <a href="mailto:harun@toolblip.com" className="text-[#58D65D] dark:text-[#58D65D] hover:underline">harun@toolblip.com</a>
              <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
              <a href="https://github.com/toolblip" target="_blank" rel="noopener noreferrer" className="text-[#58D65D] dark:text-[#58D65D] hover:underline">GitHub</a>
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2.5">
      <span className="w-1 h-6 bg-[#58D65D] rounded-full shrink-0 mt-0.5" />
      {children}
    </h2>
  );
}

function MethodPill({ method }: { method: string }) {
  return (
    <span className={`${METHOD_STYLES[method] ?? ''} text-[11px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0`}>
      {method}
    </span>
  );
}

function LockPill() {
  return (
    <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full font-medium">
      🔒 auth
    </span>
  );
}

function PublicPill() {
  return (
    <span className="text-[11px] text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-full">
      public
    </span>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

function EndpointPill({ method, path, targetId }: { method: string; path: string; targetId: string }) {
  return (
    <button
      onClick={() => scrollToSection(targetId)}
      className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full
        bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800
        text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
        hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
    >
      <MethodPill method={method} />
      <span className="font-mono">{path}</span>
    </button>
  );
}

function CodeBlock({ code, title, language }: { code: string; title?: string; language?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden text-xs">
      {title && (
        <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-[#111113] border-b border-gray-200 dark:border-gray-800">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{title}</span>
          {language && <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-600">{language}</span>}
        </div>
      )}
      <pre className="p-4 bg-[#0f0f11] dark:bg-black overflow-x-auto">
        <code className="font-mono text-[13px] text-gray-300 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
