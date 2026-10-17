"use client";

import { isSafeNext } from "@/lib/safe-next";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PasswordStrength from "@/components/ui/PasswordStrength";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import PasskeyAuthButton from "@/components/auth/PasskeyAuthButton";
import AuthMoreOptions from "@/components/auth/AuthMoreOptions";
import Turnstile, { TURNSTILE_ENABLED, type TurnstileHandle } from "@/components/auth/Turnstile";
import { PasskeyCancelledError, passkeysSupported, signUpWithPasskey } from "@/lib/passkeys";

export default function SignupForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [passkeyStep, setPasskeyStep] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [passkeyTurnstileToken, setPasskeyTurnstileToken] = useState("");
  const passkeyTurnstileRef = useRef<TurnstileHandle>(null);
  const [next, setNext] = useState("/dashboard");
  const [favoriteOnReturn, setFavoriteOnReturn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (isSafeNext(nextParam)) {
      setNext(nextParam);
    }
    setFavoriteOnReturn(params.get("favorite") === "1" || params.get("favorite") === "true");
    setPasskeyAvailable(passkeysSupported());
  }, []);

  function goToNext() {
    const target = new URL(next, window.location.origin);
    if (favoriteOnReturn) {
      target.searchParams.set("favorite", "1");
    }
    router.push(`${target.pathname}${target.search}${target.hash}`);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    let signedIn = false;
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirm,
          accepted_terms: true,
          turnstile_token: turnstileToken,
          ...(username.trim() ? { username: username.trim() } : {}),
        }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.token) {
        signedIn = true;
        login(data.user, data.token);
        goToNext();
      } else {
        const msg =
          data.message ??
          (data.errors ? Object.values(data.errors).flat().join(", ") : "Could not create account. Please try again.");
        setError(msg);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      // Turnstile tokens are single-use, so a failed attempt always needs a fresh challenge.
      if (!signedIn) turnstileRef.current?.reset();
    }
  }

  async function handlePasskeySignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setPasskeyBusy(true);
    let signedIn = false;
    try {
      const { user, token } = await signUpWithPasskey({
        name: name.trim(),
        email: email.trim(),
        turnstile_token: passkeyTurnstileToken,
      });
      signedIn = true;
      login(user, token);
      goToNext();
    } catch (err) {
      if (err instanceof PasskeyCancelledError) {
        setNotice("Passkey setup was cancelled. You can try again or use another method.");
      } else {
        setError(err instanceof Error ? err.message : "Could not create account. Please try again.");
      }
    } finally {
      setPasskeyBusy(false);
      // Tokens are single-use: any failed attempt needs a fresh challenge.
      if (!signedIn) passkeyTurnstileRef.current?.reset();
    }
  }

  const googleNext = favoriteOnReturn ? `${next}${next.includes("?") ? "&" : "?"}favorite=1` : next;

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Create account</h1>

          {error && (
            <p role="alert" className="tb-v2-auth-error">
              {error}
            </p>
          )}

          <GoogleAuthButton href={`/api/auth/google/start?next=${encodeURIComponent(googleNext)}`} />

          {passkeyAvailable && (
            <PasskeyAuthButton
              label="Sign up with passkey"
              onClick={() => setPasskeyStep((value) => !value)}
              disabled={passkeyBusy}
            />
          )}

          {passkeyAvailable && passkeyStep && (
            <form onSubmit={handlePasskeySignup} className="tb-v2-auth-form" noValidate>
              <div className="tb-v2-auth-field">
                <label htmlFor="passkey-name" className="tb-v2-auth-label">
                  Name
                </label>
                <input
                  id="passkey-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="Your name"
                />
              </div>
              <div className="tb-v2-auth-field">
                <label htmlFor="passkey-email" className="tb-v2-auth-label">
                  Email
                </label>
                <input
                  id="passkey-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="you@example.com"
                />
              </div>
              <Turnstile ref={passkeyTurnstileRef} onToken={setPasskeyTurnstileToken} />
              <button
                type="submit"
                disabled={passkeyBusy || (TURNSTILE_ENABLED && !passkeyTurnstileToken)}
                className="tb-v2-auth-submit"
              >
                {passkeyBusy ? "Waiting for passkey..." : "Continue with passkey"}
              </button>
            </form>
          )}

          {notice && (
            <p role="status" className="tb-v2-auth-notice">
              {notice}
            </p>
          )}

          <p className="tb-v2-auth-legal">
            By signing up, you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <div className="tb-v2-auth-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <AuthMoreOptions>
            <form onSubmit={handleSubmit} className="tb-v2-auth-form" noValidate>
              <div className="tb-v2-auth-field">
                <label htmlFor="name" className="tb-v2-auth-label">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="Your name"
                />
              </div>

              <div className="tb-v2-auth-field">
                <label htmlFor="username" className="tb-v2-auth-label">
                  Username <span className="font-normal text-gray-500">optional</span>
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="Leave blank and we'll pick one"
                />
              </div>

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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="Min. 8 characters"
                />
                <PasswordStrength password={password} />
              </div>

              <div className="tb-v2-auth-field">
                <label htmlFor="password-confirm" className="tb-v2-auth-label">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  type="password"
                  name="password_confirmation"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="Repeat password"
                />
              </div>

              <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />

              <button
                type="submit"
                disabled={loading || (TURNSTILE_ENABLED && !turnstileToken)}
                className="tb-v2-auth-submit"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </AuthMoreOptions>

          <p className="tb-v2-auth-footer">
            Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link>
            <br />
            Already have a passkey? <Link href={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
