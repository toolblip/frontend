"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { isSafeNext } from "@/lib/safe-next";

/**
 * Magic link landing page. The link is consumed as soon as the page loads; the token is read once,
 * then removed from the URL. Accounts without a passkey go on to the passkey setup page.
 */
export default function MagicLinkConsume() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    // Strict mode runs effects twice and the first run clears the URL, so consume only once.
    if (started.current) return;
    started.current = true;
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    window.history.replaceState(null, "", "/auth/magic");
    if (!token) {
      setError("This sign-in link is invalid or has expired.");
      return;
    }
    void (async () => {
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
    })();
  }, [login, router]);

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
            <h1 className="tb-v2-auth-title">Signing you in...</h1>
          )}
        </div>
      </div>
    </div>
  );
}
