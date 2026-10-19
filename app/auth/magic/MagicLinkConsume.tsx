"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { isSafeNext } from "@/lib/safe-next";
import { addPasskey, passkeysSupported } from "@/lib/passkeys";

/**
 * Magic link landing page. The link is NOT consumed on load (email scanners and link previews
 * would burn it); the user must press Sign in. The token is read once, then removed from the URL.
 * Accounts without a passkey get the passkey prompt from that same click, so there is no second page.
 */
export default function MagicLinkConsume() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"" | "signin" | "passkey">("");
  const read = useRef(false);

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
    if (!token) return;
    setError("");
    setBusy("signin");
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
        setBusy("");
        return;
      }
      login(data.user, data.token);
      const next = isSafeNext(data.next) ? data.next : "/dashboard";
      if (data.passkey_setup === "required" || data.passkey_setup === "suggested") {
        if (passkeysSupported()) {
          setBusy("passkey");
          try {
            await addPasskey("");
            router.replace(next);
            return;
          } catch {
            // Cancelled, or the browser dropped the click's activation: the setup page offers a retry or skip.
          }
        }
        router.replace(`/setup-passkey?mode=${data.passkey_setup}&next=${encodeURIComponent(next)}`);
      } else {
        router.replace(next);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy("");
    }
  }

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
          ) : (
            <>
              <h1 className="tb-v2-auth-title">Sign in to Toolblip</h1>
              {user?.email && (
                <p className="tb-v2-auth-notice">
                  You&apos;re signed in as {user.email}. Signing in will switch accounts.
                </p>
              )}
              <button type="button" onClick={consume} disabled={!token || busy !== ""} className="tb-v2-auth-submit">
                {busy === "passkey" ? "Waiting for passkey..." : busy ? "Signing in..." : "Sign in"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
