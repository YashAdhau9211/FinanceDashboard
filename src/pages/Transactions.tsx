import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { FilterBar } from '../components/transactions/FilterBar';
import { SlideOverPanel } from '../components/transactions/SlideOverPanel';
import {
  TransactionForm,
  type TransactionFormData,
} from '../components/transactions/TransactionForm';
import { ExportButton } from '../components/transactions/ExportButton';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useTransactionsStore } from '../stores/transactionsStore';
import { useRoleStore } from '../stores/roleStore';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { Transaction } from '../types';

function TransactionsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

  const filteredTransactions = useFilteredTransactions();
  const addTransaction = useTransactionsStore((state) => state.addTransaction);
  const updateTransaction = useTransactionsStore((state) => state.updateTransaction);
  const deleteTransaction = useTransactionsStore((state) => state.deleteTransaction);
  const role = useRoleStore((state) => state.role);

  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleAddClick = () => {
    setEditingTransaction(undefined);
    setIsSlideOverOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsSlideOverOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    deleteTransaction(id);
  };

  const handleFormSubmit = (data: TransactionFormData) => {
    if (editingTransaction) {
      // Edit mode
      updateTransaction(editingTransaction.id, data);
    } else {
      // Add mode
      addTransaction(data);
    }
    setIsSlideOverOpen(false);
    setEditingTransaction(undefined);
  };

  const handleFormCancel = () => {
    setIsSlideOverOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <PageWrapper pageTitle="Transactions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
          <div className="flex items-center gap-3">
            <ExportButton transactions={filteredTransactions} />
            {role === 'ADMIN' && (
              <button
                onClick={handleAddClick}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            )}
          </div>
        </div>
        <FilterBar />
        <TransactionTable
          transactions={filteredTransactions}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onAddTransaction={handleAddClick}
        />
      </div>

      <SlideOverPanel
        isOpen={isSlideOverOpen}
        onClose={handleFormCancel}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          mode={editingTransaction ? 'edit' : 'add'}
          transaction={editingTransaction}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </SlideOverPanel>
    </PageWrapper>
  );
}

export function Transactions() {
  return (
    <ErrorBoundary
      sectionName="Transactions Page"
      fallback={(error, retry) => (
        <PageWrapper pageTitle="Transactions">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Unable to load Transactions page
                </h3>
                <p className="text-sm text-red-700 mb-4">{error.message}</p>
                <button
                  onClick={retry}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </PageWrapper>
      )}
    >
      <TransactionsContent />
    </ErrorBoundary>
  );
}
