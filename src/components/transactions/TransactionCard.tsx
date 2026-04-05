import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useRoleStore } from '../../stores/roleStore';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getCategoryColor } from '../../utils/colorUtils';
import { formatCurrency } from '../../utils/formatters';
import type { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const role = useRoleStore((state) => state.role);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date as "DD MMM YYYY"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Get color classes based on transaction type
  const getAmountColor = (): string => {
    if (transaction.type === 'income') return 'text-green-600';
    if (transaction.type === 'expense') return 'text-red-600';
    return 'text-gray-600';
  };

  // Get type badge color
  const getTypeBadgeColor = (): string => {
    if (transaction.type === 'income') return 'bg-green-100 text-green-700';
    if (transaction.type === 'expense') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const CategoryIcon = getCategoryIcon(transaction.category);
  const categoryColor = getCategoryColor(transaction.category);

  const handleEditClick = () => {
    onEdit(transaction);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    // Wait for animation to complete before calling onDelete
    setTimeout(() => {
      onDelete(transaction.id);
    }, 200);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${
        isDeleting ? 'animate-fade-out-collapse' : 'animate-fade-in-from-top'
      }`}
    >
      {/* Card Header - Date and Amount */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(transaction.date)}
        </span>
        <span className={`text-lg font-semibold ${getAmountColor()}`}>
          {transaction.type === 'expense' && '-'}
          {formatCurrency(transaction.amount)}
        </span>
      </div>

      {/* Card Body - Description */}
      <p className="text-base text-gray-900 dark:text-white mb-3">{transaction.description}</p>

      {/* Badges - Category and Type */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: categoryColor }}
        >
          <CategoryIcon className="w-3.5 h-3.5" />
          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
        </span>
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor()}`}
        >
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </span>
      </div>

      {/* Card Actions (Admin Only) */}
      {role === 'ADMIN' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 relative">
          <button
            onClick={handleEditClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
            aria-label="Edit transaction"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <div className="flex-1 relative">
            <button
              onClick={handleDeleteClick}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              aria-label="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>

            {/* Delete Confirmation Tooltip */}
            {showDeleteConfirm && (
              <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Delete this transaction?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelDelete}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
