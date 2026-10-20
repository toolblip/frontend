"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import AuthChooser from "@/components/auth/AuthChooser";
import PasskeyAuthButton from "@/components/auth/PasskeyAuthButton";
import { PasskeyCancelledError, signInWithPasskey } from "@/lib/passkeys";
import { useAuthNext } from "@/lib/hooks/useAuthNext";

export default function LoginForm() {
  const { target } = useAuthNext();
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [noPasskey, setNoPasskey] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("oauth_error")) {
      setError("Google sign in could not be completed. Please try again.");
    }
  }, []);

  async function handlePasskey() {
    setError("");
    setNoPasskey(false);
    setPasskeyBusy(true);
    try {
      const { user, token } = await signInWithPasskey();
      login(user, token);
      router.push(target);
    } catch (err) {
      // The browser reports "no passkey here" and "cancelled" the same way, so point at email for both.
      if (err instanceof PasskeyCancelledError) setNoPasskey(true);
      else setError(err instanceof Error ? err.message : "Passkey sign in failed. Please try again.");
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

          {noPasskey && (
            <p role="status" className="tb-v2-auth-notice">
              No passkey on this device? <Link href={`/login/email?next=${encodeURIComponent(target)}`}>Sign in with email</Link> and we&apos;ll set one up.
            </p>
          )}

          <PasskeyAuthButton label={passkeyBusy ? "Waiting for passkey..." : "Sign in with passkey"} onClick={handlePasskey} disabled={passkeyBusy} />
          <AuthChooser mode="signin" target={target} />

          <p className="tb-v2-auth-footer">
            Don&apos;t have an account? <Link href={`/signup?next=${encodeURIComponent(target)}`}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
