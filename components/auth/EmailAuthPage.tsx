"use client";

import Link from "next/link";
import AuthLegal from "@/components/auth/AuthLegal";
import EmailSignIn from "@/components/auth/EmailSignIn";
import { useAuthNext } from "@/lib/hooks/useAuthNext";

/** /login/email and /signup/email. */
export default function EmailAuthPage({ intent }: { intent: "signin" | "signup" }) {
  const { target } = useAuthNext();
  const q = `?next=${encodeURIComponent(target)}`;
  const signIn = intent === "signin";

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">{signIn ? "Sign in with email" : "Sign up with email"}</h1>

          <EmailSignIn intent={intent} next={target} legal={signIn ? undefined : <AuthLegal />} />

          <p className="tb-v2-auth-footer">
            <Link href={`${signIn ? "/login" : "/signup"}${q}`}>Other options</Link>
            <br />
            {signIn ? (
              <>
                Don&apos;t have an account? <Link href={`/signup${q}`}>Sign up</Link>
              </>
            ) : (
              <>
                Already have an account? <Link href={`/login${q}`}>Sign in</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
