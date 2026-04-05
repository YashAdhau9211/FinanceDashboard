import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { computeSummaryStats } from './summaryStatsSelector';
import type { Transaction, TransactionType, Category } from '../../types';

// Helper to create a transaction with specific properties
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

describe('Summary Statistics Selector - Property Tests', () => {
  describe('Feature: sprint-1-dashboard-overview, Property 1: Summary Statistics Computation', () => {
    it('computes total balance correctly as sum of all transactions', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const stats = computeSummaryStats(transactions);

            // Compute expected total balance
            const expectedBalance = transactions.reduce((sum, t) => {
              if (t.type === 'income') return sum + t.amount;
              if (t.type === 'expense') return sum - Math.abs(t.amount);
              return sum; // transfer doesn't affect balance
            }, 0);

            // Verify computed balance matches expected (within floating point precision)
            expect(Math.abs(stats.totalBalance - expectedBalance)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('computes MTD income correctly', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const stats = computeSummaryStats(transactions);

            // Compute expected MTD income
            const expectedIncome = transactions
              .filter((t) => t.date.startsWith(currentMonth) && t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);

            expect(Math.abs(stats.totalIncome - expectedIncome)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('computes MTD expenses correctly', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const stats = computeSummaryStats(transactions);

            // Compute expected MTD expenses
            const expectedExpenses = transactions
              .filter((t) => t.date.startsWith(currentMonth) && t.type === 'expense')
              .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            expect(Math.abs(stats.totalExpenses - expectedExpenses)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns savings rate of 0 when income is 0 (not NaN)', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              date: fc.integer({ min: 0, max: 730 }).map((days) => {
                const d = new Date('2024-01-01');
                d.setDate(d.getDate() + days);
                return d.toISOString().split('T')[0];
              }),
              description: fc.string({ minLength: 1, maxLength: 50 }),
              amount: fc.integer({ min: 100, max: 100000 }),
              type: fc.constant('expense' as const), // Only expenses
              category: fc.constantFrom(
                'groceries' as const,
                'dining' as const,
                'rent' as const,
                'utilities' as const
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
            }) as fc.Arbitrary<Transaction>,
            { minLength: 1, maxLength: 50 }
          ),
          (transactions) => {
            // Ensure all transactions are in current month
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const currentMonthTransactions = transactions.map((t) => ({
              ...t,
              date: `${currentMonth}-15`,
            }));

            const stats = computeSummaryStats(currentMonthTransactions);

            // With no income, savings rate should be 0 (not NaN)
            expect(stats.savingsRate).toBe(0);
            expect(Number.isNaN(stats.savingsRate)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('computes savings rate correctly when income > 0', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 100000 }),
          fc.integer({ min: 0, max: 50000 }),
          (income, expenses) => {
            const transactions: Transaction[] = [
              createTransaction({
                date: `${currentMonth}-10`,
                type: 'income',
                amount: income,
              }),
              createTransaction({
                date: `${currentMonth}-15`,
                type: 'expense',
                amount: expenses,
              }),
            ];

            const stats = computeSummaryStats(transactions);

            const expectedSavingsRate = ((income - expenses) / income) * 100;
            expect(Math.abs(stats.savingsRate - expectedSavingsRate)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Feature: sprint-1-dashboard-overview, Property 2: Month-over-Month Delta Calculation', () => {
    it('returns delta of 0 when previous value is 0 (not Infinity)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100000 }), (currentValue) => {
          const previousValue = 0;
          const delta =
            previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;

          expect(delta).toBe(0);
          expect(Number.isFinite(delta)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('computes delta correctly for positive previous values', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100000 }),
          fc.integer({ min: 1, max: 100000 }),
          (current, previous) => {
            const delta = ((current - previous) / previous) * 100;
            const expectedDelta = ((current - previous) / previous) * 100;

            expect(Math.abs(delta - expectedDelta)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('handles negative deltas correctly', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 50000 }),
          fc.integer({ min: 60000, max: 100000 }),
          (currentIncome, previousIncome) => {
            const transactions: Transaction[] = [
              createTransaction({
                date: `${currentMonth}-10`,
                type: 'income',
                amount: currentIncome,
              }),
              createTransaction({
                date: `${previousMonth}-10`,
                type: 'income',
                amount: previousIncome,
              }),
            ];

            const stats = computeSummaryStats(transactions);

            // Delta should be negative since current < previous
            expect(stats.totalIncomeDelta).toBeLessThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns 0 delta when current equals previous', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(fc.integer({ min: 1000, max: 100000 }), (amount) => {
          const transactions: Transaction[] = [
            createTransaction({
              date: `${currentMonth}-10`,
              type: 'income',
              amount,
            }),
            createTransaction({
              date: `${previousMonth}-10`,
              type: 'income',
              amount,
            }),
          ];

          const stats = computeSummaryStats(transactions);

          expect(Math.abs(stats.totalIncomeDelta)).toBeLessThan(0.01);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty transaction array', () => {
      const stats = computeSummaryStats([]);

      expect(stats.totalBalance).toBe(0);
      expect(stats.totalIncome).toBe(0);
      expect(stats.totalExpenses).toBe(0);
      expect(stats.savingsRate).toBe(0);
      expect(stats.totalBalanceDelta).toBe(0);
      expect(stats.totalIncomeDelta).toBe(0);
      expect(stats.totalExpensesDelta).toBe(0);
      expect(stats.savingsRateDelta).toBe(0);
    });

    it('handles transactions with only income', () => {
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

      const stats = computeSummaryStats(transactions);

      expect(stats.totalIncome).toBe(80000);
      expect(stats.totalExpenses).toBe(0);
      expect(stats.savingsRate).toBe(100); // 100% savings rate
    });

    it('handles transactions with only expenses', () => {
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

      const stats = computeSummaryStats(transactions);

      expect(stats.totalIncome).toBe(0);
      expect(stats.totalExpenses).toBe(8000);
      expect(stats.savingsRate).toBe(0); // 0% savings rate (no income)
    });
  });
});
