// Tier-based file size limits (in MB)
export const TIER_FILE_LIMITS: Record<string, number> = {
  free: 5,
  starter: 50,
  pro: 500,
  max: 5000,
};

/**
 * Get the maximum file size allowed for a given tier (in bytes)
 */
export function getMaxFileSize(tier: string | null): number {
  const mb = TIER_FILE_LIMITS[tier || 'free'] || TIER_FILE_LIMITS.free;
  return mb * 1024 * 1024;
}

/**
 * Get the maximum file size in MB for a given tier
 */
export function getMaxFileSizeMB(tier: string | null): number {
  return TIER_FILE_LIMITS[tier || 'free'] || TIER_FILE_LIMITS.free;
}

/**
 * Check if a file exceeds the tier limit
 * Returns null if OK, or an error message if too large
 */
export function checkFileSize(file: File, tier: string | null): string | null {
  const maxBytes = getMaxFileSize(tier);
  if (file.size > maxBytes) {
    const maxMB = getMaxFileSizeMB(tier);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File too large (${fileMB} MB). Your ${tier || 'free'} plan allows up to ${maxMB} MB. Upgrade at /dashboard/subscription`;
  }
  return null;
}
