function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function isLoggedIn(): boolean {
  return getCookie('tb_session') !== null;
}

export function getUser(): { email: string } | null {
  const raw = getCookie('tb_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { email: string };
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch('https://api.toolblip.com/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {});

  // Clear client-side cookies
  for (const name of ['tb_session', 'tb_user']) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  window.location.href = '/';
}
