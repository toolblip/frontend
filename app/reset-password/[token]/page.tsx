"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import PasswordStrength from "@/components/ui/PasswordStrength";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) setTokenError(true);
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: "", // User should provide this too — fetch from form
          token,
          password,
          password_confirmation: confirm,
        }),
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

  if (tokenError) {
    return (
      <div className="tb-v2-auth">
        <div className="tb-v2-container">
          <div className="tb-v2-auth-card">
            <h1 className="tb-v2-auth-title">Invalid reset link</h1>
            <p className="tb-v2-auth-error">This password reset link is invalid or has expired.</p>
            <p className="tb-v2-auth-footer">
              <Link href="/forgot-password">Request a new one</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Set new password</h1>

          {success ? (
            <div>
              <p style={{ marginBottom: "1rem" }}>Your password has been reset successfully.</p>
              <p className="tb-v2-auth-footer">
                <Link href="/login">Sign in with your new password</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="tb-v2-auth-form" noValidate>
              {error && (
                <p role="alert" className="tb-v2-auth-error">
                  {error}
                </p>
              )}

              <div className="tb-v2-auth-field">
                <label htmlFor="password" className="tb-v2-auth-label">
                  New password
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
                  Confirm new password
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

              <button type="submit" disabled={loading} className="tb-v2-auth-submit">
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>
          )}

          <p className="tb-v2-auth-footer">
            Remember your password? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
