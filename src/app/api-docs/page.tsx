import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Docs — Toolblip',
  description:
    'Toolblip REST API reference. Authenticate with Bearer tokens and integrate the tool directory into your app.',
  openGraph: {
    title: 'API Docs — Toolblip',
    description: 'Toolblip REST API reference. Authenticate with Bearer tokens and integrate the tool directory into your app.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'API Docs — Toolblip',
    description: 'Toolblip REST API reference. Authenticate with Bearer tokens and integrate the tool directory into your app.',
  },
};

const BASE = 'https://toolblip-api-production.up.railway.app';
const CUSTOM = 'https://api.toolblip.com';

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--f-sans)', color: 'var(--fg-0)' },
  container: { maxWidth: 1060, margin: '0 auto', padding: '0 28px' },
  // Header
  header: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '56px 0 44px' },
  kicker: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 10 },
  title: { fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 42, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '0 0 14px', color: 'var(--fg-0)' },
  subtitle: { color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 540 },
  badges: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 22 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 13px', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-1)' },
  badgeMono: { fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-0)', fontWeight: 600 },
  // Layout
  layout: { display: 'grid', gridTemplateColumns: '210px 1fr', gap: 56, padding: '48px 0 96px', alignItems: 'start' },
  nav: { position: 'sticky' as const, top: 24 },
  navSection: { marginBottom: 28 },
  navLabel: { fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 6, paddingLeft: 10 },
  navLink: { display: 'block', padding: '5px 10px', borderRadius: 7, fontSize: 13.5, fontWeight: 500, color: 'var(--fg-2)', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.1s, color 0.1s' },
  content: { minWidth: 0 },
  // Sections
  section: { marginBottom: 60 },
  sectionTitle: { fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--fg-0)', marginBottom: 8 },
  sectionDesc: { color: 'var(--fg-2)', fontSize: 14.5, marginBottom: 24, lineHeight: 1.65 },
  // Cards
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  cardHeader: { padding: '15px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const },
  cardBody: { padding: '16px 20px' },
  // Method pills
  method: { fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 5, letterSpacing: '0.04em', flexShrink: 0 },
  methodGet: { background: '#dcf4ff', color: '#0c5790' },
  methodPost: { background: '#d6f0df', color: '#1e6b42' },
  methodDelete: { background: '#fdecec', color: '#9b1f1a' },
  endpoint: { fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 600, color: 'var(--fg-0)' },
  authBadge: { display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fdecec', border: '1px solid #f5c6c6', color: '#9b1f1a', borderRadius: 6, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, flexShrink: 0 },
  desc: { color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, margin: 0 },
  // Param table
  paramTable: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  th: { textAlign: 'left' as const, padding: '8px 10px 8px 0', color: 'var(--fg-3)', fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: '1px solid var(--line)' },
  td: { padding: '10px 10px 10px 0', borderBottom: '1px solid var(--line)', verticalAlign: 'top' as const },
  tdLast: { borderBottom: 'none' },
  tdName: { fontFamily: 'var(--f-mono)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-0)' },
  tdType: { fontFamily: 'var(--f-mono)', fontSize: 11.5, color: '#0c5790', background: '#dcf4ff', borderRadius: 4, padding: '1px 7px', whiteSpace: 'nowrap' as const },
  tdDesc: { color: 'var(--fg-2)', fontSize: 13 },
  required: { color: 'var(--red)', marginLeft: 3 },
  // Code
  codeBlock: { fontFamily: 'var(--f-mono)', background: '#0f1117', color: '#e2e8f0', borderRadius: 10, padding: '16px 20px', fontSize: 12.5, lineHeight: 1.75, overflowX: 'auto' as const, margin: 0, tabSize: 2, whiteSpace: 'pre' as const },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--line)' },
  splitPane: { padding: '16px 20px' },
  splitPaneBorder: { borderRight: '1px solid var(--line)' },
  splitLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'var(--fg-3)', marginBottom: 10 },
  codeInline: { fontFamily: 'var(--f-mono)', background: 'var(--surface-2)', color: 'var(--fg-0)', borderRadius: 5, padding: '1px 7px', fontSize: 12.5 },
  // Misc
  divider: { height: 1, background: 'var(--line)', margin: '48px 0' },
  urlCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 },
  urlLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', flexShrink: 0 },
  authCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' },
  authCardInline: { fontFamily: 'var(--f-mono)', background: '#0f1117', color: '#e2e8f0', borderRadius: 10, padding: '14px 18px', fontSize: 13, overflowX: 'auto' as const, whiteSpace: 'pre' as const, margin: '12px 0 0' },
  errorRow: { display: 'grid', gridTemplateColumns: '52px 180px 1fr', gap: 8, paddingBottom: 12, borderBottom: '1px solid var(--line)', alignItems: 'baseline' },
  errorRowLast: { borderBottom: 'none', paddingBottom: 0 },
  errorCode: { fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700, color: 'var(--red)' },
  errorLabel: { fontWeight: 600, fontSize: 13.5, color: 'var(--fg-0)' },
  errorDesc: { color: 'var(--fg-2)', fontSize: 13.5 },
  tip: { background: '#f0f4ff', border: '1px solid #c7d7ff', borderRadius: 12, padding: '16px 20px', marginTop: 8 },
  tipText: { color: 'var(--fg-1)', fontSize: 13.5, lineHeight: 1.7, margin: 0 },
  noteCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px', marginTop: 16 },
  noteText: { color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.65, margin: 0 },
};

