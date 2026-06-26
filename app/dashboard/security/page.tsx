"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
              // We need login but it's not destructured — use the token from auth
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
  }, [authLoading, token, router]);

  function redirectToLoginPreservingCurrentLocation() {
    const params = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    const currentNext = params.get("next");
    const nextPath =
      (currentPath === "/login" || currentPath === "/signup") && currentNext && currentNext.startsWith("/") && !currentNext.startsWith("//")
        ? currentNext
        : `${currentPath}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
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
      redirectToLoginPreservingCurrentLocation();
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Could not change password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 sm:pb-16">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
        Security
      </h1>
      <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
        Manage your password and account security settings.
      </p>

      {/* Change password */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Change password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
          {passwordMessage && (
            <p role="status" className="text-sm text-green-600 dark:text-green-400">
              {passwordMessage}
            </p>
          )}
          {passwordError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {passwordError}
            </p>
          )}
          <div>
            <label
              htmlFor="current-password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              minLength={8}
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-new-password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm new password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={passwordSaving}
            className="cursor-pointer rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {passwordSaving ? "Changing..." : "Change password"}
          </button>
        </form>
      </div>

      {/* Delete account placeholder */}
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 opacity-50 cursor-not-allowed dark:border-red-800 dark:text-red-400"
          title="Account deletion is not available yet"
        >
          Delete account
        </button>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Account deletion is coming soon.
        </p>
      </div>
    </div>
  );
}
