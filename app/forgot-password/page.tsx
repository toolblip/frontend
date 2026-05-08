"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Reset password</h1>

          {success ? (
            <div>
              <p className="tb-v2-auth-success" style={{ marginBottom: "1rem" }}>
                If that email exists in our system, a password reset link has been sent.
                Check your inbox (and spam folder).
              </p>
              {process.env.NODE_ENV === "development" && (
                <p className="tb-v2-auth-footer" style={{ marginBottom: "1rem" }}>
                  <em>Dev mode: Check the API response for the reset token.</em>
                </p>
              )}
              <p className="tb-v2-auth-footer">
                <Link href="/login">Back to sign in</Link>
              </p>
            </div>
          ) : (
            <>
              <p style={{ marginBottom: "1.5rem", color: "var(--color-muted, #6b7280)" }}>
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="tb-v2-auth-form" noValidate>
                {error && (
                  <p role="alert" className="tb-v2-auth-error">
                    {error}
                  </p>
                )}

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

                <button type="submit" disabled={loading} className="tb-v2-auth-submit">
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>

              <p className="tb-v2-auth-footer">
                Remember your password? <Link href="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
