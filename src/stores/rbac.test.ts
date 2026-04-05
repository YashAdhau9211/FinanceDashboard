import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTransactionsStore } from './transactionsStore';
import { useRoleStore } from './roleStore';

describe('Role-Based Access Control (RBAC)', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset stores before each test
    useTransactionsStore.setState({ transactions: [] });
    useRoleStore.setState({ role: 'ANALYST' });

    // Clear and reset console warnings spy
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.warn after each test
    consoleWarnSpy.mockRestore();
  });

  describe('Store Actions - ANALYST Role Restrictions', () => {
    it('should prevent ANALYST from adding transactions', () => {
      // Set role to ANALYST
      useRoleStore.setState({ role: 'ANALYST' });

      const store = useTransactionsStore.getState();
      const initialCount = store.transactions.length;

      // Attempt to add transaction as ANALYST
      store.addTransaction({
        date: '2025-01-15',
        description: 'Test Transaction',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      // Verify transaction was NOT added
      const finalCount = useTransactionsStore.getState().transactions.length;
      expect(finalCount).toBe(initialCount);

      // Verify warning was logged
      expect(console.warn).toHaveBeenCalledWith('ANALYST role cannot add transactions');
    });

    it('should prevent ANALYST from updating transactions', () => {
      // Add transaction as ADMIN first
      useRoleStore.setState({ role: 'ADMIN' });
      const store = useTransactionsStore.getState();

      store.addTransaction({
        date: '2025-01-15',
        description: 'Original Description',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      const transactions = useTransactionsStore.getState().transactions;
      const transactionId = transactions[0].id;
      const originalDescription = transactions[0].description;

      // Switch to ANALYST and attempt update
      useRoleStore.setState({ role: 'ANALYST' });

      store.updateTransaction(transactionId, {
        description: 'Modified Description',
      });

      // Verify transaction was NOT updated
      const updatedTransaction = useTransactionsStore.getState().transactions[0];
      expect(updatedTransaction.description).toBe(originalDescription);

      // Verify warning was logged
      expect(console.warn).toHaveBeenCalledWith('ANALYST role cannot update transactions');
    });

    it('should prevent ANALYST from deleting transactions', () => {
      // Add transaction as ADMIN first
      useRoleStore.setState({ role: 'ADMIN' });
      const store = useTransactionsStore.getState();

      store.addTransaction({
        date: '2025-01-15',
        description: 'Test Transaction',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      const transactions = useTransactionsStore.getState().transactions;
      const transactionId = transactions[0].id;
      const initialCount = transactions.length;

      // Switch to ANALYST and attempt delete
      useRoleStore.setState({ role: 'ANALYST' });

      store.deleteTransaction(transactionId);

      // Verify transaction was NOT deleted
      const finalCount = useTransactionsStore.getState().transactions.length;
      expect(finalCount).toBe(initialCount);

      // Verify warning was logged
      expect(console.warn).toHaveBeenCalledWith('ANALYST role cannot delete transactions');
    });
  });

  describe('Store Actions - ADMIN Role Permissions', () => {
    it('should allow ADMIN to add transactions', () => {
      // Set role to ADMIN
      useRoleStore.setState({ role: 'ADMIN' });

      const store = useTransactionsStore.getState();
      const initialCount = store.transactions.length;

      // Add transaction as ADMIN
      store.addTransaction({
        date: '2025-01-15',
        description: 'Test Transaction',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      // Verify transaction was added
      const finalCount = useTransactionsStore.getState().transactions.length;
      expect(finalCount).toBe(initialCount + 1);

      // Verify no warning was logged
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should allow ADMIN to update transactions', () => {
      // Set role to ADMIN
      useRoleStore.setState({ role: 'ADMIN' });

      const store = useTransactionsStore.getState();

      store.addTransaction({
        date: '2025-01-15',
        description: 'Original Description',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      const transactions = useTransactionsStore.getState().transactions;
      const transactionId = transactions[0].id;

      // Update transaction as ADMIN
      store.updateTransaction(transactionId, {
        description: 'Modified Description',
      });

      // Verify transaction was updated
      const updatedTransaction = useTransactionsStore.getState().transactions[0];
      expect(updatedTransaction.description).toBe('Modified Description');

      // Verify no warning was logged
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should allow ADMIN to delete transactions', () => {
      // Set role to ADMIN
      useRoleStore.setState({ role: 'ADMIN' });

      const store = useTransactionsStore.getState();

      store.addTransaction({
        date: '2025-01-15',
        description: 'Test Transaction',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      const transactions = useTransactionsStore.getState().transactions;
      const transactionId = transactions[0].id;
      const initialCount = transactions.length;

      // Delete transaction as ADMIN
      store.deleteTransaction(transactionId);

      // Verify transaction was deleted
      const finalCount = useTransactionsStore.getState().transactions.length;
      expect(finalCount).toBe(initialCount - 1);

      // Verify no warning was logged
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Role Store', () => {
    it('should initialize with ANALYST role', () => {
      // Reset to initial state
      useRoleStore.setState({ role: 'ANALYST' });

      const role = useRoleStore.getState().role;
      expect(role).toBe('ANALYST');
    });

    it('should allow setting role to ADMIN', () => {
      const store = useRoleStore.getState();

      store.setRole('ADMIN');

      const role = useRoleStore.getState().role;
      expect(role).toBe('ADMIN');
    });

    it('should allow setting role to ANALYST', () => {
      useRoleStore.setState({ role: 'ADMIN' });
      const store = useRoleStore.getState();

      store.setRole('ANALYST');

      const role = useRoleStore.getState().role;
      expect(role).toBe('ANALYST');
    });

    it('should toggle role from ANALYST to ADMIN', () => {
      useRoleStore.setState({ role: 'ANALYST' });
      const store = useRoleStore.getState();

      store.toggleRole();

      const role = useRoleStore.getState().role;
      expect(role).toBe('ADMIN');
    });

    it('should toggle role from ADMIN to ANALYST', () => {
      useRoleStore.setState({ role: 'ADMIN' });
      const store = useRoleStore.getState();

      store.toggleRole();

      const role = useRoleStore.getState().role;
      expect(role).toBe('ANALYST');
    });
  });

  describe('Role Switching Without Page Refresh', () => {
    it('should immediately reflect role changes in store actions', () => {
      // Start as ADMIN
      useRoleStore.setState({ role: 'ADMIN' });
      const store = useTransactionsStore.getState();

      // Add transaction as ADMIN (should succeed)
      store.addTransaction({
        date: '2025-01-15',
        description: 'Test Transaction 1',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      expect(useTransactionsStore.getState().transactions.length).toBe(1);

      // Switch to ANALYST
      useRoleStore.getState().toggleRole();
      expect(useRoleStore.getState().role).toBe('ANALYST');

      // Attempt to add transaction as ANALYST (should fail)
      store.addTransaction({
        date: '2025-01-16',
        description: 'Test Transaction 2',
        amount: 200,
        type: 'expense',
        category: 'rent',
      });

      // Should still have only 1 transaction
      expect(useTransactionsStore.getState().transactions.length).toBe(1);

      // Switch back to ADMIN
      useRoleStore.getState().toggleRole();
      expect(useRoleStore.getState().role).toBe('ADMIN');

      // Add transaction as ADMIN again (should succeed)
      store.addTransaction({
        date: '2025-01-17',
        description: 'Test Transaction 3',
        amount: 300,
        type: 'income',
        category: 'freelance',
      });

      // Should now have 2 transactions
      expect(useTransactionsStore.getState().transactions.length).toBe(2);
    });
  });

  describe('Multiple Operations with Role Checks', () => {
    it('should enforce role checks across multiple operations', () => {
      // Set up as ADMIN and add multiple transactions
      useRoleStore.setState({ role: 'ADMIN' });
      const store = useTransactionsStore.getState();

      store.addTransaction({
        date: '2025-01-15',
        description: 'Transaction 1',
        amount: 100,
        type: 'income',
        category: 'salary',
      });

      store.addTransaction({
        date: '2025-01-16',
        description: 'Transaction 2',
        amount: 200,
        type: 'expense',
        category: 'rent',
      });

      expect(useTransactionsStore.getState().transactions.length).toBe(2);

      // Switch to ANALYST
      useRoleStore.setState({ role: 'ANALYST' });

      const transactions = useTransactionsStore.getState().transactions;
      const firstId = transactions[0].id;
      const secondId = transactions[1].id;

      // Attempt multiple operations as ANALYST (all should fail)
      store.updateTransaction(firstId, { description: 'Modified 1' });
      store.updateTransaction(secondId, { description: 'Modified 2' });
      store.deleteTransaction(firstId);
      store.addTransaction({
        date: '2025-01-17',
        description: 'Transaction 3',
        amount: 300,
        type: 'income',
        category: 'freelance',
      });

      // Verify no changes occurred
      const finalTransactions = useTransactionsStore.getState().transactions;
      expect(finalTransactions.length).toBe(2);
      expect(finalTransactions[0].description).toBe('Transaction 1');
      expect(finalTransactions[1].description).toBe('Transaction 2');

      // Verify warnings were logged for each operation
      expect(console.warn).toHaveBeenCalledTimes(4);
    });
  });
});
