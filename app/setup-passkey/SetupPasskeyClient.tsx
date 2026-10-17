"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { isSafeNext } from "@/lib/safe-next";
import { addPasskey, PasskeyCancelledError, passkeysSupported } from "@/lib/passkeys";

/**
 * Offered after sign-in when the account has no passkey. "required" (magic-link accounts) is highly
 * recommended and asked on every sign-in until one exists ("Skip for now"); "suggested" (Google) has "Maybe later".
 */
export default function SetupPasskeyClient() {
  const { user, loading } = useRequireAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"required" | "suggested">("suggested");
  const [next, setNext] = useState("/dashboard");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "required") setMode("required");
    const nextParam = params.get("next");
    if (isSafeNext(nextParam)) setNext(nextParam);
  }, []);

  async function createPasskey() {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await addPasskey(name);
      router.replace(next);
    } catch (err) {
      if (err instanceof PasskeyCancelledError) setNotice("Passkey setup was cancelled. You can try again or continue without one.");
      else setError(err instanceof Error ? err.message : "Could not create a passkey. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const required = mode === "required";
  const canCreate = passkeysSupported();

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">{required ? "Set up a passkey (recommended)" : "Set up a passkey"}</h1>
          <p className="tb-v2-auth-notice">
            {required
              ? "Highly recommended. Next time, sign in with your device's fingerprint, face, or screen lock instead of waiting for an email. You can add more passkeys later, one per device."
              : "Add a passkey to sign in with your device's fingerprint, face, or screen lock. It is optional for accounts that sign in with Google."}
          </p>

          {error && (
            <p role="alert" className="tb-v2-auth-error">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="tb-v2-auth-notice">
              {notice}
            </p>
          )}

          {canCreate ? (
            <form
              className="tb-v2-auth-form"
              onSubmit={(e) => {
                e.preventDefault();
                void createPasskey();
              }}
            >
              <div className="tb-v2-auth-field">
                <label htmlFor="passkey-name" className="tb-v2-auth-label">
                  Name <span className="font-normal text-gray-500">optional</span>
                </label>
                <input
                  id="passkey-name"
                  type="text"
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tb-v2-auth-input"
                  placeholder="e.g. Work laptop"
                />
              </div>
              <button type="submit" disabled={busy} className="tb-v2-auth-submit">
                {busy ? "Waiting for passkey..." : "Create passkey"}
              </button>
            </form>
          ) : (
            <p className="tb-v2-auth-notice">This browser cannot create passkeys.</p>
          )}

          <p className="tb-v2-auth-footer">
            <button type="button" onClick={() => router.replace(next)} disabled={busy} className="tb-v2-auth-more-toggle">
              {required ? "Skip for now" : "Maybe later"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
