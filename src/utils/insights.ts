import type { Transaction, Category } from '../types';

// Insight interfaces
export interface TopSpendingCategoryInsight {
  category: Category | null;
  amount: number;
  percentage: number;
  chartData: Array<{ category: Category; amount: number; color: string }>;
}

export interface BestIncomeMonthInsight {
  month: string | null;
  year: number | null;
  amount: number;
  percentageChange: number;
  monthlyData?: Array<{ month: string; amount: number }>;
}

export interface WorstExpenseMonthInsight {
  month: string | null;
  year: number | null;
  amount: number;
  hasOverspend: boolean;
  monthlyData?: Array<{ month: string; amount: number }>;
}

export interface MonthlyComparisonInsight {
  currentMonth: {
    income: number;
    expenses: number;
  };
  previousMonth: {
    income: number;
    expenses: number;
  };
  deltas: {
    incomeDelta: number;
    expensesDelta: number;
  };
}

export interface SavingsTrendInsight {
  monthlyData: Array<{
    month: string;
    savingsRate: number;
  }>;
  currentSavingsRate: number;
  sixMonthAverage: number;
}

export interface UnusualSpendingInsight {
  alerts: Array<{
    category: Category;
    currentAmount: number;
    threeMonthAverage: number;
    percentageIncrease: number;
  }>;
}

export interface AISummary {
  text: string;
}

// Helper function to get category colors
const categoryColors: Record<Category, string> = {
  salary: '#10B981',
  freelance: '#3B82F6',
  investment: '#8B5CF6',
  rent: '#EF4444',
  utilities: '#F59E0B',
  groceries: '#84CC16',
  dining: '#EC4899',
  transportation: '#06B6D4',
  entertainment: '#A855F7',
  healthcare: '#14B8A6',
  shopping: '#F97316',
  transfer: '#6B7280',
  other: '#9CA3AF',
};

// Helper function to get current month/year
function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

// Helper function to format month name
function getMonthName(monthIndex: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthIndex];
}

// Helper function to get short month name
function getShortMonthName(monthIndex: number): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[monthIndex];
}

// Helper function to check if transaction is in a specific month/year
function isInMonth(transaction: Transaction, month: number, year: number): boolean {
  const date = new Date(transaction.date);
  return date.getMonth() === month && date.getFullYear() === year;
}

/**
 * Get top spending category for current month
 */
export function getTopSpendingCategory(transactions: Transaction[]): TopSpendingCategoryInsight {
  try {
    const { month, year } = getCurrentMonthYear();

    // Filter to current month expenses
    const currentMonthExpenses = transactions.filter(
      (t) => t.type === 'expense' && isInMonth(t, month, year)
    );

    // Handle edge case: no expense transactions
    if (currentMonthExpenses.length === 0) {
      return {
        category: null,
        amount: 0,
        percentage: 0,
        chartData: [],
      };
    }

    // Group by category and sum amounts
    const categoryTotals = new Map<Category, number>();
    currentMonthExpenses.forEach((t) => {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + t.amount);
    });

    // Find category with max amount
    let topCategory: Category | null = null;
    let maxAmount = 0;
    let totalExpenses = 0;

    categoryTotals.forEach((amount, category) => {
      totalExpenses += amount;
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = category;
      }
    });

    // Calculate percentage
    const percentage = totalExpenses > 0 ? (maxAmount / totalExpenses) * 100 : 0;

    // Build chart data
    const chartData = Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category,
      amount,
      color: categoryColors[category],
    }));

    return {
      category: topCategory,
      amount: maxAmount,
      percentage,
      chartData,
    };
  } catch (error) {
    console.error('Error in getTopSpendingCategory:', error);
    return {
      category: null,
      amount: 0,
      percentage: 0,
      chartData: [],
    };
  }
}

/**
 * Get best income month across all data
 */