function Method({ m }: { m: 'GET' | 'POST' | 'DELETE' }) {
  const style = m === 'GET' ? s.methodGet : m === 'POST' ? s.methodPost : s.methodDelete;
  return <span style={{ ...s.method, ...style }}>{m}</span>;
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

// ─── Endpoint Component ───────────────────────────────────────────────────────

interface Param {
  name: string;
  in: 'path' | 'query' | 'body';
  type: string;
  required: boolean;
  description: string;
}

interface EndpointProps {
  id: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  description: string;
  auth?: boolean;
  params?: Param[];
  curl: string;
  response: string;
}

function Endpoint({ id, method, path, description, auth, params, curl, response }: EndpointProps) {
  return (
    <div id={id} style={s.card}>
      <div style={s.cardHeader}>
        <Method m={method} />
        <span style={s.endpoint}>{path}</span>
        {auth && (
          <span style={s.authBadge}>
            <LockIcon />
            Auth required
          </span>
        )}
      </div>
      <div style={s.cardBody}>
        <p style={s.desc}>{description}</p>
      </div>

      {params && params.length > 0 && (
        <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--line)' }}>
          <p style={{ ...s.splitLabel, marginTop: 14 }}>Parameters</p>
          <table style={s.paramTable}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 150 }}>Name</th>
                <th style={{ ...s.th, width: 70 }}>In</th>
                <th style={{ ...s.th, width: 95 }}>Type</th>
                <th style={s.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p, i) => (
                <tr key={p.name}>
                  <td style={{ ...s.td, ...(i === params.length - 1 ? s.tdLast : {}) }}>
                    <span style={s.tdName}>
                      {p.name}
                      {p.required && <span style={s.required}>*</span>}
                    </span>
                  </td>
                  <td style={{ ...s.td, ...(i === params.length - 1 ? s.tdLast : {}) }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{p.in}</span>
                  </td>
                  <td style={{ ...s.td, ...(i === params.length - 1 ? s.tdLast : {}) }}>
                    <span style={s.tdType}>{p.type}</span>
                  </td>
                  <td style={{ ...s.td, ...(i === params.length - 1 ? s.tdLast : {}) }}>
                    <span style={s.tdDesc}>{p.description}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={s.split}>
        <div style={{ ...s.splitPane, ...s.splitPaneBorder }}>
          <p style={s.splitLabel}>curl</p>
          <pre style={s.codeBlock}>{curl}</pre>
        </div>
        <div style={s.splitPane}>
          <p style={s.splitLabel}>Response</p>
          <pre style={s.codeBlock}>{response}</pre>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  return (
    <div style={s.page}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={s.header}>
        <div style={s.container}>
          <p style={s.kicker}>API Reference</p>
          <h1 style={s.title}>API Documentation</h1>
          <p style={s.subtitle}>
            Integrate Toolblip into your app. All endpoints return JSON over HTTPS.
          </p>
          <div style={s.badges}>
            <div style={s.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
              Base URL: <strong style={{ ...s.badgeMono, marginLeft: 4 }}>{BASE}</strong>
            </div>
            <div style={s.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Auth: <code style={{ marginLeft: 4, fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-0)', background: 'none', padding: 0 }}>Bearer token</code>
            </div>
            <div style={s.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Format: <strong style={{ fontWeight: 700, color: 'var(--fg-0)' }}>application/json</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div style={s.container}>
        <div style={s.layout}>

          {/* Sidebar nav */}
          <nav style={s.nav}>
            <div style={s.navSection}>
              <p style={s.navLabel}>Getting Started</p>
              <a href="#base-url" style={s.navLink}>Base URL</a>
              <a href="#authentication" style={s.navLink}>Authentication</a>
            </div>
            <div style={s.navSection}>
              <p style={s.navLabel}>Tools</p>
              <a href="#get-tools" style={s.navLink}>GET /api/tools</a>
              <a href="#get-tool-slug" style={s.navLink}>GET /api/tools/{'{slug}'}</a>
            </div>
            <div style={s.navSection}>
              <p style={s.navLabel}>Auth</p>
              <a href="#post-register" style={s.navLink}>POST /api/auth/register</a>
              <a href="#post-login" style={s.navLink}>POST /api/auth/login</a>
              <a href="#post-logout" style={s.navLink}>POST /api/auth/logout</a>
              <a href="#get-user" style={s.navLink}>GET /api/auth/user</a>
            </div>
            <div style={s.navSection}>
              <p style={s.navLabel}>Reference</p>
              <a href="#errors" style={s.navLink}>Errors</a>
            </div>
          </nav>

          {/* Main content */}
          <main style={s.content}>

            {/* ── Base URL ──────────────────────────────────────────────── */}
            <section id="base-url" style={s.section}>
              <h2 style={s.sectionTitle}>Base URL</h2>
              <p style={s.sectionDesc}>All API requests go to this base URL.</p>
              <div style={s.urlCard}>
                <span style={s.urlLabel}>Primary</span>
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5, color: 'var(--fg-0)', fontWeight: 600 }}>{BASE}</code>
              </div>
              <div style={s.noteCard}>
                <p style={s.noteText}>
                  While SSL is being provisioned for <code style={s.codeInline}>api.toolblip.com</code>, use the Railway URL above.
                  Switch the base URL to <code style={s.codeInline}>{CUSTOM}</code> once DNS and SSL are ready.
                </p>
              </div>
            </section>

            <div style={s.divider} />

            {/* ── Authentication ────────────────────────────────────────── */}
            <section id="authentication" style={s.section}>
              <h2 style={s.sectionTitle}>Authentication</h2>
              <p style={s.sectionDesc}>
                The API uses Bearer token authentication. Register or log in to receive a token, then include it in the{' '}
                <code style={s.codeInline}>Authorization</code> header on every protected request.
              </p>
              <div style={s.authCard}>
                <p style={{ color: 'var(--fg-2)', fontSize: 14, margin: '0 0 12px' }}>Include your token on every authenticated request:</p>
                <div style={s.authCardInline}>Authorization: Bearer $TB_TOKEN</div>
              </div>
              <p style={{ color: 'var(--fg-3)', fontSize: 12.5, marginTop: 10 }}>
                Tokens do not expire unless you log out. Store them securely — never expose them client-side.
              </p>
            </section>

            <div style={s.divider} />

            {/* ── Tools ─────────────────────────────────────────────────── */}
            <section id="tools" style={s.section}>
              <h2 style={s.sectionTitle}>Tools</h2>
              <p style={s.sectionDesc}>Browse and fetch tools from the directory.</p>

              <Endpoint
                id="get-tools"
                method="GET"
                path="/api/tools"
                description="Returns a paginated list of all tools. The array is wrapped under the tools key."
                params={[
                  { name: 'category', in: 'query', type: 'string', required: false, description: 'Filter by category slug (e.g. developer, text, image).' },
                  { name: 'search', in: 'query', type: 'string', required: false, description: 'Search by name or keyword in title and description.' },
                  { name: 'page', in: 'query', type: 'integer', required: false, description: 'Page number for pagination (default: 1).' },
                ]}
                curl={`curl -X GET "${BASE}/api/tools?category=developer&search=json" \\
  -H "Accept: application/json"`}
                response={`{
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
    ]
  }
}`}
              />

              <Endpoint
                id="get-tool-slug"
                method="GET"
                path="/api/tools/{slug}"
                description="Fetch a single tool by its unique slug. Returns full tool details."
                params={[
                  { name: 'slug', in: 'path', type: 'string', required: true, description: "URL-friendly slug of the tool (e.g. json-formatter)." },
                ]}
                curl={`curl -X GET "${BASE}/api/tools/json-formatter" \\
  -H "Accept: application/json"`}
                response={`{
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

            <div style={s.divider} />

            {/* ── Auth ──────────────────────────────────────────────────── */}
            <section id="auth" style={s.section}>
              <h2 style={s.sectionTitle}>Auth</h2>
              <p style={s.sectionDesc}>Register, log in, and manage your API session.</p>

              <Endpoint
                id="post-register"
                method="POST"
                path="/api/auth/register"
                description="Create a new user account. Returns the user object and a Bearer token for immediate authentication."
                params={[
                  { name: 'name', in: 'body', type: 'string', required: true, description: 'Full display name of the user.' },
                  { name: 'email', in: 'body', type: 'string', required: true, description: 'Valid email address (must be unique per account).' },
                  { name: 'password', in: 'body', type: 'string', required: true, description: 'Account password (minimum 8 characters).' },
                  { name: 'password_confirmation', in: 'body', type: 'string', required: true, description: 'Must match the password field exactly.' },
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
                response={`{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "1|abcdef1234567890..."
}`}
              />

              <Endpoint
                id="post-login"
                method="POST"
                path="/api/auth/login"
                description="Authenticate with existing credentials. Returns the user object and a Bearer token."
                params={[
                  { name: 'email', in: 'body', type: 'string', required: true, description: 'Email address of your account.' },
                  { name: 'password', in: 'body', type: 'string', required: true, description: 'Your account password.' },
                ]}
                curl={`curl -X POST "${BASE}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{
    "email": "alex@example.com",
    "password": "securepass123"
  }'`}
                response={`{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": false
  },
  "token": "2|abcdef1234567890..."
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
                response={`{
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
                response={`{
  "user": {
    "id": 12,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "is_pro": true
  }
}`}
              />
            </section>

            <div style={s.divider} />

            {/* ── Errors ────────────────────────────────────────────────── */}
            <section id="errors" style={s.section}>
              <h2 style={s.sectionTitle}>Errors</h2>
              <p style={s.sectionDesc}>
                All errors return a JSON body with a <code style={s.codeInline}>message</code> field.
                HTTP status codes follow standard REST conventions.
              </p>
              <div style={s.authCard}>
                {([
                  { code: '400', label: 'Bad Request', desc: 'Invalid or missing parameters in the request body.' },
                  { code: '401', label: 'Unauthorized', desc: 'Missing or invalid auth token.' },
                  { code: '403', label: 'Forbidden', desc: 'Authenticated but not permitted for this resource.' },
                  { code: '404', label: 'Not Found', desc: 'Resource does not exist (e.g. unknown tool slug).' },
                  { code: '422', label: 'Unprocessable Entity', desc: 'Validation failed — check the message field for details.' },
                  { code: '429', label: 'Too Many Requests', desc: 'Rate limit exceeded. Wait before retrying.' },
                  { code: '500', label: 'Server Error', desc: 'Something went wrong on our end. Try again later.' },
                ] as const).map((err, i) => (
                  <div key={err.code} style={{ ...s.errorRow, ...(i === 6 ? s.errorRowLast : {}) }}>
                    <span style={s.errorCode}>{err.code}</span>
                    <span style={s.errorLabel}>{err.label}</span>
                    <span style={s.errorDesc}>{err.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Quickstart ────────────────────────────────────────────── */}
            <div style={s.tip}>
              <p style={s.tipText}>
                <strong style={{ color: 'var(--fg-0)' }}>Quickstart — 3 steps:</strong>{' '}
                <strong>1.</strong> Call <code style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>POST /api/auth/register</code>{' '}
                to create an account and get a token.{' '}
                <strong>2.</strong> Save the token — it doesn&apos;t expire unless you log out.{' '}
                <strong>3.</strong> Pass it as{' '}
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>Authorization: Bearer &lt;token&gt;</code>{' '}
                on every authenticated request.
              </p>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
