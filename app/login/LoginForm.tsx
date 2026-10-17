"use client";

import { isSafeNext } from "@/lib/safe-next";
import { useState, useEffect } from "react";
import Link from "next/link";
import EmailSignIn from "@/components/auth/EmailSignIn";

export default function LoginForm() {
  const [next, setNext] = useState("/dashboard");
  const [oauthError, setOauthError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (isSafeNext(nextParam)) {
      setNext(nextParam);
    }
    if (params.get("oauth_error")) {
      setOauthError("Google sign in could not be completed. Please try again.");
    }
  }, []);

  const googleHref = `/api/auth/google/start?next=${encodeURIComponent(next)}`;

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Sign in or sign up</h1>

          {oauthError && (
            <p role="alert" className="tb-v2-auth-error">
              {oauthError}
            </p>
          )}

          <EmailSignIn
            next={next}
            acceptsTerms
            googleHref={googleHref}
            legal={
              <p className="tb-v2-auth-legal">
                By continuing, you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            }
          />

        </div>
      </div>
    </div>
  );
}