export function getBestIncomeMonth(transactions: Transaction[]): BestIncomeMonthInsight {
  try {
    // Filter to income transactions
    const incomeTransactions = transactions.filter((t) => t.type === 'income');

    // Handle edge case: no income transactions
    if (incomeTransactions.length === 0) {
      return {
        month: null,
        year: null,
        amount: 0,
        percentageChange: 0,
        monthlyData: [],
      };
    }

    // Group by month-year and sum amounts
    const monthlyIncome = new Map<string, { month: number; year: number; amount: number }>();

    incomeTransactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      const current = monthlyIncome.get(key) || { month, year, amount: 0 };
      current.amount += t.amount;
      monthlyIncome.set(key, current);
    });

    // Find month with max income
    const monthlyIncomeArray = Array.from(monthlyIncome.values());
    if (monthlyIncomeArray.length === 0) {
      return {
        month: null,
        year: null,
        amount: 0,
        percentageChange: 0,
        monthlyData: [],
      };
    }

    const bestMonth = monthlyIncomeArray.reduce((max, current) =>
      current.amount > max.amount ? current : max
    );

    // Calculate percentage change vs previous month
    const prevMonth = bestMonth.month === 0 ? 11 : bestMonth.month - 1;
    const prevYear = bestMonth.month === 0 ? bestMonth.year - 1 : bestMonth.year;
    const prevKey = `${prevYear}-${prevMonth}`;
    const prevMonthData = monthlyIncome.get(prevKey);

    let percentageChange = 0;
    if (prevMonthData && prevMonthData.amount > 0) {
      percentageChange = ((bestMonth.amount - prevMonthData.amount) / prevMonthData.amount) * 100;
    } else if (prevMonthData && prevMonthData.amount === 0) {
      // Handle edge case: zero previous month
      percentageChange = 0;
    }

    // Get last 6 months of income data for bar chart
    const sortedMonths = monthlyIncomeArray
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .slice(-6);

    const monthlyData = sortedMonths.map((m) => ({
      month: getShortMonthName(m.month),
      amount: m.amount,
    }));

    return {
      month: getMonthName(bestMonth.month),
      year: bestMonth.year,
      amount: bestMonth.amount,
      percentageChange,
      monthlyData,
    };
  } catch (error) {
    console.error('Error in getBestIncomeMonth:', error);
    return {
      month: null,
      year: null,
      amount: 0,
      percentageChange: 0,
      monthlyData: [],
    };
  }
}

/**
 * Get worst expense month across all data
 */
export function getWorstExpenseMonth(transactions: Transaction[]): WorstExpenseMonthInsight {
  try {
    // Filter to expense transactions
    const expenseTransactions = transactions.filter((t) => t.type === 'expense');

    // Handle edge case: no expense transactions
    if (expenseTransactions.length === 0) {
      return {
        month: null,
        year: null,
        amount: 0,
        hasOverspend: false,
        monthlyData: [],
      };
    }

    // Group by month-year and sum amounts
    const monthlyExpenses = new Map<string, { month: number; year: number; amount: number }>();

    expenseTransactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      const current = monthlyExpenses.get(key) || { month, year, amount: 0 };
      current.amount += t.amount;
      monthlyExpenses.set(key, current);
    });

    // Find month with max expenses
    const monthlyExpensesArray = Array.from(monthlyExpenses.values());
    if (monthlyExpensesArray.length === 0) {
      return {
        month: null,
        year: null,
        amount: 0,
        hasOverspend: false,
        monthlyData: [],
      };
    }

    const worstMonth = monthlyExpensesArray.reduce((max, current) =>
      current.amount > max.amount ? current : max
    );

    // Check if expenses > income for that month (overspend)
    const incomeForMonth = transactions
      .filter((t) => t.type === 'income')
      .filter((t) => {
        const date = new Date(t.date);
        return date.getMonth() === worstMonth.month && date.getFullYear() === worstMonth.year;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const hasOverspend = worstMonth.amount > incomeForMonth;

    // Get last 6 months of expense data for bar chart
    const sortedMonths = monthlyExpensesArray
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .slice(-6);

    const monthlyData = sortedMonths.map((m) => ({
      month: getShortMonthName(m.month),
      amount: m.amount,
    }));

    return {
      month: getMonthName(worstMonth.month),
      year: worstMonth.year,
      amount: worstMonth.amount,
      hasOverspend,
      monthlyData,
    };
  } catch (error) {
    console.error('Error in getWorstExpenseMonth:', error);
    return {
      month: null,
      year: null,
      amount: 0,
      hasOverspend: false,
      monthlyData: [],
    };
  }
}

