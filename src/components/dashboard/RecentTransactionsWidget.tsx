import { Link } from 'react-router-dom';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getCategoryColor } from '../../utils/colorUtils';

interface RecentTransactionsWidgetProps {
  transactions: Transaction[];
}

export function RecentTransactionsWidget({ transactions }: RecentTransactionsWidgetProps) {
  return (
    <div
      className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-sm"
      aria-label="Recent transactions widget showing the 5 most recent transactions"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Transactions
        </h2>
        <Link
          to="/transactions"
          className="text-sm text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
          aria-label="View all transactions"
        >
          View All →
        </Link>
      </div>

      <ul className="space-y-3" role="list">
        {transactions.map((transaction) => {
          const Icon = getCategoryIcon(transaction.category);
          const categoryColor = getCategoryColor(transaction.category);

          return (
            <li
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              role="listitem"
            >
              {/* Left: Icon + Description + Date */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: categoryColor + '20' }}
                >
                  <Icon size={20} style={{ color: categoryColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              {/* Right: Amount */}
              <span
                className={`text-sm font-mono font-medium ${
                  transaction.type === 'income'
                    ? 'text-green-700 dark:text-green-400'
                    : transaction.type === 'expense'
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                {formatCurrency(Math.abs(transaction.amount))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
