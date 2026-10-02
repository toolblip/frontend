/**
 * Hermetic mock backend for Playwright auth tests.
 * Next.js auth proxy routes call this through NEXT_PUBLIC_API_URL.
 */
import http from 'http';

const PORT = Number.parseInt(process.argv[2] ?? process.env.MOCK_PORT ?? '3099', 10);

const users = new Map();
const tokens = new Map();
const toolStats = new Map();
const userFavorites = new Map();
const favoriteLists = new Map();
let nextId = 1;
let nextToken = 1;
let nextListId = 1;

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

function slugUsername(value) {
  const slug = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)
    .replace(/-+$/g, '');
  return /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(slug) ? slug : 'user';
}

function ensureUsername(user) {
  if (user.username) return user;
  const base = slugUsername(user.name || String(user.email).split('@')[0]);
  let candidate = base;
  let n = 2;
  const taken = (name) => [...users.values()].some((other) => other.id !== user.id && other.username === name);
  while (taken(candidate)) {
    const suffix = `-${n}`;
    candidate = `${base.slice(0, 30 - suffix.length).replace(/-+$/g, '')}${suffix}`;
    n += 1;
  }
  user.username = candidate;
  return user;
}

function publicUser(user) {
  if (!user) return null;
  const termsAcceptedAt = user.terms_accepted_at ?? null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username ?? null,
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


function engagementPayload(slug, req) {
  const stats = toolStats.get(slug) ?? { slug, views: 0, shares: 0, favorites: 0 };
  const email = tokens.get(bearer(req));
  return {
    slug,
    views: stats.views,
    shares: stats.shares,
    favorites: stats.favorites,
    viewer_favorited: Boolean(email && userFavorites.get(email)?.has(slug)),
    viewer_favorited_at: email && userFavorites.get(email)?.has(slug) ? new Date().toISOString() : null,
  };
}

function ensureStats(slug) {
  if (!toolStats.has(slug)) toolStats.set(slug, { slug, views: 0, shares: 0, favorites: 0 });
  return toolStats.get(slug);
}

function reset() {
  users.clear();
  tokens.clear();
  toolStats.clear();
  userFavorites.clear();
  favoriteLists.clear();
  nextListId = 1;
  toolStats.set('json-formatter', { slug: 'json-formatter', views: 0, shares: 0, favorites: 0 });
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
  users.set('admin@toolblip.test', {
    id: nextId++,
    name: 'Admin User',
    email: 'admin@toolblip.test',
    password: 'Password123!',
    role: 'admin',
    email_verified_at: '2026-01-01T00:00:00.000Z',
    terms_accepted_at: '2026-01-01T00:00:00.000Z',
    created_at: '2026-01-02T00:00:00.000Z',
    tier: 'ultra',
    subscription_status: 'active',
    plan_ends_at: '2026-12-31T12:00:00.000Z',
  });
  users.set('pending@toolblip.test', {
    id: nextId++,
    name: 'Pending User',
    email: 'pending@toolblip.test',
    password: 'Password123!',
    role: 'user',
    email_verified_at: null,
    terms_accepted_at: '2026-01-01T00:00:00.000Z',
    created_at: '2026-01-03T00:00:00.000Z',
  });
}

function adminUserView(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? 'user',
    email_verified_at: user.email_verified_at ?? null,
    tier: user.tier ?? null,
    subscription_status: user.subscription_status ?? null,
    plan_ends_at: user.plan_ends_at ?? null,
    created_at: user.created_at ?? '2026-01-01T00:00:00.000Z',
    favorites_count: userFavorites.get(user.email)?.size ?? 0,
  };
}

