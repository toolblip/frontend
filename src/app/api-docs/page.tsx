import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation — Toolblip',
  description:
    'Toolblip REST API reference. Authenticate with Bearer tokens and integrate tools into your app.',
  openGraph: {
    title: 'API Documentation — Toolblip',
    description:
      'Toolblip REST API reference. Authenticate with Bearer tokens and integrate tools into your app.',
    url: 'https://toolblip.com/api-docs',
    siteName: 'Toolblip',
    type: 'website',
  },
};

const BASE = 'https://toolblip-api-production.up.railway.app';
const CUSTOM = 'https://api.toolblip.com'; // switch once SSL is ready

// ─── Styles ───────────────────────────────────────────────────────────────────

const C = {
  page: { minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--f-sans)' },
  container: { maxWidth: 1080, margin: '0 auto', padding: '0 24px' },
  header: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '52px 0 40px' },
  kicker: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 10 },
  title: { fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.05, color: 'var(--fg-0)', margin: '0 0 12px' },
  subtitle: { color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: 560 },
  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 22 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 13px', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-1)' },
  badgeMono: { fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-0)', fontWeight: 600 },
  layout: { display: 'grid', gridTemplateColumns: '200px 1fr', gap: 52, padding: '44px 0 88px', alignItems: 'start' },
  nav: { position: 'sticky' as const, top: 24 },
  navSection: { marginBottom: 26 },
  navLabel: { fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 7, paddingLeft: 10 },
  navLink: { display: 'block', padding: '5px 10px', borderRadius: 7, fontSize: 13.5, fontWeight: 500, color: 'var(--fg-2)', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.1s, color 0.1s' },
  content: { minWidth: 0 },
  section: { marginBottom: 56 },
  sectionTitle: { fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--fg-0)', marginBottom: 6 },
  sectionDesc: { color: 'var(--fg-2)', fontSize: 14.5, marginBottom: 22, lineHeight: 1.6 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 18 },
  cardHeader: { padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const },
  cardBody: { padding: '14px 20px 16px' },
  method: { fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: 11, padding: '3px 9px', borderRadius: 5, letterSpacing: '0.03em', flexShrink: 0 },
  methodGet: { background: '#dcf4ff', color: '#0c5790' },
  methodPost: { background: '#d6f0df', color: '#1e6b42' },
  methodDelete: { background: '#fdecec', color: '#9b1f1a' },
  endpoint: { fontFamily: 'var(--f-mono)', fontSize: 13.5, fontWeight: 600, color: 'var(--fg-0)' },
  authBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fdecec', border: '1px solid #f5c6c6', color: '#9b1f1a', borderRadius: 6, padding: '3px 9px', fontSize: 11.5, fontWeight: 600, flexShrink: 0 },
  desc: { color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.55, margin: 0 },
  paramsTable: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left' as const, padding: '7px 8px 7px 0', color: 'var(--fg-3)', fontWeight: 600, fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.06em', borderBottom: '1px solid var(--line)' },
  td: { padding: '9px 8px 9px 0', borderBottom: '1px solid var(--line)', verticalAlign: 'top' as const },
  tdLast: { borderBottom: 'none' },
  tdName: { fontFamily: 'var(--f-mono)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-0)' },
  tdType: { fontFamily: 'var(--f-mono)', fontSize: 11.5, color: '#0c5790', background: '#dcf4ff', borderRadius: 4, padding: '1px 7px', whiteSpace: 'nowrap' as const },
  tdDesc: { color: 'var(--fg-2)', fontSize: 13 },
  required: { color: 'var(--red)', marginLeft: 3 },
  codeBlock: { fontFamily: 'var(--f-mono)', background: '#0f1117', color: '#e2e8f0', borderRadius: 10, padding: '16px 20px', fontSize: 12.5, lineHeight: 1.75, overflowX: 'auto' as const, margin: 0, tabSize: 2, whiteSpace: 'pre' as const },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--line)' },
  splitPane: { padding: '14px 18px' },
  splitPaneBorder: { borderRight: '1px solid var(--line)' },
  splitLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'var(--fg-3)', marginBottom: 10 },
  authCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' },
  codeInline: { fontFamily: 'var(--f-mono)', background: 'var(--surface-2)', color: 'var(--fg-0)', borderRadius: 5, padding: '1px 6px', fontSize: 12.5 },
  errorRow: { display: 'grid', gridTemplateColumns: '52px 200px 1fr', gap: 8, paddingBottom: 12, borderBottom: '1px solid var(--line)', alignItems: 'baseline' },
  errorRowLast: { borderBottom: 'none', paddingBottom: 0 },
  errorCode: { fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700, color: 'var(--red)' },
  errorLabel: { fontWeight: 600, fontSize: 13.5, color: 'var(--fg-0)' },
  errorDesc: { color: 'var(--fg-2)', fontSize: 13.5 },
  tip: { background: '#f0f4ff', border: '1px solid #c7d7ff', borderRadius: 12, padding: '16px 20px', marginTop: 8 },
  tipText: { color: 'var(--fg-1)', fontSize: 13.5, lineHeight: 1.65, margin: 0 },
  divider: { height: 1, background: 'var(--line)', margin: '44px 0' },
  urlCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 },
  urlLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', flexShrink: 0 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Method({ m }: { m: 'GET' | 'POST' | 'DELETE' }) {
  const style = m === 'GET' ? C.methodGet : m === 'POST' ? C.methodPost : C.methodDelete;
  return <span style={{ ...C.method, ...style }}>{m}</span>;
}

