"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import PasskeyAuthButton from "@/components/auth/PasskeyAuthButton";
import AuthMoreOptions from "@/components/auth/AuthMoreOptions";
import Turnstile, { TURNSTILE_ENABLED, type TurnstileHandle } from "@/components/auth/Turnstile";
import { PasskeyCancelledError, passkeysSupported, signInWithPasskey } from "@/lib/passkeys";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [next, setNext] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
      setNext(nextParam);
    }
    if (params.get("oauth_error")) {
      setError("Google sign in could not be completed. Please try again.");
    }
    setPasskeyAvailable(passkeysSupported());
  }, []);

  const googleHref = `/api/auth/google/start?next=${encodeURIComponent(next)}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    let signedIn = false;
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password, turnstile_token: turnstileToken }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.token) {
        signedIn = true;
        login(data.user, data.token);
        router.push(next);
      } else {
        setError(
          data.message ??
            (data.errors ? Object.values(data.errors).flat().join(", ") : "Invalid email or password.")
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      // Turnstile tokens are single-use, so a failed attempt always needs a fresh challenge.
      if (!signedIn) turnstileRef.current?.reset();
    }
  }

  async function handlePasskeyLogin() {
    setError("");
    setNotice("");
    setPasskeyBusy(true);
    try {
      const { user, token } = await signInWithPasskey();
      login(user, token);
      router.push(next);
    } catch (err) {
      if (err instanceof PasskeyCancelledError) {
        setNotice("Passkey sign in was cancelled. You can try again or use another method.");
      } else {
        setError(err instanceof Error ? err.message : "Passkey sign in failed. Please try again.");
      }
    } finally {
      setPasskeyBusy(false);
    }
  }

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Sign in</h1>

          {error && (
            <p role="alert" className="tb-v2-auth-error">
              {error}
            </p>
          )}

          <GoogleAuthButton href={googleHref} />

          {passkeyAvailable && (
            <PasskeyAuthButton
              label="Sign in with passkey"
              onClick={handlePasskeyLogin}
              disabled={passkeyBusy}
            />
          )}

          {notice && (
            <p role="status" className="tb-v2-auth-notice">
              {notice}
            </p>
          )}

          <div className="tb-v2-auth-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <AuthMoreOptions>
            <form onSubmit={handleSubmit} className="tb-v2-auth-form" noValidate>
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
              </div>

              <div className="tb-v2-auth-field">
                <label htmlFor="password" className="tb-v2-auth-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="Enter your password"
                />
              </div>

              <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />

              <button
                type="submit"
                disabled={loading || (TURNSTILE_ENABLED && !turnstileToken)}
                className="tb-v2-auth-submit"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </AuthMoreOptions>

          <p className="tb-v2-auth-footer">
            <Link href="/forgot-password">Forgot password?</Link>
            <br />
            Don&apos;t have an account? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