function requireAdmin(req) {
  const email = tokens.get(bearer(req));
  const user = email ? users.get(email) : null;
  if (!user) return { error: 401 };
  if ((user.role ?? 'user') !== 'admin') return { error: 403 };
  return { user };
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
    const chosen = String(body.username ?? '').trim().toLowerCase();
    if (chosen && !/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(chosen)) {
      return json(res, 422, { message: 'Choose a username with 3–30 letters, numbers, and hyphens.', code: 'username_invalid' });
    }
    const user = {
      id: nextId++,
      name: String(body.name),
      email,
      password: String(body.password),
      username: chosen || null,
      role: 'user',
      email_verified_at: null,
      terms_accepted_at: new Date().toISOString(),
    };
    ensureUsername(user);
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
    ensureUsername(user);
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
    ensureUsername(user);
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
    const nextUsername = String(body.username ?? '').trim().toLowerCase();
    if (nextUsername && !/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(nextUsername)) {
      return json(res, 422, { message: 'Choose a username with 3–30 letters, numbers, and hyphens.', code: 'username_invalid' });
    }
    users.delete(email);
    user.name = String(body.name);
    if (nextUsername) user.username = nextUsername;
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

  if (req.method === 'POST' && url.pathname === '/api/subscription/switch') {
    const body = await readJson(req);
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const user = email ? users.get(email) : null;
    if (!user) return json(res, 404, { message: 'User not found.' });
    const targetTier = String(body.plan_tier ?? '');
    const billing = String(body.billing ?? '');
    if (!['starter', 'ultra', 'max'].includes(targetTier) || !['monthly', 'yearly'].includes(billing)) {
      return json(res, 422, { message: 'Invalid plan_tier or billing' });
    }
    const previousTier = user.tier ?? 'free';
    const sortOrder = { free: 0, starter: 1, ultra: 2, max: 3 };
    const isUpgrade = (sortOrder[targetTier] ?? 0) > (sortOrder[previousTier] ?? 0);
    user.tier = targetTier;
    user.subscription_status = 'active';
    user.plan_ends_at = '2026-12-31T12:00:00.000Z';
    return json(res, 200, {
      success: true,
      message: isUpgrade
        ? `Upgraded to ${targetTier} with proration. Your new plan is active now.`
        : `Downgrade to ${targetTier} scheduled. The change will take effect at the end of your billing period.`,
      tier: targetTier,
      is_upgrade: isUpgrade,
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/subscription/trial') {
    const body = await readJson(req);
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const user = users.get(email);
    if (!user) return json(res, 404, { message: 'User not found.' });
    const priceId = String(body.price_id ?? '');
    if (!priceId) return json(res, 422, { message: 'price_id is required.' });
    const priceToTier = { price_1TOflqHd4AsPgGTOxspjxODX: 'starter', price_1TOflrHd4AsPgGTOnt9jYhjz: 'ultra', price_1TOflsHd4AsPgGTO5ra4mhwt: 'ultra', price_1TOflsHd4AsPgGTOG7jeNqLk: 'max', price_1TOfltHd4AsPgGTOnUHvrbT7: 'max', price_1TOflqHd4AsPgGTOOrxqG1kM: 'starter' };
    const tier = priceToTier[priceId] ?? 'ultra';
    user.tier = tier;
    user.subscription_status = 'trialing';
    user.plan_ends_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    return json(res, 200, { success: true, message: 'Your 14-day free trial has started!', tier, trial_end: Math.floor(Date.now() / 1000) + 14 * 24 * 3600 });
  }

  if (req.method === 'POST' && url.pathname === '/api/subscription/checkout') {
    const body = await readJson(req);
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    return json(res, 200, { url: 'https://checkout.stripe.com/mock', session_id: 'cs_mock' });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/forgot-password') {
    return json(res, 200, { message: 'If that email exists, a reset link has been sent.' });
  }


  const engagementMatch = url.pathname.match(/^\/api\/tools\/([^/]+)\/engagement$/);
  if (req.method === 'GET' && engagementMatch) {
    const slug = decodeURIComponent(engagementMatch[1]);
    ensureStats(slug);
    return json(res, 200, { data: engagementPayload(slug, req) });
  }

  const viewMatch = url.pathname.match(/^\/api\/tools\/([^/]+)\/view$/);
  if (req.method === 'POST' && viewMatch) {
    const slug = decodeURIComponent(viewMatch[1]);
    const stats = ensureStats(slug);
    stats.views += 1;
    return json(res, 200, { data: engagementPayload(slug, req) });
  }

  const shareMatch = url.pathname.match(/^\/api\/tools\/([^/]+)\/share$/);
  if (req.method === 'POST' && shareMatch) {
    const slug = decodeURIComponent(shareMatch[1]);
    await readJson(req);
    const stats = ensureStats(slug);
    stats.shares += 1;
    return json(res, 200, { data: engagementPayload(slug, req) });
  }

  const favoriteMatch = url.pathname.match(/^\/api\/tools\/([^/]+)\/favorite$/);
  if ((req.method === 'POST' || req.method === 'DELETE') && favoriteMatch) {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const slug = decodeURIComponent(favoriteMatch[1]);
    const stats = ensureStats(slug);
    const favorites = userFavorites.get(email) ?? new Set();
    if (req.method === 'POST') favorites.add(slug);
    if (req.method === 'DELETE') {
      favorites.delete(slug);
      for (const list of favoriteLists.get(email) ?? []) list.tools.delete(slug);
    }
    userFavorites.set(email, favorites);
    stats.favorites = Array.from(userFavorites.values()).filter((set) => set.has(slug)).length;
    return json(res, 200, { data: engagementPayload(slug, req) });
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/favorite-lists') {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const tool = url.searchParams.get('tool');
    const user = users.get(email);
    const lists = favoriteLists.get(email) ?? [];
    return json(res, 200, {
      username: user?.username ?? null,
      joined: [],
      data: lists.map((list) => ({
        id: list.id,
        name: list.name,
        slug: list.slug,
        is_shared: list.is_shared,
        public_path: list.is_shared && user?.username ? `/user/${user.username}/${list.slug}` : null,
        tool_count: list.tools.size,
        tool_slugs: Array.from(list.tools),
        contains_tool: Boolean(tool && list.tools.has(tool)),
        can_edit: true,
      })),
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/favorite-lists') {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const body = await readJson(req);
    const name = String(body.name ?? '').trim();
    if (!name) return json(res, 422, { message: 'Name is required.' });
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'list';
    const lists = favoriteLists.get(email) ?? [];
    let slug = base;
    let suffix = 2;
    while (lists.some((list) => list.slug === slug)) slug = `${base}-${suffix++}`;
    const list = { id: nextListId++, name, slug, is_shared: false, tools: new Set() };
    lists.push(list);
    favoriteLists.set(email, lists);
    return json(res, 201, {
      data: { id: list.id, name, slug, is_shared: false, public_path: null, tool_count: 0, tool_slugs: [], contains_tool: false, can_edit: true },
    });
  }

  const listToolMatch = url.pathname.match(/^\/api\/auth\/favorite-lists\/(\d+)\/tools\/([^/]+)$/);
  if ((req.method === 'PUT' || req.method === 'DELETE') && listToolMatch) {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const list = (favoriteLists.get(email) ?? []).find((item) => item.id === Number(listToolMatch[1]));
    if (!list) return json(res, 404, { message: 'List not found.' });
    const slug = decodeURIComponent(listToolMatch[2]);
    const stats = ensureStats(slug);
    if (req.method === 'PUT') {
      const favorites = userFavorites.get(email) ?? new Set();
      favorites.add(slug);
      userFavorites.set(email, favorites);
      list.tools.add(slug);
      stats.favorites = Array.from(userFavorites.values()).filter((set) => set.has(slug)).length;
    } else {
      list.tools.delete(slug);
    }
    return json(res, 200, { data: engagementPayload(slug, req) });
  }

  const listShareMatch = url.pathname.match(/^\/api\/auth\/favorite-lists\/(\d+)\/share$/);
  if ((req.method === 'POST' || req.method === 'DELETE') && listShareMatch) {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const user = users.get(email);
    const list = (favoriteLists.get(email) ?? []).find((item) => item.id === Number(listShareMatch[1]));
    if (!list) return json(res, 404, { message: 'List not found.' });
    if (req.method === 'POST' && !user?.username) {
      return json(res, 422, { message: 'Choose a username before sharing this list.', code: 'username_required' });
    }
    list.is_shared = req.method === 'POST';
    return json(res, 200, {
      data: {
        id: list.id,
        name: list.name,
        slug: list.slug,
        is_shared: list.is_shared,
        public_path: list.is_shared && user?.username ? `/user/${user.username}/${list.slug}` : null,
        tool_count: list.tools.size,
        tool_slugs: Array.from(list.tools),
        contains_tool: false,
        can_edit: true,
      },
    });
  }

  const publicListMatch = url.pathname.match(/^\/api\/lists\/([^/]+)\/([^/]+)$/);
  if (req.method === 'GET' && publicListMatch) {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const username = decodeURIComponent(publicListMatch[1]).toLowerCase();
    const slug = decodeURIComponent(publicListMatch[2]).toLowerCase();
    let found = null;
    let owner = null;
    for (const [ownerEmail, lists] of favoriteLists.entries()) {
      const candidate = users.get(ownerEmail);
      if (candidate?.username !== username) continue;
      const list = lists.find((item) => item.slug === slug);
      if (!list) continue;
      found = list;
      owner = candidate;
      break;
    }
    if (!found || !owner || (!found.is_shared && owner.email !== email)) {
      return json(res, 404, { message: 'List not found.' });
    }
    return json(res, 200, {
      data: {
        id: found.id,
        name: found.name,
        slug: found.slug,
        is_shared: found.is_shared,
        can_edit: owner.email === email,
        role: owner.email === email ? 'owner' : 'viewer',
        owner_name: owner.name,
        owner_username: owner.username,
        public_path: found.is_shared ? `/user/${owner.username}/${found.slug}` : null,
        tools: Array.from(found.tools).map((toolSlug) => ({
          slug: toolSlug,
          name: toolSlug === 'json-formatter' ? 'JSON Formatter' : toolSlug,
          description: 'Format JSON online.',
          category: 'Developer',
          icon: '🧰',
        })),
      },
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/username') {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const body = await readJson(req);
    const username = String(body.username ?? '').trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(username)) {
      return json(res, 422, { message: 'Choose a username with letters, numbers, and hyphens.' });
    }
    const user = users.get(email);
    user.username = username;
    return json(res, 200, { data: { username } });
  }

  const listInviteMatch = url.pathname.match(/^\/api\/auth\/favorite-lists\/(\d+)\/invites$/);
  if (req.method === 'POST' && listInviteMatch) {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const list = (favoriteLists.get(email) ?? []).find((item) => item.id === Number(listInviteMatch[1]));
    if (!list?.is_shared) return json(res, 422, { message: 'Share the list before emailing the link.', code: 'list_private' });
    const body = await readJson(req);
    return json(res, 200, { data: { email: body.email } });
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/favorite-tools') {
    const email = tokens.get(bearer(req));
    if (!email) return json(res, 401, { message: 'Unauthenticated.' });
    const favorites = Array.from(userFavorites.get(email) ?? []);
    return json(res, 200, {
      data: favorites.map((slug) => ({
        slug,
        name: slug === 'json-formatter' ? 'JSON Formatter' : slug,
        description: 'Format JSON online.',
        category: 'Developer Tools',
        icon: '🧰',
        favorited_at: new Date().toISOString(),
      })),
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/admin/users') {
    const gate = requireAdmin(req);
    if (gate.error) return json(res, gate.error, { message: gate.error === 401 ? 'Unauthenticated.' : 'Forbidden.' });
    return json(res, 200, { data: Array.from(users.values()).map(adminUserView) });
  }

  const adminUserMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (req.method === 'GET' && adminUserMatch) {
    const gate = requireAdmin(req);
    if (gate.error) return json(res, gate.error, { message: gate.error === 401 ? 'Unauthenticated.' : 'Forbidden.' });
    const id = Number.parseInt(decodeURIComponent(adminUserMatch[1]), 10);
    const found = Array.from(users.values()).find((u) => u.id === id);
    if (!found) return json(res, 404, { message: 'User not found.' });
    return json(res, 200, { data: adminUserView(found) });
  }

  const adminPlanMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/plan$/);
  if (req.method === 'POST' && adminPlanMatch) {
    const gate = requireAdmin(req);
    if (gate.error) return json(res, gate.error, { message: gate.error === 401 ? 'Unauthenticated.' : 'Forbidden.' });
    const id = Number.parseInt(decodeURIComponent(adminPlanMatch[1]), 10);
    const target = Array.from(users.values()).find((u) => u.id === id);
    if (!target) return json(res, 404, { message: 'User not found.' });

    const body = await readJson(req);
    const action = String(body.action ?? '');
    const previousPlan = target.tier ?? 'free';
    const previousStatus = target.subscription_status ?? null;
    let effectiveDate = null;

    if (action === 'cancel') {
      target.subscription_status = 'canceled';
      if (!target.plan_ends_at) target.plan_ends_at = '2026-12-31T12:00:00.000Z';
      effectiveDate = target.plan_ends_at;
    } else if (action === 'set') {
      const tier = String(body.tier ?? '');
      if (!['free', 'starter', 'ultra', 'max'].includes(tier)) {
        return json(res, 422, { message: 'Invalid plan.' });
      }
      target.tier = tier;
      if (tier === 'free') {
        target.subscription_status = null;
        target.plan_ends_at = null;
      } else {
        target.subscription_status = 'active';
        target.plan_ends_at = '2026-12-31T12:00:00.000Z';
      }
    } else {
      return json(res, 422, { message: 'Invalid action.' });
    }

    return json(res, 200, {
      data: adminUserView(target),
      audit: {
        admin_id: gate.user.id,
        admin_email: gate.user.email,
        target_user_id: target.id,
        target_user_email: target.email,
        action,
        previous_plan: previousPlan,
        new_plan: target.tier ?? 'free',
        previous_status: previousStatus,
        new_status: target.subscription_status ?? null,
        effective_date: effectiveDate,
        reason: body.reason ?? null,
        reference_id: `mock-billing-${target.id}`,
        timestamp: new Date().toISOString(),
      },
    });
  }

  const adminSupportMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/support$/);
  if (req.method === 'POST' && adminSupportMatch) {
    const gate = requireAdmin(req);
    if (gate.error) return json(res, gate.error, { message: gate.error === 401 ? 'Unauthenticated.' : 'Forbidden.' });
    const id = Number.parseInt(decodeURIComponent(adminSupportMatch[1]), 10);
    const target = Array.from(users.values()).find((u) => u.id === id);
    if (!target) return json(res, 404, { message: 'User not found.' });

    const body = await readJson(req);
    const action = String(body.action ?? '');
    if (!target.support_notes) target.support_notes = [];
    let note = null;
    let message = null;

    if (action === 'note') {
      const text = String(body.note ?? '').trim();
      if (!text) return json(res, 422, { message: 'Note is required.' });
      note = { id: target.support_notes.length + 1, note: text, admin_email: gate.user.email, created_at: new Date().toISOString() };
      target.support_notes.push(note);
    } else if (action === 'resend_verification') {
      target.email_verification_token = 'mock-verification-token';
      message = 'Verification email sent.';
    } else {
      return json(res, 422, { message: 'Invalid action.' });
    }

    return json(res, 200, {
      data: adminUserView(target),
      message,
      note,
      notes: target.support_notes,
      audit: {
        admin_id: gate.user.id,
        admin_email: gate.user.email,
        target_user_id: target.id,
        target_user_email: target.email,
        action,
        note: note?.note ?? null,
        message,
        timestamp: new Date().toISOString(),
      },
    });
  }

  return json(res, 404, { message: 'Not found.' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[mock-server] Listening on http://127.0.0.1:${PORT}`);
});
