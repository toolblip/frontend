'use client';

import type { Metadata } from 'next';
import { useState } from 'react';

// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE = 'https://api.toolblip.com';           // primary (SSL pending)
const RAILWAY = 'https://toolblip-api-production.up.railway.app'; // fallback

// ─── Design tokens ────────────────────────────────────────────────────────────
const t = {
  bg:         'var(--bg)',
  surface:    'var(--surface)',
  surface2:   'var(--surface-2)',
  border:     'var(--border)',
  line:       'var(--line)',
  fg0:        'var(--fg-0)',
  fg1:        'var(--fg-1)',
  fg2:        'var(--fg-2)',
  fg3:        'var(--fg-3)',
  blue:       'var(--blue)',
  blueBg:     '#dcf4ff',
  blueFg:     '#0c5790',
  greenBg:    '#d6f0df',
  greenFg:    '#1e6b42',
  redBg:      '#fdecec',
  redFg:      '#9b1f1a',
  red:        '#c0392b',
  codeBg:     '#0f1117',
  codeFg:     '#e2e8f0',
  accentBg:   '#f0f4ff',
  accentBdr:  '#c7d7ff',
};

// ─── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* noop */ }
  };
  return (
    <button onClick={handleCopy} title={copied ? 'Copied!' : 'Copy'} style={{
      position: 'absolute', top: 10, right: 12,
      background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
      border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.12)'}`,
      borderRadius: 6, padding: '3px 10px', fontSize: 11,
      fontFamily: 'var(--f-mono, monospace)', color: copied ? '#4ade80' : '#94a3b8',
      cursor: 'pointer', transition: 'all 0.15s', zIndex: 2,
    }}>{copied ? '✓ Copied' : 'Copy'}</button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconTerminal = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const IconLock     = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconDoc      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconCheck    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconLink     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

// ─── Method badge ─────────────────────────────────────────────────────────────
function Method({ m }: { m: 'GET' | 'POST' | 'DELETE' }) {
  const map = { GET: { bg: t.blueBg,  fg: t.blueFg  }, POST: { bg: t.greenBg, fg: t.greenFg }, DELETE: { bg: t.redBg, fg: t.redFg } };
  const s = map[m];
  return <span style={{ fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 11, padding: '4px 11px', borderRadius: 6, letterSpacing: '0.05em', background: s.bg, color: s.fg }}>{m}</span>;
}

// ─── Endpoint card ────────────────────────────────────────────────────────────
interface Param { name: string; in: 'path'|'query'|'body'; type: string; required: boolean; description: string; }

