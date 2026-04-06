import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { computeMonthlyData } from '../monthlyDataSelector';
import type { Transaction, TransactionType, Category } from '../../../types';

// Helper to create a transaction
function createTransaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: crypto.randomUUID(),
    date: '2025-01-15',
    description: 'Test transaction',
    amount: 1000,
    type: 'income' as TransactionType,
    category: 'salary' as Category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// Custom generator for transactions
const transactionGenerator = fc.record({
  id: fc.uuid(),
  date: fc.integer({ min: 0, max: 730 }).map((days) => {
    const d = new Date('2024-01-01');
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }),
  description: fc.string({ minLength: 1, maxLength: 50 }),
  amount: fc.integer({ min: 100, max: 100000 }),
  type: fc.constantFrom('income' as const, 'expense' as const, 'transfer' as const),
  category: fc.constantFrom(
    'salary' as const,
    'freelance' as const,
    'investment' as const,
    'groceries' as const,
    'dining' as const,
    'rent' as const,
    'utilities' as const,
    'transportation' as const,
    'entertainment' as const,
    'healthcare' as const,
    'shopping' as const,
    'transfer' as const,
    'other' as const
  ),
  createdAt: fc.integer({ min: 0, max: 730 }).map((days) => {
    const d = new Date('2024-01-01');
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }),
  updatedAt: fc.integer({ min: 0, max: 730 }).map((days) => {
    const d = new Date('2024-01-01');
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }),
}) as fc.Arbitrary<Transaction>;

describe('Monthly Data Selector - Property Tests', () => {
  describe('Feature: sprint-1-dashboard-overview, Property 3: Monthly Data Grouping', () => {
    it('returns exactly N months of data', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          fc.constantFrom(3, 6, 12),
          (transactions, months) => {
            const monthlyData = computeMonthlyData(transactions, months);

            expect(monthlyData).toHaveLength(months);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('groups transactions by YYYY-MM format', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const monthlyData = computeMonthlyData(transactions, 12);

            // Each month should have YYYY-MM format
            monthlyData.forEach((data: { month: string }) => {
              expect(data.month).toMatch(/^\d{4}-\d{2}$/);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns months in chronological order (oldest to newest)', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          fc.constantFrom(3, 6, 12),
          (transactions, months) => {
            const monthlyData = computeMonthlyData(transactions, months);

            // Verify chronological order
            for (let i = 1; i < monthlyData.length; i++) {
              expect(monthlyData[i].month >= monthlyData[i - 1].month).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('places each transaction in the correct month group', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 28 }),
          fc.integer({ min: 1000, max: 100000 }),
          (day, amount) => {
            const transactions: Transaction[] = [
              createTransaction({
                date: `${currentMonth}-${String(day).padStart(2, '0')}`,
                type: 'income',
                amount,
              }),
            ];

            const monthlyData = computeMonthlyData(transactions, 12);
            const currentMonthData = monthlyData.find((d: { month: string }) => d.month === currentMonth);

            expect(currentMonthData).toBeDefined();
            expect(currentMonthData!.transactionCount).toBe(1);
            expect(currentMonthData!.income).toBe(amount);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Feature: sprint-1-dashboard-overview, Property 4: Monthly Data Aggregation', () => {
    it('computes income correctly for each month', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const monthlyData = computeMonthlyData(transactions, 12);

            monthlyData.forEach((data: { month: string; income: number }) => {
              // Compute expected income for this month
              const expectedIncome = transactions
                .filter((t) => t.date.startsWith(data.month) && t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

              expect(Math.abs(data.income - expectedIncome)).toBeLessThan(0.01);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('computes expenses correctly for each month', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const monthlyData = computeMonthlyData(transactions, 12);

            monthlyData.forEach((data: { month: string; expenses: number }) => {
              // Compute expected expenses for this month
              const expectedExpenses = transactions
                .filter((t) => t.date.startsWith(data.month) && t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

              expect(Math.abs(data.expenses - expectedExpenses)).toBeLessThan(0.01);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('computes net correctly as income - expenses', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const monthlyData = computeMonthlyData(transactions, 12);

            monthlyData.forEach((data: { income: number; expenses: number; net: number }) => {
              const expectedNet = data.income - data.expenses;
              expect(Math.abs(data.net - expectedNet)).toBeLessThan(0.01);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('counts transactions correctly for each month', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const monthlyData = computeMonthlyData(transactions, 12);

            monthlyData.forEach((data: { month: string; transactionCount: number }) => {
              // Count expected transactions for this month
              const expectedCount = transactions.filter((t) =>
                t.date.startsWith(data.month)
              ).length;

              expect(data.transactionCount).toBe(expectedCount);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns zeros for months with no transactions', () => {
      // Create transactions only in specific months, leaving gaps
      const transactions: Transaction[] = [];

      const monthlyData = computeMonthlyData(transactions, 12);

      // All months should have zeros when no transactions exist
      monthlyData.forEach((data: { income: number; expenses: number; net: number; transactionCount: number }) => {
        expect(data.income).toBe(0);
        expect(data.expenses).toBe(0);
        expect(data.net).toBe(0);
        expect(data.transactionCount).toBe(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty transaction array', () => {
      const monthlyData = computeMonthlyData([], 12);

      expect(monthlyData).toHaveLength(12);
      monthlyData.forEach((data: { income: number; expenses: number; net: number; transactionCount: number }) => {
        expect(data.income).toBe(0);
        expect(data.expenses).toBe(0);
        expect(data.net).toBe(0);
        expect(data.transactionCount).toBe(0);
      });
    });

    it('handles different time ranges (3, 6, 12 months)', () => {
      const transactions: Transaction[] = [
        createTransaction({ date: '2025-01-15', type: 'income', amount: 5000 }),
      ];

      const data3 = computeMonthlyData(transactions, 3);
      const data6 = computeMonthlyData(transactions, 6);
      const data12 = computeMonthlyData(transactions, 12);

      expect(data3).toHaveLength(3);
      expect(data6).toHaveLength(6);
      expect(data12).toHaveLength(12);
    });

    it('handles months with only income', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const transactions: Transaction[] = [
        createTransaction({
          date: `${currentMonth}-10`,
          type: 'income',
          amount: 50000,
        }),
        createTransaction({
          date: `${currentMonth}-20`,
          type: 'income',
          amount: 30000,
        }),
      ];

      const monthlyData = computeMonthlyData(transactions, 12);
      const currentMonthData = monthlyData.find((d: { month: string }) => d.month === currentMonth);

      expect(currentMonthData!.income).toBe(80000);
      expect(currentMonthData!.expenses).toBe(0);
      expect(currentMonthData!.net).toBe(80000);
    });

    it('handles months with only expenses', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const transactions: Transaction[] = [
        createTransaction({
          date: `${currentMonth}-10`,
          type: 'expense',
          amount: 5000,
        }),
        createTransaction({
          date: `${currentMonth}-20`,
          type: 'expense',
          amount: 3000,
        }),
      ];

      const monthlyData = computeMonthlyData(transactions, 12);
      const currentMonthData = monthlyData.find((d: { month: string }) => d.month === currentMonth);

      expect(currentMonthData!.income).toBe(0);
      expect(currentMonthData!.expenses).toBe(8000);
      expect(currentMonthData!.net).toBe(-8000);
    });
  });
});
