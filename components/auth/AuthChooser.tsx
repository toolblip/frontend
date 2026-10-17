import Link from "next/link";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

/** First step of /login and /signup: Google or email. The email path has its own page. */
export default function AuthChooser({ mode, target }: { mode: "signin" | "signup"; target: string }) {
  const nextQuery = `?next=${encodeURIComponent(target)}`;
  const emailHref = `${mode === "signin" ? "/login/email" : "/signup/email"}${nextQuery}`;

  return (
    <div>
      <GoogleAuthButton href={`/api/auth/google/start${nextQuery}`} />
      <Link href={emailHref} className="tb-v2-auth-oauth" data-testid="email-auth-button">
        <svg aria-hidden="true" className="tb-v2-auth-oauth-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
        <span>{mode === "signin" ? "Sign in with email" : "Sign up with email"}</span>
      </Link>
    </div>
  );
}
