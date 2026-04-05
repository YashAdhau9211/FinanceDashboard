import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { Transactions } from './Transactions';
import { useTransactionsStore } from '../stores/transactionsStore';
import { useRoleStore } from '../stores/roleStore';
import { BrowserRouter } from 'react-router-dom';

// Mock the stores
vi.mock('../stores/transactionsStore');
vi.mock('../stores/roleStore');

const mockTransactions = [
  {
    id: '1',
    date: '2025-01-15',
    description: 'Grocery Shopping',
    amount: 1500,
    type: 'expense' as const,
    category: 'groceries' as const,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    date: '2025-01-14',
    description: 'Salary',
    amount: 50000,
    type: 'income' as const,
    category: 'salary' as const,
    createdAt: '2025-01-14T00:00:00.000Z',
    updatedAt: '2025-01-14T00:00:00.000Z',
  },
];

describe('Transactions Page - CRUD Integration', () => {
  const mockAddTransaction = vi.fn();
  const mockUpdateTransaction = vi.fn();
  const mockDeleteTransaction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock transactions store
    (useTransactionsStore as any).mockImplementation((selector: any) => {
      const state = {
        transactions: mockTransactions,
        addTransaction: mockAddTransaction,
        updateTransaction: mockUpdateTransaction,
        deleteTransaction: mockDeleteTransaction,
      };
      return selector(state);
    });

    // Mock role store - default to ADMIN
    (useRoleStore as any).mockImplementation((selector: any) => {
      const state = { role: 'ADMIN' };
      return selector(state);
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('Loading State', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show skeleton loader initially', () => {
      renderWithRouter(<Transactions />);

      const loadingElement = screen.getByRole('status', { name: /loading transactions/i });
      expect(loadingElement).toBeInTheDocument();
    }, 10000);

    it('should show table after 600ms loading period', async () => {
      vi.useRealTimers(); // Use real timers for this test

      renderWithRouter(<Transactions />);

      // Initially shows skeleton
      expect(screen.getByRole('status', { name: /loading transactions/i })).toBeInTheDocument();

      // Wait for loading to complete naturally
      await waitFor(
        () => {
          expect(
            screen.queryByRole('status', { name: /loading transactions/i })
          ).not.toBeInTheDocument();
          expect(screen.getByRole('table')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      vi.useFakeTimers(); // Restore fake timers
    });

    it('should apply fade transition when loading completes', async () => {
      vi.useRealTimers(); // Use real timers for this test

      const { container } = renderWithRouter(<Transactions />);

      // Wait for loading to complete naturally
      await waitFor(
        () => {
          const tableContainer = container.querySelector('.transition-opacity');
          expect(tableContainer).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      vi.useFakeTimers(); // Restore fake timers
    });
  });

  describe('Empty States', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show empty state when no transactions and no filters', async () => {
      vi.useRealTimers(); // Use real timers for this test

      (useTransactionsStore as any).mockImplementation((selector: any) => {
        const state = {
          transactions: [],
          addTransaction: mockAddTransaction,
          updateTransaction: mockUpdateTransaction,
          deleteTransaction: mockDeleteTransaction,
        };
        return selector(state);
      });

      renderWithRouter(<Transactions />);

      // Wait for loading to complete naturally
      await waitFor(
        () => {
          expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      vi.useFakeTimers(); // Restore fake timers
    });

    it('should show Add Transaction button in empty state for ADMIN', async () => {
      vi.useRealTimers(); // Use real timers for this test

      (useTransactionsStore as any).mockImplementation((selector: any) => {
        const state = {
          transactions: [],
          addTransaction: mockAddTransaction,
          updateTransaction: mockUpdateTransaction,
          deleteTransaction: mockDeleteTransaction,
        };
        return selector(state);
      });

      renderWithRouter(<Transactions />);

      // Wait for loading to complete naturally
      await waitFor(
        () => {
          const addButtons = screen.getAllByRole('button', { name: /add transaction/i });
          expect(addButtons.length).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );

      vi.useFakeTimers(); // Restore fake timers
    });

    it('should not show Add Transaction button in empty state for ANALYST', async () => {
      vi.useRealTimers(); // Use real timers for this test

      (useTransactionsStore as any).mockImplementation((selector: any) => {
        const state = {
          transactions: [],
          addTransaction: mockAddTransaction,
          updateTransaction: mockUpdateTransaction,
          deleteTransaction: mockDeleteTransaction,
        };
        return selector(state);
      });

      (useRoleStore as any).mockImplementation((selector: any) => {
        const state = { role: 'ANALYST' };
        return selector(state);
      });

      renderWithRouter(<Transactions />);

      // Wait for loading to complete naturally
      await waitFor(
        () => {
          expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
          expect(
            screen.queryByRole('button', { name: /add transaction/i })
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      vi.useFakeTimers(); // Restore fake timers
    });
  });

  describe('Add Transaction Flow', () => {
    it('should show Add Transaction button for ADMIN role', () => {
      renderWithRouter(<Transactions />);
      expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
    });

    it('should not show Add Transaction button for ANALYST role', () => {
      (useRoleStore as any).mockImplementation((selector: any) => {
        const state = { role: 'ANALYST' };
        return selector(state);
      });

      renderWithRouter(<Transactions />);
      expect(screen.queryByRole('button', { name: /add transaction/i })).not.toBeInTheDocument();
    });

    it('should open slide-over panel when Add Transaction is clicked', async () => {
      renderWithRouter(<Transactions />);

      const addButton = screen.getByRole('button', { name: /add transaction/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should add transaction when form is submitted', async () => {
      renderWithRouter(<Transactions />);

      // Open slide-over
      const addButton = screen.getByRole('button', { name: /add transaction/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Fill form
      const dialog = screen.getByRole('dialog');
      const dateInput = within(dialog).getByLabelText(/date/i);
      const descInput = within(dialog).getByLabelText(/description/i);
      const amountInput = within(dialog).getByLabelText(/amount/i);

      fireEvent.change(dateInput, { target: { value: '2025-01-16' } });
      fireEvent.change(descInput, { target: { value: 'New Transaction' } });
      fireEvent.change(amountInput, { target: { value: '2000' } });

      // Submit form
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockAddTransaction).toHaveBeenCalledWith({
          date: '2025-01-16',
          description: 'New Transaction',
          amount: 2000,
          type: 'expense',
          category: 'other',
        });
      });
    });

    it('should close slide-over after successful submission', async () => {
      renderWithRouter(<Transactions />);

      // Open slide-over
      const addButton = screen.getByRole('button', { name: /add transaction/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Fill and submit form
      const dialog = screen.getByRole('dialog');
      const dateInput = within(dialog).getByLabelText(/date/i);
      const descInput = within(dialog).getByLabelText(/description/i);
      const amountInput = within(dialog).getByLabelText(/amount/i);

      fireEvent.change(dateInput, { target: { value: '2025-01-16' } });
      fireEvent.change(descInput, { target: { value: 'New Transaction' } });
      fireEvent.change(amountInput, { target: { value: '2000' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edit Transaction Flow', () => {
    it('should show Edit buttons for ADMIN role', async () => {
      renderWithRouter(<Transactions />);

      await waitFor(() => {
        const editButtons = screen.getAllByLabelText(/edit transaction/i);
        expect(editButtons.length).toBeGreaterThan(0);
      });
    });

    it('should not show Edit buttons for ANALYST role', async () => {
      (useRoleStore as any).mockImplementation((selector: any) => {
        const state = { role: 'ANALYST' };
        return selector(state);
      });

      renderWithRouter(<Transactions />);

      await waitFor(() => {
        expect(screen.queryByLabelText(/edit transaction/i)).not.toBeInTheDocument();
      });
    });

    it('should open slide-over with pre-filled data when Edit is clicked', async () => {
      renderWithRouter(<Transactions />);

      await waitFor(() => {
        const editButtons = screen.getAllByLabelText(/edit transaction/i);
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Edit Transaction')).toBeInTheDocument();

        const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
        expect(descInput.value).toBe('Grocery Shopping');
      });
    });

    it('should update transaction when form is submitted', async () => {
      renderWithRouter(<Transactions />);

      await waitFor(() => {
        const editButtons = screen.getAllByLabelText(/edit transaction/i);
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Modify description
      const descInput = screen.getByLabelText(/description/i);
      fireEvent.change(descInput, { target: { value: 'Updated Grocery Shopping' } });

      // Submit form
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateTransaction).toHaveBeenCalledWith('1', {
          date: '2025-01-15',
          description: 'Updated Grocery Shopping',
          amount: 1500,
          type: 'expense',
          category: 'groceries',
        });
      });
    });
  });

  describe('Delete Transaction Flow', () => {
    it('should show Delete buttons for ADMIN role', async () => {
      renderWithRouter(<Transactions />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/delete transaction/i);
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });

    it('should not show Delete buttons for ANALYST role', async () => {
      (useRoleStore as any).mockImplementation((selector: any) => {
        const state = { role: 'ANALYST' };
        return selector(state);
      });

      renderWithRouter(<Transactions />);

      await waitFor(() => {
        expect(screen.queryByLabelText(/delete transaction/i)).not.toBeInTheDocument();
      });
    });

    it('should show confirmation dialog when Delete is clicked', async () => {
      renderWithRouter(<Transactions />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/delete transaction/i);
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/delete this transaction/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });
    });

    it('should delete transaction when Confirm is clicked', async () => {
      renderWithRouter(<Transactions />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/delete transaction/i);
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(mockDeleteTransaction).toHaveBeenCalledWith('1');
      });
    });

    it('should not delete transaction when Cancel is clicked', async () => {
      renderWithRouter(<Transactions />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/delete transaction/i);
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);
      });

      expect(mockDeleteTransaction).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Actions', () => {
    it('should close slide-over when Cancel button is clicked in form', async () => {
      renderWithRouter(<Transactions />);

      const addButton = screen.getByRole('button', { name: /add transaction/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close slide-over when backdrop is clicked', async () => {
      renderWithRouter(<Transactions />);

      const addButton = screen.getByRole('button', { name: /add transaction/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const backdrop = document.querySelector('.bg-black\\/50');
      fireEvent.click(backdrop!);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