/**
 * Get monthly comparison (current vs previous month)
 */
export function getMonthlyComparison(transactions: Transaction[]): MonthlyComparisonInsight {
  try {
    const { month: currentMonth, year: currentYear } = getCurrentMonthYear();

    // Calculate previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Sum income and expenses for current month
    const currentIncome = transactions
      .filter((t) => t.type === 'income' && isInMonth(t, currentMonth, currentYear))
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = transactions
      .filter((t) => t.type === 'expense' && isInMonth(t, currentMonth, currentYear))
      .reduce((sum, t) => sum + t.amount, 0);

    // Sum income and expenses for previous month
    const prevIncome = transactions
      .filter((t) => t.type === 'income' && isInMonth(t, prevMonth, prevYear))
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = transactions
      .filter((t) => t.type === 'expense' && isInMonth(t, prevMonth, prevYear))
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate percentage deltas
    // Handle edge case: if previous is 0, return 0 (not Infinity)
    const incomeDelta = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;

    const expensesDelta =
      prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    return {
      currentMonth: {
        income: currentIncome,
        expenses: currentExpenses,
      },
      previousMonth: {
        income: prevIncome,
        expenses: prevExpenses,
      },
      deltas: {
        incomeDelta,
        expensesDelta,
      },
    };
  } catch (error) {
    console.error('Error in getMonthlyComparison:', error);
    return {
      currentMonth: {
        income: 0,
        expenses: 0,
      },
      previousMonth: {
        income: 0,
        expenses: 0,
      },
      deltas: {
        incomeDelta: 0,
        expensesDelta: 0,
      },
    };
  }
}

/**
 * Get savings trend for last 12 months
 */
export function getSavingsTrend(transactions: Transaction[]): SavingsTrendInsight {
  try {
    const { month: currentMonth, year: currentYear } = getCurrentMonthYear();

    // Get last 12 months (from current month backwards)
    const monthlyData: Array<{ month: string; savingsRate: number }> = [];

    for (let i = 11; i >= 0; i--) {
      const targetMonth = (currentMonth - i + 12) % 12;
      const targetYear =
        currentMonth - i < 0 ? currentYear - Math.ceil((i - currentMonth) / 12) : currentYear;

      // Calculate income and expenses for this month
      const income = transactions
        .filter((t) => t.type === 'income' && isInMonth(t, targetMonth, targetYear))
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter((t) => t.type === 'expense' && isInMonth(t, targetMonth, targetYear))
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate savings rate: (income - expenses) / income * 100
      // Handle edge case: if income is 0, return 0% (not NaN)
      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

      monthlyData.push({
        month: getShortMonthName(targetMonth),
        savingsRate,
      });
    }

    // Current savings rate is the last month in the array
    const currentSavingsRate = monthlyData[monthlyData.length - 1]?.savingsRate || 0;

    // Calculate 6-month average
    const last6Months = monthlyData.slice(-6);
    const sixMonthAverage =
      last6Months.length > 0
        ? last6Months.reduce((sum, data) => sum + data.savingsRate, 0) / last6Months.length
        : 0;

    return {
      monthlyData,
      currentSavingsRate,
      sixMonthAverage,
    };
  } catch (error) {
    console.error('Error in getSavingsTrend:', error);
    return {
      monthlyData: [],
      currentSavingsRate: 0,
      sixMonthAverage: 0,
    };
  }
}

/**
 * Get unusual spending alerts
 */
