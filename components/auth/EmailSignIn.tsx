"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import Turnstile, { TURNSTILE_ENABLED, type TurnstileHandle } from "@/components/auth/Turnstile";
import { PasskeyCancelledError, signInWithChallenge, type PasskeySession } from "@/lib/passkeys";
import type { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";

const JSON_HEADERS = { "Content-Type": "application/json", Accept: "application/json" };
const RESEND_AFTER_MS = 60_000;

type Sent = { email: string; at: number };
type Intent = "signin" | "signup";

/**
 * Email step of /login/email and /signup/email.
 * An account with passkeys gets a passkey prompt; otherwise (or if the passkey fails) we email a magic link.
 * Sign up needs Turnstile; sign in only emails existing accounts, so it doesn't.
 */
export default function EmailSignIn({ intent, next, legal }: { intent: Intent; next: string; legal?: ReactNode }) {
  const { login } = useAuth();
  const router = useRouter();
  const needsTurnstile = intent === "signup" && TURNSTILE_ENABLED;
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);
  const [resendReady, setResendReady] = useState(false);
  const [fallbackChallenge, setFallbackChallenge] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    const prefill = new URLSearchParams(window.location.search).get("email");
    if (prefill) setEmail(prefill);
  }, []);

  useEffect(() => {
    if (!sent) return;
    setResendReady(false);
    const timer = setTimeout(() => setResendReady(true), RESEND_AFTER_MS);
    return () => clearTimeout(timer);
  }, [sent]);

  function completeSignIn(user: PasskeySession["user"], token: string) {
    login(user, token);
    router.push(next);
  }

  function passkeyFailed(err: unknown) {
    setPasskeyBusy(false);
    if (err instanceof PasskeyCancelledError) setNotice("Passkey sign in was cancelled. You can try again or get a sign-in link by email.");
    else setError(err instanceof Error ? err.message : "Passkey sign in failed. Please try again.");
  }

  // The account has passkeys: prompt for one. On cancel or failure the user can fall back to an email link.
  async function runPasskeyChallenge(challenge_id: string, options: PublicKeyCredentialRequestOptionsJSON) {
    setFallbackChallenge(challenge_id);
    setPasskeyBusy(true);
    try {
      const { user, token } = await signInWithChallenge(challenge_id, options);
      completeSignIn(user, token);
    } catch (err) {
      passkeyFailed(err);
    }
  }

  async function startEmail(address: string) {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/email/start", {
        method: "POST",
        headers: JSON_HEADERS,
        credentials: "include",
        body: JSON.stringify({ email: address, intent, next, ...(needsTurnstile ? { turnstile_token: turnstileToken } : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? (data.errors ? Object.values(data.errors).flat().join(", ") : "Could not send a sign-in link. Please try again."));
        return;
      }
      if (data.method === "passkey") {
        setBusy(false);
        await runPasskeyChallenge(data.challenge_id, data.options);
        return;
      }
      setSent({ email: address, at: Date.now() });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      // Turnstile tokens are single-use, so every submit needs a fresh challenge.
      turnstileRef.current?.reset();
    }
  }

  async function sendInsteadOfPasskey() {
    if (!fallbackChallenge) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/email/send", {
        method: "POST",
        headers: JSON_HEADERS,
        credentials: "include",
        body: JSON.stringify({ challenge_id: fallbackChallenge }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? "Could not send a sign-in link. Please try again.");
        return;
      }
      setFallbackChallenge(null);
      setSent({ email: email.trim(), at: Date.now() });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void startEmail(email.trim());
  }

  const sendingBlocked = busy || passkeyBusy;
  const turnstileMissing = needsTurnstile && !turnstileToken;

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="tb-v2-auth-error">
          {error}
        </p>
      )}

      {sent ? (
        <div className="tb-v2-auth-form" role="status">
          <h2 className="tb-v2-auth-title !text-xl">Check your email</h2>
          <p>
            We sent a sign-in link to <strong>{sent.email}</strong>. It expires in 15 minutes.
          </p>
          {intent === "signin" && (
            <p className="tb-v2-auth-hint">
              No email? We only send links to existing accounts.{" "}
              <Link href={`/signup/email?next=${encodeURIComponent(next)}&email=${encodeURIComponent(sent.email)}`}>Sign up instead</Link>
            </p>
          )}
          {intent === "signup" && <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />}
          <button
            type="button"
            onClick={() => startEmail(sent.email)}
            disabled={sendingBlocked || !resendReady || turnstileMissing}
            className="tb-v2-auth-submit"
          >
            {resendReady ? "Send a new link" : "Send a new link in a minute"}
          </button>
          <button type="button" onClick={() => setSent(null)} className="tb-v2-auth-more-toggle">
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleEmailSubmit} className="tb-v2-auth-form" noValidate>
          <div className="tb-v2-auth-field">
            <label htmlFor="email" className="tb-v2-auth-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tb-v2-auth-input"
              placeholder="you@example.com"
            />
            <p className="tb-v2-auth-hint">
              {intent === "signin"
                ? "Have a passkey on this account? We'll ask for it. Otherwise we'll email you a sign-in link."
                : "We'll email you a link to finish creating your account. No password needed."}
            </p>
          </div>

          {intent === "signup" && <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />}

          <button type="submit" disabled={sendingBlocked || turnstileMissing} className="tb-v2-auth-submit">
            {busy ? "Sending..." : passkeyBusy ? "Waiting for passkey..." : "Continue"}
          </button>
        </form>
      )}

      {notice && (
        <p role="status" className="tb-v2-auth-notice">
          {notice}
        </p>
      )}

      {fallbackChallenge && (
        <button type="button" onClick={sendInsteadOfPasskey} disabled={busy} className="tb-v2-auth-submit">
          Email me a sign-in link instead
        </button>
      )}

      {legal}
    </div>
  );
}
