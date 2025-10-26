import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') !== 'light',
  
  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newIsDark);
      return { isDark: newIsDark };
    });
  },

  setTheme: (isDark) => {
    set({ isDark });
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDark = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    set({ isDark });
  }
}));

