import { create } from 'zustand';
import { authAPI } from '../services/api';

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('nl_user')); } catch { return null; }
};

const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem('nl_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('nl_token', data.token);
      localStorage.setItem('nl_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  register: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register(formData);
      localStorage.setItem('nl_token', data.token);
      localStorage.setItem('nl_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('nl_token');
    localStorage.removeItem('nl_user');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    const updated = { ...get().user, ...userData };
    localStorage.setItem('nl_user', JSON.stringify(updated));
    set({ user: updated });
  },

  refreshMe: async () => {
    try {
      const { data } = await authAPI.getMe();
      localStorage.setItem('nl_user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch {}
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
