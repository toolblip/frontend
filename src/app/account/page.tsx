'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://toolblip-api-production.up.railway.app';

interface Subscription {
  is_pro: boolean;
  plan_ends_at: string | null;
  subscription_status: string | null;
}

export default function AccountPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('toolblip_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw) as { name: string; email: string });
      } catch {
        window.location.href = '/login?next=/account';
        return;
      }
    } else {
      window.location.href = '/login?next=/account';
      return;
    }

    // Check if returning from Stripe checkout
    const params = new URLSearchParams(window.location.search);
    if (params.has('session_id')) {
      setCheckingSession(true);
      // Refresh user data after Stripe checkout
      checkSubscription();
    } else {
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    const token = localStorage.getItem('toolblip_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
        // Update localStorage user with latest is_pro
        const raw = localStorage.getItem('toolblip_user');
        if (raw) {
          const u = JSON.parse(raw);
          u.is_pro = data.is_pro;
          localStorage.setItem('toolblip_user', JSON.stringify(u));
        }
      }
    } catch {
      // ignore network errors
    } finally {
      setCheckingSession(false);
    }
  }

  async function openCustomerPortal() {
    setPortalError(null);
    const token = localStorage.getItem('toolblip_token');
    if (!token) {
      window.location.href = '/login?next=/account';
      return;
    }

    setLoadingPortal(true);

    try {
      const res = await fetch(`${API_BASE}/api/subscription/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Something went wrong');
      setLoadingPortal(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    );
  }

  const planEndDate = subscription?.plan_ends_at
    ? new Date(subscription.plan_ends_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your subscription and profile.</p>

      {checkingSession && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
          Subscription updated! Verifying your new plan...
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Profile
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-lg uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Subscription
        </h2>

        {subscription === null ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
              <span className="text-gray-500">Checking subscription...</span>
            </div>
          </div>
        ) : subscription.is_pro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400">
                Pro plan active
              </span>
            </div>
            {planEndDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.subscription_status === 'active'
                  ? `Renews on ${planEndDate}`
                  : `Active until ${planEndDate}`}
              </p>
            )}
            {portalError && (
              <p className="text-red-600 dark:text-red-400 text-sm">{portalError}</p>
            )}
            <button
              onClick={openCustomerPortal}
              disabled={loadingPortal}
              className="mt-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loadingPortal ? 'Opening...' : 'Manage Billing'}
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
              Upgrade to Pro to remove ads and get early access to new tools.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
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
