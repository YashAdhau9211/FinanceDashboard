import { describe, it, expect, vi } from 'vitest';
import {
  getTopSpendingCategory,
  getBestIncomeMonth,
  getWorstExpenseMonth,
  getMonthlyComparison,
  getSavingsTrend,
  getUnusualSpending,
  generateAISummary,
} from '../insights';
import type { Transaction } from '../../types';

describe('Insight Computation Error Handling', () => {
  // Mock console.error to avoid cluttering test output
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  describe('getTopSpendingCategory', () => {
    it('should handle invalid transaction data gracefully', () => {
      const invalidTransactions = [
        { invalid: 'data' },
        null,
        undefined,
      ] as unknown as Transaction[];

      const result = getTopSpendingCategory(invalidTransactions);

      expect(result).toEqual({
        category: null,
        amount: 0,
        percentage: 0,
        chartData: [],
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in getTopSpendingCategory:',
        expect.any(Error)
      );
    });

    it('should handle transactions with missing properties', () => {
      const incompleteTransactions = [{ type: 'expense' } as Transaction];

      const result = getTopSpendingCategory(incompleteTransactions);

      expect(result).toEqual({
        category: null,
        amount: 0,
        percentage: 0,
        chartData: [],
      });
    });

    it('should handle empty array without errors', () => {
      const result = getTopSpendingCategory([]);

      expect(result).toEqual({
        category: null,
        amount: 0,
        percentage: 0,
        chartData: [],
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('getBestIncomeMonth', () => {
    it('should handle invalid transaction data gracefully', () => {
      const invalidTransactions = [{ invalid: 'data' }] as unknown as Transaction[];

      const result = getBestIncomeMonth(invalidTransactions);

      // Should return safe defaults without crashing
      expect(result.month).toBeNull();
      expect(result.year).toBeNull();
      expect(result.amount).toBe(0);
      expect(result.percentageChange).toBe(0);
    });

    it('should handle empty array without errors', () => {
      const result = getBestIncomeMonth([]);

      expect(result).toEqual({
        month: null,
        year: null,
        amount: 0,
        percentageChange: 0,
        monthlyData: [],
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('getWorstExpenseMonth', () => {
    it('should handle invalid transaction data gracefully', () => {
      const invalidTransactions = [{ invalid: 'data' }] as unknown as Transaction[];

      const result = getWorstExpenseMonth(invalidTransactions);

      // Should return safe defaults without crashing
      expect(result.month).toBeNull();
      expect(result.year).toBeNull();
      expect(result.amount).toBe(0);
      expect(result.hasOverspend).toBe(false);
    });

    it('should handle empty array without errors', () => {
      const result = getWorstExpenseMonth([]);

      expect(result).toEqual({
        month: null,
        year: null,
        amount: 0,
        hasOverspend: false,
        monthlyData: [],
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('getMonthlyComparison', () => {
    it('should handle invalid transaction data gracefully', () => {
      const invalidTransactions = [{ invalid: 'data' }] as unknown as Transaction[];

      const result = getMonthlyComparison(invalidTransactions);

      // Should return safe defaults without crashing
      expect(result.currentMonth.income).toBe(0);
      expect(result.currentMonth.expenses).toBe(0);
      expect(result.deltas.incomeDelta).toBe(0);
      expect(result.deltas.expensesDelta).toBe(0);
    });

    it('should handle empty array without errors', () => {
      const result = getMonthlyComparison([]);

      expect(result.currentMonth.income).toBe(0);
      expect(result.deltas.incomeDelta).toBe(0);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('getSavingsTrend', () => {
    it('should handle invalid transaction data gracefully', () => {
      const invalidTransactions = [{ invalid: 'data' }] as unknown as Transaction[];

      const result = getSavingsTrend(invalidTransactions);

      // Should return 12 months of data with 0 savings rate
      expect(result.monthlyData).toHaveLength(12);
      expect(result.currentSavingsRate).toBe(0);
      expect(result.sixMonthAverage).toBe(0);
    });

    it('should handle empty array without errors', () => {
      const result = getSavingsTrend([]);

      expect(result.monthlyData).toHaveLength(12);
      expect(result.currentSavingsRate).toBe(0);
      expect(result.sixMonthAverage).toBe(0);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('getUnusualSpending', () => {
    it('should handle invalid transaction data gracefully', () => {
      const invalidTransactions = [{ invalid: 'data' }] as unknown as Transaction[];

      const result = getUnusualSpending(invalidTransactions);

      // Should return empty alerts without crashing
      expect(result.alerts).toEqual([]);
    });

    it('should handle empty array without errors', () => {
      const result = getUnusualSpending([]);

      expect(result).toEqual({
        alerts: [],
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('generateAISummary', () => {
    it('should handle invalid insight data gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidTopSpending = null as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidBestIncome = null as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidSavingsTrend = null as any;

      const result = generateAISummary(invalidTopSpending, invalidBestIncome, invalidSavingsTrend);

      expect(result).toEqual({
        text: 'Unable to generate financial insights at this time.',
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in generateAISummary:',
        expect.any(Error)
      );
    });

    it('should handle partial insight data', () => {
      const topSpending = {
        category: null,
        amount: 0,
        percentage: 0,
        chartData: [],
      };
      const bestIncome = {
        month: null,
        year: null,
        amount: 0,
        percentageChange: 0,
      };
      const savingsTrend = {
        monthlyData: [],
        currentSavingsRate: 0,
        sixMonthAverage: 0,
      };

      const result = generateAISummary(topSpending, bestIncome, savingsTrend);

      expect(result.text).toContain('savings rate');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases - No NaN or Infinity', () => {
    it('should not return NaN for zero income in savings rate', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'expense',
          category: 'groceries',
          amount: 100,
          date: '2026-04-01',
          description: 'Test',
          createdAt: '2026-04-01T00:00:00Z',
          updatedAt: '2026-04-01T00:00:00Z',
        },
      ];

      const result = getSavingsTrend(transactions);

      result.monthlyData.forEach((data) => {
        expect(data.savingsRate).not.toBeNaN();
        expect(isFinite(data.savingsRate)).toBe(true);
      });
    });

    it('should not return Infinity for zero previous month in deltas', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          category: 'salary',
          amount: 5000,
          date: '2026-04-01',
          description: 'Test',
          createdAt: '2026-04-01T00:00:00Z',
          updatedAt: '2026-04-01T00:00:00Z',
        },
      ];

      const result = getMonthlyComparison(transactions);

      expect(result.deltas.incomeDelta).not.toBe(Infinity);
      expect(result.deltas.expensesDelta).not.toBe(Infinity);
      expect(isFinite(result.deltas.incomeDelta)).toBe(true);
      expect(isFinite(result.deltas.expensesDelta)).toBe(true);
    });
  });
});
