"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    const parsed = JSON.parse(rawUser) as Partial<AuthUser>;
    if (!parsed.id || !parsed.email) return null;

    return {
      id: parsed.id,
      name: parsed.name?.trim() || "Usuario",
      email: parsed.email,
      role: parsed.role || "USER",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const syncFromStorage = useCallback(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    syncFromStorage();

    const onStorageOrFocus = () => syncFromStorage();
    window.addEventListener("storage", onStorageOrFocus);
    window.addEventListener("focus", onStorageOrFocus);

    return () => {
      window.removeEventListener("storage", onStorageOrFocus);
      window.removeEventListener("focus", onStorageOrFocus);
    };
  }, [syncFromStorage]);

  const login = useCallback((token: string, nextUser: AuthUser) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser({
      id: nextUser.id,
      name: nextUser.name?.trim() || "Usuario",
      email: nextUser.email,
      role: nextUser.role || "USER",
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
