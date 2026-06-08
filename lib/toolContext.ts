// Lightweight, user-controlled saved context for paid users (Stage 4 Feature 3).
//
// Stores ONLY a small per-tool settings/defaults object keyed by user + tool
// slug. It never captures tool input/output, files, or secrets — callers pass
// just the settings they want to remember. Persistence is local (survives
// reload); the paid gate lives in useToolContext.

export function toolContextKey(userId: string | number, slug: string): string {
  return `toolblip_tool_context_${userId}_${slug}`;
}

export function readToolContext<T extends Record<string, unknown>>(
  userId: string | number,
  slug: string,
): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(toolContextKey(userId, slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as T) : null;
  } catch {
    return null;
  }
}

export function writeToolContext(
  userId: string | number,
  slug: string,
  context: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(toolContextKey(userId, slug), JSON.stringify(context));
  } catch {
    // best-effort: ignore quota/serialization errors
  }
}

export function clearToolContext(userId: string | number, slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(toolContextKey(userId, slug));
  } catch {
    // ignore
  }
}
