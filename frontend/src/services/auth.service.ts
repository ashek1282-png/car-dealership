import { api } from './api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth.types';

export const authService = {
  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await api.post<User>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
};
