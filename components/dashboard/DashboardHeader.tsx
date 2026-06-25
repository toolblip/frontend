"use client";

import React from "react";
import type { Subscription } from "./types";

interface DashboardHeaderProps {
  subscription: Subscription | null;
  subscriptionError: boolean;
  checkingSession: boolean;
  favoriteCount: number;
  favoriteToolsLoading: boolean;
  user: { email_verified_at?: string | null; [key: string]: unknown };
  tierName: string | null;
}

export function DashboardHeader({
  subscription,
  subscriptionError,
  checkingSession,
  favoriteCount,
  favoriteToolsLoading,
  user,
  tierName,
}: DashboardHeaderProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:px-8 lg:py-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Manage your account in one place
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
            Keep profile, favorites, and billing together without digging through the site.
          </p>
          {checkingSession && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Subscription updated. Verifying your new plan...
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Plan</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {subscription === null
                ? subscriptionError
                  ? "Unavailable"
                  : "Loading..."
                : subscription.is_pro
                  ? `${tierName ?? "Pro"}`
                  : "Free"}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subscription === null
                ? subscriptionError
                  ? "Couldn't load plan"
                  : "Checking subscription"
                : subscription.is_pro
                  ? "Billing is active"
                  : "No upgrade selected"}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Favorites</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {favoriteToolsLoading ? "Loading..." : `${favoriteCount}`}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Saved tools for quick access</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {user.email_verified_at ? "Verified" : "Pending"}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user.email_verified_at ? "All set" : "Needs attention"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
