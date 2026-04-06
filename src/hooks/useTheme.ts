import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';

interface UseThemeReturn {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
}

/**
 * Hook for managing dark mode theme
 */
export function useTheme(): UseThemeReturn {
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);
  const setDarkMode = useUIStore((state) => state.setDarkMode);

  // Apply/remove 'dark' class on document element when darkMode changes
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Failed to apply dark mode class to document:', error);
    }
  }, [darkMode]);

  return { darkMode, toggleDarkMode, setDarkMode };
}
