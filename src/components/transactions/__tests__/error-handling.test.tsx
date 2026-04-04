import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from '../TransactionForm';
import { useTransactionsStore } from '../../../stores/transactionsStore';
import { useToastStore } from '../../../stores/toastStore';
import { useRoleStore } from '../../../stores/roleStore';
import { ErrorBoundary } from '../../ErrorBoundary';

describe('Error Handling Tests', () => {
  beforeEach(() => {
    // Reset stores before each test
    useTransactionsStore.setState({ transactions: [] });
    useToastStore.setState({ toasts: [] });
    useRoleStore.setState({ role: 'ADMIN' });
  });

  describe('TransactionForm Error Handling', () => {
    it('should catch and display form submission errors', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'));

      render(
        <TransactionForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={vi.fn()}
        />
      );

      // Fill form with valid data
      await user.type(screen.getByLabelText(/date/i), '2025-01-15');
      await user.type(screen.getByLabelText(/description/i), 'Test Transaction');
      await user.type(screen.getByLabelText(/amount/i), '1000');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /save/i });
      await user.click(submitButton);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/error saving transaction/i)).toBeInTheDocument();
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should display retry button on submission error', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockRejectedValue(new Error('Server error'));

      render(
        <TransactionForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={vi.fn()}
        />
      );

      // Fill and submit form
      await user.type(screen.getByLabelText(/date/i), '2025-01-15');
      await user.type(screen.getByLabelText(/description/i), 'Test');
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Wait for error and retry button
      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });

    it('should allow retry after submission error', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn()
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce(undefined);

      render(
        <TransactionForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={vi.fn()}
        />
      );

      // Fill and submit form
      await user.type(screen.getByLabelText(/date/i), '2025-01-15');
      await user.type(screen.getByLabelText(/description/i), 'Test');
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Wait for error
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      // Verify onSubmit was called twice
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(2);
      });
    });

    it('should disable buttons during submission', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <TransactionForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={vi.fn()}
        />
      );

      // Fill form
      await user.type(screen.getByLabelText(/date/i), '2025-01-15');
      await user.type(screen.getByLabelText(/description/i), 'Test');
      await user.type(screen.getByLabelText(/amount/i), '100');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /save/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      
      await user.click(submitButton);

      // Buttons should be disabled during submission
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/saving/i);
    });

    it('should display custom error message from Error object', async () => {
      const user = userEvent.setup();
      const customError = new Error('Custom validation failed');
      const onSubmit = vi.fn().mockRejectedValue(customError);

      render(
        <TransactionForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={vi.fn()}
        />
      );

      // Fill and submit
      await user.type(screen.getByLabelText(/date/i), '2025-01-15');
      await user.type(screen.getByLabelText(/description/i), 'Test');
      await user.type(screen.getByLabelText(/amount/i), '100');
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Check for custom error message
      await waitFor(() => {
        expect(screen.getByText(/custom validation failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Store Action Error Handling', () => {
    it('should log error when addTransaction fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Force an error by making crypto.randomUUID throw
      const originalRandomUUID = crypto.randomUUID;
      crypto.randomUUID = vi.fn().mockImplementation(() => {
        throw new Error('UUID generation failed');
      });

      try {
        useTransactionsStore.getState().addTransaction({
          date: '2025-01-15',
          description: 'Test',
          amount: 1000,
          type: 'expense',
          category: 'groceries',
        });
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to add transaction:',
        expect.any(Error)
      );

      // Restore
      crypto.randomUUID = originalRandomUUID;
      consoleSpy.mockRestore();
    });

    it('should display toast when ANALYST tries to add transaction', () => {
      useRoleStore.setState({ role: 'ANALYST' });
      useToastStore.setState({ toasts: [] });

      useTransactionsStore.getState().addTransaction({
        date: '2025-01-15',
        description: 'Test',
        amount: 1000,
        type: 'expense',
        category: 'groceries',
      });

      // Check toast was added
      const toasts = useToastStore.getState().toasts;
      expect(toasts.some(t => t.type === 'error')).toBe(true);
      expect(toasts.some(t => t.message.includes('permission'))).toBe(true);
    });

    it('should display toast when ANALYST tries to update transaction', () => {
      useRoleStore.setState({ role: 'ANALYST' });
      useToastStore.setState({ toasts: [] });

      useTransactionsStore.getState().updateTransaction('test-id', {
        description: 'Updated',
      });

      // Check toast was added
      const toasts = useToastStore.getState().toasts;
      expect(toasts.some(t => t.type === 'error')).toBe(true);
      expect(toasts.some(t => t.message.includes('permission'))).toBe(true);
    });

    it('should display toast when ANALYST tries to delete transaction', () => {
      useRoleStore.setState({ role: 'ANALYST' });
      useToastStore.setState({ toasts: [] });

      useTransactionsStore.getState().deleteTransaction('test-id');

      // Check toast was added
      const toasts = useToastStore.getState().toasts;
      expect(toasts.some(t => t.type === 'error')).toBe(true);
      expect(toasts.some(t => t.message.includes('permission'))).toBe(true);
    });

    it('should display success toast on successful addTransaction', () => {
      useRoleStore.setState({ role: 'ADMIN' });
      useToastStore.setState({ toasts: [] });

      useTransactionsStore.getState().addTransaction({
        date: '2025-01-15',
        description: 'Test',
        amount: 1000,
        type: 'expense',
        category: 'groceries',
      });

      // Check success toast was added
      const toasts = useToastStore.getState().toasts;
      expect(toasts.some(t => t.type === 'success')).toBe(true);
      expect(toasts.some(t => t.message.includes('added successfully'))).toBe(true);
    });

    it('should display success toast on successful updateTransaction', () => {
      useRoleStore.setState({ role: 'ADMIN' });
      useToastStore.setState({ toasts: [] });

      // First add a transaction
      useTransactionsStore.getState().addTransaction({
        date: '2025-01-15',
        description: 'Test',
        amount: 1000,
        type: 'expense',
        category: 'groceries',
      });

      // Clear toasts
      useToastStore.setState({ toasts: [] });

      // Update it
      const transactions = useTransactionsStore.getState().transactions;
      const id = transactions[0].id;
      useTransactionsStore.getState().updateTransaction(id, {
        description: 'Updated',
      });

      // Check success toast
      const toasts = useToastStore.getState().toasts;
      expect(toasts.some(t => t.type === 'success')).toBe(true);
      expect(toasts.some(t => t.message.includes('updated successfully'))).toBe(true);
    });

    it('should display success toast on successful deleteTransaction', () => {
      useRoleStore.setState({ role: 'ADMIN' });
      useToastStore.setState({ toasts: [] });

      // First add a transaction
      useTransactionsStore.getState().addTransaction({
        date: '2025-01-15',
        description: 'Test',
        amount: 1000,
        type: 'expense',
        category: 'groceries',
      });

      // Clear toasts
      useToastStore.setState({ toasts: [] });

      // Delete it
      const transactions = useTransactionsStore.getState().transactions;
      const id = transactions[0].id;
      useTransactionsStore.getState().deleteTransaction(id);

      // Check success toast
      const toasts = useToastStore.getState().toasts;
      expect(toasts.some(t => t.type === 'success')).toBe(true);
      expect(toasts.some(t => t.message.includes('deleted successfully'))).toBe(true);
    });
  });

  describe('ErrorBoundary', () => {
    it('should catch errors and display fallback UI', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary sectionName="Test Section">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/error in test section/i)).toBeInTheDocument();
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should allow retry after error', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const MaybeThrowError = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Success</div>;
      };

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { rerender } = render(
        <ErrorBoundary sectionName="Test Section">
          <MaybeThrowError />
        </ErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByText(/error in test section/i)).toBeInTheDocument();

      // Fix the error
      shouldThrow = false;

      // Click retry
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      // Component should render successfully
      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('should use custom fallback if provided', () => {
      const ThrowError = () => {
        throw new Error('Custom error');
      };

      const customFallback = (error: Error, retry: () => void) => (
        <div>
          <h1>Custom Error UI</h1>
          <p>{error.message}</p>
          <button onClick={retry}>Try Again</button>
        </div>
      );

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.getByText('Custom error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should log error to console', () => {
      const ThrowError = () => {
        throw new Error('Logged error');
      };

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary sectionName="Test Section">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );
      expect(consoleSpy).toHaveBeenCalledWith('Error in section: Test Section');

      consoleSpy.mockRestore();
    });
  });
});
