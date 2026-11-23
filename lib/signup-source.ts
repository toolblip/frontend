// First-touch sign-up attribution. Stored only after the cookie banner is accepted,
// sent once after sign-in; the API keeps it only for accounts made in the last day.
export const STORAGE_KEY = 'tb_signup_source';
// Set on the first consented page view and never removed: later visits, such as the
// Google or mail-client redirect back after sign-in, are not a first touch.
const SEEN_KEY = 'tb_signup_source_seen';

const CONSENT_KEY = 'toolblip_cookie_consent';
const INTERNAL_HOSTS = new Set(['toolblip.com', 'www.toolblip.com']);
const MAX = 100;

type SignupSource = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'referrer_host' | 'landing_path', string>>;

function externalHost(referrer: string): string | null {
  try {
    const host = new URL(referrer).hostname;
    return host && !INTERNAL_HOSTS.has(host) ? host : null;
  } catch {
    return null;
  }
}

// shortcut: a visitor who browses to another page before accepting loses their landing source; fine for stage 0 counts.
export function captureSignupSource(
  loc: { search: string; pathname: string } = window.location,
  referrer: string = document.referrer,
  storage: Storage = window.localStorage,
): void {
  try {
    if (storage.getItem(CONSENT_KEY) !== 'accepted' || storage.getItem(SEEN_KEY) !== null) return;
    storage.setItem(SEEN_KEY, '1');

    const params = new URLSearchParams(loc.search);
    const source: SignupSource = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const value = params.get(key);
      if (value) source[key] = value.slice(0, MAX);
    }
    const host = externalHost(referrer);
    if (host) source.referrer_host = host.slice(0, MAX);
    if (Object.keys(source).length === 0) return;

    source.landing_path = loc.pathname.slice(0, MAX);
    storage.setItem(STORAGE_KEY, JSON.stringify(source));
  } catch {
    // Storage blocked: attribution is optional.
  }
}

export async function sendSignupSource(
  fetchImpl: typeof fetch = fetch,
  storage: Storage = window.localStorage,
): Promise<void> {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return;
    // Cleared before the request so a later sign-in never sends it again.
    storage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
  try {
    await fetchImpl('/api/auth/signup-source', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
    });
  } catch {
    // Best effort.
  }
}
