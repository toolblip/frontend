"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminPlanActions from "@/components/admin/AdminPlanActions";
import AdminSupportActions from "@/components/admin/AdminSupportActions";
import {
  formatAdminDate,
  planLabel,
  verificationLabel,
  type AdminUser,
} from "@/lib/adminUsers";

function Field({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/50">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p data-testid={testId} className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function UserRecord() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [user, setUser] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setStatus("loading");
    fetch(`/api/admin/users/${id}`, { credentials: "include", headers: { Accept: "application/json" } })
      .then(async (res) => {
        if (res.status === 404) return { notfound: true } as const;
        if (!res.ok) throw new Error("load failed");
        return { data: (await res.json()).data as AdminUser } as const;
      })
      .then((result) => {
        if (cancelled) return;
        if ("notfound" in result) {
          setStatus("notfound");
          return;
        }
        setUser(result.data ?? null);
        setStatus(result.data ? "ready" : "notfound");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/admin/users" className="text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        ← Back to users
      </Link>

      {status === "loading" ? (
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Loading user...</p>
      ) : status === "notfound" ? (
        <p data-testid="admin-user-notfound" className="mt-6 text-sm text-gray-500 dark:text-gray-400">User not found.</p>
      ) : status === "error" ? (
        <p data-testid="admin-user-error" className="mt-6 text-sm text-amber-700 dark:text-amber-300">Couldn&apos;t load this user.</p>
      ) : user ? (
        <div data-testid="admin-user-record">
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Field label="User ID" value={String(user.id)} testId="record-id" />
            <Field label="Role" value={user.role} testId="record-role" />
            <Field label="Email" value={user.email} testId="record-email" />
            <Field label="Email verification" value={verificationLabel(user.email_verified_at)} testId="record-verification" />
            <Field label="Plan" value={planLabel(user.tier)} testId="record-plan" />
            <Field label="Subscription status" value={user.subscription_status ?? "—"} testId="record-status" />
            <Field label="Plan ends" value={formatAdminDate(user.plan_ends_at)} testId="record-plan-ends" />
            <Field label="Created" value={formatAdminDate(user.created_at)} testId="record-created" />
          </div>

          <AdminPlanActions user={user} onUpdated={setUser} />
          <AdminSupportActions user={user} onUpdated={setUser} />
        </div>
      ) : null}
    </div>
  );
}

export default function AdminUserRecordPage() {
  return (
    <AdminGuard>
      <UserRecord />
    </AdminGuard>
  );
}
