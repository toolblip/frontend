export type FavoriteListSummary = {
  id: number;
  name: string;
  slug: string;
  is_shared: boolean;
  public_path: string | null;
  tool_count: number;
  tool_slugs: string[];
  contains_tool: boolean;
  can_edit: boolean;
};

export type JoinedFavoriteList = {
  id: number;
  name: string;
  slug: string;
  tool_count: number;
  owner_name: string | null;
  owner_username: string | null;
  public_path: string | null;
  can_edit: boolean;
};

export type SharedListTool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon?: string | null;
};

export type SharedFavoriteList = {
  id: number;
  name: string;
  slug: string;
  is_shared: boolean;
  can_edit: boolean;
  role: "owner" | "viewer";
  owner_name: string | null;
  owner_username: string | null;
  public_path: string | null;
  tools: SharedListTool[];
};
