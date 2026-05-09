"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    async function verify() {
      const email = params.get("email");
      const token = params.get("token");

      if (!email || !token) {
        setStatus("error");
        setMessage("This verification link is missing information.");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email, token }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "This verification link is invalid or expired.");
        }

        setStatus("success");
        setMessage("Email verified successfully. You can now continue using Toolblip.");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "This verification link is invalid or expired.");
      }
    }

    verify();
  }, [params]);

  return (
    <div className="tb-v2-auth-card text-center">
      <h1 className="tb-v2-auth-title">Verify email</h1>
      <p role="status" className={status === "error" ? "tb-v2-auth-error" : "text-sm text-gray-600 dark:text-gray-300"}>
        {message}
      </p>
      <p className="tb-v2-auth-footer">
        <Link href={status === "success" ? "/account" : "/login"}>
          {status === "success" ? "Go to account" : "Back to login"}
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <Suspense fallback={<div className="tb-v2-auth-card text-center">Verifying your email...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