function Endpoint({ id, method, path, description, auth, params, curl, response }: {
  id: string; method: 'GET'|'POST'|'DELETE'; path: string; description: string;
  auth?: boolean; params?: Param[]; curl: string; response: string;
}) {
  return (
    <div id={id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
      {/* header */}
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
        <Method m={method} />
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 14.5, fontWeight: 600, color: t.fg0 }}>{path}</span>
        {auth && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: t.redBg, border: '1px solid #f5c6c6', color: t.redFg, borderRadius: 6, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>
          <IconLock /> Auth required
        </span>}
      </div>
      {/* description */}
      <div style={{ padding: '16px 22px' }}>
        <p style={{ color: t.fg2, fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>{description}</p>
      </div>
      {/* params table */}
      {params && params.length > 0 && (
        <div style={{ padding: '0 22px 20px', borderTop: `1px solid ${t.line}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: t.fg3, margin: '16px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconLink /> Parameters
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
            <thead><tr>
              <th style={{ textAlign: 'left' as const, padding: '8px 12px 8px 0', color: t.fg3, fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: `1px solid ${t.line}`, width: 160 }}>Name</th>
              <th style={{ textAlign: 'left' as const, padding: '8px 12px 8px 0', color: t.fg3, fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: `1px solid ${t.line}`, width: 72 }}>In</th>
              <th style={{ textAlign: 'left' as const, padding: '8px 12px 8px 0', color: t.fg3, fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: `1px solid ${t.line}`, width: 100 }}>Type</th>
              <th style={{ textAlign: 'left' as const, padding: '8px 12px 8px 0', color: t.fg3, fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: `1px solid ${t.line}` }}>Description</th>
            </tr></thead>
            <tbody>
              {params.map((p, i) => (
                <tr key={p.name}>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: i === params.length - 1 ? 'none' : `1px solid ${t.line}`, verticalAlign: 'top' as const }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, fontWeight: 600, color: t.fg0 }}>{p.name}{p.required && <span style={{ color: t.red, marginLeft: 3 }}>*</span>}</span>
                  </td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: i === params.length - 1 ? 'none' : `1px solid ${t.line}`, verticalAlign: 'top' as const }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: t.fg3 }}>{p.in}</span>
                  </td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: i === params.length - 1 ? 'none' : `1px solid ${t.line}`, verticalAlign: 'top' as const }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, color: t.blueFg, background: t.blueBg, borderRadius: 5, padding: '1px 8px', whiteSpace: 'nowrap' as const, display: 'inline-block' }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: i === params.length - 1 ? 'none' : `1px solid ${t.line}`, verticalAlign: 'top' as const }}>
                    <span style={{ color: t.fg2, fontSize: 13, lineHeight: 1.6 }}>{p.description}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* curl + response split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${t.line}` }}>
        <div style={{ padding: '18px 22px', borderRight: `1px solid ${t.line}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: t.fg3, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconTerminal /> curl
          </p>
          <div style={{ position: 'relative' }}>
            <CopyButton text={curl} />
            <pre style={{ fontFamily: 'var(--f-mono)', background: t.codeBg, color: t.codeFg, borderRadius: 10, padding: '18px 22px', fontSize: 12.5, lineHeight: 1.8, overflowX: 'auto' as const, margin: 0, tabSize: 2, whiteSpace: 'pre' as const }}>{curl}</pre>
          </div>
        </div>
        <div style={{ padding: '18px 22px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: t.fg3, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconCheck /> Response
          </p>
          <div style={{ position: 'relative' }}>
            <CopyButton text={response} />
            <pre style={{ fontFamily: 'var(--f-mono)', background: t.codeBg, color: t.codeFg, borderRadius: 10, padding: '18px 22px', fontSize: 12.5, lineHeight: 1.8, overflowX: 'auto' as const, margin: 0, tabSize: 2, whiteSpace: 'pre' as const }}>{response}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApiDocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: 'var(--f-sans)', color: t.fg0, scrollBehavior: 'smooth' as const }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: '64px 0 52px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: t.blue, marginBottom: 12 }}>API Reference</p>
          <h1 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 46, letterSpacing: '-0.028em', lineHeight: 1.05, margin: '0 0 16px', color: t.fg0 }}>API Documentation</h1>
          <p style={{ color: t.fg2, fontSize: 15.5, lineHeight: 1.75, margin: 0, maxWidth: 520 }}>
            Integrate Toolblip into your app. All endpoints return JSON over HTTPS using Bearer token authentication.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 24 }}>
            {[
              { icon: <IconTerminal />, label: 'Base:', value: BASE },
              { icon: <IconLock />,     label: 'Auth:', value: 'Bearer token' },
              { icon: <IconDoc />,      label: 'Format:', value: 'application/json' },
            ].map(b => (
              <div key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 14px', fontSize: 12.5, fontWeight: 500, color: t.fg1 }}>
                {b.icon}
                <span style={{ color: t.fg2 }}>{b.label}</span>
                <strong style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: t.fg0, fontWeight: 600, marginLeft: 2 }}>{b.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64, padding: '56px 0 96px', alignItems: 'start' as const }}>

          {/* Sidebar */}
          <nav style={{ position: 'sticky' as const, top: 28 }}>
            {[
              { label: 'Getting Started', links: [['Overview', '#overview'], ['Base URL', '#base-url'], ['Authentication', '#authentication']] },
              { label: 'Tools', links: [['GET /api/tools', '#get-tools'], ['GET /api/tools/{slug}', '#get-tool-slug']] },
              { label: 'Auth', links: [['POST /api/auth/register', '#post-register'], ['POST /api/auth/login', '#post-login'], ['POST /api/auth/logout', '#post-logout'], ['GET /api/auth/user', '#get-user']] },
              { label: 'Reference', links: [['Errors', '#errors']] },
            ].map(section => (
              <div key={section.label} style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: t.fg3, marginBottom: 7, paddingLeft: 10 }}>{section.label}</p>
                {section.links.map(([text, href]) => (
                  <a key={href} href={href} style={{ display: 'block', padding: '5px 10px', borderRadius: 7, fontSize: 13.5, fontWeight: 500, color: t.fg2, textDecoration: 'none', cursor: 'pointer', transition: 'background 0.1s, color 0.1s' }}>
                    {text}
                  </a>
                ))}
              </div>
            ))}
          </nav>

          {/* Content */}
          <main>

            {/* Overview */}
            <section id="overview" style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.022em', color: t.fg0, margin: '0 0 10px' }}>Overview</h2>
              <p style={{ color: t.fg2, fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>The Toolblip API gives you programmatic access to browse the tool directory and manage user accounts. All requests go over HTTPS and return JSON.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { icon: '🔓', label: 'Bearer token auth', desc: 'Simple token-based authentication for protected endpoints.' },
                  { icon: '📦', label: 'RESTful', desc: 'Standard HTTP methods — GET, POST. Predictable and intuitive.' },
                  { icon: '📋', label: 'JSON responses', desc: 'Every endpoint returns application/json. Always.' },
                ].map(item => (
                  <div key={item.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '16px 18px' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: t.fg0, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 12.5, color: t.fg2, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ height: 1, background: t.line, margin: '56px 0' }} />

            {/* Base URL */}
            <section id="base-url" style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.022em', color: t.fg0, margin: '0 0 10px' }}>Base URL</h2>
              <p style={{ color: t.fg2, fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>All API requests are made to this base URL.</p>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.fg3, flexShrink: 0 }}>Primary</span>
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5, color: t.fg0, fontWeight: 600 }}>{BASE}</code>
              </div>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.fg3, flexShrink: 0 }}>Railway</span>
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5, color: t.fg2 }}>{RAILWAY}</code>
              </div>
              <p style={{ color: t.fg3, fontSize: 12.5, marginTop: 12 }}>Use the Railway URL until api.toolblip.com SSL is ready.</p>
            </section>

            <div style={{ height: 1, background: t.line, margin: '56px 0' }} />

            {/* Authentication */}
            <section id="authentication" style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.022em', color: t.fg0, margin: '0 0 10px' }}>Authentication</h2>
              <p style={{ color: t.fg2, fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>
                The API uses Bearer token authentication. Register or log in to receive a token, then include it in the <code style={{ fontFamily: 'var(--f-mono)', background: t.surface2, color: t.fg0, borderRadius: 5, padding: '1px 7px', fontSize: 12.5 }}>Authorization</code> header on every protected request.
              </p>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '22px 24px' }}>
                <p style={{ color: t.fg2, fontSize: 14, margin: '0 0 10px' }}>Include your token on every authenticated request:</p>
                <pre style={{ fontFamily: 'var(--f-mono)', background: t.codeBg, color: t.codeFg, borderRadius: 10, padding: '14px 18px', fontSize: 13, overflowX: 'auto' as const, whiteSpace: 'pre' as const, margin: 0 }}>{`Authorization: Bearer $TB_TOKEN`}</pre>
              </div>
              <p style={{ color: t.fg3, fontSize: 12.5, marginTop: 12 }}>Tokens do not expire unless you log out. Store them securely — never expose them client-side.</p>
            </section>

            <div style={{ height: 1, background: t.line, margin: '56px 0' }} />

            {/* Tools */}
            <section id="tools" style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.022em', color: t.fg0, margin: '0 0 10px' }}>Tools</h2>
              <p style={{ color: t.fg2, fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>Browse and fetch tools from the directory.</p>

              <Endpoint
                id="get-tools"
                method="GET"
                path="/api/tools"
                description="Returns a paginated list of all tools. Supports filtering by category and full-text search."
                params={[
                  { name: 'category',  in: 'query', type: 'string',   required: false, description: 'Filter by category slug (e.g. developer, text, image).' },
                  { name: 'search',     in: 'query', type: 'string',   required: false, description: 'Search by name or keyword in the title and description.' },
                  { name: 'page',       in: 'query', type: 'integer',  required: false, description: 'Page number for pagination (default: 1).' },
                  { name: 'per_page',   in: 'query', type: 'integer',  required: false, description: 'Results per page (default: 20, max: 100).' },
                ]}
                curl={`curl -X GET "${BASE}/api/tools" \\
  -H "Accept: application/json"`}
                response={`// 200 OK
{
  "tools": {
    "tools": [
      {
        "id": 1,
        "slug": "url-encode",
        "name": "URL Encode",
        "description": "Encode text for safe URL usage.",
        "category": "encoder",
        "is_pro": false,
        "emoji": "🔗",
        "created_at": "2026-01-15T09:23:00.000000Z"
      },
      {
        "id": 2,
        "slug": "json-formatter",
        "name": "JSON Formatter",
        "description": "Format and validate JSON data instantly.",
        "category": "developer",
        "is_pro": false,
        "emoji": "📋",
        "created_at": "2026-01-20T14:11:00.000000Z"
      }
    ],
    "total": 47,
    "page": 1,
    "per_page": 20
  }
}`}
              />

              <Endpoint
                id="get-tool-slug"
                method="GET"
                path="/api/tools/{slug}"
                description="Fetch a single tool by its unique slug. Returns full tool details."
                params={[
                  { name: 'slug', in: 'path', type: 'string', required: true, description: 'URL-friendly slug of the tool (e.g. json-formatter).' },
                ]}
                curl={`curl -X GET "${BASE}/api/tools/json-formatter" \\
  -H "Accept: application/json"`}
                response={`// 200 OK
{
  "tool": {
    "id": 2,
    "slug": "json-formatter",
    "name": "JSON Formatter",
    "description": "Format and validate JSON data instantly.",
    "category": "developer",
    "is_pro": false,
    "emoji": "📋",
    "created_at": "2026-01-20T14:11:00.000000Z"
  }
}`}
              />
            </section>

            <div style={{ height: 1, background: t.line, margin: '56px 0' }} />

            {/* Auth */}
            <section id="auth" style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.022em', color: t.fg0, margin: '0 0 10px' }}>Auth</h2>
              <p style={{ color: t.fg2, fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>Register, log in, and manage your API session.</p>

              <Endpoint
                id="post-register"
                method="POST"
                path="/api/auth/register"
                description="Create a new user account. Returns the user object and a Bearer token for immediate authentication."
                params={[
                  { name: 'name',                   in: 'body', type: 'string', required: true,  description: 'Full display name of the user.' },
                  { name: 'email',                  in: 'body', type: 'string', required: true,  description: 'Valid email address (must be unique per account).' },
                  { name: 'password',               in: 'body', type: 'string', required: true,  description: 'Account password (minimum 8 characters).' },
                  { name: 'password_confirmation',  in: 'body', type: 'string', required: true,  description: 'Must match the password field exactly.' },
                ]}
                curl={`curl -X POST "${BASE}/api/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "securepass123",
    "password_confirmation": "securepass123"
  }'`}
                response={`// 201 Created
{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "1|abcdef1234567890abcdef1234567890abcdef12"
}`}
              />

              <Endpoint
                id="post-login"
                method="POST"
                path="/api/auth/login"
                description="Authenticate with existing credentials. Returns the user object and a Bearer token."
                params={[
                  { name: 'email',    in: 'body', type: 'string', required: true, description: 'Email address of your account.' },
                  { name: 'password', in: 'body', type: 'string', required: true, description: 'Your account password.' },
                ]}
                curl={`curl -X POST "${BASE}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "alex@example.com",
    "password": "securepass123"
  }'`}
                response={`// 200 OK
{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "2|abcdef1234567890abcdef1234567890abcdef12"
}`}
              />

              <Endpoint
                id="post-logout"
                method="POST"
                path="/api/auth/logout"
                description="Invalidate the current token server-side. Requires authentication. The token can no longer be used after this call."
                auth
                curl={`curl -X POST "${BASE}/api/auth/logout" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer $TB_TOKEN"`}
                response={`// 200 OK
{
  "message": "Session terminated successfully."
}`}
              />

              <Endpoint
                id="get-user"
                method="GET"
                path="/api/auth/user"
                description="Fetch the currently authenticated user. Use to verify a token or retrieve the latest profile data."
                auth
                curl={`curl -X GET "${BASE}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer $TB_TOKEN"`}
                response={`// 200 OK
{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": true
  }
}`}
              />
            </section>

            <div style={{ height: 1, background: t.line, margin: '56px 0' }} />

            {/* Errors */}
            <section id="errors" style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.022em', color: t.fg0, margin: '0 0 10px' }}>Errors</h2>
              <p style={{ color: t.fg2, fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>
                All errors return a JSON body with a <code style={{ fontFamily: 'var(--f-mono)', background: t.surface2, color: t.fg0, borderRadius: 5, padding: '1px 7px', fontSize: 12.5 }}>message</code> field. HTTP status codes follow standard REST conventions.
              </p>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '22px 24px' }}>
                {([
                  { code: '400', label: 'Bad Request',        desc: 'Invalid or missing parameters in the request body.' },
                  { code: '401', label: 'Unauthorized',       desc: 'Missing or invalid auth token.' },
                  { code: '403', label: 'Forbidden',          desc: 'Authenticated but not permitted for this resource.' },
                  { code: '404', label: 'Not Found',          desc: 'Resource does not exist (e.g. unknown tool slug).' },
                  { code: '422', label: 'Unprocessable Entity', desc: 'Validation failed — check the message field for details.' },
                  { code: '429', label: 'Too Many Requests',  desc: 'Rate limit exceeded. Wait before retrying.' },
                  { code: '500', label: 'Server Error',       desc: 'Something went wrong on our end. Try again later.' },
                ] as const).map((err, i) => (
                  <div key={err.code} style={{ display: 'grid', gridTemplateColumns: '52px 180px 1fr', gap: 10, paddingBottom: i === 6 ? 0 : 14, borderBottom: i === 6 ? 'none' : `1px solid ${t.line}`, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700, color: t.red }}>{err.code}</span>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: t.fg0 }}>{err.label}</span>
                    <span style={{ color: t.fg2, fontSize: 13.5 }}>{err.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quickstart */}
            <div style={{ background: t.accentBg, border: `1px solid ${t.accentBdr}`, borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ color: t.fg1, fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: t.fg0 }}>Quickstart — 3 steps:</strong>{' '}
                <strong>1.</strong> Call <code style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>POST /api/auth/register</code> to create an account and get a token.{' '}
                <strong>2.</strong> Save the token — it doesn&apos;t expire unless you log out.{' '}
                <strong>3.</strong> Pass it as <code style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>Authorization: Bearer &lt;token&gt;</code> on every authenticated request.
              </p>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// Re-export metadata for Next.js
export { metadata };
