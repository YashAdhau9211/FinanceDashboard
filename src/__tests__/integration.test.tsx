import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTransactionsStore } from '../stores/transactionsStore';
import { useRoleStore } from '../stores/roleStore';
import { useUIStore } from '../stores/uiStore';
import App from '../App';
import type { Transaction } from '../types';

describe('Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset all stores to initial state
    useTransactionsStore.setState({
      transactions: [],
    });

    useRoleStore.setState({
      role: 'ADMIN', // Set to ADMIN so store actions work
    });

    useUIStore.setState({
      sidebarCollapsed: false,
      darkMode: false,
    });
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();

    // Remove dark class from document if present
    document.documentElement.classList.remove('dark');
  });

  describe('localStorage persistence - transactions store', () => {
    it('should persist transactions to localStorage when added', () => {
      const mockTransaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
        date: '2025-01-15',
        description: 'Test Transaction',
        amount: 1000,
        type: 'expense',
        category: 'groceries',
      };

      // Add transaction to store
      useTransactionsStore.getState().addTransaction(mockTransaction);

      // Verify localStorage was updated
      const stored = localStorage.getItem('zorvyn-transactions');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.transactions).toHaveLength(1);
      expect(parsed.state.transactions[0].description).toBe('Test Transaction');
      expect(parsed.state.transactions[0].amount).toBe(1000);
    });

    it('should restore transactions from localStorage on reload', async () => {
      // Manually set localStorage with transaction data
      const mockData = {
        state: {
          transactions: [
            {
              id: 'test-1',
              date: '2025-01-15',
              description: 'Persisted Transaction',
              amount: 2000,
              type: 'income',
              category: 'salary',
              createdAt: '2025-01-15T00:00:00Z',
              updatedAt: '2025-01-15T00:00:00Z',
            },
          ],
        },
        version: 0,
      };

      localStorage.setItem('zorvyn-transactions', JSON.stringify(mockData));

      // Reset store to trigger rehydration
      useTransactionsStore.persist.rehydrate();

      // Wait for rehydration to complete
      await waitFor(() => {
        const currentTransactions = useTransactionsStore.getState().transactions;
        expect(currentTransactions.length).toBeGreaterThan(0);
        const persistedTransaction = currentTransactions.find((t) => t.id === 'test-1');
        expect(persistedTransaction).toBeDefined();
        expect(persistedTransaction?.description).toBe('Persisted Transaction');
        expect(persistedTransaction?.amount).toBe(2000);
      });
    });
  });

  describe('localStorage persistence - role store', () => {
    it('should persist role to localStorage when changed', () => {
      // Reset role to ANALYST for this test
      useRoleStore.setState({ role: 'ANALYST' });

      // Toggle role to ADMIN
      useRoleStore.getState().toggleRole();

      // Verify localStorage was updated
      const stored = localStorage.getItem('zorvyn-role');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.role).toBe('ADMIN');
    });

    it('should restore role from localStorage on reload', async () => {
      // Manually set localStorage with role data
      const mockData = {
        state: {
          role: 'ADMIN',
        },
        version: 0,
      };

      localStorage.setItem('zorvyn-role', JSON.stringify(mockData));

      // Reset store to trigger rehydration
      useRoleStore.persist.rehydrate();

      // Wait for rehydration to complete
      await waitFor(() => {
        const currentRole = useRoleStore.getState().role;
        expect(currentRole).toBe('ADMIN');
      });
    });
  });

  describe('React Router navigation', () => {
    it('should navigate to dashboard by default', () => {
      render(<App />);

      // Should redirect to /dashboard and show Dashboard page
      expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    });

    it('should navigate between routes when sidebar links are clicked', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Start at Dashboard
      expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();

      // Click Transactions link in sidebar
      const transactionsLink = screen.getAllByRole('link', { name: /transactions/i })[0]; // Get sidebar link
      await user.click(transactionsLink);

      // Should navigate to Transactions page - verify TopNav (h1)
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: 'Transactions' })).toBeInTheDocument();
      });

      // Click Insights link
      const insightsLink = screen.getByRole('link', { name: /insights/i });
      await user.click(insightsLink);

      // Should navigate to Insights page - verify both TopNav (h1) and page content (h2)
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: 'Insights' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Insights' })).toBeInTheDocument();
      });
    });
  });

  describe('dark mode class application to DOM', () => {
    it('should add dark class to document.documentElement when dark mode is enabled', async () => {
      const user = userEvent.setup();

      render(<App />);

      // Initially, dark class should not be present
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Click dark mode toggle
      const darkModeToggle = screen.getByLabelText(/toggle dark mode/i);
      await user.click(darkModeToggle);

      // Dark class should be added
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should remove dark class from document.documentElement when dark mode is disabled', async () => {
      const user = userEvent.setup();

      // Start with dark mode enabled
      useUIStore.setState({ darkMode: true });
      document.documentElement.classList.add('dark');

      render(<App />);

      // Dark class should be present initially
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Click dark mode toggle to disable
      const darkModeToggle = screen.getByLabelText(/toggle dark mode/i);
      await user.click(darkModeToggle);

      // Dark class should be removed
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });

    it('should persist dark mode state across component remounts', async () => {
      const user = userEvent.setup();

      const { unmount } = render(<App />);

      // Enable dark mode
      const darkModeToggle = screen.getByLabelText(/toggle dark mode/i);
      await user.click(darkModeToggle);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });

      // Unmount and remount
      unmount();

      render(<App />);

      // Dark mode should still be enabled (from UI store state)
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });
  });
});
