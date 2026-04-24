'use client';

import { useState, useEffect, useRef } from 'react';
import CodeBlock from '@/components/ui/CodeBlock';

// ─── Config ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.toolblip.com';

const ENDPOINTS = [
  { id: 'tools-list',    method: 'GET',    path: '/api/tools',          auth: false, status: 200, label: 'List all tools' },
  { id: 'tools-detail',  method: 'GET',    path: '/api/tools/{slug}',   auth: false, status: 200, label: 'Get single tool' },
  { id: 'auth-register', method: 'POST',   path: '/api/auth/register',  auth: false, status: 201, label: 'Create account' },
  { id: 'auth-login',    method: 'POST',   path: '/api/auth/login',     auth: false, status: 200, label: 'Sign in' },
  { id: 'auth-logout',   method: 'POST',   path: '/api/auth/logout',    auth: true,  status: 200, label: 'Revoke session' },
  { id: 'auth-user',     method: 'GET',    path: '/api/auth/user',     auth: true,  status: 200, label: 'Get authenticated user' },
] as const;

const SECTIONS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'auth',          label: 'Authentication' },
  { id: 'tools-list',    label: 'GET /api/tools' },
  { id: 'tools-detail',  label: 'GET /api/tools/{slug}' },
  { id: 'auth-register', label: 'POST /api/auth/register' },
  { id: 'auth-login',   label: 'POST /api/auth/login' },
  { id: 'auth-logout',   label: 'POST /api/auth/logout' },
  { id: 'auth-user',     label: 'GET /api/auth/user' },
  { id: 'errors',        label: 'Error Codes' },
] as const;

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
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 }
    );
    for (const { id } of SECTIONS) {
      document.getElementById(id)?.setAttribute('tabindex', '-1');
      observerRef.current?.observe(document.getElementById(id)!);
    }
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#090909] text-gray-900 dark:text-gray-100">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#090909]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold bg-red-500 text-white px-2.5 py-1 rounded-full">REST v1</span>
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
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-100 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16 flex flex-col lg:flex-row lg:items-start gap-10">

          {/* Intro */}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
              API Reference
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mb-8">
              HTTP REST API for browsing developer tools and managing user accounts.
              All responses are JSON. Authenticate with a Bearer token to access protected endpoints.
            </p>

            {/* Endpoint pills */}
            <div className="flex flex-wrap gap-2">
              {ENDPOINTS.map(({ id, method, path }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full
                    bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800
                    text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                    hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
                >
                  <MethodPill method={method} />
                  <span className="font-mono">{path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Base URL card */}
          <div className="shrink-0 lg:w-72">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Base URL</p>
              <code className="block text-sm font-mono text-red-600 dark:text-red-400 break-all">{BASE_URL}</code>
              <p className="text-[10px] text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                SSL active — Cloudflare proxied
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Railway fallback</p>
                <code className="block text-[11px] font-mono text-gray-500 dark:text-gray-600 break-all">
                  https://toolblip-api-production.up.railway.app
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex gap-10 lg:gap-12">

        {/* Sidebar */}
        <aside className="w-36 xl:w-44 shrink-0 hidden md:block">
          <nav className="sticky top-20 space-y-0.5 text-sm max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-1">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">On this page</p>
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs text-left cursor-pointer ${
                  activeSection === id
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/30'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* ── Overview ── */}
          <section id="overview" className="scroll-mt-16">
            <SectionHeading>Overview</SectionHeading>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { icon: '🌐', title: 'Base URL', body: `All requests go to ${BASE_URL}` },
                { icon: '🔐', title: 'Auth', body: 'Bearer token in Authorization header' },
                { icon: '📦', title: 'Format', body: 'All responses are JSON. Always send Accept: application/json' },
              ].map(({ icon, title, body }) => (
                <div key={title} className="p-4 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-xl">
                  <span className="text-lg">{icon}</span>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 mb-1">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>Rate limiting:</strong> Back off and retry with the <InlineCode>Retry-After</InlineCode> header if you hit 429.
            </div>

            {/* Endpoint table */}
            <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Method</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endpoint</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Auth</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ENDPOINTS.map(({ method, path, auth, label }) => (
                    <tr key={path} className="bg-white dark:bg-[#090909] hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-4 py-3"><MethodPill method={method} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{path}</td>
                      <td className="px-4 py-3">{auth ? <LockPill /> : <PublicPill />}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Authentication ── */}
          <section id="auth" className="scroll-mt-16">
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

          {/* ── GET /api/tools ── */}
          <section id="tools-list" className="scroll-mt-16">
            <EndpointHeader method="GET" path="/api/tools" auth={false} status={200} />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              Returns all available tools. Public — no authentication required.
            </p>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
              <CodeBlock
                code={`curl "${BASE_URL}/api/tools" \\
  -H "Accept: application/json"`}
                title="Request"
                language="bash"
              />
            </div>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Query parameters</p>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-28">Param</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-20">Type</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[
                      { name: 'category', type: 'string',  desc: 'Filter by category (e.g. AI, DevOps, Analytics)' },
                      { name: 'page',     type: 'number',  desc: 'Page number (default: 1)' },
                      { name: 'per_page', type: 'number',  desc: 'Results per page (default: 20)' },
                    ].map(({ name, type, desc }) => (
                      <tr key={name} className="bg-white dark:bg-[#090909]">
                        <td className="px-4 py-2.5 font-mono text-gray-700 dark:text-gray-300">{name}</td>
                        <td className="px-4 py-2.5 text-gray-400 dark:text-gray-500">{type}</td>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
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

            <div className="mt-4 p-4 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Response fields</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                {[
                  { field: 'tools[].id',         desc: 'Unique numeric ID' },
                  { field: 'tools[].slug',        desc: 'URL-friendly identifier' },
                  { field: 'tools[].name',        desc: 'Display name' },
                  { field: 'tools[].description', desc: 'Short description' },
                  { field: 'tools[].category',    desc: 'Tool category' },
                  { field: 'tools[].is_pro',      desc: 'Requires pro subscription' },
                  { field: 'tools[].emoji',       desc: 'Icon emoji (optional)' },
                  { field: 'tools[].created_at',  desc: 'ISO 8601 timestamp' },
                ].map(({ field, desc }) => (
                  <div key={field} className="flex gap-2 py-0.5">
                    <code className="font-mono text-gray-700 dark:text-gray-300 shrink-0">{field}</code>
                    <span className="text-gray-400 dark:text-gray-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── GET /api/tools/{slug} ── */}
          <section id="tools-detail" className="scroll-mt-16">
            <EndpointHeader method="GET" path="/api/tools/{slug}" auth={false} status={200} />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              Fetch a single tool by its slug identifier. Returns 404 if not found.
            </p>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
              <CodeBlock
                code={`curl "${BASE_URL}/api/tools/claude-code" \\
  -H "Accept: application/json"`}
                title="Request"
                language="bash"
              />
            </div>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Path parameters</p>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest w-28">Param</th>
                      <th className="text-left px-4 py-2 text-gray-400 font-bold uppercase tracking-widest">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-[#090909]">
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
  "tool": {
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
  "message": "Tool not found"
}`}
                language="json"
              />
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* AUTH                                                             */}
          {/* ═══════════════════════════════════════════════════════════════ */}

          {/* ── POST /api/auth/register ── */}
          <section id="auth-register" className="scroll-mt-16">
            <EndpointHeader method="POST" path="/api/auth/register" auth={false} status={201} />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              Create a new user account. Returns the user object and a Bearer token.
            </p>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
              <CodeBlock
                code={`curl -X POST "${BASE_URL}/api/auth/register" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Harun Ray",
    "email": "harun@toolblip.com",
    "password": "securepassword123",
    "password_confirmation": "securepassword123"
  }'`}
                title="Request"
                language="bash"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Request body</p>
                <CodeBlock
                  code={`{
  "name": "Harun Ray",
  "email": "harun@toolblip.com",
  "password": "securepassword123",
  "password_confirmation": "securepassword123"
}`}
                  language="json"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Response — 201</p>
                <CodeBlock
                  code={`{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@toolblip.com",
    "is_pro": false
  },
  "token": "1|abcd1234efgh5678ijkl9012mnop3456qrst"
}`}
                  language="json"
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Error — 422</p>
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
          </section>

          {/* ── POST /api/auth/login ── */}
          <section id="auth-login" className="scroll-mt-16">
            <EndpointHeader method="POST" path="/api/auth/login" auth={false} status={200} />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              Sign in with existing credentials. Returns the user object and a Bearer token.
            </p>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
              <CodeBlock
                code={`curl -X POST "${BASE_URL}/api/auth/login" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "harun@toolblip.com",
    "password": "securepassword123"
  }'`}
                title="Request"
                language="bash"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Request body</p>
                <CodeBlock
                  code={`{
  "email": "harun@toolblip.com",
  "password": "securepassword123"
}`}
                  language="json"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Response — 200</p>
                <CodeBlock
                  code={`{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@toolblip.com",
    "is_pro": false
  },
  "token": "1|abcd1234efgh5678ijkl9012mnop3456qrst"
}`}
                  language="json"
                />
              </div>
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
          </section>

          {/* ── POST /api/auth/logout ── */}
          <section id="auth-logout" className="scroll-mt-16">
            <EndpointHeader method="POST" path="/api/auth/logout" auth={true} status={200} />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              Revoke the current Bearer token and end the session. Token becomes permanently invalid.
            </p>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
              <CodeBlock
                code={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer 1|abcd1234efgh5678ijkl9012mnop3456qrst"`}
                title="Request"
                language="bash"
              />
            </div>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Response — 200</p>
              <CodeBlock
                code={`{
  "message": "Logged out successfully"
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
          </section>

          {/* ── GET /api/auth/user ── */}
          <section id="auth-user" className="scroll-mt-16">
            <EndpointHeader method="GET" path="/api/auth/user" auth={true} status={200} />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              Retrieve the currently authenticated user profile.
            </p>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Example request</p>
              <CodeBlock
                code={`curl "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer 1|abcd1234efgh5678ijkl9012mnop3456qrst"`}
                title="Request"
                language="bash"
              />
            </div>

            <div className="mb-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Response — 200</p>
              <CodeBlock
                code={`{
  "user": {
    "id": 1,
    "name": "Harun Ray",
    "email": "harun@toolblip.com",
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
                  className="flex items-center gap-2.5 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2.5"
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
              <a href="mailto:harun@toolblip.com" className="text-red-600 dark:text-red-400 hover:underline">harun@toolblip.com</a>
              <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
              <a href="https://github.com/toolblip" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 hover:underline">GitHub</a>
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  POST:   'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  PUT:    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  DELETE: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  PATCH:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2.5">
      <span className="w-1 h-6 bg-red-500 rounded-full shrink-0 mt-0.5" />
      {children}
    </h2>
  );
}

function EndpointHeader({ method, path, auth, status }: { method: string; path: string; auth: boolean; status: number }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 flex-wrap">
      <MethodPill method={method} />
      <code className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">{path}</code>
      {auth ? <LockPill /> : <PublicPill />}
      <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">→ {status}</span>
    </div>
  );
}

function MethodPill({ method }: { method: string }) {
  return (
    <span className={`${METHOD_COLORS[method] ?? ''} text-[11px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0`}>
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
