import { useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import { useTransactionsStore } from '../../stores/transactionsStore';
import { useRoleStore } from '../../stores/roleStore';
import { computeSummaryStats } from '../../stores/selectors/summaryStatsSelector';
import { computeMonthlyData } from '../../stores/selectors/monthlyDataSelector';
import { KPICard } from './KPICard';

export function KPICardsGrid() {
  const transactions = useTransactionsStore((state) => state.transactions);
  const role = useRoleStore((state) => state.role);

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

  // Apply staggered fade-up animation on mount
  useEffect(() => {
    const cards = document.querySelectorAll('.kpi-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('opacity-100', 'translate-y-0');
        card.classList.remove('opacity-0', 'translate-y-4');
      }, index * 100);
    });
  }, []);

  const showEditButton = role === 'ADMIN';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Total Balance"
        value={summaryStats.totalBalance}
        delta={summaryStats.totalBalanceDelta}
        icon={DollarSign}
        sparklineData={balanceSparkline}
        format="currency"
        showEditButton={showEditButton}
      />
      <KPICard
        label="Total Income"
        value={summaryStats.totalIncome}
        delta={summaryStats.totalIncomeDelta}
        icon={TrendingUp}
        sparklineData={incomeSparkline}
        format="currency"
        showEditButton={showEditButton}
      />
      <KPICard
        label="Total Expenses"
        value={summaryStats.totalExpenses}
        delta={summaryStats.totalExpensesDelta}
        icon={CreditCard}
        sparklineData={expensesSparkline}
        format="currency"
        showEditButton={showEditButton}
      />
      <KPICard
        label="Savings Rate"
        value={summaryStats.savingsRate}
        delta={summaryStats.savingsRateDelta}
        icon={PiggyBank}
        sparklineData={savingsRateSparkline}
        format="percentage"
        showEditButton={showEditButton}
      />
    </div>
  );
}
