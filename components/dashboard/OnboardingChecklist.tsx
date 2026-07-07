"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "browse_tools", label: "Browse tools", description: "Explore 1,500+ developer tools", href: "/tools" },
  { id: "favorite_tool", label: "Favorite a tool", description: "Save tools for quick access", href: "/tools" },
  { id: "explore_plans", label: "Explore plans", description: "Compare features and pricing", href: "/dashboard/subscription" },
  { id: "api_keys", label: "Set up API keys", description: "Access tools programmatically", href: "/dashboard/api-keys" },
  { id: "invite_team", label: "Invite team members", description: "Collaborate with your team", href: "/dashboard/team" },
];

interface ChecklistState {
  completed: string[];
  dismissed: boolean;
}

function checklistStorageKey(userId: number | string) {
  return `toolblip_checklist_${userId}`;
}

function readChecklistState(userId: number | string): ChecklistState {
  try {
    const stored = window.localStorage.getItem(checklistStorageKey(userId));
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        dismissed: Boolean(parsed.dismissed),
      };
    }
  } catch {
    // localStorage may be unavailable
  }
  return { completed: [], dismissed: false };
}

function writeChecklistState(userId: number | string, state: ChecklistState) {
  try {
    window.localStorage.setItem(checklistStorageKey(userId), JSON.stringify(state));
  } catch {
    // localStorage may be unavailable
  }
}

interface OnboardingChecklistProps {
  userId: number | string;
  hasFavorites: boolean;
  onDismiss: () => void;
}

export function OnboardingChecklist({ userId, hasFavorites, onDismiss }: OnboardingChecklistProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const state = readChecklistState(userId);
    setCompleted(state.completed);
  }, [userId]);

  useEffect(() => {
    if (!hasFavorites || completed.includes("favorite_tool")) return;
    setCompleted((prev) => {
      const next = [...prev, "favorite_tool"];
      writeChecklistState(userId, { completed: next, dismissed: false });
      return next;
    });
  }, [hasFavorites, completed, userId]);

  function markComplete(id: string) {
    if (completed.includes(id)) return;
    const next = [...completed, id];
    setCompleted(next);
    writeChecklistState(userId, { completed: next, dismissed: false });
  }

  function dismiss() {
    writeChecklistState(userId, { completed, dismissed: true });
    onDismiss();
  }

  const progress = Math.round((completed.length / CHECKLIST_ITEMS.length) * 100);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Get started with Toolblip</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Complete these steps to get the most out of Toolblip
          </p>
        </div>
        <div className="mt-1 h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-red-600 transition-all dark:bg-red-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="mt-4 space-y-1">
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = completed.includes(item.id);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => markComplete(item.id)}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isDone && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.415l-7.005 7a1 1 0 01-1.414 0l-3.005-3a1 1 0 111.415-1.415l2.297 2.298 6.298-6.298a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-medium ${
                      isDone
                        ? "text-gray-400 line-through dark:text-gray-600"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`block text-xs ${
                      isDone ? "text-gray-300 line-through dark:text-gray-700" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex justify-end">
        <button
          onClick={dismiss}
          className="text-sm text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}

export default OnboardingChecklist;
