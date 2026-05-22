import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition ${
        isDark 
          ? 'bg-dark-800 hover:bg-dark-700' 
          : 'bg-gray-100 hover:bg-gray-200'
      } ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

