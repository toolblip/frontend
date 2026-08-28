"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type User = { id: number; name: string; email: string; [key: string]: unknown };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setToken(data.token || "");
          return data.user as User;
        }
      }
      setUser(null);
      setToken(null);
      return null;
    } catch {
      setUser(null);
      setToken(null);
      return null;
    }
  }, []);

  // Restore session once on mount
  useEffect(() => {
    async function restore() {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, [refreshUser]);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // best-effort
    }
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
