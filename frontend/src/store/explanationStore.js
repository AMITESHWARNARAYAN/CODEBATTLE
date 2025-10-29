import { create } from 'zustand';
import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/explanations`;

export const useExplanationStore = create((set) => ({
  explanation: null,
  guidance: null,
  solution: null,
  loading: false,
  error: null,

  // Generate problem explanation
  generateExplanation: async (problemId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/problem/${problemId}/explanation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      set({ explanation: response.data.explanation, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to generate explanation';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Generate guidance for user code
  generateGuidance: async (problemId, userCode, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/problem/${problemId}/guidance`,
        { userCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      set({ guidance: response.data.guidance, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to generate guidance';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Generate detailed solution
  generateSolution: async (problemId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/problem/${problemId}/solution`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      set({ solution: response.data.solution, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to generate solution';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Clear explanations
  clearExplanations: () => {
    set({ explanation: null, guidance: null, solution: null, error: null });
  }
}));

