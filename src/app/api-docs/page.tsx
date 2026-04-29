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
  twitter: {
    card: 'summary',
    title: 'API Documentation — Toolblip',
    description:
      'Toolblip REST API reference. Authenticate with Bearer tokens and integrate tools into your app.',
  },
};

const BASE_URL = 'https://toolblip-api-production.up.railway.app';

// ─── Styles ─────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--f-sans)' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  header: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '52px 0 40px',
  },
  kicker: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--blue)',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'var(--f-display)',
    fontWeight: 700,
    fontSize: 40,
    letterSpacing: '-0.025em',
    lineHeight: 1.05,
    color: 'var(--fg-0)',
    margin: '0 0 12px',
  },
  subtitle: { color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: 560 },
  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 22 },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 13px',
    fontSize: 12.5,
    fontWeight: 500,
    color: 'var(--fg-1)',
  },
  badgeMono: { fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-0)', fontWeight: 600 },
  layout: {
    display: 'grid',
    gridTemplateColumns: '210px 1fr',
    gap: 52,
    padding: '44px 0 88px',
    alignItems: 'start',
  },
  nav: { position: 'sticky' as const, top: 24 },
  navSection: { marginBottom: 26 },
  navLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--fg-3)',
    marginBottom: 7,
    paddingLeft: 10,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
    borderRadius: 7,
    fontSize: 13.5,
    fontWeight: 500,
    color: 'var(--fg-2)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.1s, color 0.1s',
  },
  content: { minWidth: 0 },
  section: { marginBottom: 56 },
  sectionTitle: {
    fontFamily: 'var(--f-display)',
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: '-0.02em',
    color: 'var(--fg-0)',
    marginBottom: 6,
  },
  sectionDesc: { color: 'var(--fg-2)', fontSize: 14.5, marginBottom: 22, lineHeight: 1.6 },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
  },
  cardHeader: {
    padding: '16px 22px',
    borderBottom: '1px solid var(--line)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap' as const,
  },
  cardBody: { padding: '16px 22px' },
  method: {
    fontFamily: 'var(--f-mono)',
    fontWeight: 700,
    fontSize: 11,
    padding: '3px 9px',
    borderRadius: 5,
    letterSpacing: '0.03em',
    flexShrink: 0,
  },
  methodGet: { background: '#dcf4ff', color: '#0c5790' },
  methodPost: { background: '#d6f0df', color: '#1e6b42' },
  methodDelete: { background: '#fdecec', color: '#9b1f1a' },
  endpoint: { fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 600, color: 'var(--fg-0)' },
  authBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: '#fdecec',
    border: '1px solid #f5c6c6',
    color: '#9b1f1a',
    borderRadius: 6,
    padding: '3px 9px',
    fontSize: 11.5,
    fontWeight: 600,
    flexShrink: 0,
  },
  desc: { color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.55, margin: '12px 0 0' },
  paramsTable: { width: '100%', borderCollapse: 'collapse', fontSize: 13.5 },
  th: {
    textAlign: 'left' as const,
    padding: '7px 10px 7px 0',
    color: 'var(--fg-3)',
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    borderBottom: '1px solid var(--line)',
  },
  td: { padding: '10px 10px 10px 0', borderBottom: '1px solid var(--line)', verticalAlign: 'top' as const },
  tdLast: { borderBottom: 'none' },
  tdName: { fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600, color: 'var(--fg-0)' },
  tdType: {
    fontFamily: 'var(--f-mono)',
    fontSize: 12,
    color: '#0c5790',
    background: '#dcf4ff',
    borderRadius: 4,
    padding: '1px 7px',
    whiteSpace: 'nowrap' as const,
  },
  tdDesc: { color: 'var(--fg-2)', fontSize: 13.5 },
  required: { color: 'var(--red)', marginLeft: 3 },
  codeBlock: {
    fontFamily: 'var(--f-mono)',
    background: '#1a1a2e',
    color: '#e8e8ec',
    borderRadius: 10,
    padding: '16px 20px',
    fontSize: 12.5,
    lineHeight: 1.75,
    overflowX: 'auto' as const,
    margin: 0,
    tabSize: 2,
  },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--line)' },
  splitPane: { padding: '14px 20px' },
  splitPaneBorder: { borderRight: '1px solid var(--line)' },
  splitLabel: { fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'var(--fg-3)', marginBottom: 10 },
  authCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '22px 24px',
  },
  codeInline: {
    fontFamily: 'var(--f-mono)',
    background: 'var(--surface-2)',
    color: 'var(--fg-0)',
    borderRadius: 5,
    padding: '1px 6px',
    fontSize: 12.5,
  },
  errorRow: {
    display: 'grid',
    gridTemplateColumns: '52px 200px 1fr',
    gap: 8,
    paddingBottom: 12,
    borderBottom: '1px solid var(--line)',
    alignItems: 'baseline',
  },
  errorRowLast: { borderBottom: 'none', paddingBottom: 0 },
  errorCode: { fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700, color: 'var(--red)' },
  errorLabel: { fontWeight: 600, fontSize: 13.5, color: 'var(--fg-0)' },
  errorDesc: { color: 'var(--fg-2)', fontSize: 13.5 },
  tip: {
    background: 'var(--blue-tint)',
    border: '1px solid #c7d7ff',
    borderRadius: 12,
    padding: '18px 22px',
    marginTop: 8,
  },
  tipText: { color: 'var(--fg-1)', fontSize: 14, lineHeight: 1.65, margin: 0 },
  divider: { height: 1, background: 'var(--line)', margin: '44px 0' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Method({ m }: { m: 'GET' | 'POST' | 'DELETE' }) {
  const style = m === 'GET' ? s.methodGet : m === 'POST' ? s.methodPost : s.methodDelete;
  return <span style={{ ...s.method, ...style }}>{m}</span>;
}

// ─── Endpoint Component ────────────────────────────────────────────────────────

interface Param {
  name: string;
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
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Auth required
          </span>
        )}
      </div>
      <div style={s.cardBody}>
        <p style={s.desc}>{description}</p>
      </div>

      {params && params.length > 0 && (
        <div style={{ padding: '0 22px 16px', borderTop: '1px solid var(--line)' }}>
          <p style={{ ...s.splitLabel, marginTop: 14 }}>Parameters</p>
          <table style={s.paramsTable}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 155 }}>Name</th>
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
      {/* Header */}
      <div style={s.header}>
        <div style={s.container}>
          <p style={s.kicker}>API Reference</p>
          <h1 style={s.title}>API Documentation</h1>
          <p style={s.subtitle}>
            Integrate Toolblip into your app. All endpoints return JSON and are REST-based.
          </p>
          <div style={s.badgeRow}>
            <div style={s.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
              Base URL:{' '}
              <strong style={{ ...s.badgeMono, marginLeft: 4 }}>{BASE_URL}</strong>
            </div>
            <div style={s.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Auth:{' '}
              <code style={{ marginLeft: 4, fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-0)', background: 'none', padding: 0 }}>
                Bearer token
              </code>
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

      {/* Body */}
      <div style={s.container}>
        <div style={s.layout}>

          {/* Sidebar */}
          <nav style={s.nav}>
            <div style={s.navSection}>
              <p style={s.navLabel}>Getting Started</p>
              <a href="#authentication" style={s.navLink}>Authentication</a>
            </div>
            <div style={s.navSection}>
              <p style={s.navLabel}>Tools</p>
              <a href="#get-tools" style={s.navLink}>GET /api/tools</a>
              <a href="#get-tool-slug" style={s.navLink}>GET /api/tools/{`{slug}`}</a>
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

            {/* Authentication */}
            <section id="authentication" style={s.section}>
              <h2 style={s.sectionTitle}>Authentication</h2>
              <p style={s.sectionDesc}>
                The API uses Bearer token authentication. Register or log in to receive a token, then include it
                in the <code style={s.codeInline}>Authorization</code> header on every authenticated request.
              </p>
              <div style={s.authCard}>
                <p style={{ margin: '0 0 12px', color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6 }}>
                  Include your token in the Authorization header on every request:
                </p>
                <pre style={s.codeBlock}>
                  {'Authorization: Bearer $TB_TOKEN'}
                </pre>
                <p style={{ marginTop: 12, color: 'var(--fg-3)', fontSize: 12.5 }}>
                  Tokens do not expire unless you log out. Store them securely.
                </p>
              </div>
            </section>

            <div style={s.divider} />

            {/* Tools */}
            <section id="tools" style={s.section}>
              <h2 style={s.sectionTitle}>Tools</h2>
              <p style={s.sectionDesc}>Browse and fetch tools from the directory.</p>

              <Endpoint
                id="get-tools"
                method="GET"
                path="/api/tools"
                description="Returns a paginated list of all tools. Supports filtering by category and search."
                params={[
                  { name: 'category', type: 'string', required: false, description: 'Filter by category (e.g. text, developer, image).' },
                  { name: 'search', type: 'string', required: false, description: 'Search by name or description.' },
                  { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1).' },
                ]}
                curl={`curl -X GET "${BASE_URL}/api/tools?category=developer&page=1" \\
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
                description="Fetch a single tool by its slug. Returns tool details including full description and metadata."
                params={[
                  { name: 'slug', type: 'string', required: true, description: 'The URL-friendly slug of the tool (e.g. json-formatter).' },
                ]}
                curl={`curl -X GET "${BASE_URL}/api/tools/json-formatter" \\
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

            {/* Auth endpoints */}
            <section id="auth" style={s.section}>
              <h2 style={s.sectionTitle}>Auth</h2>
              <p style={s.sectionDesc}>Register, log in, or manage your session.</p>

              <Endpoint
                id="post-register"
                method="POST"
                path="/api/auth/register"
                description="Create a new user account. Returns the user object and a Bearer token."
                params={[
                  { name: 'name', type: 'string', required: true, description: 'Full name of the user.' },
                  { name: 'email', type: 'string', required: true, description: 'Valid email address (must be unique).' },
                  { name: 'password', type: 'string', required: true, description: 'Account password (min 8 characters).' },
                  { name: 'password_confirmation', type: 'string', required: true, description: 'Must match the password field exactly.' },
                ]}
                curl={`curl -X POST "${BASE_URL}/api/auth/register" \\
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
                description="Log in with existing credentials. Returns the user object and a Bearer token."
                params={[
                  { name: 'email', type: 'string', required: true, description: 'Email address of your account.' },
                  { name: 'password', type: 'string', required: true, description: 'Your account password.' },
                ]}
                curl={`curl -X POST "${BASE_URL}/api/auth/login" \\
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
                description="Invalidate the current token. Requires authentication."
                auth
                curl={`curl -X POST "${BASE_URL}/api/auth/logout" \\
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
                description="Fetch the currently authenticated user. Requires a valid Bearer token."
                auth
                curl={`curl -X GET "${BASE_URL}/api/auth/user" \\
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

            {/* Errors */}
            <section id="errors" style={s.section}>
              <h2 style={s.sectionTitle}>Errors</h2>
              <p style={s.sectionDesc}>
                All errors return a JSON body with a <code style={s.codeInline}>message</code> field describing
                what went wrong.
              </p>
              <div style={s.authCard}>
                {([
                  { code: '400', label: 'Bad Request', desc: 'Invalid or missing parameters.' },
                  { code: '401', label: 'Unauthorized', desc: 'Missing or invalid auth token.' },
                  { code: '403', label: 'Forbidden', desc: 'Authenticated but not permitted.' },
                  { code: '404', label: 'Not Found', desc: 'Resource does not exist.' },
                  { code: '422', label: 'Unprocessable Entity', desc: 'Validation failed — check the message field.' },
                  { code: '429', label: 'Too Many Requests', desc: 'Rate limit exceeded. Wait and retry.' },
                  { code: '500', label: 'Server Error', desc: 'Something went wrong on our end.' },
                ] as const).map((err, i) => (
                  <div
                    key={err.code}
                    style={{
                      ...s.errorRow,
                      ...(i === 6 ? s.errorRowLast : {}),
                    }}
                  >
                    <span style={s.errorCode}>{err.code}</span>
                    <span style={s.errorLabel}>{err.label}</span>
                    <span style={s.errorDesc}>{err.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quickstart tip */}
            <div style={s.tip}>
              <p style={s.tipText}>
                <strong style={{ color: 'var(--fg-0)' }}>Quickstart:</strong> Register to get a token, then pass it
                as{' '}
                <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, background: '#fff', padding: '1px 6px', borderRadius: 4 }}>
                  Authorization: Bearer &lt;token&gt;
                </code>{' '}
                on every authenticated request. Store the token securely — it does not expire unless you log out.
              </p>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
