"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

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

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onExternalChange = () => callback();
  window.addEventListener("storage", onExternalChange);
  window.addEventListener("focus", onExternalChange);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onExternalChange);
    window.removeEventListener("focus", onExternalChange);
  };
}

let cachedRaw: string | null | undefined = undefined;
let cachedUser: AuthUser | null = null;

function getSnapshot(): AuthUser | null {
  const raw = localStorage.getItem("user");
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  cachedUser = readStoredUser();
  return cachedUser;
}

function getServerSnapshot(): AuthUser | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback((token: string, nextUser: AuthUser) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: nextUser.id,
        name: nextUser.name?.trim() || "Usuario",
        email: nextUser.email,
        role: nextUser.role || "USER",
      })
    );
    notify();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    notify();
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
