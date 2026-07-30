import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { registerUnauthorizedHandler, tokenStorage } from '../services/api';
import type { LoginPayload, RegisterPayload, User } from '../types/auth.types';

const USER_STORAGE_KEY = 'autoledger_user';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedToken = tokenStorage.get();
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(logout);
  }, [logout]);

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authService.login(payload);
    tokenStorage.set(result.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authService.register(payload);
      await login({ email: payload.email, password: payload.password });
    },
    [login],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, isInitializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
