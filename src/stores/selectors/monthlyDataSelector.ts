import type { Transaction, MonthlyData } from '../../types';

export function computeMonthlyData(
  transactions: Transaction[],
  months: number = 12
): MonthlyData[] {
  const now = new Date();

  // Generate array of last N months in YYYY-MM format
  const monthKeys: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthKeys.push(monthKey);
  }

  // Compute data for each month
  const monthlyData: MonthlyData[] = monthKeys.map((monthKey) => {
    // Filter transactions for this month
    const monthTransactions = transactions.filter((t) => t.date.startsWith(monthKey));

    // Compute income
    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Compute expenses (absolute value)
    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Compute net
    const net = income - expenses;

    // Count transactions
    const transactionCount = monthTransactions.length;

    return {
      month: monthKey,
      income,
      expenses,
      net,
      transactionCount,
    };
  });

  // Return array sorted chronologically (oldest to newest)
  return monthlyData;
}
