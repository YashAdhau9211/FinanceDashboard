import { useMemo, useEffect, useRef, useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useTransactionsStore } from '../stores/transactionsStore';
import {
  AISummaryBlock,
  TopSpendingCategoryCard,
  BestIncomeMonthCard,
  WorstExpenseMonthCard,
  MonthlyComparisonCard,
  SavingsTrendCard,
  UnusualSpendingCard,
} from '../components/insights';
import InsightCardErrorBoundary from '../components/insights/InsightCardErrorBoundary';
import {
  getTopSpendingCategory,
  getBestIncomeMonth,
  getWorstExpenseMonth,
  getMonthlyComparison,
  getSavingsTrend,
  getUnusualSpending,
  generateAISummary,
} from '../utils/insights';

export function Insights() {
  const transactions = useTransactionsStore((state) => state.transactions);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevTransactionsRef = useRef(transactions);

  // Compute all insights using useMemo with transactions as dependency
  const insights = useMemo(() => {
    const topSpending = getTopSpendingCategory(transactions);
    const bestIncome = getBestIncomeMonth(transactions);
    const worstExpense = getWorstExpenseMonth(transactions);
    const monthlyComparison = getMonthlyComparison(transactions);
    const savingsTrend = getSavingsTrend(transactions);
    const unusualSpending = getUnusualSpending(transactions);
    const aiSummary = generateAISummary(topSpending, bestIncome, savingsTrend);

    return {
      topSpending,
      bestIncome,
      worstExpense,
      monthlyComparison,
      savingsTrend,
      unusualSpending,
      aiSummary,
    };
  }, [transactions]);

  // Staggered fade-up animation on page load
  useEffect(() => {
    const cards = document.querySelectorAll('.insight-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('opacity-100', 'translate-y-0');
        card.classList.remove('opacity-0', 'translate-y-4');
      }, index * 100);
    });
    // Set animation flag after a delay to avoid setState in effect
    const timer = setTimeout(() => setIsAnimated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Fade transition when insights update
  useEffect(() => {
    // Skip on initial mount
    if (!isAnimated) return;

    // Check if transactions actually changed
    if (prevTransactionsRef.current !== transactions) {
      // Use setTimeout to avoid setState in effect
      const updateTimer = setTimeout(() => setIsUpdating(true), 0);

      // Apply fade out
      const fadeTimer = setTimeout(() => {
        setIsUpdating(false);
      }, 150);

      prevTransactionsRef.current = transactions;

      return () => {
        clearTimeout(updateTimer);
        clearTimeout(fadeTimer);
      };
    }
  }, [transactions, isAnimated]);

  return (
    <PageWrapper pageTitle="Insights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Summary Block - Full Width */}
        <div
          className={`mb-8 transition-opacity duration-150 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
        >
          <AISummaryBlock summary={insights.aiSummary} />
        </div>

        {/* Insights Grid - Responsive 3/2/1 columns */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-150 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}
        >
          <div className="insight-card opacity-0 translate-y-4 transition-all duration-300 ease-out">
            <InsightCardErrorBoundary cardTitle="Top Spending Category">
              <TopSpendingCategoryCard insight={insights.topSpending} />
            </InsightCardErrorBoundary>
          </div>

          <div className="insight-card opacity-0 translate-y-4 transition-all duration-300 ease-out">
            <InsightCardErrorBoundary cardTitle="Best Income Month">
              <BestIncomeMonthCard insight={insights.bestIncome} />
            </InsightCardErrorBoundary>
          </div>

          <div className="insight-card opacity-0 translate-y-4 transition-all duration-300 ease-out">
            <InsightCardErrorBoundary cardTitle="Worst Expense Month">
              <WorstExpenseMonthCard insight={insights.worstExpense} />
            </InsightCardErrorBoundary>
          </div>

          <div className="insight-card opacity-0 translate-y-4 transition-all duration-300 ease-out">
            <InsightCardErrorBoundary cardTitle="Monthly Comparison">
              <MonthlyComparisonCard insight={insights.monthlyComparison} />
            </InsightCardErrorBoundary>
          </div>

          <div className="insight-card opacity-0 translate-y-4 transition-all duration-300 ease-out">
            <InsightCardErrorBoundary cardTitle="Savings Trend">
              <SavingsTrendCard insight={insights.savingsTrend} />
            </InsightCardErrorBoundary>
          </div>

          <div className="insight-card opacity-0 translate-y-4 transition-all duration-300 ease-out">
            <InsightCardErrorBoundary cardTitle="Unusual Spending Alert">
              <UnusualSpendingCard insight={insights.unusualSpending} />
            </InsightCardErrorBoundary>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
