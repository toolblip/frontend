export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  tier: string | null;
  subscription_status: string | null;
  plan_ends_at: string | null;
  created_at: string | null;
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  ultra: "Pro",
  max: "Max",
};

export function planLabel(tier: string | null): string {
  if (!tier) return "Free";
  return TIER_LABELS[tier] ?? tier.charAt(0).toUpperCase() + tier.slice(1);
}

export function formatAdminDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function verificationLabel(value: string | null): string {
  return value ? "Verified" : "Pending";
}
