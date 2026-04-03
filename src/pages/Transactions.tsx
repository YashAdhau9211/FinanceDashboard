import { PageWrapper } from '../components/PageWrapper';
import { useTransactionsStore } from '../stores/transactionsStore';

export function Transactions() {
  const transactions = useTransactionsStore((state) => state.transactions);

  return (
    <PageWrapper pageTitle="Transactions">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {transactions.length} transactions loaded
        </p>
      </div>
    </PageWrapper>
  );
}
