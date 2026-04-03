import type { Transaction } from '../../types';

export interface SummaryStats {
  totalBalance: number;
  totalBalanceDelta: number;
  totalIncome: number;
  totalIncomeDelta: number;
  totalExpenses: number;
  totalExpensesDelta: number;
  savingsRate: number;
  savingsRateDelta: number;
}

export function computeSummaryStats(transactions: Transaction[]): SummaryStats {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Calculate previous month
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  // Filter transactions for current month (MTD)
  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth));

  // Filter transactions for previous month
  const previousMonthTransactions = transactions.filter((t) => t.date.startsWith(previousMonth));

  // Compute current month totals
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Compute savings rate (handle division by zero)
  const savingsRate = totalIncome === 0 ? 0 : ((totalIncome - totalExpenses) / totalIncome) * 100;

  // Compute total balance (sum of all transactions)
  const totalBalance = transactions.reduce((sum, t) => {
    if (t.type === 'income') return sum + t.amount;
    if (t.type === 'expense') return sum - Math.abs(t.amount);
    return sum; // transfer type doesn't affect balance
  }, 0);

  // Compute previous month totals
  const prevIncome = previousMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const prevExpenses = previousMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const prevSavingsRate = prevIncome === 0 ? 0 : ((prevIncome - prevExpenses) / prevIncome) * 100;

  // Compute previous month balance (all transactions up to end of previous month)
  const prevBalance = transactions
    .filter((t) => t.date < currentMonth)
    .reduce((sum, t) => {
      if (t.type === 'income') return sum + t.amount;
      if (t.type === 'expense') return sum - Math.abs(t.amount);
      return sum;
    }, 0);

  // Compute MoM deltas (handle division by zero)
  const totalBalanceDelta =
    prevBalance === 0 ? 0 : ((totalBalance - prevBalance) / prevBalance) * 100;
  const totalIncomeDelta = prevIncome === 0 ? 0 : ((totalIncome - prevIncome) / prevIncome) * 100;
  const totalExpensesDelta =
    prevExpenses === 0 ? 0 : ((totalExpenses - prevExpenses) / prevExpenses) * 100;
  const savingsRateDelta =
    prevSavingsRate === 0 ? 0 : ((savingsRate - prevSavingsRate) / prevSavingsRate) * 100;

  return {
    totalBalance,
    totalBalanceDelta,
    totalIncome,
    totalIncomeDelta,
    totalExpenses,
    totalExpensesDelta,
    savingsRate,
    savingsRateDelta,
  };
}
