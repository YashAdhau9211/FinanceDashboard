import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category } from '../types';

interface CategoriesState {
  customCategories: string[];
  addCustomCategory: (category: string) => void;
  removeCustomCategory: (category: string) => void;
  getAllCategories: () => (Category | string)[];
}

const DEFAULT_CATEGORIES: Category[] = [
  'salary',
  'freelance',
  'investment',
  'rent',
  'utilities',
  'groceries',
  'dining',
  'transportation',
  'entertainment',
  'healthcare',
  'shopping',
  'transfer',
];

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      customCategories: [],

      addCustomCategory: (category: string) => {
        const trimmed = category.trim().toLowerCase();
        
        // Validate category name
        if (!trimmed) return;
        if (DEFAULT_CATEGORIES.includes(trimmed as Category)) return;
        if (get().customCategories.includes(trimmed)) return;
        
        set((state) => ({
          customCategories: [...state.customCategories, trimmed],
        }));
      },

      removeCustomCategory: (category: string) => {
        set((state) => ({
          customCategories: state.customCategories.filter((c) => c !== category),
        }));
      },

      getAllCategories: () => {
        return [...DEFAULT_CATEGORIES, ...get().customCategories];
      },
    }),
    {
      name: 'categories-storage',
    }
  )
);

export { DEFAULT_CATEGORIES };
