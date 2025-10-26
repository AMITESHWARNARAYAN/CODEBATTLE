import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useAdminStore = create((set) => ({
  problems: [],
  categories: [],
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

  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

