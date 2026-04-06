import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getSignBasedColor,
  getHeatmapColor,
  getCategoryColor,
  CATEGORY_COLORS,
} from '../colorUtils';
import type { Category } from '../../types';

describe('colorUtils', () => {
  describe('Property 8: Sign-Based Color Coding', () => {
    it('Feature: sprint-1-dashboard-overview, Property 8: positive values should return green colors', () => {
      fc.assert(
        fc.property(fc.double({ min: 0.0001, max: 1000000, noNaN: true }), (value) => {
          const colors = getSignBasedColor(value);
          expect(colors.bg).toBe('bg-green-100');
          expect(colors.text).toBe('text-green-700');
          expect(colors.darkBg).toBe('dark:bg-green-900/20');
          expect(colors.darkText).toBe('dark:text-green-400');
        }),
        { numRuns: 100 }
      );
    });

    it('Feature: sprint-1-dashboard-overview, Property 8: negative values should return red colors', () => {
      fc.assert(
        fc.property(fc.double({ min: -1000000, max: -0.0001, noNaN: true }), (value) => {
          const colors = getSignBasedColor(value);
          expect(colors.bg).toBe('bg-red-100');
          expect(colors.text).toBe('text-red-700');
          expect(colors.darkBg).toBe('dark:bg-red-900/20');
          expect(colors.darkText).toBe('dark:text-red-400');
        }),
        { numRuns: 100 }
      );
    });

    it('Feature: sprint-1-dashboard-overview, Property 8: zero should return green colors', () => {
      const colors = getSignBasedColor(0);
      expect(colors.bg).toBe('bg-green-100');
      expect(colors.text).toBe('text-green-700');
      expect(colors.darkBg).toBe('dark:bg-green-900/20');
      expect(colors.darkText).toBe('dark:text-green-400');
    });

    it('Feature: sprint-1-dashboard-overview, Property 8: very small positive values should return green', () => {
      const colors = getSignBasedColor(0.0001);
      expect(colors.bg).toBe('bg-green-100');
      expect(colors.text).toBe('text-green-700');
    });

    it('Feature: sprint-1-dashboard-overview, Property 8: very small negative values should return red', () => {
      const colors = getSignBasedColor(-0.0001);
      expect(colors.bg).toBe('bg-red-100');
      expect(colors.text).toBe('text-red-700');
    });
  });

  describe('Property 9: Threshold-Based Color Coding', () => {
    it('Feature: sprint-1-dashboard-overview, Property 9: count of 0 should return gray', () => {
      const color = getHeatmapColor(0);
      expect(color).toBe('bg-gray-100 dark:bg-gray-700/50');
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: count 1-2 should return teal-200', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 2 }), (count) => {
          const color = getHeatmapColor(count);
          expect(color).toBe('bg-teal-200 dark:bg-teal-600/60');
        }),
        { numRuns: 100 }
      );
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: count 3-5 should return teal-400', () => {
      fc.assert(
        fc.property(fc.integer({ min: 3, max: 5 }), (count) => {
          const color = getHeatmapColor(count);
          expect(color).toBe('bg-teal-400 dark:bg-teal-500/80');
        }),
        { numRuns: 100 }
      );
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: count 6-10 should return teal-600', () => {
      fc.assert(
        fc.property(fc.integer({ min: 6, max: 10 }), (count) => {
          const color = getHeatmapColor(count);
          expect(color).toBe('bg-teal-600 dark:bg-teal-400');
        }),
        { numRuns: 100 }
      );
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: count 11+ should return teal-800', () => {
      fc.assert(
        fc.property(fc.integer({ min: 11, max: 1000 }), (count) => {
          const color = getHeatmapColor(count);
          expect(color).toBe('bg-teal-800 dark:bg-teal-300');
        }),
        { numRuns: 100 }
      );
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: boundary value 1 should return teal-200', () => {
      expect(getHeatmapColor(1)).toBe('bg-teal-200 dark:bg-teal-600/60');
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: boundary value 2 should return teal-200', () => {
      expect(getHeatmapColor(2)).toBe('bg-teal-200 dark:bg-teal-600/60');
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: boundary value 3 should return teal-400', () => {
      expect(getHeatmapColor(3)).toBe('bg-teal-400 dark:bg-teal-500/80');
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: boundary value 5 should return teal-400', () => {
      expect(getHeatmapColor(5)).toBe('bg-teal-400 dark:bg-teal-500/80');
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: boundary value 6 should return teal-600', () => {
      expect(getHeatmapColor(6)).toBe('bg-teal-600 dark:bg-teal-400');
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: boundary value 10 should return teal-600', () => {
      expect(getHeatmapColor(10)).toBe('bg-teal-600 dark:bg-teal-400');
    });

    it('Feature: sprint-1-dashboard-overview, Property 9: boundary value 11 should return teal-800', () => {
      expect(getHeatmapColor(11)).toBe('bg-teal-800 dark:bg-teal-300');
    });
  });

  describe('getCategoryColor', () => {
    it('should return correct color for each category', () => {
      const categories: Category[] = [
        'groceries',
        'dining',
        'rent',
        'utilities',
        'transportation',
        'entertainment',
        'healthcare',
        'shopping',
        'salary',
        'freelance',
        'investment',
        'transfer',
      ];

      categories.forEach((category) => {
        const color = getCategoryColor(category);
        expect(color).toBe(CATEGORY_COLORS[category]);
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should return expense categories with distinct colors', () => {
      const expenseCategories: Category[] = [
        'groceries',
        'dining',
        'rent',
        'utilities',
        'transportation',
        'entertainment',
        'healthcare',
        'shopping',
      ];

      const colors = expenseCategories.map((cat) => getCategoryColor(cat));
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(expenseCategories.length);
    });
  });
});
