import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useMatchStore = create((set, get) => ({
  currentMatch: null,
  matchHistory: [],
  loading: false,
  error: null,

  startSoloMatch: async (problemId = null) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const payload = problemId ? { problemId } : {};
      const response = await axios.post(`${API_URL}/matches/solo`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ currentMatch: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start match';
      set({ error: message, loading: false });
      throw error;
    }
  },

  createFriendChallenge: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/matches/friend/create`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  joinFriendChallenge: async (inviteCode) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/matches/friend/join/${inviteCode}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ currentMatch: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to join challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  challengeFriendByEmail: async (friendEmail) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/matches/friend/challenge-by-email`,
        { friendEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  getPendingChallenges: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/matches/friend/pending-challenges`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch challenges', loading: false });
      throw error;
    }
  },

  acceptChallenge: async (matchId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/matches/friend/accept-challenge/${matchId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ currentMatch: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to accept challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  rejectChallenge: async (matchId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/matches/friend/reject-challenge/${matchId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reject challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  submitCode: async (matchId, code, language = 'javascript') => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/matches/${matchId}/submit`,
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ currentMatch: response.data.match, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit code';
      set({ error: message, loading: false });
      throw error;
    }
  },

  getMatchHistory: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/matches/user/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ matchHistory: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch match history', loading: false });
      throw error;
    }
  },

  getMatch: async (matchId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  giveUp: async (matchId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/matches/${matchId}/giveup`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ currentMatch: response.data.match, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to give up';
      set({ error: message, loading: false });
      throw error;
    }
  },

  setCurrentMatch: (match) => set({ currentMatch: match }),
  clearCurrentMatch: () => set({ currentMatch: null }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

