import { useMemo } from 'react';
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import { useTransactionsStore } from '../../stores/transactionsStore';
import { computeSummaryStats } from '../../stores/selectors/summaryStatsSelector';
import { computeMonthlyData } from '../../stores/selectors/monthlyDataSelector';
import { KPICard } from './KPICard';

export function KPICardsGrid() {
  const transactions = useTransactionsStore((state) => state.transactions);

  // Compute summary stats using selector
  const summaryStats = useMemo(() => computeSummaryStats(transactions), [transactions]);

  // Compute monthly data for sparklines (last 6 months)
  const monthlyData = useMemo(() => computeMonthlyData(transactions, 6), [transactions]);

  // Extract sparkline data for each KPI
  const balanceSparkline = useMemo(() => {
    // Calculate cumulative balance for each month
    return monthlyData.reduce<number[]>((acc, month) => {
      const previousBalance = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(previousBalance + month.net);
      return acc;
    }, []);
  }, [monthlyData]);

  const incomeSparkline = useMemo(() => monthlyData.map((month) => month.income), [monthlyData]);

  const expensesSparkline = useMemo(
    () => monthlyData.map((month) => month.expenses),
    [monthlyData]
  );

  const savingsRateSparkline = useMemo(
    () =>
      monthlyData.map((month) =>
        month.income === 0 ? 0 : ((month.income - month.expenses) / month.income) * 100
      ),
    [monthlyData]
  );

  const kpiCards = [
    {
      label: 'Total Balance',
      value: summaryStats.totalBalance,
      delta: summaryStats.totalBalanceDelta,
      icon: DollarSign,
      sparklineData: balanceSparkline,
      format: 'currency' as const,
    },
    {
      label: 'Total Income',
      value: summaryStats.totalIncome,
      delta: summaryStats.totalIncomeDelta,
      icon: TrendingUp,
      sparklineData: incomeSparkline,
      format: 'currency' as const,
    },
    {
      label: 'Total Expenses',
      value: summaryStats.totalExpenses,
      delta: summaryStats.totalExpensesDelta,
      icon: CreditCard,
      sparklineData: expensesSparkline,
      format: 'currency' as const,
    },
    {
      label: 'Savings Rate',
      value: summaryStats.savingsRate,
      delta: summaryStats.savingsRateDelta,
      icon: PiggyBank,
      sparklineData: savingsRateSparkline,
      format: 'percentage' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((card, index) => (
        <div
          key={card.label}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <KPICard
            label={card.label}
            value={card.value}
            delta={card.delta}
            icon={card.icon}
            sparklineData={card.sparklineData}
            format={card.format}
          />
        </div>
      ))}
    </div>
  );
}
