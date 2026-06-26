"use client";

import Link from "next/link";
import React from "react";
import type { Subscription } from "./types";

interface DashboardHeaderProps {
  subscription: Subscription | null;
  subscriptionError: boolean;
  checkingSession: boolean;
  favoriteCount: number;
  favoriteToolsLoading: boolean;
  tierName: string | null;
}

function subscriptionStatusLabel(subscription: Subscription | null): string {
  if (!subscription) return "";
  const status = subscription.subscription_status;
  if (status === "active") return "Active";
  if (status === "trialing") return "Trialing";
  if (status === "past_due") return "Past Due";
  if (status === "canceled") return "Canceled";
  if (status === "incomplete") return "Incomplete";
  if (status === "incomplete_expired") return "Expired";
  if (status === "paused") return "Paused";
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
}

export function DashboardHeader({
  subscription,
  subscriptionError,
  checkingSession,
  favoriteCount,
  favoriteToolsLoading,
  tierName,
}: DashboardHeaderProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.6fr)] lg:px-8 lg:py-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Manage your account
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
            Profile, favorites, and billing - all in one place.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard/subscription"
            className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Plan</p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {checkingSession
                    ? "Checking..."
                    : subscription === null
                      ? subscriptionError
                        ? "Unavailable"
                        : "Loading..."
                      : tierName ?? "Free"}
                </p>
              </div>
              {subscription && subscription.is_pro && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  {subscriptionStatusLabel(subscription)}
                </span>
              )}
              {subscription && !subscription.is_pro && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  Free
                </span>
              )}
              {subscription === null && !checkingSession && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {subscriptionError ? "Error" : "..."}
                </span>
              )}
            </div>

            {subscription && subscription.is_pro && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(subscription.storage_gb ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {subscription.storage_gb}GB storage
                  </span>
                )}
                {(subscription.max_file_size_mb ?? 0) > 0 &&
                  (() => {
                    const mb = subscription.max_file_size_mb as number;
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Max {mb >= 1000 ? `${mb / 1000}GB` : `${mb}MB`}
                      </span>
                    );
                  })()}
                {(subscription.team_seats ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {subscription.team_seats} seat{subscription.team_seats !== 1 ? "s" : ""}
                  </span>
                )}
                {subscription.api_access && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    API access
                  </span>
                )}
                {subscription.priority_support && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Priority support
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400">
              Configure
              <span aria-hidden="true">→</span>
            </div>
          </Link>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/60">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Favorites</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {favoriteToolsLoading ? "Loading..." : `${favoriteCount}`}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Saved tools for quick access</p>
          </div>
        </div>
      </div>
    </section>
  );
}
