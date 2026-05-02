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

export default function AccountPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(false);

  // Redirect to login if not authenticated (after auth has finished loading)
  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login?next=/account");
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("session_id")) {
      setCheckingSession(true);
      checkSubscription();
    } else {
      checkSubscription();
    }
  }, [token]);

  async function checkSubscription() {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/subscription`, {
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
      router.replace("/login?next=/account");
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

  async function handleLogout() {
    await logout();
    router.replace("/");
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

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account</h1>
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

      {/* Subscription Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
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
