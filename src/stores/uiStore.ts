import { create } from 'zustand';
import type { UIState } from '../types';

interface UIActions {
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setPrefersReducedMotion: (enabled: boolean) => void;
}

// Detect prefers-reduced-motion media query
const detectReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

// Load dark mode preference from localStorage
const loadDarkModePreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('zorvyn-dark-mode');
    return stored === 'true';
  } catch (error) {
    console.warn('Failed to load dark mode preference from localStorage:', error);
    return false;
  }
};

// Save dark mode preference to localStorage
const saveDarkModePreference = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('zorvyn-dark-mode', String(enabled));
  } catch (error) {
    console.warn('Failed to save dark mode preference to localStorage:', error);
  }
};

export const useUIStore = create<UIState & UIActions>()((set) => {
  // Set up media query listener for prefers-reduced-motion
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      set({ prefersReducedMotion: e.matches });
    };
    mediaQuery.addEventListener('change', handleChange);
  }

  return {
    // Initialize with default UI state (restore from localStorage)
    sidebarCollapsed: false,
    darkMode: loadDarkModePreference(),
    prefersReducedMotion: detectReducedMotion(),

    // Toggle sidebar action
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    // Toggle dark mode action
    toggleDarkMode: () =>
      set((state) => {
        const newDarkMode = !state.darkMode;
        saveDarkModePreference(newDarkMode);
        return { darkMode: newDarkMode };
      }),

    // Set sidebar collapsed action
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    // Set dark mode action
    setDarkMode: (enabled) => {
      saveDarkModePreference(enabled);
      set({ darkMode: enabled });
    },

    // Set prefers reduced motion action
    setPrefersReducedMotion: (enabled) => set({ prefersReducedMotion: enabled }),
  };
});
