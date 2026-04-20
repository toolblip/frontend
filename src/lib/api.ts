const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Tools
export async function getTools(params?: { category?: string; page?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiRequest<{ tools: { tools: Tool[] } }>(`/api/tools${query ? `?${query}` : ''}`);
}

export async function getTool(slug: string) {
  return apiRequest<{ tool: Tool }>(`/api/tools/${slug}`);
}

// MCP Servers
export async function getMcpServers(params?: { category?: string; page?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiRequest<{ servers: { servers: McpServer[] } }>(`/api/mcp/servers${query ? `?${query}` : ''}`);
}

// Auth
export async function login(email: string, password: string) {
  return apiRequest<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(name: string, email: string, password: string) {
  return apiRequest<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export async function getMe() {
  return apiRequest<{ user: User }>('/api/auth/user');
}

// Subscription
export async function getSubscription(token: string) {
  return apiRequest<Subscription>('/api/subscription', { token });
}

export async function createCheckoutSession(plan: 'monthly' | 'yearly', token: string) {
  return apiRequest<{ url: string }>('/api/subscription/checkout', {
    method: 'POST',
    body: { plan },
    token,
  });
}

export async function openCustomerPortal(token: string) {
  return apiRequest<{ url: string }>('/api/subscription/portal', {
    method: 'POST',
    token,
  });
}

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

// Types
export interface Tool {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  is_pro: boolean;
  emoji?: string;
  created_at: string;
}

export interface McpServer {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  url: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_pro: boolean;
}
