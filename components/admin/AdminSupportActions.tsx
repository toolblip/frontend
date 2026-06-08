"use client";

import { useState } from "react";
import { formatAdminDate, verificationLabel, type AdminUser } from "@/lib/adminUsers";

type SupportNote = { id: number; note: string; admin_email?: string; created_at?: string };

type SupportAudit = {
  admin_email?: string;
  target_user_email?: string;
  action?: string;
  note?: string | null;
  message?: string | null;
  timestamp?: string;
};

export default function AdminSupportActions({
  user,
  onUpdated,
}: {
  user: AdminUser;
  onUpdated: (user: AdminUser) => void;
}) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<SupportNote[]>([]);
  const [result, setResult] = useState<SupportAudit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"" | "note" | "resend">("");

  const verified = Boolean(user.email_verified_at);

  async function submit(action: "note" | "resend_verification") {
    setError(null);
    setBusy(action === "note" ? "note" : "resend");
    try {
      const payload =
        action === "note" ? { action, note: note.trim() } : { action };
      const res = await fetch(`/api/admin/users/${user.id}/support`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Support action failed.");
      if (data.data) onUpdated(data.data as AdminUser);
      if (Array.isArray(data.notes)) setNotes(data.notes as SupportNote[]);
      setResult((data.audit ?? null) as SupportAudit | null);
      if (action === "note") setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Support action failed.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section
      data-testid="admin-support-actions"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Support</h2>

      {/* Support context */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
        <span>
          Email verification:{" "}
          <span data-testid="support-verification" className="font-medium text-gray-900 dark:text-white">
            {verificationLabel(user.email_verified_at)}
          </span>
        </span>
        <span>
          Favorites saved:{" "}
          <span data-testid="support-favorites-count" className="font-medium text-gray-900 dark:text-white">
            {user.favorites_count ?? 0}
          </span>
        </span>
      </div>

      {/* Safe backend-backed action */}
      <div className="mt-4">
        <button
          type="button"
          data-testid="support-resend-verification"
          onClick={() => submit("resend_verification")}
          disabled={verified || busy === "resend"}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          {verified ? "Email already verified" : busy === "resend" ? "Sending..." : "Resend verification email"}
        </button>
      </div>

      {/* Internal support note */}
      <div className="mt-5">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Internal support note</span>
          <textarea
            data-testid="support-note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Add an internal note or support reason"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </label>
        <button
          type="button"
          data-testid="support-note-save"
          onClick={() => submit("note")}
          disabled={!note.trim() || busy === "note"}
          className="mt-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {busy === "note" ? "Saving..." : "Save note"}
        </button>
      </div>

      {notes.length > 0 && (
        <ul className="mt-4 space-y-2" data-testid="support-notes">
          {notes.map((n) => (
            <li
              key={n.id}
              data-testid="support-note-item"
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-950/50"
            >
              <p className="text-gray-900 dark:text-white">{n.note}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {n.admin_email ? `${n.admin_email} · ` : ""}
                {formatAdminDate(n.created_at ?? null)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {error && <p data-testid="support-action-error" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {result && (
        <div
          data-testid="support-action-result"
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/30"
        >
          <p className="font-medium text-emerald-800 dark:text-emerald-200">
            {result.message ?? (result.action === "note" ? "Note recorded" : "Done")}
          </p>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
            {result.action} · by {result.admin_email} · {formatAdminDate(result.timestamp ?? null)}
          </p>
        </div>
      )}
    </section>
  );
}
