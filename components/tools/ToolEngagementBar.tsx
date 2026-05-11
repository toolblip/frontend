"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";

type EngagementStats = {
  slug: string;
  views: number;
  shares: number;
  favorites: number;
  viewer_favorited: boolean;
};

type ToolEngagementBarProps = {
  toolName: string;
  toolSlug: string;
};

const fallbackStats = (slug: string): EngagementStats => ({
  slug,
  views: 0,
  shares: 0,
  favorites: 0,
  viewer_favorited: false,
});

function copyTextFallback(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en", { notation: value >= 10000 ? "compact" : "standard" }).format(value);
}

export default function ToolEngagementBar({ toolName, toolSlug }: ToolEngagementBarProps) {
  const { user, login } = useAuth();
  const [stats, setStats] = useState<EngagementStats>(() => fallbackStats(toolSlug));
  const [shareOpen, setShareOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState(`https://toolblip.com/tools/${toolSlug}`);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const shareLinks = useMemo(() => {
    const encodedText = `Check out ${toolName} on Toolblip`;
    return [
      {
        label: "Share on Twitter",
        href: `https://twitter.com/intent/tweet?${new URLSearchParams({ text: encodedText, url: pageUrl }).toString()}`,
      },
      {
        label: "Share on LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: pageUrl }).toString()}`,
      },
      {
        label: "Share on Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: pageUrl }).toString()}`,
      },
    ];
  }, [pageUrl, toolName]);

  async function refreshStats() {
    const res = await fetch(`/api/tools/${toolSlug}/engagement`, { credentials: "include", cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setStats(data.data ?? fallbackStats(toolSlug));
  }

  async function recordViewOnce() {
    const key = `toolblip:viewed:${toolSlug}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    const res = await fetch(`/api/tools/${toolSlug}/view`, { method: "POST", credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setStats(data.data ?? fallbackStats(toolSlug));
  }

  useEffect(() => {
    refreshStats();
    recordViewOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolSlug]);

  useEffect(() => {
    refreshStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function recordShare(channel: string) {
    const res = await fetch(`/api/tools/${toolSlug}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify({ channel }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setStats(data.data ?? fallbackStats(toolSlug));
  }

  async function copyLink() {
    const url = window.location.href || pageUrl;
    setPageUrl(url);

    await recordShare("copy");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (!copyTextFallback(url)) {
        throw new Error("Clipboard fallback failed");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function toggleFavorite() {
    if (!user) {
      setLoginOpen(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const res = await fetch(`/api/tools/${toolSlug}/favorite`, {
        method: stats.viewer_favorited ? "DELETE" : "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok) setStats(data.data ?? fallbackStats(toolSlug));
      else if (res.status === 401) setLoginOpen(true);
    } finally {
      setFavoriteLoading(false);
    }
  }

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.token) {
        setLoginError(data.message ?? "Invalid email or password.");
        return;
      }

      login(data.user, data.token);
      const favoriteRes = await fetch(`/api/tools/${toolSlug}/favorite`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const favoriteData = await favoriteRes.json();
      if (favoriteRes.ok) {
        setStats(favoriteData.data ?? fallbackStats(toolSlug));
        setLoginOpen(false);
        setEmail("");
        setPassword("");
      } else {
        setLoginError(favoriteData.message ?? "Signed in, but could not favorite this tool.");
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  const favoriteLabel = stats.viewer_favorited ? `Favorited ${toolName}` : `Favorite ${toolName}`;

  return (
    <div className="relative flex flex-wrap items-center gap-2" aria-label={`${toolName} engagement stats`}>
      <button
        type="button"
        onClick={() => setShareOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:border-red-900 dark:hover:text-red-400"
        aria-label={`Share ${toolName}`}
        aria-haspopup="dialog"
        aria-expanded={shareOpen}
      >
        <span aria-hidden="true">↗</span>
        Share
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">Shares {formatCount(stats.shares)}</span>
      </button>

      <button
        type="button"
        onClick={toggleFavorite}
        disabled={favoriteLoading}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-200 hover:text-red-600 disabled:opacity-60 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:border-red-900 dark:hover:text-red-400"
        aria-label={favoriteLabel}
      >
        <span aria-hidden="true">{stats.viewer_favorited ? "♥" : "♡"}</span>
        {stats.viewer_favorited ? "Favorited" : "Favorite"}
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">Favorites {formatCount(stats.favorites)}</span>
      </button>

      <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
        <span aria-hidden="true">👁</span>
        Views {formatCount(stats.views)}
      </span>

      {shareOpen && (
        <div
          role="dialog"
          aria-label={`Share ${toolName}`}
          className="absolute left-0 top-12 z-20 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Share this tool</h2>
            <button
              type="button"
              onClick={() => setShareOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              aria-label="Close share dialog"
            >
              ×
            </button>
          </div>
          <div className="grid gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void recordShare(link.label.toLowerCase().replace(/\s+/g, "-"))}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:text-gray-200 dark:hover:border-red-900 dark:hover:text-red-400"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={copyLink}
              className="rounded-xl border border-gray-200 px-3 py-2 text-left text-sm text-gray-700 transition hover:border-red-200 hover:text-red-600 dark:border-gray-800 dark:text-gray-200 dark:hover:border-red-900 dark:hover:text-red-400"
              aria-label="Copy link"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}

      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Sign in to favorite ${toolName}`}
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to favorite</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Log in and we’ll automatically add {toolName} to your favorites.</p>
              </div>
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="text-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Close login dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              {loginError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{loginError}</p>}
              <div>
                <label htmlFor="favorite-login-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input
                  id="favorite-login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="favorite-login-password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                <input
                  id="favorite-login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {loginLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account? <Link href="/signup" className="font-semibold text-red-600 hover:text-red-700 dark:text-red-400">Sign up</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
