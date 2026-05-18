"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

interface Subscription {
  is_pro: boolean;
  tier: string | null;
  devices: number | null;
  storage_gb: number | null;
  team_seats: number | null;
  max_file_size_mb: number | null;
  api_access: boolean;
  priority_support: boolean;
  plan_ends_at: string | null;
  subscription_status: string | null;
}

interface FavoriteTool {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon?: string | null;
  favorited_at?: string | null;
}

type OnboardingStatus = "completed" | "skipped";
type OnboardingPlanTier = "free" | "starter" | "ultra" | "max";

const ONBOARDING_PLANS: Array<{
  tier: OnboardingPlanTier;
  name: string;
  price: string;
  description: string;
  badge?: string;
}> = [
  { tier: "free", name: "Free", price: "$0", description: "Start with all core tools and client-side processing." },
  { tier: "starter", name: "Starter", price: "$4.99/mo", description: "Remove ads and unlock personal cloud storage." },
  { tier: "ultra", name: "Ultra", price: "$19.99/mo", description: "Power-user limits, API access, and more storage.", badge: "Popular" },
  { tier: "max", name: "Business", price: "$49.99/mo", description: "Team seats, priority support, and the highest limits." },
];

function onboardingStorageKey(userId: number | string) {
  return `toolblip_onboarding_${userId}`;
}

