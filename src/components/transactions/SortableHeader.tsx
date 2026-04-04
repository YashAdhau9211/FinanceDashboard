import { ChevronUp, ChevronDown } from 'lucide-react';
import type { SortDir } from '../../types';

interface SortableHeaderProps {
  field: 'date' | 'amount' | 'description';
  label: string;
  currentSortField: string;
  currentSortDir: SortDir;
  onSort: (field: 'date' | 'amount' | 'description') => void;
}

export function SortableHeader({
  field,
  label,
  currentSortField,
  currentSortDir,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSortField === field;

  return (
    <th scope="col" className="px-4 py-3 text-left">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {label}
        {isActive && (
          <span className="text-gray-900 dark:text-white">
            {currentSortDir === 'asc' ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        )}
      </button>
    </th>
  );
}
