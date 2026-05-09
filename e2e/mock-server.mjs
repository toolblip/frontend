/**
 * Hermetic mock backend for Playwright auth tests.
 * Next.js auth proxy routes call this through NEXT_PUBLIC_API_URL.
 */
import http from 'http';

const PORT = Number.parseInt(process.argv[2] ?? process.env.MOCK_PORT ?? '3099', 10);

const users = new Map();
const tokens = new Map();
let nextId = 1;
let nextToken = 1;

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function readJson(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
  });
}

function bearer(req) {
  return String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
}

function publicUser(user) {
  if (!user) return null;
  const termsAcceptedAt = user.terms_accepted_at ?? null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? 'user',
    email_verified_at: user.email_verified_at ?? null,
    avatar_url: user.avatar_url ?? null,
    terms_accepted_at: termsAcceptedAt,
    requires_terms_acceptance: termsAcceptedAt === null,
  };
}

function issueToken(email) {
  const token = `mock-token-${nextToken++}`;
  tokens.set(token, email);
  return token;
}

function reset() {
  users.clear();
  tokens.clear();
  nextId = 1;
  nextToken = 1;
  users.set('bdd@toolblip.test', {
    id: nextId++,
    name: 'BDD User',
    email: 'bdd@toolblip.test',
    password: 'Password123!',
    role: 'user',
    email_verified_at: '2026-01-01T00:00:00.000Z',
    terms_accepted_at: '2026-01-01T00:00:00.000Z',
  });
  users.set('taken@toolblip.test', {
    id: nextId++,
    name: 'Taken User',
    email: 'taken@toolblip.test',
    password: 'Password123!',
    role: 'user',
    email_verified_at: '2026-01-01T00:00:00.000Z',
    terms_accepted_at: '2026-01-01T00:00:00.000Z',
  });
}

