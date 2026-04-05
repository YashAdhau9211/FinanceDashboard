import type { Category } from '../types';


export const CATEGORY_COLORS: Record<Category, string> = {
  groceries: '#10B981', // green-500
  dining: '#F59E0B', // amber-500
  rent: '#3B82F6', // blue-500
  utilities: '#8B5CF6', // purple-500
  transportation: '#EAB308', // yellow-500
  entertainment: '#EC4899', // pink-500
  healthcare: '#EF4444', // red-500
  shopping: '#14B8A6', // teal-500
  // Income categories
  salary: '#6B7280', // gray-500
  freelance: '#6B7280', // gray-500
  investment: '#6B7280', // gray-500
  transfer: '#6B7280', // gray-500
  other: '#6B7280', // gray-500
};

/**
 * Get color based on sign of value
 */
export function getSignBasedColor(value: number): {
  bg: string;
  text: string;
  darkBg: string;
  darkText: string;
} {
  if (value >= 0) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-700',
      darkBg: 'dark:bg-green-900/20',
      darkText: 'dark:text-green-400',
    };
  } else {
    return {
      bg: 'bg-red-100',
      text: 'text-red-700',
      darkBg: 'dark:bg-red-900/20',
      darkText: 'dark:text-red-400',
    };
  }
}


export function getHeatmapColor(count: number): string {
  if (count === 0) {
    // Distinct gray for zero transactions - darker in dark mode for contrast
    return 'bg-gray-100 dark:bg-gray-700/50';
  } else if (count <= 2) {
    // Very pale mint for lowest non-zero values - brighter in dark mode
    return 'bg-teal-100 dark:bg-teal-500/30';
  } else if (count <= 5) {
    // Light teal - more saturated in dark mode
    return 'bg-teal-300 dark:bg-teal-400/60';
  } else if (count <= 10) {
    // Medium teal - bright and vibrant in dark mode
    return 'bg-teal-500 dark:bg-teal-400';
  } else {
    // Deep teal for highest values - very bright in dark mode
    return 'bg-teal-700 dark:bg-teal-300';
  }
}


export function getCategoryColor(category: Category): string {
  return CATEGORY_COLORS[category];
}
