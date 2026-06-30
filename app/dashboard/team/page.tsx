"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

interface TeamMember {
  id: number;
  team_id: number;
  user_id: number | null;
  name: string | null;
  email: string;
  avatar_url: string | null;
  role: "admin" | "member";
  status: "active" | "pending";
  invited_email: string | null;
  is_owner: boolean;
}

interface Team {
  id: number;
  name: string;
  owner_id: number;
  invite_code: string | null;
}

interface TeamData {
  team: Team;
  members: TeamMember[];
  is_owner: boolean;
  is_admin: boolean;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://toolblip.com";

export default function TeamPage() {
  const { user, token, login, loading: authLoading } = useAuth();
  const router = useRouter();

  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inline name edit
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Invite member
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  // Remove member
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Invite code
  const [copiedCode, setCopiedCode] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

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

  useEffect(() => {
    if (!token) return;
    loadTeam();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadTeam() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/team", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load team");
      const data: TeamData = await res.json();
      setTeamData(data);
      setNameValue(data.team.name);
    } catch {
      setError("Could not load team. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function startEditingName() {
    setEditingName(true);
    setNameError("");
    setTimeout(() => nameInputRef.current?.focus(), 0);
  }

  async function saveName() {
    if (!teamData || !nameValue.trim()) return;
    setSavingName(true);
    setNameError("");
    try {
      const res = await fetch("/api/team", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      setTeamData((prev) => prev ? { ...prev, team: data.team } : prev);
      setEditingName(false);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Failed to save name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError("");
    setInviteSuccess("");
    try {
      const res = await fetch("/api/team/members", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to invite member");
      setTeamData((prev) =>
        prev ? { ...prev, members: [...prev.members, data.member] } : prev
      );
      setInviteEmail("");
      setInviteSuccess(
        data.member.status === "pending"
          ? `Invitation sent to ${data.member.email}.`
          : `${data.member.name || data.member.email} added to the team.`
      );
      setTimeout(() => setInviteSuccess(""), 4000);
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Failed to invite member.");
    } finally {
      setInviting(false);
    }
  }

  async function removeMember(memberId: number) {
    setRemovingId(memberId);
    try {
      const res = await fetch(`/api/team/members/${memberId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to remove member");
      }
      setTeamData((prev) =>
        prev ? { ...prev, members: prev.members.filter((m) => m.id !== memberId) } : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove member.");
    } finally {
      setRemovingId(null);
    }
  }

  async function copyInviteLink() {
    const code = teamData?.team.invite_code;
    if (!code) return;
    const link = `${APP_URL}/dashboard/team/join?code=${code}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const el = document.createElement("textarea");
      el.value = link;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      try { document.execCommand("copy"); } catch { /* best-effort */ }
      document.body.removeChild(el);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  async function regenerateInviteCode() {
    setRegenerating(true);
    try {
      const res = await fetch("/api/team/invite-code", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to regenerate");
      setTeamData((prev) =>
        prev ? { ...prev, team: { ...prev.team, invite_code: data.invite_code } } : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to regenerate invite code.");
    } finally {
      setRegenerating(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Loading team...</p>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">{error || "Something went wrong."}</p>
        <button
          onClick={loadTeam}
          className="mt-3 text-sm text-gray-500 underline hover:text-gray-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { team, members, is_admin } = teamData;
  const activeMembers = members.filter((m) => m.status === "active");
  const pendingMembers = members.filter((m) => m.status === "pending");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Team name */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Team name</h2>
        <div className="mt-2 flex items-center gap-3">
          {editingName ? (
            <>
              <input
                ref={nameInputRef}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") { setEditingName(false); setNameValue(team.name); }
                }}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-lg font-semibold text-gray-900 focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                maxLength={100}
              />
              <button
                onClick={saveName}
                disabled={savingName || !nameValue.trim()}
                className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                {savingName ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => { setEditingName(false); setNameValue(team.name); }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</span>
              {is_admin && (
                <button
                  onClick={startEditingName}
                  className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
        {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
      </div>

      {/* Members */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Members ({activeMembers.length})
        </h2>
        <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-700">
          {activeMembers.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {(member.name ?? member.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {member.name ?? member.email}
                  </p>
                  {member.name && (
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {member.is_owner && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Owner
                  </span>
                )}
                {!member.is_owner && member.role === "admin" && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                    Admin
                  </span>
                )}
                {!member.is_owner && member.role === "member" && (
                  <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    Member
                  </span>
                )}
                {is_admin && !member.is_owner && member.user_id !== user.id && (
                  <button
                    onClick={() => removeMember(member.id)}
                    disabled={removingId === member.id}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    {removingId === member.id ? "Removing…" : "Remove"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {pendingMembers.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Pending invitations ({pendingMembers.length})
            </h3>
            <ul className="mt-2 divide-y divide-gray-100 rounded-xl border border-dashed border-gray-200 dark:divide-gray-800 dark:border-gray-700">
              {pendingMembers.map((member) => (
                <li key={member.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-400 dark:bg-gray-800">
                      ?
                    </div>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
                      Pending
                    </span>
                    {is_admin && (
                      <button
                        onClick={() => removeMember(member.id)}
                        disabled={removingId === member.id}
                        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {removingId === member.id ? "Removing…" : "Cancel"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Invite member */}
      {is_admin && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Invite member</h2>
          <form onSubmit={handleInvite} className="mt-3 flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              required
            />
            <button
              type="submit"
              disabled={inviting || !inviteEmail.trim()}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              {inviting ? "Sending…" : "Invite"}
            </button>
          </form>
          {inviteError && <p className="mt-2 text-sm text-red-500">{inviteError}</p>}
          {inviteSuccess && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{inviteSuccess}</p>}
        </div>
      )}

      {/* Invite link */}
      {is_admin && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Invite link</h2>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Share this link so teammates can join directly.
          </p>
          {team.invite_code ? (
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                {`${APP_URL}/dashboard/team/join?code=${team.invite_code}`}
              </code>
              <button
                onClick={copyInviteLink}
                className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              >
                {copiedCode ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={regenerateInviteCode}
                disabled={regenerating}
                className="shrink-0 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50 dark:hover:text-gray-300"
              >
                {regenerating ? "…" : "Regenerate"}
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <button
                onClick={regenerateInviteCode}
                disabled={regenerating}
                className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 transition hover:border-gray-400 hover:text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300"
              >
                {regenerating ? "Generating…" : "Generate invite link"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="pt-2">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
