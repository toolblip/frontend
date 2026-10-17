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
          <h1 className="tb-v2-auth-title">Sign in</h1>

          {oauthError && (
            <p role="alert" className="tb-v2-auth-error">
              {oauthError}
            </p>
          )}

          <EmailSignIn next={next} googleHref={googleHref} />

          <p className="tb-v2-auth-footer">
            Don&apos;t have an account? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
