import { useMemo } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import {
  KPICardsGrid,
  BalanceTrendChart,
  SpendingDonut,
  RecentTransactionsWidget,
  TransactionActivityHeatmap,
} from '../components/dashboard';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ErrorFallback } from '../components/dashboard/ErrorFallback';
import { useTransactionsStore } from '../stores/transactionsStore';
import { computeMonthlyData } from '../stores/selectors/monthlyDataSelector';
import { computeCategoryBreakdown } from '../stores/selectors/categoryBreakdownSelector';
import { getRecentTransactions } from '../stores/selectors/recentTransactionsSelector';

export function Dashboard() {
  const transactions = useTransactionsStore((state) => state.transactions);

  // Compute all derived state using selectors with useMemo
  const monthlyData = useMemo(() => computeMonthlyData(transactions, 12), [transactions]);

  const categoryBreakdown = useMemo(() => computeCategoryBreakdown(transactions), [transactions]);

  const recentTransactions = useMemo(() => getRecentTransactions(transactions), [transactions]);

  return (
    <PageWrapper pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Top row: KPI Cards Grid (4 columns) */}
        <ErrorBoundary
          sectionName="KPI Cards"
          fallback={(error, retry) => (
            <ErrorFallback sectionName="KPI Cards" error={error} onRetry={retry} />
          )}
        >
          <KPICardsGrid />
        </ErrorBoundary>

        {/* Second row: Balance Trend Chart (Full Width) */}
        <ErrorBoundary
          sectionName="Balance Trend Chart"
          fallback={(error, retry) => (
            <ErrorFallback sectionName="Balance Trend Chart" error={error} onRetry={retry} />
          )}
        >
          <BalanceTrendChart data={monthlyData} />
        </ErrorBoundary>

        {/* Third row: Transaction Activity Heatmap (Full Width) */}
        <ErrorBoundary
          sectionName="Transaction Activity Heatmap"
          fallback={(error, retry) => (
            <ErrorFallback
              sectionName="Transaction Activity Heatmap"
              error={error}
              onRetry={retry}
            />
          )}
        >
          <TransactionActivityHeatmap />
        </ErrorBoundary>

        {/* Bottom row: Spending Donut (left) + Recent Transactions Widget (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ErrorBoundary
            sectionName="Spending Breakdown"
            fallback={(error, retry) => (
              <ErrorFallback sectionName="Spending Breakdown" error={error} onRetry={retry} />
            )}
          >
            <SpendingDonut data={categoryBreakdown} />
          </ErrorBoundary>

          <ErrorBoundary
            sectionName="Recent Transactions"
            fallback={(error, retry) => (
              <ErrorFallback sectionName="Recent Transactions" error={error} onRetry={retry} />
            )}
          >
            <RecentTransactionsWidget transactions={recentTransactions} />
          </ErrorBoundary>
        </div>
      </div>
    </PageWrapper>
  );
}
