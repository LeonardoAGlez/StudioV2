import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  setUser: (user: User | null) =>
    set(() => ({
      user
    })),
  setToken: (token: string | null) =>
    set(() => {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
      return {
        token,
        isAuthenticated: !!token
      };
    }),
  logout: () =>
    set(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return {
        user: null,
        token: null,
        isAuthenticated: false
      };
    })
}));