export function getUnusualSpending(transactions: Transaction[]): UnusualSpendingInsight {
  try {
    const { month: currentMonth, year: currentYear } = getCurrentMonthYear();

    // Get current month and previous 3 months
    const months: Array<{ month: number; year: number }> = [];
    for (let i = 0; i <= 3; i++) {
      const targetMonth = (currentMonth - i + 12) % 12;
      const targetYear =
        currentMonth - i < 0 ? currentYear - Math.ceil((i - currentMonth) / 12) : currentYear;
      months.push({ month: targetMonth, year: targetYear });
    }

    const [current, ...previous3] = months;

    // Get expenses by category for current month
    const currentExpenses = new Map<Category, number>();
    transactions
      .filter((t) => t.type === 'expense' && isInMonth(t, current.month, current.year))
      .forEach((t) => {
        const amount = currentExpenses.get(t.category) || 0;
        currentExpenses.set(t.category, amount + t.amount);
      });

    // Get expenses by category for previous 3 months
    const previous3Expenses = new Map<Category, number[]>();
    previous3.forEach(({ month, year }) => {
      transactions
        .filter((t) => t.type === 'expense' && isInMonth(t, month, year))
        .forEach((t) => {
          const amounts = previous3Expenses.get(t.category) || [];
          amounts.push(t.amount);
          previous3Expenses.set(t.category, amounts);
        });
    });

    // Calculate 3-month average for each category
    const threeMonthAverages = new Map<Category, number>();
    previous3Expenses.forEach((amounts, category) => {
      const total = amounts.reduce((sum, amt) => sum + amt, 0);
      const average = total / 3; // Divide by 3 months, not by number of transactions
      threeMonthAverages.set(category, average);
    });

    // Find unusual spending (current > 1.5 * average)
    const alerts: Array<{
      category: Category;
      currentAmount: number;
      threeMonthAverage: number;
      percentageIncrease: number;
    }> = [];

    currentExpenses.forEach((currentAmount, category) => {
      const average = threeMonthAverages.get(category) || 0;

      if (average > 0 && currentAmount > 1.5 * average) {
        const percentageIncrease = ((currentAmount - average) / average) * 100;
        alerts.push({
          category,
          currentAmount,
          threeMonthAverage: average,
          percentageIncrease,
        });
      }
    });

    // Sort by percentage increase descending
    alerts.sort((a, b) => b.percentageIncrease - a.percentageIncrease);

    return { alerts };
  } catch (error) {
    console.error('Error in getUnusualSpending:', error);
    return { alerts: [] };
  }
}

/**
 * Generate AI-style summary from insights
 */
export function generateAISummary(
  topSpending: TopSpendingCategoryInsight,
  bestIncome: BestIncomeMonthInsight,
  savingsTrend: SavingsTrendInsight
): AISummary {
  try {
    const parts: string[] = [];

    // Best income month
    if (bestIncome.month && bestIncome.year) {
      const changeText =
        bestIncome.percentageChange > 0
          ? `${bestIncome.percentageChange.toFixed(1)}% increase`
          : bestIncome.percentageChange < 0
            ? `${Math.abs(bestIncome.percentageChange).toFixed(1)}% decrease`
            : 'no change';

      parts.push(
        `Your best income month was ${bestIncome.month} ${bestIncome.year} with ₹${bestIncome.amount.toLocaleString('en-IN')} (${changeText}).`
      );
    }

    // Top spending category
    if (topSpending.category) {
      parts.push(`Your top spending category is ${topSpending.category}.`);
    }

    // Savings rate comparison
    const comparison =
      savingsTrend.currentSavingsRate >= savingsTrend.sixMonthAverage ? 'above' : 'below';

    parts.push(
      `Your current savings rate is ${savingsTrend.currentSavingsRate.toFixed(1)}%, ${comparison} your 6-month average of ${savingsTrend.sixMonthAverage.toFixed(1)}%.`
    );

    return {
      text: parts.join(' '),
    };
  } catch (error) {
    console.error('Error in generateAISummary:', error);
    return {
      text: 'Unable to generate financial insights at this time.',
    };
  }
}
