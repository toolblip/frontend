"use client";

import React from "react";

interface Invoice {
  id: string;
  number: string | null;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  period_start: number;
  period_end: number;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  open: "Open",
  uncollectible: "Uncollectible",
  void: "Void",
  draft: "Draft",
};

const STATUS_COLORS: Record<string, string> = {
  paid: "text-emerald-600 dark:text-emerald-400",
  open: "text-amber-600 dark:text-amber-400",
  uncollectible: "text-red-600 dark:text-red-400",
  void: "text-gray-400 dark:text-gray-500",
  draft: "text-gray-500 dark:text-gray-400",
};

const cardClasses =
  "overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80";

export function InvoicesSection() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/subscription/invoices", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load invoices");
        const data = await res.json();
        if (cancelled) return;
        setInvoices(data.invoices ?? []);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className={cardClasses}>
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Invoices</p>

        {loading ? (
          <p className="mt-3 text-sm text-gray-500">Loading invoices...</p>
        ) : error ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            Could not load invoices.
          </p>
        ) : invoices.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
            No invoices yet.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatDate(inv.created)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {formatCurrency(inv.amount_paid > 0 ? inv.amount_paid : inv.amount_due, inv.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${STATUS_COLORS[inv.status] ?? "text-gray-500"}`}>
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.invoice_pdf ? (
                        <a
                          href={inv.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
