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
  return { id: user.id, name: user.name, email: user.email, role: user.role ?? 'user' };
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
  });
  users.set('taken@toolblip.test', {
    id: nextId++,
    name: 'Taken User',
    email: 'taken@toolblip.test',
    password: 'Password123!',
    role: 'user',
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
