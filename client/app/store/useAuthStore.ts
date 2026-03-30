import { create } from 'zustand';
import { api } from '../api';

interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    password?: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const handleAsync = async (action: () => Promise<void>) => {
    set({ isLoading: true, error: null });
    try {
      await action();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    initializeAuth: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      set({ isLoading: true });
      try {
        const user: any = await api('/profile/me');
        set({ user, token, isAuthenticated: true });
      } catch (err) {
        localStorage.removeItem('auth_token');
        set({ token: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    },

    signup: async (email, password, firstName, lastName) => {
      await handleAsync(async () => {
        await api('/auth/signup', {
          method: 'POST',
          body: { email, password, firstName, lastName },
        });

        await get().login(email, password);
      });
    },

    login: async (email, password) => {
      await handleAsync(async () => {
        const response: any = await api('/auth/login', {
          method: 'POST',
          body: { email, password },
        });

        const { access_token, user } = response;
        localStorage.setItem('auth_token', access_token);
        set({ user, token: access_token, isAuthenticated: true });
      });
    },

    updateProfile: async (profileData) => {
      await handleAsync(async () => {
        const updatedUser: any = await api('/profile/update', {
          method: 'PATCH',
          body: profileData,
        });

        set({ user: updatedUser });
      });
    },

    logout: () => {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null }),
  };
});
