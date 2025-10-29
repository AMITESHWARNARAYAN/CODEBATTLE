import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useUserStore = create((set) => ({
  leaderboard: [],
  userStats: null,
  loading: false,
  error: null,

  getLeaderboard: async (limit = 100) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/leaderboard?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ leaderboard: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch leaderboard', loading: false });
      throw error;
    }
  },

  getUserStats: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ userStats: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch user stats', loading: false });
      throw error;
    }
  },

  searchUsers: async (query) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserProfile: async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

