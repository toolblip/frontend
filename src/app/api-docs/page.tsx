import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation — Toolblip',
  description: 'Toolblip REST API reference. Authenticate with Bearer tokens and integrate tools into your app.',
};

const BASE_URL = 'https://api.toolblip.com';

const codeStyle: React.CSSProperties = {
  fontFamily: 'var(--f-mono)',
  background: '#1a1a1f',
  color: '#e8e8ec',
  borderRadius: 10,
  padding: '16px 20px',
  fontSize: 13,
  lineHeight: 1.65,
  overflowX: 'auto',
};

const codeInline: React.CSSProperties = {
  fontFamily: 'var(--f-mono)',
  background: 'var(--surface-2)',
  color: 'var(--fg-0)',
  borderRadius: 5,
  padding: '2px 6px',
  fontSize: 12.5,
};

const methodGet: React.CSSProperties = {
  background: '#dcf4ff',
  color: '#0c5790',
  fontWeight: 700,
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 5,
  fontFamily: 'var(--f-mono)',
};

const methodPost: React.CSSProperties = {
  background: '#d6f0df',
  color: '#1e6b42',
  fontWeight: 700,
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 5,
  fontFamily: 'var(--f-mono)',
};

const methodDelete: React.CSSProperties = {
  background: '#fdecec',
  color: '#9b1f1a',
  fontWeight: 700,
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 5,
  fontFamily: 'var(--f-mono)',
};

const tagStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '4px 10px',
  fontSize: 12.5,
  fontWeight: 500,
  color: 'var(--fg-1)',
  fontFamily: 'var(--f-mono)',
};

interface EndpointProps {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  description: string;
  auth?: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  curl: string;
  response: string;
}

