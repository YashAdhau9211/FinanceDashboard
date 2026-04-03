import { create } from 'zustand';
import type { UIState } from '../types';

interface UIActions {
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>()((set) => ({
  // Initialize with default UI state
  sidebarCollapsed: false,
  darkMode: false,

  // Toggle sidebar action
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Toggle dark mode action
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // Set sidebar collapsed action
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Set dark mode action
  setDarkMode: (enabled) => set({ darkMode: enabled }),
}));
