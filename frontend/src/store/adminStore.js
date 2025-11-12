import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAdminStore = create((set) => ({
  problems: [],
  categories: [],
  challenges: [],
  contests: [],
  users: [],
  stats: null,
  loading: false,
  error: null,

  // Problem Management
  createProblem: async (problemData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/problems`, problemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        problems: [response.data.problem, ...state.problems],
        loading: false
      }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create problem';
      set({ error: message, loading: false });
      throw error;
    }
  },

  getProblems: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/problems`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ problems: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch problems', loading: false });
      throw error;
    }
  },

  updateProblem: async (problemId, problemData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/admin/problems/${problemId}`,
        problemData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        problems: state.problems.map((p) =>
          p._id === problemId ? response.data.problem : p
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update problem';
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteProblem: async (problemId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        problems: state.problems.filter((p) => p._id !== problemId),
        loading: false
      }));
      return { message: 'Problem deleted successfully' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete problem';
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Admin Management
  makeAdmin: async (userId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/admin/make-admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to make admin';
      set({ error: message, loading: false });
      throw error;
    }
  },

  removeAdmin: async (userId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/admin/remove-admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove admin';
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Category Management
  createCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/categories/admin`, categoryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        categories: [response.data.category, ...state.categories],
        loading: false
      }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create category';
      set({ error: message, loading: false });
      throw error;
    }
  },

  getCategories: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/categories/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ categories: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch categories', loading: false });
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/categories/admin/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        categories: state.categories.filter(cat => cat._id !== categoryId),
        loading: false
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete category';
      set({ error: message, loading: false });
      throw error;
    }
  },

  addProblemToCategory: async (categoryId, problemId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/categories/admin/${categoryId}/problems/${problemId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        categories: state.categories.map(cat =>
          cat._id === categoryId ? response.data.category : cat
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add problem to category';
      set({ error: message, loading: false });
      throw error;
    }
  },

  removeProblemFromCategory: async (categoryId, problemId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/categories/admin/${categoryId}/problems/${problemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        categories: state.categories.map(cat =>
          cat._id === categoryId
            ? { ...cat, problems: cat.problems.filter(p => p._id !== problemId) }
            : cat
        ),
        loading: false
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove problem from category';
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Statistics
  getStats: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ stats: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch stats', loading: false });
      throw error;
    }
  },

  // Challenge Management
  createChallenge: async (challengeData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/admin/challenges`, challengeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        challenges: [response.data.challenge, ...state.challenges],
        loading: false
      }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  getChallenges: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/admin/challenges?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ challenges: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch challenges', loading: false });
      throw error;
    }
  },

  updateChallenge: async (challengeId, challengeData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/admin/challenges/${challengeId}`,
        challengeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        challenges: state.challenges.map((c) =>
          c._id === challengeId ? response.data.challenge : c
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteChallenge: async (challengeId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/challenges/${challengeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        challenges: state.challenges.filter((c) => c._id !== challengeId),
        loading: false
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete challenge';
      set({ error: message, loading: false });
      throw error;
    }
  },

  getChallengeStats: async (challengeId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/challenges/${challengeId}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch challenge stats', loading: false });
      throw error;
    }
  },

  // Contest Management
  createContest: async (contestData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_URL}/admin/contests`, contestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set((state) => ({
        contests: [response.data.contest, ...state.contests],
        loading: false
      }));

      return response.data.contest;
    } catch (error) {
      set({ error: 'Failed to create contest', loading: false });
      throw error;
    }
  },

  getContests: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');

      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/admin/contests?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ contests: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch contests', loading: false });
      throw error;
    }
  },

  updateContest: async (contestId, contestData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `${API_URL}/admin/contests/${contestId}`,
        contestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        contests: state.contests.map((c) =>
          c._id === contestId ? response.data.contest : c
        ),
        loading: false
      }));

      return response.data.contest;
    } catch (error) {
      set({ error: 'Failed to update contest', loading: false });
      throw error;
    }
  },

  deleteContest: async (contestId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');

      await axios.delete(`${API_URL}/admin/contests/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set((state) => ({
        contests: state.contests.filter((c) => c._id !== contestId),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete contest', loading: false });
      throw error;
    }
  },

  cancelContest: async (contestId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/admin/contests/${contestId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        contests: state.contests.map((c) =>
          c._id === contestId ? response.data.contest : c
        ),
        loading: false
      }));

      return response.data.contest;
    } catch (error) {
      set({ error: 'Failed to cancel contest', loading: false });
      throw error;
    }
  },

  getContestStats: async (contestId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/admin/contests/${contestId}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch contest stats', loading: false });
      throw error;
    }
  },

  // User Management
  getUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ users: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch users', loading: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        users: state.users.filter((u) => u._id !== userId),
        loading: false
      }));
      return { message: 'User deleted successfully' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      set({ error: message, loading: false });
      throw error;
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

