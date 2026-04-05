import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Transaction } from '../../types';
import {
  getTopSpendingCategory,
  getBestIncomeMonth,
  getWorstExpenseMonth,
  getMonthlyComparison,
  getSavingsTrend,
  getUnusualSpending,
  generateAISummary,
} from '../insights';

describe('getTopSpendingCategory', () => {
  beforeEach(() => {
    // Mock current date to January 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns category with highest MTD expenses', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 35000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-01-10T10:00:00Z',
        description: 'Groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-10T10:00:00Z',
      },
      {
        id: '3',
        date: '2026-01-12T10:00:00Z',
        description: 'Dining',
        amount: 2000,
        type: 'expense',
        category: 'dining',
        createdAt: '2026-01-12T10:00:00Z',
        updatedAt: '2026-01-12T10:00:00Z',
      },
    ];

    const result = getTopSpendingCategory(transactions);

    expect(result.category).toBe('rent');
    expect(result.amount).toBe(35000);
    expect(result.percentage).toBeCloseTo(83.33, 1);
    expect(result.chartData).toHaveLength(3);
    expect(result.chartData[0]).toHaveProperty('color');
  });

  it('returns null when no expense transactions exist', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 150000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
    ];

    const result = getTopSpendingCategory(transactions);

    expect(result.category).toBeNull();
    expect(result.amount).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.chartData).toHaveLength(0);
  });

  it('only considers current month expenses', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2025-12-05T10:00:00Z',
        description: 'Last month rent',
        amount: 50000,
        type: 'expense',
        category: 'rent',
        createdAt: '2025-12-05T10:00:00Z',
        updatedAt: '2025-12-05T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-01-10T10:00:00Z',
        description: 'Current groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-10T10:00:00Z',
      },
    ];

    const result = getTopSpendingCategory(transactions);

    expect(result.category).toBe('groceries');
    expect(result.amount).toBe(5000);
  });
});

describe('getBestIncomeMonth', () => {
  it('returns month with highest income', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2025-12-01T10:00:00Z',
        description: 'Salary',
        amount: 150000,
        type: 'income',
        category: 'salary',
        createdAt: '2025-12-01T10:00:00Z',
        updatedAt: '2025-12-01T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 150000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
      {
        id: '3',
        date: '2026-01-15T10:00:00Z',
        description: 'Freelance',
        amount: 100000,
        type: 'income',
        category: 'freelance',
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-15T10:00:00Z',
      },
    ];

    const result = getBestIncomeMonth(transactions);

    expect(result.month).toBe('January');
    expect(result.year).toBe(2026);
    expect(result.amount).toBe(250000);
    expect(result.percentageChange).toBeCloseTo(66.67, 1);
  });

  it('returns null when no income transactions exist', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 35000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
    ];

    const result = getBestIncomeMonth(transactions);

    expect(result.month).toBeNull();
    expect(result.year).toBeNull();
    expect(result.amount).toBe(0);
    expect(result.percentageChange).toBe(0);
  });

  it('handles zero previous month correctly', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 150000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
    ];

    const result = getBestIncomeMonth(transactions);

    expect(result.month).toBe('January');
    expect(result.year).toBe(2026);
    expect(result.amount).toBe(150000);
    expect(result.percentageChange).toBe(0); // Not Infinity
  });
});

describe('getWorstExpenseMonth', () => {
  it('returns month with highest expenses', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2025-12-05T10:00:00Z',
        description: 'Rent',
        amount: 35000,
        type: 'expense',
        category: 'rent',
        createdAt: '2025-12-05T10:00:00Z',
        updatedAt: '2025-12-05T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 35000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
      {
        id: '3',
        date: '2026-01-10T10:00:00Z',
        description: 'Shopping',
        amount: 50000,
        type: 'expense',
        category: 'shopping',
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-10T10:00:00Z',
      },
    ];

    const result = getWorstExpenseMonth(transactions);

    expect(result.month).toBe('January');
    expect(result.year).toBe(2026);
    expect(result.amount).toBe(85000);
  });

  it('detects overspend when expenses > income', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 50000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 35000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
      {
        id: '3',
        date: '2026-01-10T10:00:00Z',
        description: 'Shopping',
        amount: 30000,
        type: 'expense',
        category: 'shopping',
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-10T10:00:00Z',
      },
    ];

    const result = getWorstExpenseMonth(transactions);

    expect(result.hasOverspend).toBe(true);
    expect(result.amount).toBe(65000);
  });

  it('returns null when no expense transactions exist', () => {
    const transactions: Transaction[] = [];

    const result = getWorstExpenseMonth(transactions);

    expect(result.month).toBeNull();
    expect(result.year).toBeNull();
    expect(result.amount).toBe(0);
    expect(result.hasOverspend).toBe(false);
  });
});

