"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";

/**
 * Gates admin-only routes. While auth resolves it shows a loading state;
 * unauthenticated users are sent to login (preserving the return path), and
 * signed-in non-admins get an explicit access-denied state.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (loading || user) return;
    const next = `${window.location.pathname}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500 dark:text-gray-400">
        Checking access...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-gray-500 dark:text-gray-400">
        Redirecting to sign in...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-testid="admin-access-denied"
        className="mx-auto max-w-md px-4 py-20 text-center"
      >
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Access denied</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You need an admin account to view this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
