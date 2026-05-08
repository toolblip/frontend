"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (nextParam && nextParam.startsWith("/")) {
      setNext(nextParam);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.token) {
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
    }
  }


  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Sign in</h1>

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
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              />
            </div>

            <button type="submit" disabled={loading} className="tb-v2-auth-submit">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="tb-v2-auth-footer">
            <Link href="/forgot-password">Forgot password?</Link>
            <br />
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