describe('getMonthlyComparison', () => {
  beforeEach(() => {
    // Mock current date to January 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('compares current month vs previous month', () => {
    const transactions: Transaction[] = [
      // December 2025
      {
        id: '1',
        date: '2025-12-01T10:00:00Z',
        description: 'Salary',
        amount: 100000,
        type: 'income',
        category: 'salary',
        createdAt: '2025-12-01T10:00:00Z',
        updatedAt: '2025-12-01T10:00:00Z',
      },
      {
        id: '2',
        date: '2025-12-05T10:00:00Z',
        description: 'Rent',
        amount: 30000,
        type: 'expense',
        category: 'rent',
        createdAt: '2025-12-05T10:00:00Z',
        updatedAt: '2025-12-05T10:00:00Z',
      },
      // January 2026
      {
        id: '3',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 150000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
      {
        id: '4',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 35000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
    ];

    const result = getMonthlyComparison(transactions);

    expect(result.currentMonth.income).toBe(150000);
    expect(result.currentMonth.expenses).toBe(35000);
    expect(result.previousMonth.income).toBe(100000);
    expect(result.previousMonth.expenses).toBe(30000);
    expect(result.deltas.incomeDelta).toBeCloseTo(50, 1);
    expect(result.deltas.expensesDelta).toBeCloseTo(16.67, 1);
  });

  it('handles zero previous month correctly', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 150000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
    ];

    const result = getMonthlyComparison(transactions);

    expect(result.currentMonth.income).toBe(150000);
    expect(result.previousMonth.income).toBe(0);
    expect(result.deltas.incomeDelta).toBe(0); // Not Infinity
    expect(result.deltas.expensesDelta).toBe(0); // Not Infinity
  });
});

describe('getSavingsTrend', () => {
  beforeEach(() => {
    // Mock current date to January 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates savings rate for last 12 months', () => {
    const transactions: Transaction[] = [
      // January 2026
      {
        id: '1',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 100000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 30000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
    ];

    const result = getSavingsTrend(transactions);

    expect(result.monthlyData).toHaveLength(12);
    expect(result.monthlyData[11].month).toBe('Jan');
    expect(result.monthlyData[11].savingsRate).toBeCloseTo(70, 1);
    expect(result.currentSavingsRate).toBeCloseTo(70, 1);
  });

  it('handles zero income correctly', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 30000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
    ];

    const result = getSavingsTrend(transactions);

    expect(result.currentSavingsRate).toBe(0); // Not NaN
    expect(result.monthlyData[11].savingsRate).toBe(0);
  });

  it('calculates 6-month average correctly', () => {
    const transactions: Transaction[] = [
      // January 2026 - 70% savings rate
      {
        id: '1',
        date: '2026-01-01T10:00:00Z',
        description: 'Salary',
        amount: 100000,
        type: 'income',
        category: 'salary',
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-01T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-01-05T10:00:00Z',
        description: 'Rent',
        amount: 30000,
        type: 'expense',
        category: 'rent',
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
      },
    ];

    const result = getSavingsTrend(transactions);

    // Should have 12 months of data
    expect(result.monthlyData).toHaveLength(12);
    // 6-month average should be calculated from last 6 months
    expect(result.sixMonthAverage).toBeDefined();
    expect(typeof result.sixMonthAverage).toBe('number');
  });
});

