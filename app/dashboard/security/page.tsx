"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { stepUpFetch } from "@/lib/step-up";
import { addPasskey, deletePasskey, listPasskeys, passkeysSupported, PasskeyCancelledError, renamePasskey, suggestPasskeyName, type PasskeyItem } from "@/lib/passkeys";

export default function SecurityPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [passkeyName, setPasskeyName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [passkeyMessage, setPasskeyMessage] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [canUsePasskeys, setCanUsePasskeys] = useState(false);
  const userId = user?.id;
  const { logout } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    setCanUsePasskeys(passkeysSupported());
    setPasskeyName(suggestPasskeyName());
  }, []);

  useEffect(() => {
    if (!userId) return;
    listPasskeys().then(setPasskeys).catch(() => setPasskeyError("Could not load passkeys."));
  }, [userId]);

  async function handleAddPasskey() {
    setPasskeyMessage("");
    setPasskeyError("");
    setPasskeyBusy(true);
    try {
      await addPasskey(passkeyName);
      setPasskeys(await listPasskeys());
      setPasskeyName(suggestPasskeyName());
      setPasskeyMessage("Passkey added.");
    } catch (error) {
      if (error instanceof PasskeyCancelledError) {
        setPasskeyMessage("Passkey setup was cancelled.");
      } else {
        setPasskeyError(error instanceof Error ? error.message : "Could not add passkey.");
      }
    } finally {
      setPasskeyBusy(false);
    }
  }

  async function handleRenamePasskey(id: number) {
    setPasskeyMessage("");
    setPasskeyError("");
    try {
      const updated = await renamePasskey(id, editName);
      setPasskeys((current) => current.map((item) => (item.id === id ? { ...item, name: updated.name } : item)));
      setEditingId(null);
    } catch (error) {
      setPasskeyError(error instanceof Error ? error.message : "Could not rename passkey.");
    }
  }

  async function handleDeletePasskey(id: number) {
    setPasskeyMessage("");
    setPasskeyError("");
    try {
      await deletePasskey(id);
      setPasskeys((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setPasskeyError(error instanceof Error ? error.message : "Could not delete passkey.");
    }
  }

  async function handleDeleteAccount() {
    setDeleteError("");
    setDeleteBusy(true);
    try {
      const res = await stepUpFetch("/api/auth/account", {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: deleteConfirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not delete your account.");
      await logout();
      // Hard navigation: a soft one races useRequireAuth's redirect to /login once user is null.
      window.location.replace("/");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Could not delete your account.");
      setDeleteBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white";
  const smallButtonClass =
    "cursor-pointer rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";

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
        Manage how you sign in to Toolblip.
      </p>

      {/* Passkeys */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Passkeys
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in with your device&apos;s fingerprint, face, or screen lock. Add more than one, for example one per device.
        </p>
        {passkeyMessage && (
          <p role="status" className="mt-4 text-sm text-green-600 dark:text-green-400">
            {passkeyMessage}
          </p>
        )}
        {passkeyError && (
          <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
            {passkeyError}
          </p>
        )}
        {passkeys.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
            {passkeys.map((passkey) => (
              <li key={passkey.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                {editingId === passkey.id ? (
                  <form
                    className="flex w-full flex-col gap-2 sm:flex-row"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleRenamePasskey(passkey.id);
                    }}
                  >
                    <input
                      type="text"
                      aria-label="Passkey name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={60}
                      required
                      className={inputClass}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className={smallButtonClass}>Save</button>
                      <button type="button" onClick={() => setEditingId(null)} className={smallButtonClass}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{passkey.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added {new Date(passkey.created_at).toLocaleDateString()}
                        {passkey.last_used_at ? ` · Last used ${new Date(passkey.last_used_at).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(passkey.id);
                          setEditName(passkey.name);
                        }}
                        className={smallButtonClass}
                      >
                        Rename
                      </button>
                      <button type="button" onClick={() => handleDeletePasskey(passkey.id)} className={smallButtonClass}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {canUsePasskeys && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              aria-label="New passkey name"
              value={passkeyName}
              onChange={(e) => setPasskeyName(e.target.value)}
              placeholder="Name, e.g. Work laptop"
              maxLength={60}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleAddPasskey}
              disabled={passkeyBusy}
              className="cursor-pointer whitespace-nowrap rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passkeyBusy ? "Waiting for passkey..." : "Add passkey"}
            </button>
          </div>
        )}
      </div>

      {/* Delete account */}
      <div data-testid="danger-zone" className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        {deleteOpen ? (
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleDeleteAccount();
            }}
          >
            <label htmlFor="delete-confirm" className="block text-sm text-gray-700 dark:text-gray-300">
              Type <span className="font-mono font-semibold">DELETE</span> to confirm
            </label>
            <input
              id="delete-confirm"
              type="text"
              autoComplete="off"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className={`mt-1 max-w-xs ${inputClass}`}
            />
            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
                {deleteError}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={deleteBusy || deleteConfirm !== "DELETE"}
                className="cursor-pointer rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteBusy ? "Deleting..." : "Delete my account"}
              </button>
              <button
                type="button"
                disabled={deleteBusy}
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteConfirm("");
                  setDeleteError("");
                }}
                className={smallButtonClass}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-4 cursor-pointer rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Delete account
          </button>
        )}
      </div>
    </div>
  );
}
