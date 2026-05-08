import * as React from "react";
import { lsGet, lsSet } from "@/utils/storage";

export type User = {
  id: string;
  username: string;
  email: string;
  avatarSeed: string;
  createdAt: string;
};

type AuthState = {
  user: User | null;
  login: (payload: { email: string; username?: string }) => void;
  logout: () => void;
  updateUser: (patch: Partial<Pick<User, "username" | "avatarSeed" | "email">>) => void;
};

const AuthContext = React.createContext<AuthState | undefined>(undefined);

const KEY = "playarena.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => lsGet<User | null>(KEY, null));

  const login = React.useCallback((payload: { email: string; username?: string }) => {
    const username = payload.username?.trim() || payload.email.split("@")[0] || "Player";
    const next: User = {
      id: crypto.randomUUID(),
      username,
      email: payload.email.trim(),
      avatarSeed: username,
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    lsSet(KEY, next);
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    lsSet(KEY, null);
  }, []);

  const updateUser = React.useCallback(
    (patch: Partial<Pick<User, "username" | "avatarSeed" | "email">>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        lsSet(KEY, next);
        return next;
      });
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
