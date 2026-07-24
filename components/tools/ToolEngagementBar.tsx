"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { useAuth } from "@/app/providers/auth-provider";
import { recordRecentTool } from "@/lib/toolHistory";
import ShareCard, { type ShareChannelLink } from "@/components/share/ShareCard";
import { LinkedInIcon, WhatsAppIcon, MessengerIcon, SnapchatIcon, EmailIcon, ShareGlyphIcon, SOCIAL_COLORS } from "@/components/share/shareIcons";

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
        className={`${sharedClassName} transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400`}
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

function SharePopover({
  toolName,
  title,
  channels,
  copied,
  loading,
  expanded,
  qrDataUrl,
  onToggleExpand,
  onNativeShare,
  onClose,
}: {
  toolName: string;
  title: string;
  channels: ShareChannelLink[];
  copied: boolean;
  loading: boolean;
  expanded: boolean;
  qrDataUrl: string;
  onToggleExpand: () => void;
  onNativeShare: () => void;
  onClose: () => void;
}) {
  return (
    <div role="dialog" aria-label={`Share ${toolName}`} className="absolute left-0 top-14 z-20">
      <ShareCard
        channels={channels}
        qrDataUrl={qrDataUrl}
        copied={copied}
        loading={loading}
        expanded={expanded}
        title={title}
        onToggleExpand={onToggleExpand}
        onClose={onClose}
        onNativeShare={onNativeShare}
      />
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
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState(`https://toolblip.com/tools/${toolSlug}`);
  const [pageTitle, setPageTitle] = useState(toolName);
  const [shareHovered, setShareHovered] = useState(false);
  const [favoriteIntent, setFavoriteIntent] = useState(false);
  const [unfavoriteOpen, setUnfavoriteOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState(`https://toolblip.com/tools/${toolSlug}`);
  const [shortUrlLoading, setShortUrlLoading] = useState(false);
  const [shareExpanded, setShareExpanded] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    setPageUrl(window.location.href);
    setPageTitle(document.title);
  }, []);

  // Generate short URL when share popover opens
  useEffect(() => {
    if (!shareOpen) return;
    let cancelled = false;
    setShortUrlLoading(true);
    const currentUrl = typeof window !== "undefined" ? window.location.href : pageUrl;

    fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ url: currentUrl }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.short_url) setShortUrl(data.short_url);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setShortUrlLoading(false); });

    return () => { cancelled = true; };
  }, [shareOpen, pageUrl]);

  // Generate QR code once the short link is ready
  useEffect(() => {
    if (!shareOpen || !shortUrl) return;
    let cancelled = false;
    import('@/lib/qr').then(({ generateQRCode }) => {
      generateQRCode(shortUrl, 400).then((qrUrl) => {
        if (!cancelled && qrUrl) setQrDataUrl(qrUrl);
      });
    });
    return () => { cancelled = true; };
  }, [shareOpen, shortUrl]);

  // Reset expand state each time the popover closes
  useEffect(() => {
    if (!shareOpen) setShareExpanded(false);
  }, [shareOpen]);

  const registerHref = `/signup?next=${encodeURIComponent(`/tools/${toolSlug}`)}&favorite=1`;
  const favoriteReturnHref = `/tools/${toolSlug}?favorite=1`;
  const loginHref = `/login?next=${encodeURIComponent(favoriteReturnHref)}`;
  const googleHref = `/api/auth/google/start?next=${encodeURIComponent(favoriteReturnHref)}`;

  function clearFavoriteQuery() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("favorite") === "1" || url.searchParams.get("favorite") === "true") {
      url.searchParams.delete("favorite");
      router.replace(`${url.pathname}${url.search}${url.hash}`);
    }
  }

  async function favoriteTool() {
    setFavoriteLoading(true);
    try {
      const res = await fetch(`/api/tools/${toolSlug}/favorite`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data.data ?? fallbackStats(toolSlug));
        setFavoriteIntent(false);
        clearFavoriteQuery();
      } else if (res.status === 401) {
        setLoginOpen(true);
      }
    } finally {
      setFavoriteLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("favorite") === "1" || params.get("favorite") === "true") {
      setFavoriteIntent(true);
    }
  }, []);

  useEffect(() => {
    if (!favoriteIntent || authLoading || !user) {
      return;
    }

    if (stats.viewer_favorited) {
      setFavoriteIntent(false);
      clearFavoriteQuery();
      return;
    }

    void favoriteTool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteIntent, authLoading, user, stats.viewer_favorited]);

  const shareLinks = useMemo<ShareChannelLink[]>(() => {
    const text = `Check out ${toolName} on Toolblip`;
    return [
      {
        label: "WhatsApp",
        href: `https://wa.me/?${new URLSearchParams({ text: `${text} ${shortUrl}` }).toString()}`,
        icon: <WhatsAppIcon className="h-full w-full text-white" />,
        color: SOCIAL_COLORS.whatsapp,
        onClick: () => void recordShare("whatsapp"),
      },
      {
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: shortUrl }).toString()}`,
        icon: <LinkedInIcon className="h-full w-full text-white" />,
        color: SOCIAL_COLORS.linkedin,
        onClick: () => void recordShare("linkedin"),
      },
      {
        label: "Messenger",
        href: `fb-messenger://share/?link=${encodeURIComponent(shortUrl)}`,
        icon: <MessengerIcon className="h-full w-full text-white" />,
        color: SOCIAL_COLORS.messenger,
        onClick: () => void recordShare("messenger"),
      },
      {
        label: "Snapchat",
        href: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shortUrl)}`,
        icon: <SnapchatIcon className="h-full w-full text-white" />,
        color: SOCIAL_COLORS.snapchat,
        onClick: () => void recordShare("snapchat"),
      },
      {
        label: "Email",
        href: `mailto:?${new URLSearchParams({ subject: text, body: shortUrl }).toString()}`,
        icon: <EmailIcon className="h-full w-full text-white" />,
        color: SOCIAL_COLORS.email,
        onClick: () => void recordShare("email"),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolName, shortUrl]);


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
    // Best-effort client-side history for the dashboard "Recent tools" panel.
    recordRecentTool({ slug: toolSlug, name: toolName, icon: toolIcon });
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
    const url = shortUrl || window.location.href || pageUrl;
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

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: toolName, text: `Check out ${toolName} on Toolblip`, url: shortUrl });
        void recordShare("native");
      } catch {
        // user cancelled or share failed — nothing to do
      }
      return;
    }
    void copyLink();
  }

  async function toggleFavorite() {
    setShareOpen(false);

    if (authLoading) {
      return;
    }

    if (!user) {
      setFavoriteIntent(true);
      setLoginOpen(true);
      return;
    }

    if (stats.viewer_favorited) {
      setUnfavoriteOpen(true);
      return;
    }

    await favoriteTool();
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.token) {
        setLoginError(data.message ?? "Invalid email or password.");
        return;
      }

      login(data.user, data.token);
      setLoginOpen(false);
      setEmail("");
      setPassword("");
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function confirmUnfavorite() {
    setFavoriteLoading(true);
    try {
      const res = await fetch(`/api/tools/${toolSlug}/favorite`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data.data ?? fallbackStats(toolSlug));
        setUnfavoriteOpen(false);
      }
    } finally {
      setFavoriteLoading(false);
    }
  }

  const favoriteText = authLoading ? "Checking..." : stats.viewer_favorited ? "Favorited" : "Favorite";
  const favoriteLabel = authLoading ? `Checking sign-in status for ${toolName}` : stats.viewer_favorited ? `Favorited ${toolName}` : `Favorite ${toolName}`;
  const favoriteDisabled = favoriteLoading || authLoading;

  function toggleSharePopover() {
    setLoginOpen(false);
    setShareOpen((open) => !open);
  }

  return (
    <div data-testid="tool-engagement-bar" className="relative flex w-full flex-wrap items-center gap-3" aria-label={`${toolName} engagement stats`}>
      <div
        className="relative inline-flex items-stretch rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
        onMouseEnter={() => setShareHovered(true)}
        onMouseLeave={() => setShareHovered(false)}
      >
        <button
          data-testid="tool-share-button"
          type="button"
          onClick={toggleSharePopover}
          className={`inline-flex items-center gap-1.5 border-0 rounded-l-xl px-3 py-1.5 text-sm font-medium transition ${
            shareOpen || shareHovered
              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              : "bg-transparent text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          } cursor-pointer`}
          aria-label={`Share ${toolName}`}
          aria-haspopup="dialog"
          aria-expanded={shareOpen}
        >
          <ShareGlyphIcon className="h-4 w-4" />
          Share
        </button>
        <button
          data-testid="tool-share-count"
          type="button"
          onClick={toggleSharePopover}
          className={`inline-flex min-w-8 items-center justify-center border-0 border-l border-gray-100 px-2.5 py-1.5 text-sm font-bold transition dark:border-gray-700 ${
            shareOpen || shareHovered
              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          } cursor-pointer`}
          aria-label={`Shares ${formatCount(stats.shares)}`}
        >
          {formatCount(stats.shares)}
        </button>

        {shareOpen && (
          <SharePopover
            toolName={toolName}
            title={pageTitle}
            channels={shareLinks}
            copied={copied}
            loading={shortUrlLoading}
            expanded={shareExpanded}
            qrDataUrl={qrDataUrl}
            onToggleExpand={() => setShareExpanded((v) => !v)}
            onNativeShare={handleNativeShare}
            onClose={() => setShareOpen(false)}
          />
        )}
      </div>

      <span
        data-testid="tool-view-count"
        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
        aria-label={`Views ${formatCount(stats.views)}`}
      >
        <EyeIcon className="h-4 w-4" />
        <span className="font-bold text-gray-800 dark:text-gray-100">{formatCount(stats.views)}</span>
      </span>

      <div className="ml-auto flex items-stretch overflow-hidden rounded-xl">
        <button
          data-testid="tool-favorite-button"
          type="button"
          onClick={toggleFavorite}
          disabled={favoriteDisabled}
          className={`inline-flex items-center gap-1.5 rounded-l-xl border border-r-0 px-3 py-1.5 text-sm font-medium shadow-sm transition cursor-pointer disabled:opacity-60 ${
            stats.viewer_favorited
              ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
              : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          }`}
          aria-label={favoriteLabel}
        >
          {stats.viewer_favorited ? <HeartIcon className="h-4 w-4" /> : <HeartOutlineIcon className="h-4 w-4" />}
          {favoriteText}
        </button>
        <span
          data-testid="tool-favorite-count"
          className={`inline-flex min-w-8 items-center justify-center rounded-r-xl border px-2.5 py-1.5 text-sm font-bold shadow-sm transition dark:border-gray-700 ${
            stats.viewer_favorited
              ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300"
              : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          }`}
          aria-label={`Favorites ${formatCount(stats.favorites)}`}
        >
          {formatCount(stats.favorites)}
        </span>
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

            <div className="space-y-4">
              <GoogleAuthButton href={googleHref} />

              <div className="tb-v2-auth-divider !my-0" aria-hidden="true">
                <span>or</span>
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
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:border-gray-700"
                  />
                  <span>Remember me</span>
                </label>
                <button type="submit" disabled={loginLoading} className="w-full rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
                  {loginLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Link href={registerHref} className="font-semibold text-red-600 hover:text-red-700 dark:text-red-400">Create account</Link>
            </div>
          </div>
        </div>
      )}

      {unfavoriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Unfavorite ${toolName}`}
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Unfavorite this favorite?</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Are you really want to unfavorite this favorite?</p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUnfavoriteOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => void confirmUnfavorite()}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                disabled={favoriteLoading}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
