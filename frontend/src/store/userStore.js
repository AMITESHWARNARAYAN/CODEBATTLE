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

  getUserSubmissionStats: async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/submissions/stats/overview${username ? `?username=${username}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch submission stats:', error);
      throw error;
    }
  },

  getUserHeatmap: async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/submissions/calendar/heatmap${username ? `?username=${username}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch heatmap:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      set({ error: message, loading: false });
      throw error;
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

