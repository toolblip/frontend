"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PasswordStrength from "@/components/ui/PasswordStrength";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function SignupForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/dashboard");
  const [favoriteOnReturn, setFavoriteOnReturn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
      setNext(nextParam);
    }
    setFavoriteOnReturn(params.get("favorite") === "1" || params.get("favorite") === "true");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!acceptedLegal) {
      setError("Please accept the Terms and Conditions and Privacy Policy to create your account.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, password, password_confirmation: confirm, accepted_terms: true }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.token) {
        login(data.user, data.token);
        const target = new URL(next, window.location.origin);
        if (favoriteOnReturn) {
          target.searchParams.set("favorite", "1");
        }
        router.push(`${target.pathname}${target.search}${target.hash}`);
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
    }
  }

  const googleNext = favoriteOnReturn ? `${next}${next.includes("?") ? "&" : "?"}favorite=1` : next;

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Create account</h1>

          <GoogleAuthButton href={`/api/auth/google/start?next=${encodeURIComponent(googleNext)}`} />

          <div className="tb-v2-auth-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="tb-v2-auth-form" noValidate>
            {error && (
              <p role="alert" className="tb-v2-auth-error">
                {error}
              </p>
            )}

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

            <div className="tb-v2-auth-consent">
              <label htmlFor="legal-consent" className="tb-v2-auth-consent-label">
                <input
                  id="legal-consent"
                  type="checkbox"
                  checked={acceptedLegal}
                  onChange={(e) => setAcceptedLegal(e.target.checked)}
                  className="tb-v2-auth-consent-checkbox"
                />
                <span>
                  I agree to the <Link href="/terms">Terms and Conditions</Link> and <Link href="/privacy">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading || !acceptedLegal} className="tb-v2-auth-submit">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="tb-v2-auth-footer">
            Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
