"use client";

import { useState } from "react";
import {
  PLAN_TIERS,
  formatAdminDate,
  planChangeLabel,
  planLabel,
  type AdminUser,
  type PlanTier,
} from "@/lib/adminUsers";

type AdminPlanAudit = {
  admin_email?: string;
  action?: string;
  previous_plan?: string;
  new_plan?: string;
  previous_status?: string | null;
  new_status?: string | null;
  effective_date?: string | null;
  reason?: string | null;
  reference_id?: string | null;
  timestamp?: string;
};

type PendingAction =
  | { type: "set"; tier: PlanTier; label: "Upgrade" | "Downgrade" | "Change" }
  | { type: "cancel" };

export default function AdminPlanActions({
  user,
  onUpdated,
}: {
  user: AdminUser;
  onUpdated: (user: AdminUser) => void;
}) {
  const [targetTier, setTargetTier] = useState<PlanTier>((user.tier as PlanTier) ?? "free");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdminPlanAudit | null>(null);

  const isCancelled = user.subscription_status === "canceled";
  const canCancel = Boolean(user.tier && user.tier !== "free" && user.subscription_status === "active");

  function openSet() {
    setError(null);
    setPending({ type: "set", tier: targetTier, label: planChangeLabel(user.tier, targetTier) });
  }

  function openCancel() {
    if (!canCancel) return;
    setError(null);
    setPending({ type: "cancel" });
  }

  function close() {
    setPending(null);
    setReason("");
  }

  async function confirm() {
    if (!pending) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload =
        pending.type === "set"
          ? { action: "set", tier: pending.tier, reason: reason.trim() || null }
          : { action: "cancel", reason: reason.trim() || null };
      const res = await fetch(`/api/admin/users/${user.id}/plan`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Plan update failed.");
      if (data.data) onUpdated(data.data as AdminUser);
      setResult((data.audit ?? null) as AdminPlanAudit | null);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Plan update failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      data-testid="admin-plan-actions"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Plan actions</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Current plan: <span className="font-medium text-gray-900 dark:text-white">{planLabel(user.tier)}</span>
        {user.subscription_status ? ` · ${user.subscription_status}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Set plan</span>
          <select
            data-testid="plan-target-select"
            value={targetTier}
            onChange={(e) => setTargetTier(e.target.value as PlanTier)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          >
            {PLAN_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {planLabel(tier)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          data-testid="apply-plan-change"
          onClick={openSet}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Apply plan change
        </button>
        <button
          type="button"
          data-testid="cancel-plan-action"
          onClick={openCancel}
          disabled={!canCancel || isCancelled}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          {isCancelled ? "Cancellation scheduled" : canCancel ? "Cancel plan" : "No active subscription"}
        </button>
      </div>

      {result && (
        <div
          data-testid="plan-action-result"
          className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm dark:border-emerald-900/50 dark:bg-emerald-950/30"
        >
          <p className="font-medium text-emerald-800 dark:text-emerald-200">Plan updated</p>
          <dl className="mt-2 grid gap-x-6 gap-y-1 text-emerald-900 dark:text-emerald-200 sm:grid-cols-2">
            <div><dt className="inline text-emerald-700 dark:text-emerald-300">Action:</dt> {result.action}</div>
            <div><dt className="inline text-emerald-700 dark:text-emerald-300">Plan:</dt> {planLabel(result.previous_plan ?? null)} → {planLabel(result.new_plan ?? null)}</div>
            <div><dt className="inline text-emerald-700 dark:text-emerald-300">Status:</dt> {result.previous_status ?? "—"} → {result.new_status ?? "—"}</div>
            <div><dt className="inline text-emerald-700 dark:text-emerald-300">Effective:</dt> {result.action === "cancel" ? formatAdminDate(result.effective_date ?? null) : "Immediately"}</div>
            {result.reference_id && <div><dt className="inline text-emerald-700 dark:text-emerald-300">Reference:</dt> {result.reference_id}</div>}
            {result.reason && <div><dt className="inline text-emerald-700 dark:text-emerald-300">Reason:</dt> {result.reason}</div>}
          </dl>
        </div>
      )}

      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm plan action"
            data-testid="plan-confirm-dialog"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {pending.type === "cancel" ? "Cancel plan" : `${pending.label} plan`}
            </h3>
            <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p>User: <span className="font-medium text-gray-900 dark:text-white">{user.name}</span> ({user.email})</p>
              <p>Current plan: <span className="font-medium">{planLabel(user.tier)}</span></p>
              {pending.type === "set" ? (
                <>
                  <p>Requested action: <span className="font-medium">{pending.label}</span></p>
                  <p>Target plan: <span className="font-medium">{planLabel(pending.tier)}</span></p>
                  <p>Effective: <span className="font-medium">Immediately</span></p>
                </>
              ) : (
                <>
                  <p>Requested action: <span className="font-medium">Cancel subscription</span></p>
                  <p>
                    Effective:{" "}
                    <span className="font-medium">
                      {user.plan_ends_at ? `access until ${formatAdminDate(user.plan_ends_at)}` : "end of billing period"}
                    </span>
                  </p>
                </>
              )}
            </div>

            <label className="mt-4 block text-sm">
              <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Reason / support note (optional)</span>
              <textarea
                data-testid="plan-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            {error && (
              <p data-testid="plan-action-error" className="mt-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                data-testid="plan-confirm-cancel"
                onClick={close}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                Back
              </button>
              <button
                type="button"
                data-testid="plan-confirm-submit"
                onClick={confirm}
                disabled={submitting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {submitting ? "Applying..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
