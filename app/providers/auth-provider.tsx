"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

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
  const userRef = useRef<User | null>(null);
  const inflightRef = useRef<Promise<User | null> | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    if (inflightRef.current) return inflightRef.current;

    const run = (async (): Promise<User | null> => {
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
          setUser(null);
          setToken(null);
          return null;
        }
        // Definitive unauth only — keep existing session on 5xx/network flakes
        if (res.status === 401 || res.status === 403) {
          setUser(null);
          setToken(null);
          return null;
        }
        return userRef.current;
      } catch {
        return userRef.current;
      } finally {
        inflightRef.current = null;
      }
    })();

    inflightRef.current = run;
    return run;
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
