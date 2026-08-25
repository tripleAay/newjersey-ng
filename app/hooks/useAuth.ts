"use client";

import { useCallback, useEffect, useState } from "react";

type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  isEmailVerified?: boolean;
};

const API_BASE =
  process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5000";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    refreshUser: fetchUser,
    logout,
  };
}