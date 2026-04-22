import { readUsage, incrementUsage, isAtLimit } from './usage';

export interface ToolUsageState {
  count: number;
  limit: number;
  isAtLimit: boolean;
  /** Increment count and return the updated state */
  increment: () => ToolUsageState;
}

/**
 * Returns current usage state for a tool and an increment function.
 * Call increment() before executing the tool to count the use.
 */
export function useToolUsage(slug: string, limit: number): ToolUsageState {
  const count = readUsage(slug);
  const atLimit = isAtLimit(slug, limit);

  const increment = (): ToolUsageState => {
    const newCount = incrementUsage(slug);
    return {
      count: newCount,
      limit,
      isAtLimit: newCount >= limit,
      increment,
    };
  };

  return { count, limit, isAtLimit: atLimit, increment };
}
