import {
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";

export type PasskeyUser = { id: number; name: string; email: string; [key: string]: unknown };
export type PasskeySession = { user: PasskeyUser; token: string };
export type PasskeyItem = { id: number; name: string; created_at: string; last_used_at: string | null };

/** The user dismissed or timed out the browser passkey prompt. Not an error to surface loudly. */
export class PasskeyCancelledError extends Error {}

const JSON_HEADERS = { "Content-Type": "application/json", Accept: "application/json" };

export function passkeysSupported(): boolean {
  return typeof window !== "undefined" && typeof window.PublicKeyCredential !== "undefined";
}

function isCancelled(err: unknown): boolean {
  const e = err as { name?: string; cause?: { name?: string } } | null;
  return e?.name === "NotAllowedError" || e?.cause?.name === "NotAllowedError";
}

async function call<T>(url: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(url, {
    method: init.method ?? "POST",
    headers: JSON_HEADERS,
    credentials: "include",
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Something went wrong. Please try again.");
  return data as T;
}

async function ceremony<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (isCancelled(err)) throw new PasskeyCancelledError("Passkey request was cancelled.");
    throw err;
  }
}

export async function signInWithPasskey(): Promise<PasskeySession> {
  const { challenge_id, options } = await call<{ challenge_id: string; options: PublicKeyCredentialRequestOptionsJSON }>(
    "/api/auth/passkeys/login/options",
    { body: {} }
  );
  const credential = await ceremony(() => startAuthentication({ optionsJSON: options }));
  return call<PasskeySession>("/api/auth/passkeys/login", { body: { challenge_id, credential } });
}

export async function signUpWithPasskey(details: { name: string; email: string; turnstile_token: string }): Promise<PasskeySession> {
  const { challenge_id, options } = await call<{ challenge_id: string; options: PublicKeyCredentialCreationOptionsJSON }>(
    "/api/auth/passkeys/register/options",
    { body: { ...details, accepted_terms: true } }
  );
  const credential = await ceremony(() => startRegistration({ optionsJSON: options }));
  return call<PasskeySession>("/api/auth/passkeys/register", { body: { challenge_id, credential } });
}

export async function addPasskey(name: string): Promise<void> {
  const { challenge_id, options } = await call<{ challenge_id: string; options: PublicKeyCredentialCreationOptionsJSON }>(
    "/api/auth/passkeys/options"
  );
  const credential = await ceremony(() => startRegistration({ optionsJSON: options }));
  await call("/api/auth/passkeys", { body: { challenge_id, credential, ...(name.trim() ? { name: name.trim() } : {}) } });
}

export async function listPasskeys(): Promise<PasskeyItem[]> {
  const data = await call<{ passkeys: PasskeyItem[] }>("/api/auth/passkeys", { method: "GET" });
  return data.passkeys;
}

export async function deletePasskey(id: number): Promise<void> {
  await call(`/api/auth/passkeys/${id}`, { method: "DELETE" });
}
