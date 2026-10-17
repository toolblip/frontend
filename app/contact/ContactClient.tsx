"use client";

import { useRef, useState } from "react";
import Turnstile, { TURNSTILE_ENABLED, type TurnstileHandle } from "@/components/auth/Turnstile";

export default function ContactClient() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<TurnstileHandle>(null);

  async function revealEmail() {
    setError("");
    setLoading(true);
    let revealed = false;
    try {
      const res = await fetch("/api/contact/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ turnstile_token: token }),
      });
      const data = await res.json();
      if (res.ok && data.email) {
        revealed = true;
        setEmail(data.email);
      } else {
        setError(data.message ?? "Could not show the email address. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      if (!revealed) turnstileRef.current?.reset();
    }
  }

  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <article className="tb-v2-article">
          <div className="tb-v2-kicker">Contact</div>
          <h1 className="tb-v2-page-title">Contact Toolblip</h1>

          <div className="tb-v2-article-section">
            <p>
              Questions, bug reports, or privacy requests are all welcome. Complete the quick security check below to show the
              email address.
            </p>
          </div>

          <div className="tb-v2-article-section">
            {email ? (
              <p>
                Email us at <a href={`mailto:${email}`}>{email}</a>.
              </p>
            ) : (
              <>
                <Turnstile ref={turnstileRef} onToken={setToken} />
                {error && <p role="alert" className="tb-v2-auth-error">{error}</p>}
                <button
                  type="button"
                  onClick={revealEmail}
                  disabled={loading || (TURNSTILE_ENABLED && !token)}
                  className="tb-v2-btn"
                >
                  {loading ? "Checking..." : "Show email address"}
                </button>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
