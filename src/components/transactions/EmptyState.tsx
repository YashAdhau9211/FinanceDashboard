import { FolderOpen } from 'lucide-react';
import { useRoleStore } from '../../stores/roleStore';

interface EmptyStateProps {
  onAddTransaction: () => void;
}

export function EmptyState({ onAddTransaction }: EmptyStateProps) {
  const role = useRoleStore((state) => state.role);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <FolderOpen className="h-12 w-12 text-gray-400" aria-hidden="true" />
        </div>

        {/* Message */}
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No transactions yet
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          Add your first one to get started.
        </p>

        {/* CTA Button - Only for ADMIN role */}
        {role === 'ADMIN' && (
          <button
            onClick={onAddTransaction}
            className="inline-flex items-center rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Add Transaction
          </button>
        )}
      </div>
    </div>
  );
}