export default function AccountPage() {
  const { user, token, login, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedOnboardingTerms, setAcceptedOnboardingTerms] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [showPlanOnboarding, setShowPlanOnboarding] = useState(false);
  const [selectedOnboardingPlan, setSelectedOnboardingPlan] = useState<OnboardingPlanTier>("free");
  const [favoriteTools, setFavoriteTools] = useState<FavoriteTool[]>([]);
  const [favoriteToolsLoading, setFavoriteToolsLoading] = useState(false);

  // Redirect to login if not authenticated (after auth has finished loading)
  useEffect(() => {
    async function restoreCookieSessionBeforeRedirect() {
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
          // retry once before redirecting
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      router.replace("/login?next=/dashboard");
    }

    restoreCookieSessionBeforeRedirect();
  }, [authLoading, token, login, router]);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.name);
    setProfileEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (!user || user.requires_terms_acceptance) {
      setShowPlanOnboarding(false);
      return;
    }

    try {
      const stored = window.localStorage.getItem(onboardingStorageKey(user.id));
      if (!stored) {
        setSelectedOnboardingPlan("free");
        setShowPlanOnboarding(true);
        return;
      }

      const parsed = JSON.parse(stored) as { status?: OnboardingStatus; selectedPlan?: OnboardingPlanTier };
      if (parsed.status === "completed" || parsed.status === "skipped") {
        setShowPlanOnboarding(false);
        return;
      }
    } catch {
      setSelectedOnboardingPlan("free");
      setShowPlanOnboarding(true);
      return;
    }

    setSelectedOnboardingPlan("free");
    setShowPlanOnboarding(true);
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("session_id")) {
      setCheckingSession(true);
      checkSubscription();
    } else {
      checkSubscription();
    }
  }, [token]);

  useEffect(() => {
    loadFavoriteTools();
  }, [token]);

  async function loadFavoriteTools() {
    if (!token) return;
    setFavoriteToolsLoading(true);
    try {
      const res = await fetch("/api/tools/favorites", { credentials: "include", headers: { Accept: "application/json" } });
      if (res.ok) {
        const data = await res.json();
        setFavoriteTools(Array.isArray(data.data) ? data.data : []);
      }
    } catch {
      // ignore favorite loading errors
    } finally {
      setFavoriteToolsLoading(false);
    }
  }

  async function checkSubscription() {
    if (!token) return;
    try {
      const res = await fetch(`/api/subscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch {
      // ignore network errors
    } finally {
      setCheckingSession(false);
    }
  }

  async function openCustomerPortal() {
    setPortalError(null);
    if (!token) {
      router.replace("/login?next=/dashboard");
      return;
    }
    setLoadingPortal(true);
    try {
      const res = await fetch(`${API_BASE}/api/subscription/portal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to open billing portal");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Something went wrong");
      setLoadingPortal(false);
    }
  }

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

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(", ") : "Could not change password."));
      }

      setPasswordMessage("Password changed successfully. Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await logout();
      router.replace("/login?next=/dashboard");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Could not change password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/");
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

      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(", ") : "Could not accept terms."));
      }

      if (data.user && token) {
        login(data.user, token);
      }
      await checkSubscription();
    } catch (error) {
      setTermsError(error instanceof Error ? error.message : "Could not accept terms.");
    } finally {
      setAcceptingTerms(false);
    }
  }

  function persistPlanOnboarding(status: OnboardingStatus) {
    if (!user || !selectedOnboardingPlan) return;

    window.localStorage.setItem(
      onboardingStorageKey(user.id),
      JSON.stringify({
        status,
        selectedPlan: selectedOnboardingPlan,
        updatedAt: new Date().toISOString(),
      })
    );
    setShowPlanOnboarding(false);
  }

  function handleFinishPlanOnboarding() {
    persistPlanOnboarding("completed");
  }

  function handleSkipPlanOnboarding() {
    if (!selectedOnboardingPlan) setSelectedOnboardingPlan("free");
    persistPlanOnboarding("skipped");
  }

  if (authLoading || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const planEndDate = subscription?.plan_ends_at
    ? new Date(subscription.plan_ends_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const tierName = subscription?.tier
    ? subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)
    : null;
  const showTermsOnboarding = Boolean(user.requires_terms_acceptance);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {showTermsOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">Welcome to Toolblip</p>
            <h2 id="onboarding-title" className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Complete your dashboard setup</h2>
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
              Accept the Terms and Conditions and Privacy Policy to continue. After this, you can choose a subscription or keep using the free plan.
            </p>
            <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
              <p className="font-medium text-gray-900 dark:text-white">Included in onboarding:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Legal agreement confirmation</li>
                <li>Profile setup</li>
                <li>Subscription options</li>
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
                I agree to the <Link href="/terms" className="text-red-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>.
              </span>
            </label>
            {termsError && <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">{termsError}</p>}
            <button
              type="button"
              onClick={handleAcceptTerms}
              disabled={!acceptedOnboardingTerms || acceptingTerms}
              className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {acceptingTerms ? "Saving..." : "Continue to subscription options"}
            </button>
          </div>
        </div>
      )}
      {!showTermsOnboarding && showPlanOnboarding && (
        <section
          aria-labelledby="plan-onboarding-title"
          className="mb-8 rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-gray-50 p-6 shadow-sm dark:border-red-900/50 dark:from-red-950/30 dark:via-gray-900 dark:to-gray-950"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">Welcome to Toolblip</p>
              <div>
                <h2 id="plan-onboarding-title" className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Welcome to your Toolblip dashboard</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                  Start here to understand what the dashboard does, pick a plan, save your favorite tools, and manage billing and profile settings from one place. Free is selected by default, and you can switch plans anytime.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSkipPlanOnboarding}
              className="self-start rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Skip for now
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <p className="font-semibold text-gray-900 dark:text-white">Your first steps</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>Pick a plan that fits how you use Toolblip</li>
                <li>Save your favorite tools for quick access</li>
                <li>Update your profile and billing anytime from this dashboard</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href="#favorite-tools" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:bg-red-950/30">Favorite tools</a>
                <a href="#profile-settings" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:bg-red-950/30">Profile settings</a>
                <a href="#billing" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:bg-red-950/30">Billing</a>
                <a href="/pricing" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:bg-red-950/30">View plans</a>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <p className="font-semibold text-gray-900 dark:text-white">Choose a plan</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Free is selected by default. You can compare plans now and decide later.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Toolblip plan options">
                {ONBOARDING_PLANS.map((plan) => {
                  const selected = selectedOnboardingPlan === plan.tier;
                  return (
                    <label
                      key={plan.tier}
                      htmlFor={`onboarding-plan-${plan.tier}`}
                      className={`relative cursor-pointer rounded-xl border p-4 transition-colors ${
                        selected
                          ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950/30"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-gray-600"
                      }`}
                    >
                      <input
                        id={`onboarding-plan-${plan.tier}`}
                        type="radio"
                        name="onboarding-plan"
                        value={plan.tier}
                        checked={selected}
                        onChange={() => setSelectedOnboardingPlan(plan.tier)}
                        className="mb-3 h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-semibold text-gray-900 dark:text-white">{plan.name}</span>
                          <span className="mt-1 block text-sm font-medium text-red-600 dark:text-red-400">{plan.price}</span>
                        </span>
                        {plan.badge && (
                          <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">{plan.badge}</span>
                        )}
                      </span>
                      <span className="mt-3 block text-sm text-gray-600 dark:text-gray-300">{plan.description}</span>
                      {selected && <span className="mt-3 block text-xs font-semibold text-red-600 dark:text-red-400">Selected plan</span>}
                    </label>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleFinishPlanOnboarding}
                  disabled={!selectedOnboardingPlan}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Finish onboarding
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your subscription and profile.</p>

      {checkingSession && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          Subscription updated! Verifying your new plan...
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Profile
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-lg uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {user.email_verified_at ? null : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">Email verification needed</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">Verify your email before using paid and account-sensitive features.</p>
          <button
            type="button"
            onClick={handleResendVerification}
            className="mt-3 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Resend verification email
          </button>
          {verificationMessage && <p role="status" className="text-sm text-amber-700 dark:text-amber-300 mt-2">{verificationMessage}</p>}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6" id="profile-settings">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Profile settings
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {profileMessage && <p role="status" className="text-sm text-green-600 dark:text-green-400">{profileMessage}</p>}
          {profileError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{profileError}</p>}
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              id="profile-name"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              id="profile-email"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              required
            />
          </div>
          <button type="submit" disabled={profileSaving} className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium disabled:opacity-50">
            {profileSaving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Change password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordMessage && <p role="status" className="text-sm text-green-600 dark:text-green-400">{passwordMessage}</p>}
          {passwordError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>}
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current password</label>
            <input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" required />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New password</label>
            <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" minLength={8} required />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm new password</label>
            <input id="confirm-new-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm" minLength={8} required />
          </div>
          <button type="submit" disabled={passwordSaving} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {passwordSaving ? "Changing..." : "Change password"}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6" id="favorite-tools">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Favorite tools
        </h2>
        {favoriteToolsLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading favorites...</p>
        ) : favoriteTools.length > 0 ? (
          <div className="space-y-3">
            {favoriteTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-red-200 hover:bg-red-50 dark:border-gray-800 dark:hover:border-red-900 dark:hover:bg-red-950/30"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-lg dark:bg-gray-800">{tool.icon || "🧰"}</span>
                <span>
                  <span className="block font-semibold text-gray-900 dark:text-white">{tool.name}</span>
                  <span className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{tool.description}</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Favorite tools from any tool page to keep them here.</p>
        )}
      </div>

      {/* Subscription Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6" id="billing">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Subscription
        </h2>

        {subscription === null ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
            <span className="text-gray-500">Checking subscription...</span>
          </div>
        ) : subscription.is_pro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-medium text-red-700 dark:text-red-400">
                {tierName} plan active
              </span>
            </div>

            {planEndDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.subscription_status === "active"
                  ? `Renews on ${planEndDate}`
                  : `Active until ${planEndDate}`}
              </p>
            )}

            {(subscription.devices ?? 0) > 0 || (subscription.storage_gb ?? 0) > 0 || (subscription.max_file_size_mb ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(subscription.devices ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {subscription.devices} device{subscription.devices !== 1 ? "s" : ""}
                  </span>
                )}
                {(subscription.storage_gb ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                    </svg>
                    {subscription.storage_gb}GB storage
                  </span>
                )}
                {(subscription.max_file_size_mb ?? 0) > 0 && (() => {
                    const mb = subscription.max_file_size_mb as number;
                    return (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Max {mb >= 1000 ? `${mb / 1000}GB` : `${mb}MB`} file
                      </span>
                    );
                  })()}
                {(subscription.team_seats ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {subscription.team_seats} team seat{subscription.team_seats !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            ) : null}

            {portalError && (
              <p className="text-red-600 dark:text-red-400 text-sm">{portalError}</p>
            )}
            <button
              onClick={openCustomerPortal}
              disabled={loadingPortal}
              className="mt-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loadingPortal ? "Opening..." : "Manage Billing"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Free plan
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upgrade to remove ads, unlock more devices, storage, and team seats.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
