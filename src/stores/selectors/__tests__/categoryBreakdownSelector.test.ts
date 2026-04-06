import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { computeCategoryBreakdown, CATEGORY_COLORS } from '../categoryBreakdownSelector';
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

describe('Category Breakdown Selector - Property Tests', () => {
  describe('Feature: sprint-1-dashboard-overview, Property 5: Category Breakdown Filtering', () => {
    it('includes only expense transactions', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 0, maxLength: 100 }),
          (transactions) => {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            // Ensure some transactions are in current month
            const adjustedTransactions = transactions.map((t, i) => ({
              ...t,
              date: i % 2 === 0 ? `${currentMonth}-15` : t.date,
            }));

            const categoryData = computeCategoryBreakdown(adjustedTransactions);

            // Verify all included transactions were expenses
            const expenseTransactions = adjustedTransactions.filter(
              (t) => t.type === 'expense' && t.date.startsWith(currentMonth)
            );

            const totalFromCategories = categoryData.reduce((sum, c) => sum + c.amount, 0);
            const totalExpenses = expenseTransactions.reduce(
              (sum, t) => sum + Math.abs(t.amount),
              0
            );

            expect(Math.abs(totalFromCategories - totalExpenses)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('includes only MTD transactions', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000 }),
          fc.integer({ min: 1000, max: 10000 }),
          (currentAmount, previousAmount) => {
            const transactions: Transaction[] = [
              createTransaction({
                date: `${currentMonth}-15`,
                type: 'expense',
                category: 'groceries',
                amount: currentAmount,
              }),
              createTransaction({
                date: `${previousMonth}-15`,
                type: 'expense',
                category: 'groceries',
                amount: previousAmount,
              }),
            ];

            const categoryData = computeCategoryBreakdown(transactions);

            // Should only include current month transaction
            const groceriesData = categoryData.find((c) => c.category === 'groceries');
            expect(groceriesData?.amount).toBe(currentAmount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns empty array when no expense transactions exist', () => {
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
              type: fc.constantFrom('income' as const, 'transfer' as const), // No expenses
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
            }) as fc.Arbitrary<Transaction>,
            { minLength: 0, maxLength: 50 }
          ),
          (transactions) => {
            const categoryData = computeCategoryBreakdown(transactions);
            expect(categoryData).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('groups expenses by category', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.constantFrom('groceries' as const, 'dining' as const, 'rent' as const),
          fc.array(fc.integer({ min: 1000, max: 10000 }), { minLength: 1, maxLength: 10 }),
          (category, amounts) => {
            const transactions: Transaction[] = amounts.map((amount) =>
              createTransaction({
                date: `${currentMonth}-15`,
                type: 'expense',
                category,
                amount,
              })
            );

            const categoryData = computeCategoryBreakdown(transactions);

            const categoryEntry = categoryData.find((c) => c.category === category);
            const expectedTotal = amounts.reduce((sum, a) => sum + a, 0);

            expect(categoryEntry).toBeDefined();
            expect(Math.abs(categoryEntry!.amount - expectedTotal)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Feature: sprint-1-dashboard-overview, Property 6: Category Breakdown Percentage Calculation', () => {
    it('computes percentages that sum to 100', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              category: fc.constantFrom(
                'groceries' as const,
                'dining' as const,
                'rent' as const,
                'utilities' as const,
                'transportation' as const
              ),
              amount: fc.integer({ min: 1000, max: 10000 }),
            }),
            { minLength: 1, maxLength: 8 }
          ),
          (categoryAmounts) => {
            const transactions: Transaction[] = categoryAmounts.map(({ category, amount }) =>
              createTransaction({
                date: `${currentMonth}-15`,
                type: 'expense',
                category,
                amount,
              })
            );

            const categoryData = computeCategoryBreakdown(transactions);

            // Sum of all percentages should equal 100 (within rounding error)
            const totalPercentage = categoryData.reduce((sum, c) => sum + c.percentage, 0);
            expect(Math.abs(totalPercentage - 100)).toBeLessThan(0.1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('computes each category percentage correctly', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              category: fc.constantFrom('groceries' as const, 'dining' as const, 'rent' as const),
              amount: fc.integer({ min: 1000, max: 10000 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (categoryAmounts) => {
            const transactions: Transaction[] = categoryAmounts.map(({ category, amount }) =>
              createTransaction({
                date: `${currentMonth}-15`,
                type: 'expense',
                category,
                amount,
              })
            );

            const categoryData = computeCategoryBreakdown(transactions);

            const totalExpenses = categoryAmounts.reduce((sum, c) => sum + c.amount, 0);

            categoryData.forEach((data) => {
              const expectedPercentage = (data.amount / totalExpenses) * 100;
              expect(Math.abs(data.percentage - expectedPercentage)).toBeLessThan(0.01);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Feature: sprint-1-dashboard-overview, Property 7: Category Breakdown Sorting', () => {
    it('sorts categories by amount descending', () => {
      fc.assert(
        fc.property(
          fc.array(transactionGenerator, { minLength: 1, maxLength: 100 }),
          (transactions) => {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            // Ensure transactions are in current month and are expenses
            const adjustedTransactions = transactions.map((t) => ({
              ...t,
              date: `${currentMonth}-15`,
              type: 'expense' as const,
            }));

            const categoryData = computeCategoryBreakdown(adjustedTransactions);

            // Verify descending order
            for (let i = 1; i < categoryData.length; i++) {
              expect(categoryData[i - 1].amount).toBeGreaterThanOrEqual(categoryData[i].amount);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty transaction array', () => {
      const categoryData = computeCategoryBreakdown([]);
      expect(categoryData).toEqual([]);
    });

    it('assigns correct colors from CATEGORY_COLORS map', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const transactions: Transaction[] = [
        createTransaction({
          date: `${currentMonth}-15`,
          type: 'expense',
          category: 'groceries',
          amount: 5000,
        }),
        createTransaction({
          date: `${currentMonth}-15`,
          type: 'expense',
          category: 'dining',
          amount: 3000,
        }),
      ];

      const categoryData = computeCategoryBreakdown(transactions);

      categoryData.forEach((data) => {
        expect(data.color).toBe(CATEGORY_COLORS[data.category]);
      });
    });

    it('handles single category', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const transactions: Transaction[] = [
        createTransaction({
          date: `${currentMonth}-15`,
          type: 'expense',
          category: 'groceries',
          amount: 5000,
        }),
      ];

      const categoryData = computeCategoryBreakdown(transactions);

      expect(categoryData).toHaveLength(1);
      expect(categoryData[0].category).toBe('groceries');
      expect(categoryData[0].amount).toBe(5000);
      expect(categoryData[0].percentage).toBe(100);
    });

    it('handles multiple transactions in same category', () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const transactions: Transaction[] = [
        createTransaction({
          date: `${currentMonth}-10`,
          type: 'expense',
          category: 'groceries',
          amount: 2000,
        }),
        createTransaction({
          date: `${currentMonth}-15`,
          type: 'expense',
          category: 'groceries',
          amount: 3000,
        }),
        createTransaction({
          date: `${currentMonth}-20`,
          type: 'expense',
          category: 'groceries',
          amount: 1000,
        }),
      ];

      const categoryData = computeCategoryBreakdown(transactions);

      expect(categoryData).toHaveLength(1);
      expect(categoryData[0].category).toBe('groceries');
      expect(categoryData[0].amount).toBe(6000);
      expect(categoryData[0].percentage).toBe(100);
    });
  });
});
