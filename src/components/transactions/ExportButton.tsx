import { Download } from 'lucide-react';
import Papa from 'papaparse';

import { useRoleStore } from '../../stores/roleStore';
import { useToastStore } from '../../stores/toastStore';
import type { Transaction } from '../../types';

interface ExportButtonProps {
  transactions: Transaction[];
  filename?: string;
}

/**
 * ExportButton component for CSV export functionality
 * Only visible to ADMIN role users
 * 
 * Validates Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 18.1, 18.2, 18.3
 */
export function ExportButton({
  transactions,
  filename = 'zorvyn-transactions.csv',
}: ExportButtonProps) {
  const role = useRoleStore((state) => state.role);
  const addToast = useToastStore((state) => state.addToast);

  // Only render for ADMIN role (Requirement 16.2)
  if (role !== 'ADMIN') return null;

  const handleExport = () => {
    try {
      // Transform transactions to CSV row format (Requirements 17.2, 17.4, 17.5)
      const csvData = transactions.map((transaction) => ({
        Date: transaction.date, // Format: YYYY-MM-DD (Requirement 17.4)
        Description: transaction.description,
        Category: transaction.category,
        Type: transaction.type,
        Amount: transaction.amount, // Numeric value without currency symbols (Requirement 17.5)
      }));

      // Generate CSV using PapaParse (Requirements 17.6, 18.1, 18.2)
      const csv = Papa.unparse(csvData, {
        quotes: true, // Use double quotes for text fields (Requirement 17.6)
        delimiter: ',', // Use comma as delimiter (Requirement 17.6)
      });

      // Create Blob and trigger download (Requirements 18.4, 18.5)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Requirement 17.7
      link.click();

      // Clean up object URL (Requirement 18.6)
      URL.revokeObjectURL(url);
    } catch (error) {
      // Handle CSV generation or download errors (Requirements 18.2, 18.3)
      console.error('CSV export failed:', error);
      addToast('Failed to export CSV. Please try again.', 'error');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
      aria-label="Export transactions to CSV"
    >
      <Download size={20} />
      <span>Export CSV</span>
    </button>
  );
}