// ─── Endpoint ────────────────────────────────────────────────────────────────

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
    <div id={id} style={C.card}>
      <div style={C.cardHeader}>
        <Method m={method} />
        <span style={C.endpoint}>{path}</span>
        {auth && (
          <span style={C.authBadge}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Auth required
          </span>
        )}
      </div>
      <div style={C.cardBody}>
        <p style={C.desc}>{description}</p>
      </div>

      {params && params.length > 0 && (
        <div style={{ padding: '0 20px 16px', borderTop: '1px solid var(--line)' }}>
          <p style={{ ...C.splitLabel, marginTop: 14 }}>Parameters</p>
          <table style={C.paramsTable}>
            <thead><tr>
              <th style={{ ...C.th, width: 140 }}>Name</th>
              <th style={{ ...C.th, width: 65 }}>In</th>
              <th style={{ ...C.th, width: 90 }}>Type</th>
              <th style={C.th}>Description</th>
            </tr></thead>
            <tbody>
              {params.map((p, i) => (
                <tr key={p.name}>
                  <td style={{ ...C.td, ...(i === params.length - 1 ? C.tdLast : {}) }}>
                    <span style={C.tdName}>{p.name}{p.required && <span style={C.required}>*</span>}</span>
                  </td>
                  <td style={{ ...C.td, ...(i === params.length - 1 ? C.tdLast : {}) }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{p.in}</span>
                  </td>
                  <td style={{ ...C.td, ...(i === params.length - 1 ? C.tdLast : {}) }}>
                    <span style={C.tdType}>{p.type}</span>
                  </td>
                  <td style={{ ...C.td, ...(i === params.length - 1 ? C.tdLast : {}) }}>
                    <span style={C.tdDesc}>{p.description}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={C.split}>
        <div style={{ ...C.splitPane, ...C.splitPaneBorder }}>
          <p style={C.splitLabel}>curl</p>
          <pre style={C.codeBlock}>{curl}</pre>
        </div>
        <div style={C.splitPane}>
          <p style={C.splitLabel}>Response</p>
          <pre style={C.codeBlock}>{response}</pre>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  return (
    <div style={C.page}>
      {/* Header */}
      <div style={C.header}>
        <div style={C.container}>
          <p style={C.kicker}>API Reference</p>
          <h1 style={C.title}>API Documentation</h1>
          <p style={C.subtitle}>
            Integrate Toolblip into your app. All endpoints return JSON over HTTPS.
          </p>
          <div style={C.badgeRow}>
            <div style={C.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
              Base URL: <strong style={{ ...C.badgeMono, marginLeft: 4 }}>{BASE}</strong>
            </div>
            <div style={C.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Auth: <code style={{ marginLeft: 4, fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-0)', background: 'none', padding: 0 }}>Bearer token</code>
            </div>
            <div style={C.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Format: <strong style={{ fontWeight: 700, color: 'var(--fg-0)' }}>application/json</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={C.container}>
        <div style={C.layout}>

          {/* Sidebar */}
          <nav style={C.nav}>
            <div style={C.navSection}>
              <p style={C.navLabel}>Getting Started</p>
              <a href="#base-url" style={C.navLink}>Base URL</a>
              <a href="#authentication" style={C.navLink}>Authentication</a>
            </div>
            <div style={C.navSection}>
              <p style={C.navLabel}>Tools</p>
              <a href="#get-tools" style={C.navLink}>GET /api/tools</a>
              <a href="#get-tool-slug" style={C.navLink}>GET /api/tools/{'{slug}'}</a>
            </div>
            <div style={C.navSection}>
              <p style={C.navLabel}>Auth</p>
              <a href="#post-register" style={C.navLink}>POST /api/auth/register</a>
              <a href="#post-login" style={C.navLink}>POST /api/auth/login</a>
              <a href="#post-logout" style={C.navLink}>POST /api/auth/logout</a>
              <a href="#get-user" style={C.navLink}>GET /api/auth/user</a>
            </div>
            <div style={C.navSection}>
              <p style={C.navLabel}>Reference</p>
              <a href="#errors" style={C.navLink}>Errors</a>
            </div>
          </nav>

          {/* Main content */}
          <main style={C.content}>

            {/* Base URL */}
            <section id="base-url" style={C.section}>
              <h2 style={C.sectionTitle}>Base URL</h2>
              <p style={C.sectionDesc}>All API requests go to this base URL:</p>
              <div style={C.urlCard}>
                <span style={C.urlLabel}>Primary</span>
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--fg-0)', fontWeight: 600 }}>{BASE}</code>
              </div>
              <p style={{ ...C.sectionDesc, marginTop: 14 }}>
                While SSL is being provisioned for <code style={C.codeInline}>api.toolblip.com</code>, use the Railway URL above. Switch to <code style={C.codeInline}>{CUSTOM}</code> once ready.
              </p>
            </section>

            <div style={C.divider} />

            {/* Authentication */}
            <section id="authentication" style={C.section}>
              <h2 style={C.sectionTitle}>Authentication</h2>
              <p style={C.sectionDesc}>
                The API uses Bearer token authentication. Register or log in to receive a token, then include it in the <code style={C.codeInline}>Authorization</code> header on every authenticated request.
              </p>
              <div style={C.authCard}>
                <pre style={C.codeBlock}>Authorization: Bearer $TB_TOKEN</pre>
              </div>
              <p style={{ color: 'var(--fg-3)', fontSize: 12.5, marginTop: 10 }}>
                Tokens do not expire unless you log out. Store them securely — never expose them client-side.
              </p>
            </section>

            <div style={C.divider} />

            {/* Tools */}
            <section id="tools" style={C.section}>
              <h2 style={C.sectionTitle}>Tools</h2>
              <p style={C.sectionDesc}>Browse and fetch tools from the directory.</p>

              <Endpoint
                id="get-tools"
                method="GET"
                path="/api/tools"
                description="Returns all tools. The response wraps the array under the tools key."
                params={[
                  { name: 'category', in: 'query', type: 'string', required: false, description: 'Filter by category slug (e.g. developer, text, image).' },
                  { name: 'search', in: 'query', type: 'string', required: false, description: 'Search by name or keyword in title/description.' },
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

            <div style={C.divider} />

            {/* Auth */}
            <section id="auth" style={C.section}>
              <h2 style={C.sectionTitle}>Auth</h2>
              <p style={C.sectionDesc}>Register, log in, and manage your API session.</p>

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
                description="Fetch the currently authenticated user. Use to verify a token or get the latest profile data."
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

            <div style={C.divider} />

            {/* Errors */}
            <section id="errors" style={C.section}>
              <h2 style={C.sectionTitle}>Errors</h2>
              <p style={C.sectionDesc}>
                All errors return a JSON body with a <code style={C.codeInline}>message</code> field. HTTP status codes follow standard conventions.
              </p>
              <div style={C.authCard}>
                {([
                  { code: '400', label: 'Bad Request', desc: 'Invalid or missing parameters in the request body.' },
                  { code: '401', label: 'Unauthorized', desc: 'Missing or invalid auth token.' },
                  { code: '403', label: 'Forbidden', desc: 'Authenticated but not permitted for this resource.' },
                  { code: '404', label: 'Not Found', desc: 'Resource does not exist (e.g. unknown tool slug).' },
                  { code: '422', label: 'Unprocessable Entity', desc: 'Validation failed — check the message field for details.' },
                  { code: '429', label: 'Too Many Requests', desc: 'Rate limit exceeded. Wait before retrying.' },
                  { code: '500', label: 'Server Error', desc: 'Something went wrong on our end. Try again later.' },
                ] as const).map((err, i) => (
                  <div key={err.code} style={{ ...C.errorRow, ...(i === 6 ? C.errorRowLast : {}) }}>
                    <span style={C.errorCode}>{err.code}</span>
                    <span style={C.errorLabel}>{err.label}</span>
                    <span style={C.errorDesc}>{err.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quickstart */}
            <div style={C.tip}>
              <p style={C.tipText}>
                <strong style={{ color: 'var(--fg-0)' }}>Quickstart:</strong>{' '}
                Call <code style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>POST /api/auth/register</code>{' '}
                to get a token, then pass it as{' '}
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 12.5, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>Authorization: Bearer &lt;token&gt;</code>{' '}
                on every authenticated request. Store the token securely — it does not expire unless you log out.
              </p>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
