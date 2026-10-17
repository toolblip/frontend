import Link from "next/link";

export default function AuthLegal() {
  return (
    <p className="tb-v2-auth-legal">
      By signing up, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
    </p>
  );
}
