"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";

/**
 * Wait for AuthProvider's mount-once /me restore, then soft-redirect to login
 * if there is still no user. Avoids duplicate /api/auth/me calls on every
 * dashboard page mount.
 */
export function useRequireAuth() {
  const { user, token, login, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) return;

    const params = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    const currentNext = params.get("next");
    const nextPath =
      (currentPath === "/login" || currentPath === "/signup") &&
      currentNext &&
      currentNext.startsWith("/") &&
      !currentNext.startsWith("//")
        ? currentNext
        : `${currentPath}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [loading, user, router]);

  return { user, token, login, logout, loading };
}
