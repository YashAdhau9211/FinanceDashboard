import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '../types';

interface RoleState {
  role: Role;
}

interface RoleActions {
  setRole: (role: Role) => void;
  toggleRole: () => void;
}

export const useRoleStore = create<RoleState & RoleActions>()(
  persist(
    (set) => ({
      // Initialize with default role 'ANALYST'
      role: 'ANALYST',

      // Set role action
      setRole: (role) => set({ role }),

      // Toggle role action - switch between ADMIN/ANALYST
      toggleRole: () =>
        set((state) => ({
          role: state.role === 'ADMIN' ? 'ANALYST' : 'ADMIN',
        })),
    }),
    {
      name: 'zorvyn-role', // localStorage key
    }
  )
);
