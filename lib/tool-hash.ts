export function readHash(hash: string): URLSearchParams | null {
  const raw = hash.replace(/^#/, '');
  if (!raw) return null;
  return new URLSearchParams(raw);
}

export function hashFromFields(fields: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) params.set(key, value);
  return params.toString();
}