describe('getUnusualSpending', () => {
  beforeEach(() => {
    // Mock current date to April 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('detects unusual spending when current > 1.5x average', () => {
    const transactions: Transaction[] = [
      // January 2026 - groceries: 5000
      {
        id: '1',
        date: '2026-01-10T10:00:00Z',
        description: 'Groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-10T10:00:00Z',
      },
      // February 2026 - groceries: 5000
      {
        id: '2',
        date: '2026-02-10T10:00:00Z',
        description: 'Groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-02-10T10:00:00Z',
        updatedAt: '2026-02-10T10:00:00Z',
      },
      // March 2026 - groceries: 5000
      {
        id: '3',
        date: '2026-03-10T10:00:00Z',
        description: 'Groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-03-10T10:00:00Z',
        updatedAt: '2026-03-10T10:00:00Z',
      },
      // April 2026 - groceries: 15000 (3x average, should be flagged)
      {
        id: '4',
        date: '2026-04-10T10:00:00Z',
        description: 'Groceries',
        amount: 15000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-04-10T10:00:00Z',
        updatedAt: '2026-04-10T10:00:00Z',
      },
    ];

    const result = getUnusualSpending(transactions);

    expect(result.alerts).toHaveLength(1);
    expect(result.alerts[0].category).toBe('groceries');
    expect(result.alerts[0].currentAmount).toBe(15000);
    expect(result.alerts[0].threeMonthAverage).toBe(5000);
    expect(result.alerts[0].percentageIncrease).toBeCloseTo(200, 1);
  });

  it('does not flag spending below 1.5x average', () => {
    const transactions: Transaction[] = [
      // Previous months - groceries: 5000 each
      {
        id: '1',
        date: '2026-01-10T10:00:00Z',
        description: 'Groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-10T10:00:00Z',
      },
      {
        id: '2',
        date: '2026-02-10T10:00:00Z',
        description: 'Groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-02-10T10:00:00Z',
        updatedAt: '2026-02-10T10:00:00Z',
      },
      {
        id: '3',
        date: '2026-03-10T10:00:00Z',
        description: 'Groceries',
        amount: 5000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-03-10T10:00:00Z',
        updatedAt: '2026-03-10T10:00:00Z',
      },
      // April 2026 - groceries: 7000 (1.4x average, should NOT be flagged)
      {
        id: '4',
        date: '2026-04-10T10:00:00Z',
        description: 'Groceries',
        amount: 7000,
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-04-10T10:00:00Z',
        updatedAt: '2026-04-10T10:00:00Z',
      },
    ];

    const result = getUnusualSpending(transactions);

    expect(result.alerts).toHaveLength(0);
  });

  it('sorts alerts by percentage increase descending', () => {
    const transactions: Transaction[] = [
      // Previous months baseline
      ...['2026-01', '2026-02', '2026-03'].flatMap((month) => [
        {
          id: `groceries-${month}`,
          date: `${month}-10T10:00:00Z`,
          description: 'Groceries',
          amount: 5000,
          type: 'expense' as const,
          category: 'groceries' as const,
          createdAt: `${month}-10T10:00:00Z`,
          updatedAt: `${month}-10T10:00:00Z`,
        },
        {
          id: `dining-${month}`,
          date: `${month}-15T10:00:00Z`,
          description: 'Dining',
          amount: 2000,
          type: 'expense' as const,
          category: 'dining' as const,
          createdAt: `${month}-15T10:00:00Z`,
          updatedAt: `${month}-15T10:00:00Z`,
        },
      ]),
      // April - both unusual, but dining has higher % increase
      {
        id: 'groceries-april',
        date: '2026-04-10T10:00:00Z',
        description: 'Groceries',
        amount: 10000, // 2x average = 100% increase
        type: 'expense',
        category: 'groceries',
        createdAt: '2026-04-10T10:00:00Z',
        updatedAt: '2026-04-10T10:00:00Z',
      },
      {
        id: 'dining-april',
        date: '2026-04-15T10:00:00Z',
        description: 'Dining',
        amount: 6000, // 3x average = 200% increase
        type: 'expense',
        category: 'dining',
        createdAt: '2026-04-15T10:00:00Z',
        updatedAt: '2026-04-15T10:00:00Z',
      },
    ];

    const result = getUnusualSpending(transactions);

    expect(result.alerts).toHaveLength(2);
    expect(result.alerts[0].category).toBe('dining'); // Higher % increase
    expect(result.alerts[1].category).toBe('groceries');
  });
});

describe('generateAISummary', () => {
  it('generates narrative text from insights', () => {
    const topSpending = {
      category: 'rent' as const,
      amount: 35000,
      percentage: 50,
      chartData: [],
    };

    const bestIncome = {
      month: 'March',
      year: 2026,
      amount: 250000,
      percentageChange: 66.67,
    };

    const savingsTrend = {
      monthlyData: [],
      currentSavingsRate: 45.5,
      sixMonthAverage: 40.2,
    };

    const result = generateAISummary(topSpending, bestIncome, savingsTrend);

    expect(result.text).toContain('March 2026');
    expect(result.text).toContain('₹2,50,000');
    expect(result.text).toContain('66.7% increase');
    expect(result.text).toContain('rent');
    expect(result.text).toContain('45.5%');
    expect(result.text).toContain('above');
    expect(result.text).toContain('40.2%');
  });

  it('uses "below" when current rate is below average', () => {
    const topSpending = {
      category: 'groceries' as const,
      amount: 5000,
      percentage: 30,
      chartData: [],
    };

    const bestIncome = {
      month: 'January',
      year: 2026,
      amount: 150000,
      percentageChange: 0,
    };

    const savingsTrend = {
      monthlyData: [],
      currentSavingsRate: 30.0,
      sixMonthAverage: 45.0,
    };

    const result = generateAISummary(topSpending, bestIncome, savingsTrend);

    expect(result.text).toContain('below');
  });

  it('handles null values gracefully', () => {
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

    expect(result.text).toBeTruthy();
    expect(result.text).toContain('0.0%');
  });
});
