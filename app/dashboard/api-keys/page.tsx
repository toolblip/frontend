"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

interface ApiKey {
  id: number;
  prefix: string;
  name: string | null;
  last_five: string;
  created_at: string;
  revoked_at: string | null;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ApiKeysPage() {
  const { user, token, login, loading: authLoading } = useAuth();
  const router = useRouter();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [generating, setGenerating] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: string; id: number } | null>(null);

  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<number | null>(null);

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

  // Load keys when token is ready
  useEffect(() => {
    if (!token) return;
    loadKeys();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadKeys() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/keys", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load API keys");
      const data = await res.json();
      setKeys(Array.isArray(data) ? data : data.keys ?? []);
    } catch {
      setError("Could not load API keys. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setNewKeyData(null);
    setError("");
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate API key");
      setNewKeyData(data);
      // Refresh the list to include the new key
      await loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate API key.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke(keyId: number) {
    setRevokingId(keyId);
    setError("");
    try {
      const res = await fetch(`/api/keys/${keyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to revoke key");
      }
      setKeys((prev) => prev.filter((k) => k.id !== keyId));
      setConfirmRevokeId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke key.");
    } finally {
      setRevokingId(null);
    }
  }

  function dismissNewKeyDialog() {
    setNewKeyData(null);
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
        API Keys
      </h1>
      <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
        Manage your API keys for programmatic access to Toolblip.
      </p>

      {/* Error banner */}
      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Generate new key */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Create API key
        </h2>
        <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
          Generate a new API key to use with the Toolblip API. The full key will be shown only once.
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="mt-4 cursor-pointer rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate new API key"}
        </button>
      </div>

      {/* New key one-time dialog */}
      {newKeyData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-key-title"
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              API key created
            </p>
            <h2 id="new-key-title" className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Your new API key
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Copy this key now. You won&apos;t be able to see it again.
            </p>
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-900 break-all dark:border-gray-700 dark:bg-gray-950 dark:text-white">
              {newKeyData.key}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(newKeyData.key).catch(() => {});
                  dismissNewKeyDialog();
                }}
                className="cursor-pointer flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Copy &amp; close
              </button>
              <button
                type="button"
                onClick={dismissNewKeyDialog}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke confirmation dialog */}
      {confirmRevokeId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="revoke-key-title"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <h2 id="revoke-key-title" className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
              Revoke API key?
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              This will permanently invalidate this key. Any services using it will lose access immediately.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleRevoke(confirmRevokeId)}
                disabled={revokingId === confirmRevokeId}
                className="cursor-pointer flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {revokingId === confirmRevokeId ? "Revoking…" : "Yes, revoke key"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmRevokeId(null)}
                disabled={revokingId === confirmRevokeId}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Your API keys
          </h2>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">Loading keys…</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">No API keys yet.</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Generate one above to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800" role="list">
            {keys.map((key) => (
              <li key={key.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {key.name ?? "Unnamed key"}
                  </p>
                  <p className="mt-0.5 text-sm font-mono text-gray-500 dark:text-gray-400">
                    {key.prefix}...{key.last_five}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    Created {formatDate(key.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmRevokeId(key.id)}
                  disabled={revokingId === key.id}
                  className="shrink-0 cursor-pointer text-xs font-medium text-red-600 transition-colors hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                >
                  {revokingId === key.id ? "Revoking…" : "Revoke"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
