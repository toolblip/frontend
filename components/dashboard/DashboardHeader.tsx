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
  teamName: string;
}

export function DashboardHeader({
  subscription,
  favoriteCount: _favoriteCount,
  favoriteToolsLoading: _favoriteToolsLoading,
  tierName,
  teamName,
}: DashboardHeaderProps) {
  const showUpgrade = subscription !== null && tierName !== "Max";

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Dashboard</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {teamName || "My workspace"}
          </h1>
          {subscription && subscription.is_pro && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              {tierName}
            </span>
          )}
          {subscription && !subscription.is_pro && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Free
            </span>
          )}
          {showUpgrade && (
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800"
            >
              Upgrade
            </Link>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
            Profile, favorites, and billing - all in one place.
          </p>
          <Link
            href="/dashboard/subscription"
            className="text-sm font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Manage subscription →
          </Link>
        </div>
      </div>
    </section>
  );
}
