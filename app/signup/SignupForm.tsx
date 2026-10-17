"use client";

import Link from "next/link";
import AuthChooser from "@/components/auth/AuthChooser";
import AuthLegal from "@/components/auth/AuthLegal";
import { useAuthNext } from "@/lib/hooks/useAuthNext";

export default function SignupForm() {
  const { target } = useAuthNext();

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Create account</h1>

          <AuthChooser mode="signup" target={target} />
          <AuthLegal />

          <p className="tb-v2-auth-footer">
            Already have an account? <Link href={`/login?next=${encodeURIComponent(target)}`}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