reset();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/__reset') {
    reset();
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await readJson(req);
    const email = String(body.email ?? '').toLowerCase();
    if (!body.name || !email || !body.password || !body.password_confirmation) {
      return json(res, 422, { message: 'All fields are required.' });
    }
    if (body.accepted_terms !== true) {
      return json(res, 422, { message: 'Please accept the Terms and Conditions and Privacy Policy.', errors: { accepted_terms: ['The terms must be accepted.'] } });
    }
    if (users.has(email)) {
      return json(res, 422, {
        message: 'The email has already been taken.',
        errors: { email: ['The email has already been taken.'] },
      });
    }
    const user = {
      id: nextId++,
      name: String(body.name),
      email,
      password: String(body.password),
      role: 'user',
      email_verified_at: null,
      terms_accepted_at: new Date().toISOString(),
    };
    users.set(email, user);
    const token = issueToken(email);
    return json(res, 201, { user: publicUser(user), token });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readJson(req);
    const email = String(body.email ?? '').toLowerCase();
    const user = users.get(email);
    if (!user || user.password !== body.password) {
      return json(res, 401, {
        message: 'Invalid email or password.',
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }
    const token = issueToken(email);
    return json(res, 200, { user: publicUser(user), token });
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/google/redirect') {
    const state = url.searchParams.get('state') ?? '';
    const redirectUri = url.searchParams.get('redirect_uri') ?? 'http://127.0.0.1:3200/api/auth/google/callback';
    const callback = new URL(redirectUri);
    callback.searchParams.set('code', 'mock-google-code');
    callback.searchParams.set('state', state);
    return json(res, 200, { provider: 'google', authorization_url: callback.toString() });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/google/callback') {
    const user = {
      id: nextId++,
      name: 'Google OAuth User',
      email: 'google-oauth@toolblip.test',
      password: '',
      role: 'user',
      google_id: 'mock-google-sub',
      email_verified_at: '2026-01-01T00:00:00.000Z',
      terms_accepted_at: null,
    };
    users.set(user.email, user);
    const token = issueToken(user.email);
    return json(res, 200, { user: publicUser(user), token, is_new_user: true, requires_terms_acceptance: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/accept-terms') {
    const email = tokens.get(bearer(req));
    const user = email ? users.get(email) : null;
    if (!user) return json(res, 401, { message: 'Unauthenticated.' });
    const body = await readJson(req);
    if (body.accepted_terms !== true) {
      return json(res, 422, { message: 'Please accept the Terms and Conditions and Privacy Policy.', errors: { accepted_terms: ['The terms must be accepted.'] } });
    }
    user.terms_accepted_at = new Date().toISOString();
    return json(res, 200, { message: 'Terms accepted.', user: publicUser(user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/verify-email') {
    const body = await readJson(req);
    const email = String(body.email ?? '').toLowerCase();
    const user = users.get(email);
    if (!user || body.token !== 'mock-verification-token') {
      return json(res, 422, { message: 'This verification link is invalid or expired.' });
    }
    user.email_verified_at = '2026-01-01T00:00:00.000Z';
    return json(res, 200, { message: 'Email verified successfully.', user: publicUser(user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/resend-verification') {
    const email = tokens.get(bearer(req));
    const user = email ? users.get(email) : null;
    if (!user) return json(res, 401, { message: 'Unauthenticated.' });
    user.email_verification_token = 'mock-verification-token';
    return json(res, 200, { message: 'Verification email sent.' });
  }

  if (req.method === 'PATCH' && url.pathname === '/api/auth/profile') {
    const email = tokens.get(bearer(req));
    const user = email ? users.get(email) : null;
    if (!user) return json(res, 401, { message: 'Unauthenticated.' });
    const body = await readJson(req);
    const nextEmail = String(body.email ?? '').toLowerCase();
    if (!body.name || !nextEmail) return json(res, 422, { message: 'Name and email are required.' });
    if (nextEmail !== email && users.has(nextEmail)) {
      return json(res, 422, { message: 'The email has already been taken.', errors: { email: ['The email has already been taken.'] } });
    }
    users.delete(email);
    user.name = String(body.name);
    if (nextEmail !== email) {
      user.email = nextEmail;
      user.email_verified_at = null;
      user.email_verification_token = 'mock-verification-token';
      for (const [token, tokenEmail] of tokens.entries()) {
        if (tokenEmail === email) tokens.set(token, nextEmail);
      }
    }
    users.set(user.email, user);
    return json(res, 200, { message: 'Profile updated successfully.', user: publicUser(user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/change-password') {
    const email = tokens.get(bearer(req));
    const user = email ? users.get(email) : null;
    if (!user) return json(res, 401, { message: 'Unauthenticated.' });
    const body = await readJson(req);
    if (body.current_password !== user.password) {
      return json(res, 422, { message: 'The current password is incorrect.', errors: { current_password: ['The current password is incorrect.'] } });
    }
    user.password = String(body.password ?? '');
    for (const [token, tokenEmail] of tokens.entries()) {
      if (tokenEmail === email) tokens.delete(token);
    }
    return json(res, 200, { message: 'Password changed successfully.' });
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    const email = tokens.get(bearer(req));
    const user = email ? users.get(email) : null;
    if (!user) return json(res, 401, { message: 'Unauthenticated.' });
    return json(res, 200, { user: publicUser(user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    const token = bearer(req);
    if (token) tokens.delete(token);
    return json(res, 200, { message: 'Logged out.' });
  }

  if (req.method === 'GET' && url.pathname === '/api/subscription') {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    return json(res, 200, {
      is_pro: false,
      tier: null,
      devices: null,
      storage_gb: null,
      team_seats: null,
      max_file_size_mb: null,
      api_access: false,
      priority_support: false,
      plan_ends_at: null,
      subscription_status: null,
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/forgot-password') {
    return json(res, 200, { message: 'If that email exists, a reset link has been sent.' });
  }

  return json(res, 404, { message: 'Not found.' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[mock-server] Listening on http://127.0.0.1:${PORT}`);
});
