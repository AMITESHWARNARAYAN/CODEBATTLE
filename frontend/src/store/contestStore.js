import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useContestStore = create((set) => ({
  contests: [],
  currentContest: null,
  leaderboard: [],
  loading: false,
  error: null,

  // Get all contests
  getContests: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/contests?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ contests: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch contests', loading: false });
      throw error;
    }
  },

  // Get upcoming contests
  getUpcomingContests: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/contests/upcoming`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch upcoming contests', loading: false });
      throw error;
    }
  },

  // Get running contests
  getRunningContests: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/contests/running`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch running contests', loading: false });
      throw error;
    }
  },

  // Get past contests
  getPastContests: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/contests/past`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch past contests', loading: false });
      throw error;
    }
  },

  // Get single contest
  getContest: async (contestId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/contests/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ currentContest: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch contest', loading: false });
      throw error;
    }
  },

  // Register for contest
  registerForContest: async (contestId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/contests/${contestId}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        currentContest: state.currentContest?._id === contestId 
          ? response.data.contest 
          : state.currentContest,
        loading: false
      }));

      return response.data;
    } catch (error) {
      set({ error: 'Failed to register for contest', loading: false });
      throw error;
    }
  },

  // Start contest
  startContest: async (contestId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/contests/${contestId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        currentContest: state.currentContest?._id === contestId 
          ? response.data.contest 
          : state.currentContest,
        loading: false
      }));

      return response.data;
    } catch (error) {
      set({ error: 'Failed to start contest', loading: false });
      throw error;
    }
  },

  // Submit solution
  submitSolution: async (contestId, problemId, code, language) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/contests/${contestId}/submit`,
        { problemId, code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to submit solution', loading: false });
      throw error;
    }
  },

  // Get leaderboard
  getLeaderboard: async (contestId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/contests/${contestId}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ leaderboard: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch leaderboard', loading: false });
      throw error;
    }
  },

  // Clear current contest
  clearCurrentContest: () => set({ currentContest: null }),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