function Endpoint({ method, path, description, auth, params, curl, response }: EndpointProps) {
  const methodStyle = method === 'GET' ? methodGet : method === 'POST' ? methodPost : methodDelete;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 32,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={methodStyle}>{method}</span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 14.5, fontWeight: 600, color: 'var(--fg-0)' }}>{path}</span>
          {auth && (
            <span style={{ ...tagStyle, color: 'var(--red)', borderColor: '#f5c6c6', background: '#fdecec' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Auth required
            </span>
          )}
        </div>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14.5, lineHeight: 1.55 }}>{description}</p>
      </div>

      {/* Params */}
      {params && params.length > 0 && (
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)' }}>
          <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Parameters</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line-2)' }}>
                <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--fg-3)', fontWeight: 600, fontSize: 12 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--fg-3)', fontWeight: 600, fontSize: 12 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--fg-3)', fontWeight: 600, fontSize: 12 }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p) => (
                <tr key={p.name} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 0', fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--fg-0)', fontWeight: 600 }}>
                    {p.name}
                    {p.required && <span style={{ color: 'var(--red)', marginLeft: 4 }}>*</span>}
                  </td>
                  <td style={{ padding: '8px 0', fontFamily: 'var(--f-mono)', fontSize: 12.5, color: '#0c5790', background: '#dcf4ff', borderRadius: 4, display: 'inline-block', padding: '1px 6px' }}>{p.type}</td>
                  <td style={{ padding: '8px 0', color: 'var(--fg-2)', fontSize: 13.5 }}>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* curl + Response side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <div style={{ borderRight: '1px solid var(--line)', padding: '16px 24px' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>curl</p>
          <pre style={{ ...codeStyle, margin: 0, fontSize: 12 }}>{curl}</pre>
        </div>
        <div style={{ padding: '16px 24px' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Response</p>
          <pre style={{ ...codeStyle, margin: 0, fontSize: 12 }}>{response}</pre>
        </div>
      </div>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '52px 0 40px',
      }}>
        <div className="tb-v2-container">
          <div className="tb-v2-kicker">API Reference</div>
          <h1 style={{
            fontFamily: 'var(--f-display)',
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: '10px 0 0',
            color: 'var(--fg-0)',
          }}>
            API Documentation
          </h1>
          <p style={{ marginTop: 12, color: 'var(--fg-2)', fontSize: 16, maxWidth: 560 }}>
            Integrate Toolblip into your app. All endpoints return JSON and are REST-based.
          </p>

          {/* Base URL + Auth badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
            <div style={{ ...tagStyle }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
              Base URL: <strong style={{ marginLeft: 4, color: 'var(--fg-0)' }}>{BASE_URL}</strong>
            </div>
            <div style={{ ...tagStyle }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Auth: <code style={{ marginLeft: 4, fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--fg-0)', background: 'none', padding: 0 }}>Bearer token</code>
            </div>
            <div style={{ ...tagStyle }}>
              Format: <strong style={{ marginLeft: 4, color: 'var(--fg-0)' }}>application/json</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="tb-v2-container" style={{ padding: '40px 28px 80px' }}>

        {/* Auth overview */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--f-display)',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '-0.02em',
            color: 'var(--fg-0)',
            marginBottom: 16,
          }}>
            Authentication
          </h2>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '20px 24px',
          }}>
            <p style={{ margin: '0 0 14px', color: 'var(--fg-2)', fontSize: 14.5, lineHeight: 1.6 }}>
              Include your token in the <code style={{ ...codeInline, fontSize: 13 }}>Authorization</code> header on every authenticated request:
            </p>
            <pre style={{ ...codeStyle, margin: 0 }}>{'Authorization: Bearer YOUR_TOKEN_HERE'}</pre>
            <p style={{ marginTop: 14, color: 'var(--fg-3)', fontSize: 13 }}>
              Register or log in to receive a token. Tokens do not expire unless you log out.
            </p>
          </div>
        </section>

        {/* Tools */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--f-display)',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '-0.02em',
            color: 'var(--fg-0)',
            marginBottom: 8,
          }}>
            Tools
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 14.5, marginBottom: 20, lineHeight: 1.6 }}>
            Browse and fetch tools from the directory.
          </p>

          <Endpoint
            method="GET"
            path="/api/tools"
            description="Returns a paginated list of all tools. Supports filtering by category and search."
            params={[
              { name: 'category', type: 'string', required: false, description: 'Filter by category (e.g. text, developer, image).' },
              { name: 'search', type: 'string', required: false, description: 'Search by name or description.' },
              { name: 'page', type: 'integer', required: false, description: 'Page number for pagination (default: 1).' },
              { name: 'per_page', type: 'integer', required: false, description: 'Number of results per page (default: 20).' },
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
        "created_at": "2026-01-01T00:00:00.000000Z"
      },
      {
        "id": 2,
        "slug": "json-formatter",
        "name": "JSON Formatter",
        "description": "Format and validate JSON.",
        "category": "developer",
        "is_pro": false,
        "emoji": "📋",
        "created_at": "2026-01-01T00:00:00.000000Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "total": 48,
      "per_page": 20,
      "last_page": 3
    }
  }
}`}
          />

          <Endpoint
            method="GET"
            path="/api/tools/{slug}"
            description="Fetch a single tool by its slug. Returns tool details including full description and metadata."
            params={[
              { name: 'slug', type: 'string', required: true, description: 'The URL-friendly slug of the tool (e.g. url-encode).' },
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
    "created_at": "2026-01-01T00:00:00.000000Z"
  }
}`}
          />
        </section>

        {/* Auth */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--f-display)',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '-0.02em',
            color: 'var(--fg-0)',
            marginBottom: 8,
          }}>
            Authentication
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 14.5, marginBottom: 20, lineHeight: 1.6 }}>
            Register a new account, log in, or manage your session.
          </p>

          <Endpoint
            method="POST"
            path="/api/auth/register"
            description="Create a new user account. Returns the user object and an auth token."
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
            method="POST"
            path="/api/auth/login"
            description="Log in with existing credentials. Returns the user object and an auth token."
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
            method="POST"
            path="/api/auth/logout"
            description="Invalidate the current token. The user must be authenticated. Returns a confirmation message."
            auth
            curl={`curl -X POST "${BASE_URL}/api/auth/logout" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`}
            response={`{
  "message": "Session terminated successfully."
}`}
          />

          <Endpoint
            method="GET"
            path="/api/auth/user"
            description="Fetch the currently authenticated user. Requires a valid Bearer token in the Authorization header."
            auth
            curl={`curl -X GET "${BASE_URL}/api/auth/user" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`}
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

        {/* Rate Limits & Errors */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--f-display)',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '-0.02em',
            color: 'var(--fg-0)',
            marginBottom: 16,
          }}>
            Errors
          </h2>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '20px 24px',
          }}>
            <p style={{ margin: '0 0 14px', color: 'var(--fg-2)', fontSize: 14.5, lineHeight: 1.6 }}>
              All errors return a JSON body with a <code style={codeInline}>message</code> field. HTTP status codes:
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { code: '400', label: 'Bad Request', desc: 'Invalid or missing parameters.' },
                { code: '401', label: 'Unauthorized', desc: 'Missing or invalid auth token.' },
                { code: '403', label: 'Forbidden', desc: 'Authenticated but not allowed.' },
                { code: '404', label: 'Not Found', desc: 'Resource does not exist.' },
                { code: '422', label: 'Unprocessable Entity', desc: 'Validation failed — check the message field.' },
                { code: '429', label: 'Too Many Requests', desc: 'Rate limit exceeded. Wait and retry.' },
                { code: '500', label: 'Server Error', desc: 'Something went wrong on our end.' },
              ].map((err) => (
                <div key={err.code} style={{ display: 'flex', gap: 16, alignItems: 'baseline', paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700, color: 'var(--red)', minWidth: 40 }}>{err.code}</span>
                  <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fg-0)', minWidth: 180 }}>{err.label}</span>
                  <span style={{ color: 'var(--fg-2)', fontSize: 13.5 }}>{err.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SDK / Quickstart note */}
        <section>
          <div style={{
            background: 'var(--blue-tint)',
            border: '1px solid #c7d7ff',
            borderRadius: 14,
            padding: '20px 24px',
          }}>
            <p style={{ margin: 0, color: 'var(--fg-1)', fontSize: 14.5, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--fg-0)' }}>Quickstart tip:</strong> The token returned from register or login is your key. Store it securely — you&apos;ll pass it as{' '}
              <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, background: '#fff', padding: '1px 5px', borderRadius: 4 }}>Authorization: Bearer {`<token>`}</code>{' '}
              on every authenticated request. See <code style={{ fontFamily: 'var(--f-mono)', fontSize: 13, background: '#fff', padding: '1px 5px', borderRadius: 4 }}>frontend/lib/api.ts</code> for the full JS client used internally.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
