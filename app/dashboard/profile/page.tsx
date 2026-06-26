"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, token, login, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [acceptedOnboardingTerms, setAcceptedOnboardingTerms] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    async function restoreSession() {
      if (authLoading || token) return;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const res = await fetch("/api/auth/me", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            if (data.user && data.token) {
              login(data.user, data.token);
              return;
            }
          }
        } catch {
          // retry once
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      const params = new URLSearchParams(window.location.search);
      const currentPath = window.location.pathname;
      const currentNext = params.get("next");
      const nextPath =
        (currentPath === "/login" || currentPath === "/signup") && currentNext && currentNext.startsWith("/") && !currentNext.startsWith("//")
          ? currentNext
          : `${currentPath}${window.location.search}`;
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
    restoreSession();
  }, [authLoading, token, login, router]);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.name);
    setProfileEmail(user.email);
  }, [user]);

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setVerificationMessage("");
    setProfileSaving(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(", ") : "Could not update profile."));
      }

      if (data.user && token) {
        login(data.user, token);
      }
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Could not update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleResendVerification() {
    setVerificationMessage("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setVerificationMessage(data.message || (res.ok ? "Verification email sent." : "Could not send verification email."));
    } catch {
      setVerificationMessage("Could not send verification email.");
    }
  }

  async function handleAcceptTerms() {
    setTermsError("");
    if (!acceptedOnboardingTerms) {
      setTermsError("Please accept the Terms and Conditions and Privacy Policy to continue.");
      return;
    }
    setAcceptingTerms(true);
    try {
      const res = await fetch("/api/auth/accept-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ accepted_terms: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(", ") : "Could not accept terms."));
      if (data.user && token) login(data.user, token);
    } catch (error) {
      setTermsError(error instanceof Error ? error.message : "Could not accept terms.");
    } finally {
      setAcceptingTerms(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const showTermsOnboarding = Boolean(user.requires_terms_acceptance);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 sm:pb-16">
      {showTermsOnboarding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              Welcome to Toolblip
            </p>
            <h2 id="onboarding-title" className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Complete your dashboard setup
            </h2>
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
              Accept the Terms and Conditions and Privacy Policy to continue.
            </p>
            <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
              <p className="font-medium text-gray-900 dark:text-white">Included in onboarding:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Legal agreement confirmation</li>
                <li>Profile setup</li>
              </ul>
            </div>
            <label htmlFor="onboarding-terms" className="mb-4 flex gap-3 text-sm text-gray-700 dark:text-gray-300">
              <input
                id="onboarding-terms"
                type="checkbox"
                checked={acceptedOnboardingTerms}
                onChange={(event) => setAcceptedOnboardingTerms(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span>
                I agree to the <Link href="/terms" className="text-red-600 hover:underline">Terms and Conditions</Link> and{" "}
                <Link href="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>.
              </span>
            </label>
            {termsError && <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">{termsError}</p>}
            <button
              type="button"
              onClick={handleAcceptTerms}
              disabled={!acceptedOnboardingTerms || acceptingTerms}
              className="cursor-pointer w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {acceptingTerms ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      )}

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Profile
      </h1>
      <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
        Manage your personal information and email preferences.
      </p>

      {/* Profile info card */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-semibold uppercase text-white shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Email verification */}
      {!user.email_verified_at && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Email verification needed
          </p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
            Verify your email before using paid and account-sensitive features.
          </p>
          <button
            type="button"
            onClick={handleResendVerification}
            className="cursor-pointer rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Resend verification email
          </button>
          {verificationMessage && (
            <p role="status" className="mt-3 text-sm text-amber-700 dark:text-amber-300">
              {verificationMessage}
            </p>
          )}
        </div>
      )}

      {/* Profile edit form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Edit profile
        </h2>
        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
          {profileMessage && (
            <p role="status" className="text-sm text-green-600 dark:text-green-400">
              {profileMessage}
            </p>
          )}
          {profileError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {profileError}
            </p>
          )}
          <div>
            <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={profileSaving}
            className="cursor-pointer rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {profileSaving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
