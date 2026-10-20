"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { isSafeNext } from "@/lib/safe-next";

/**
 * Magic link landing page. The link is consumed as soon as the page loads, unless someone is already
 * signed in: then a link (possibly someone else's) must not silently switch accounts, so we ask first.
 * The token is read once, then removed from the URL. Accounts without a passkey go on to passkey setup.
 */
export default function MagicLinkConsume() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const read = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    // Strict mode runs effects twice and the first run clears the URL, so read the token only once.
    if (read.current) return;
    read.current = true;
    const value = new URLSearchParams(window.location.search).get("token") ?? "";
    window.history.replaceState(null, "", "/auth/magic");
    if (value) setToken(value);
    else setError("This sign-in link is invalid or has expired.");
  }, []);

  async function consume() {
    if (!token || started.current) return;
    started.current = true;
    setBusy(true);
    try {
      const res = await fetch("/api/auth/magic-link/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) {
        setError(data.message ?? "This sign-in link is invalid or has expired.");
        return;
      }
      login(data.user, data.token);
      const next = isSafeNext(data.next) ? data.next : "/dashboard";
      if (data.passkey_setup === "required" || data.passkey_setup === "suggested") {
        router.replace(`/setup-passkey?mode=${data.passkey_setup}&next=${encodeURIComponent(next)}`);
      } else {
        router.replace(next);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  const askFirst = !!user && !busy;
  useEffect(() => {
    if (token && !loading && !user) void consume();
    // consume only reads token and stable hooks; started guards repeats.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading, user]);

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          {error ? (
            <>
              <h1 className="tb-v2-auth-title">Link not valid</h1>
              <p role="alert" className="tb-v2-auth-error">
                {error}
              </p>
              <p className="tb-v2-auth-footer">
                <Link href="/login">Request a new sign-in link</Link>
              </p>
            </>
          ) : askFirst && token ? (
            <>
              <h1 className="tb-v2-auth-title">Switch account?</h1>
              <p className="tb-v2-auth-notice">
                You&apos;re signed in as {user.email}. Continuing signs you in with this email link instead.
              </p>
              <button type="button" onClick={() => void consume()} className="tb-v2-auth-submit">
                Continue
              </button>
            </>
          ) : (
            <h1 className="tb-v2-auth-title">Signing you in...</h1>
          )}
        </div>
      </div>
    </div>
  );
}
