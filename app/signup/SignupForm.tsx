"use client";

import { isSafeNext } from "@/lib/safe-next";
import { useEffect, useState } from "react";
import Link from "next/link";
import EmailSignIn from "@/components/auth/EmailSignIn";

export default function SignupForm() {
  const [next, setNext] = useState("/dashboard");
  const [favoriteOnReturn, setFavoriteOnReturn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (isSafeNext(nextParam)) {
      setNext(nextParam);
    }
    setFavoriteOnReturn(params.get("favorite") === "1" || params.get("favorite") === "true");
  }, []);

  const target = favoriteOnReturn ? `${next}${next.includes("?") ? "&" : "?"}favorite=1` : next;
  const googleHref = `/api/auth/google/start?next=${encodeURIComponent(target)}`;

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Create account</h1>

          <EmailSignIn
            next={target}
            acceptsTerms
            googleHref={googleHref}
            legal={
              <p className="tb-v2-auth-legal">
                By signing up, you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            }
          />

          <p className="tb-v2-auth-footer">
            Already have an account? Enter the same email above to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
