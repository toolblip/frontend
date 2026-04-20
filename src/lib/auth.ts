const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com';

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('toolblip_token') !== null;
}

export function getUser(): { name: string; email: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('toolblip_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { name: string; email: string };
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('toolblip_token');
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).catch(() => {});
  }
  localStorage.removeItem('toolblip_token');
  localStorage.removeItem('toolblip_user');
  window.location.href = '/';
}
