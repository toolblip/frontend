"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthChooser from "@/components/auth/AuthChooser";
import { useAuthNext } from "@/lib/hooks/useAuthNext";

export default function LoginForm() {
  const { target } = useAuthNext();
  const [oauthError, setOauthError] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("oauth_error")) {
      setOauthError("Google sign in could not be completed. Please try again.");
    }
  }, []);

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Sign in</h1>

          {oauthError && (
            <p role="alert" className="tb-v2-auth-error">
              {oauthError}
            </p>
          )}

          <AuthChooser mode="signin" target={target} />

          <p className="tb-v2-auth-footer">
            Don&apos;t have an account? <Link href={`/signup?next=${encodeURIComponent(target)}`}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
