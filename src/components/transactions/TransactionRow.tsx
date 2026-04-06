import { useState, memo, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useRoleStore } from '../../stores/roleStore';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getCategoryColor } from '../../utils/colorUtils';
import { formatCurrency } from '../../utils/formatters';
import { useSwipeToDelete } from '../../hooks/useSwipeToDelete';
import type { Transaction } from '../../types';

interface TransactionRowProps {
  transaction: Transaction;
  isEven: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

export const TransactionRow = memo(function TransactionRow({
  transaction,
  isEven,
  onEdit,
  onDelete,
  isNew = false,
}: TransactionRowProps) {
  const role = useRoleStore((state) => state.role);
  const [showDescTooltip, setShowDescTooltip] = useState(false);
  const [showAmountTooltip, setShowAmountTooltip] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Swipe-to-delete for mobile
  const {
    handlers,
    translateX,
    isDeleting: isSwipeDeleting,
  } = useSwipeToDelete({
    onDelete: () => {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(transaction.id);
      }, 200);
    },
    threshold: 50,
  });

  // Format date as "DD MMM YYYY"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Truncate description at 32 characters
  const truncateDescription = (desc: string): string => {
    if (desc.length <= 32) return desc;
    return desc.substring(0, 32) + '...';
  };

  // Format amount with abbreviation for large values
  const formatAmount = (amount: number): string => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      // ≥ ₹10,00,000
      return `₹${(absAmount / 100000).toFixed(0)}L`;
    }
    return formatCurrency(amount);
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

  const categoryColor = getCategoryColor(transaction.category);
  const isTruncated = transaction.description.length > 32;
  const isAbbreviated = Math.abs(transaction.amount) >= 1000000;

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
    <tr
      className={`${
        isEven ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
      } hover:bg-[var(--color-bg)] transition-colors duration-100 ${
        isDeleting || isSwipeDeleting ? 'animate-fade-out-collapse' : ''
      } ${isNew ? 'animate-fade-in-from-top' : ''}`}
      style={
        isMobile && role === 'ADMIN'
          ? {
              transform: `translateX(${translateX}px)`,
              transition: translateX === 0 ? 'transform 0.2s ease-out' : 'none',
            }
          : undefined
      }
      {...(isMobile && role === 'ADMIN' ? handlers : {})}
    >
      {/* Date Column */}
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
        {formatDate(transaction.date)}
      </td>

      {/* Description Column */}
      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white relative">
        <span
          onMouseEnter={() => isTruncated && setShowDescTooltip(true)}
          onMouseLeave={() => setShowDescTooltip(false)}
        >
          {truncateDescription(transaction.description)}
        </span>
        {showDescTooltip && isTruncated && (
          <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg -top-10 left-0 whitespace-nowrap">
            {transaction.description}
          </div>
        )}
      </td>

      {/* Category Column */}
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: categoryColor }}
        >
          {(() => {
            const Icon = getCategoryIcon(transaction.category);
            return <Icon className="w-3.5 h-3.5" />;
          })()}
          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
        </span>
      </td>

      {/* Type Column */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor()}`}
        >
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </span>
      </td>

      {/* Amount Column */}
      <td className={`px-4 py-3 text-sm font-semibold ${getAmountColor()} relative`}>
        <span
          onMouseEnter={() => isAbbreviated && setShowAmountTooltip(true)}
          onMouseLeave={() => setShowAmountTooltip(false)}
        >
          {transaction.type === 'expense' && '-'}
          {formatAmount(transaction.amount)}
        </span>
        {showAmountTooltip && isAbbreviated && (
          <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg -top-10 right-0 whitespace-nowrap">
            {formatCurrency(transaction.amount)}
          </div>
        )}
      </td>

      {/* Actions Column (Admin Only) */}
      {role === 'ADMIN' && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleEditClick}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition-colors"
              aria-label="Edit transaction"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={handleDeleteClick}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                aria-label="Delete transaction"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Delete Confirmation Tooltip */}
              {showDeleteConfirm && (
                <div className="absolute z-20 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 w-64">
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
        </td>
      )}
    </tr>
  );
});
