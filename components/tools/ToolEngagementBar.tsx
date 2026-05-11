"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "@/app/providers/auth-provider";

type EngagementStats = {
  slug: string;
  views: number;
  shares: number;
  favorites: number;
  viewer_favorited: boolean;
  viewer_favorited_at?: string | null;
};

type ToolEngagementBarProps = {
  toolName: string;
  toolSlug: string;
  toolIcon?: string;
};

type IconProps = { className?: string };

type ShareChannel = {
  label: string;
  channel: string;
  url: string;
  icon: ReactNode;
};

const fallbackStats = (slug: string): EngagementStats => ({
  slug,
  views: 0,
  shares: 0,
  favorites: 0,
  viewer_favorited: false,
  viewer_favorited_at: null,
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

function formatFavoriteDate(value?: string | null) {
  if (!value) return "Favorited";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Favorited";

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return "Favorited today";

  return `Favorited on ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date)}`;
}

function ShareIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.6 13.6 15.4 17M15.4 7 8.6 10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="5.5" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="18.5" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function HeartIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7.2-4.4-9.5-9.1C.7 8.2 2.7 4 6.8 4c2 0 3.7 1.1 5.2 3 1.5-1.9 3.2-3 5.2-3 4.1 0 6.1 4.2 4.3 7.9C19.2 16.6 12 21 12 21Z" />
    </svg>
  );
}

function HeartOutlineIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20.2s-7-4.2-9.1-8.6C1.4 8.5 3 5 6.6 5c2 0 3.8 1.3 5.4 3.5C13.6 6.3 15.4 5 17.4 5c3.6 0 5.2 3.5 3.7 6.6C19 16 12 20.2 12 20.2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function BrandBadge({ children, className = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-sm ring-1 ring-black/5 ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3.5 8.2 2.7 2.7 6.3-6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CountPill({
  label,
  value,
  testId,
  className = "",
  onClick,
  disabled = false,
}: {
  label: string;
  value: number;
  testId: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const sharedClassName = `inline-flex min-w-10 items-center justify-center border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 ${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        data-testid={testId}
        className={`${sharedClassName} transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400`}
        aria-label={`${label} ${formatCount(value)}`}
        onClick={onClick}
        disabled={disabled}
      >
        {formatCount(value)}
      </button>
    );
  }

  return (
    <span
      data-testid={testId}
      className={sharedClassName}
      aria-label={`${label} ${formatCount(value)}`}
    >
      {formatCount(value)}
    </span>
  );
}

function SharePopover({ toolName, toolIcon = "🧰", channels, copied, onShare, onCopy, onClose }: { toolName: string; toolIcon?: string; channels: ShareChannel[]; copied: boolean; onShare: (channel: string) => void; onCopy: () => void; onClose: () => void }) {
  function openShareWindow(link: ShareChannel) {
    window.open(link.url, "_blank", "noopener,noreferrer");
    onShare(link.channel);
  }

  return (
    <div
      role="dialog"
      aria-label={`Share ${toolName}`}
      className="absolute left-0 top-14 z-20 w-[min(92vw,24rem)] overflow-hidden rounded-[1.7rem] border border-gray-200/80 bg-white shadow-2xl shadow-gray-900/12 ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-950 dark:shadow-black/40"
    >
      <div className="relative border-b border-gray-100 bg-gradient-to-br from-gray-50 via-white to-red-50/60 p-5 dark:border-gray-800 dark:from-gray-900 dark:via-gray-950 dark:to-red-950/20">
        <div className="absolute right-4 top-4">
          <button type="button" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-gray-400 transition hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-white" aria-label="Close share dialog">
            ×
          </button>
        </div>
        <div className="flex items-center gap-3 pr-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800" aria-hidden="true">
            {toolIcon}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">Share tool</p>
            <h2 className="mt-1 text-base font-bold text-gray-950 dark:text-white">{toolName}</h2>
          </div>
        </div>
      </div>
      <div className="grid gap-2 p-3">
        {channels.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => openShareWindow(link)}
            aria-label={link.label}
            className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-gray-50 px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900/70 dark:hover:border-gray-700 dark:hover:bg-gray-900"
          >
            {link.icon}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-gray-900 dark:text-white">{link.label.replace("Share on ", "")}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Open a ready-to-post share window</span>
            </span>
            <ArrowIcon className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
          </button>
        ))}
        <button
          type="button"
          onClick={onCopy}
          className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-gray-50 px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900/70 dark:hover:border-gray-700 dark:hover:bg-gray-900"
          aria-label="Copy link"
        >
          <BrandBadge className={copied ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"}>{copied ? <CheckIcon /> : "⛓"}</BrandBadge>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-gray-900 dark:text-white">{copied ? "Copied!" : "Copy link"}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">Paste the Toolblip URL anywhere</span>
          </span>
          <ArrowIcon className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
        </button>
      </div>
    </div>
  );
}

export default function ToolEngagementBar({ toolName, toolSlug, toolIcon = "🧰" }: ToolEngagementBarProps) {
  const { user, login, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<EngagementStats>(() => fallbackStats(toolSlug));
  const viewRecordedRef = useRef(false);
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

  const registerHref = `/signup?next=${encodeURIComponent(`/tools/${toolSlug}`)}`;

  const shareLinks = useMemo<ShareChannel[]>(() => {
    const text = `Check out ${toolName} on Toolblip`;
    return [
      {
        label: "Share on Facebook",
        channel: "facebook",
        url: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: pageUrl }).toString()}`,
        icon: <BrandBadge className="bg-[#1877F2] text-white">f</BrandBadge>,
      },
      {
        label: "Share on X",
        channel: "x",
        url: `https://x.com/intent/tweet?${new URLSearchParams({ text, url: pageUrl }).toString()}`,
        icon: <BrandBadge className="bg-black text-white dark:bg-white dark:text-black">𝕏</BrandBadge>,
      },
      {
        label: "Share on LinkedIn",
        channel: "linkedin",
        url: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: pageUrl }).toString()}`,
        icon: <BrandBadge className="bg-[#0A66C2] text-white">in</BrandBadge>,
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
    if (viewRecordedRef.current) return;
    viewRecordedRef.current = true;
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
    setStats((current) => ({ ...current, shares: current.shares + 1 }));

    const res = await fetch(`/api/tools/${toolSlug}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      keepalive: true,
      body: JSON.stringify({ channel }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setStats(data.data ?? fallbackStats(toolSlug));
  }

  async function copyLink() {
    const url = window.location.href || pageUrl;
    setPageUrl(url);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (!copyTextFallback(url)) {
        throw new Error("Clipboard fallback failed");
      }
    } catch {
      if (!copyTextFallback(url)) {
        return;
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    void recordShare("copy");
  }

  async function toggleFavorite() {
    setShareOpen(false);

    if (authLoading) {
      return;
    }

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

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
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

  const favoriteText = authLoading ? "Checking..." : stats.viewer_favorited ? formatFavoriteDate(stats.viewer_favorited_at) : "Favorite";
  const favoriteLabel = authLoading ? `Checking sign-in status for ${toolName}` : stats.viewer_favorited ? `${favoriteText} ${toolName}` : `Favorite ${toolName}`;
  const favoriteDisabled = favoriteLoading || authLoading;

  function toggleSharePopover() {
    setLoginOpen(false);
    setShareOpen((open) => !open);
  }

  return (
    <div data-testid="tool-engagement-bar" className="relative flex w-full flex-wrap items-center gap-3" aria-label={`${toolName} engagement stats`}>
      <div className="relative flex items-stretch gap-0">
        <button
          data-testid="tool-share-button"
          type="button"
          onClick={toggleSharePopover}
          className="inline-flex items-center gap-2 rounded-l-full border border-r-0 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          aria-label={`Share ${toolName}`}
          aria-haspopup="dialog"
          aria-expanded={shareOpen}
        >
          <ShareIcon className="h-5 w-5" />
          Share
        </button>
        <CountPill label="Shares" value={stats.shares} testId="tool-share-count" className="rounded-r-full" onClick={toggleSharePopover} />

        {shareOpen && <SharePopover toolName={toolName} toolIcon={toolIcon} channels={shareLinks} copied={copied} onShare={(channel) => void recordShare(channel)} onCopy={copyLink} onClose={() => setShareOpen(false)} />}
      </div>

      <span
        data-testid="tool-view-count"
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
        aria-label={`Views ${formatCount(stats.views)}`}
      >
        <EyeIcon className="h-5 w-5" />
        <span>Views</span>
        <span>{formatCount(stats.views)}</span>
      </span>

      <div className="ml-auto flex items-stretch gap-0">
        <button
          data-testid="tool-favorite-button"
          type="button"
          onClick={toggleFavorite}
          disabled={favoriteDisabled}
          className={`inline-flex items-center gap-2 rounded-l-full border border-r-0 px-4 py-2 text-sm font-bold shadow-sm transition disabled:opacity-60 ${
            stats.viewer_favorited
              ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
              : "border-gray-200 bg-white text-gray-800 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          }`}
          aria-label={favoriteLabel}
        >
          {stats.viewer_favorited ? <HeartIcon className="h-6 w-6" /> : <HeartOutlineIcon className="h-6 w-6" />}
          {favoriteText}
        </button>
        <CountPill
          label="Favorites"
          value={stats.favorites}
          testId="tool-favorite-count"
          className={`rounded-r-full ${stats.viewer_favorited ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200" : ""}`}
          onClick={() => void toggleFavorite()}
          disabled={favoriteDisabled}
        />
      </div>

      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Sign in to favorite ${toolName}`}
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sign in to favorite</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Log in and we’ll add {toolName} to your favorites.</p>
              </div>
              <button type="button" onClick={() => setLoginOpen(false)} className="text-xl leading-none text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" aria-label="Close login dialog">
                ×
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3" noValidate>
              {loginError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{loginError}</p>}
              <div>
                <label htmlFor="favorite-login-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input id="favorite-login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="favorite-login-password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                <input id="favorite-login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white" required />
              </div>
              <button type="submit" disabled={loginLoading} className="w-full rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                {loginLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Link href={`/login?next=${encodeURIComponent(`/tools/${toolSlug}`)}`} className="font-semibold text-gray-700 hover:text-red-600 dark:text-gray-200 dark:hover:text-red-400">Full login</Link>
              <Link href={registerHref} className="font-semibold text-red-600 hover:text-red-700 dark:text-red-400">Create account</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
