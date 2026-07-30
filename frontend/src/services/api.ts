import axios, { AxiosError } from 'axios';

const AUTH_TOKEN_KEY = 'autoledger_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tokenStorage = {
  get: () => localStorage.getItem(AUTH_TOKEN_KEY),
  set: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clear: () => localStorage.removeItem(AUTH_TOKEN_KEY),
};

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A listener the AuthContext registers so a 401 anywhere in the app
// can trigger a clean logout instead of a silent failure.
let onUnauthorized: (() => void) | null = null;

export const registerUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; errors?: string } | undefined;
    return data?.error ?? data?.errors ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};
