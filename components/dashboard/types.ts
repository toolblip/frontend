export interface Subscription {
  is_pro: boolean;
  tier: string | null;
  devices: number | null;
  storage_gb: number | null;
  team_seats: number | null;
  max_file_size_mb: number | null;
  api_access: boolean;
  priority_support: boolean;
  plan_ends_at: string | null;
  subscription_status: string | null;
}

export interface FavoriteTool {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon?: string | null;
  favorited_at?: string | null;
}

export type Plan = {
  tier: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  stripe_monthly_id: string | null;
  stripe_yearly_id: string | null;
  storage_gb: number;
  max_file_size_mb: number;
  team_seats: number;
  api_access: boolean;
  priority_support: boolean;
  sort_order: number;
};

export type BillingCycle = "monthly" | "yearly";
export type OnboardingPlanTier = "free" | "starter" | "ultra" | "max";
export type OnboardingStep = "welcome" | "pricing";
export type OnboardingStatus = "completed" | "draft" | "skipped";
