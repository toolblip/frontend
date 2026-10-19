import {
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import { stepUpFetch } from "@/lib/step-up";

export type PasskeyUser = { id: number; name: string; email: string; [key: string]: unknown };
export type PasskeySession = { user: PasskeyUser; token: string };
export type PasskeyItem = { id: number; name: string; created_at: string; last_used_at: string | null; transports?: string[] };

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
  const res = await stepUpFetch(url, {
    method: init.method ?? "POST",
    headers: JSON_HEADERS,
    credentials: "include",
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message ?? "Something went wrong. Please try again."), { code: data.code });
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

/** Passkey sign in for a challenge from /api/auth/email/start (allowCredentials = that user's passkeys). */
export async function signInWithChallenge(challenge_id: string, options: PublicKeyCredentialRequestOptionsJSON): Promise<PasskeySession> {
  const credential = await ceremony(() => startAuthentication({ optionsJSON: options }));
  return call<PasskeySession>("/api/auth/passkeys/login", { body: { challenge_id, credential } });
}

/** Discoverable passkey sign in (no email typed). */
export async function signInWithPasskey(): Promise<PasskeySession> {
  const { challenge_id, options } = await call<{ challenge_id: string; options: PublicKeyCredentialRequestOptionsJSON }>(
    "/api/auth/passkeys/login/options",
    { body: {} }
  );
  return signInWithChallenge(challenge_id, options);
}

/** "Chrome on Mac"-style default, so several passkeys are told apart without the user typing anything. */
export function suggestPasskeyName(ua: string = typeof navigator === "undefined" ? "" : navigator.userAgent): string {
  const browser = /Edg(e|A|iOS)?\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\/|FxiOS\//.test(ua)
        ? "Firefox"
        : /Chrome\/|CriOS\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  const os = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /CrOS/.test(ua)
          ? "Chromebook"
          : /Mac OS X|Macintosh/.test(ua)
            ? "Mac"
            : /Windows/.test(ua)
              ? "Windows"
              : /Linux/.test(ua)
                ? "Linux"
                : "";
  return os ? `${browser} on ${os}` : browser;
}

/** Creates a passkey; an empty name falls back to the device suggestion. */
export async function addPasskey(name: string): Promise<PasskeyItem> {
  const { challenge_id, options } = await call<{ challenge_id: string; options: PublicKeyCredentialCreationOptionsJSON }>(
    "/api/auth/passkeys/options"
  );
  const credential = await ceremony(() => startRegistration({ optionsJSON: options }));
  const data = await call<{ passkey: PasskeyItem }>("/api/auth/passkeys", {
    body: { challenge_id, credential, name: name.trim() || suggestPasskeyName() },
  });
  return data.passkey;
}

export async function renamePasskey(id: number, name: string): Promise<PasskeyItem> {
  const data = await call<{ passkey: PasskeyItem }>(`/api/auth/passkeys/${id}`, { method: "PATCH", body: { name: name.trim() } });
  return data.passkey;
}

export async function listPasskeys(): Promise<PasskeyItem[]> {
  const data = await call<{ passkeys: PasskeyItem[] }>("/api/auth/passkeys", { method: "GET" });
  return data.passkeys;
}

export async function deletePasskey(id: number): Promise<void> {
  await call(`/api/auth/passkeys/${id}`, { method: "DELETE" });
}

/** Step-up with one passkey (id) or any of the user's passkeys (null). */
export async function stepUpWithPasskey(passkeyId: number | null): Promise<void> {
  const { challenge_id, options } = await call<{ challenge_id: string; options: PublicKeyCredentialRequestOptionsJSON }>(
    "/api/auth/step-up/options",
    { body: passkeyId === null ? {} : { passkey_id: passkeyId } }
  );
  const credential = await ceremony(() => startAuthentication({ optionsJSON: options }));
  await call("/api/auth/step-up", { body: { challenge_id, credential } });
}

export async function sendStepUpEmailCode(): Promise<void> {
  try {
    await call("/api/auth/step-up/email-code", { body: {} });
  } catch (err) {
    if ((err as { code?: string }).code === "RATE_LIMITED") throw new Error("Please wait a minute before asking for another code.");
    throw err;
  }
}

export async function verifyStepUpEmailCode(code: string): Promise<void> {
  await call("/api/auth/step-up/email-code/verify", { body: { code } });
}
