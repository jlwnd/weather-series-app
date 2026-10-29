import { useCallback, useMemo, useState, type ReactNode } from "react";
import * as api from "../queries/auth";
import { AuthContext, type AuthValue } from "./context";

const STORAGE_KEY = "ws_auth";

type Stored = { token: string; expiresAt: number };

function loadToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Stored;
    if (!s.token || s.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s.token;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(loadToken);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.login(username, password);
    if (!res) throw new Error("Brak odpowiedzi serwera");
    const stored: Stored = {
      token: res.accessToken,
      expiresAt: Date.now() + res.expiresIn * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setToken(res.accessToken);
  }, []);

  const logout = useCallback(async () => {
    const current = token;
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    if (current) {
      try {
        await api.logout(current);
      } catch {
        // token already invalid server-side; local state is cleared either way
      }
    }
  }, [token]);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!token) throw new Error("Nie zalogowano");
      await api.changePassword(token, currentPassword, newPassword);
    },
    [token],
  );

  const value = useMemo<AuthValue>(
    () => ({
      token,
      isAuthenticated: token !== null,
      login,
      logout,
      changePassword,
    }),
    [token, login, logout, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
