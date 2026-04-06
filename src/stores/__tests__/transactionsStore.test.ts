import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useTransactionsStore } from '../transactionsStore';
import { useRoleStore } from '../roleStore';
import type { TransactionType, Category } from '../../types';

// Helper to reset store state before each test
beforeEach(() => {
  useTransactionsStore.setState({
    transactions: [],
  });
  // Set role to ADMIN for all tests
  useRoleStore.setState({ role: 'ADMIN' });
});

// Arbitraries for generating random transaction data
const transactionTypeArb = fc.constantFrom<TransactionType>('income', 'expense', 'transfer');

const categoryArb = fc.constantFrom<Category>(
  'salary',
  'freelance',
  'investment',
  'rent',
  'utilities',
  'groceries',
  'dining',
  'transportation',
  'entertainment',
  'healthcare',
  'shopping',
  'transfer',
  'other'
);

const transactionDataArb = fc.record({
  date: fc.integer({ min: 0, max: 3652 }).map((days) => {
    const baseDate = new Date('2020-01-01');
    baseDate.setDate(baseDate.getDate() + days);
    return baseDate.toISOString().split('T')[0];
  }),
  description: fc.string({ minLength: 1, maxLength: 100 }),
  amount: fc.double({ min: 0.01, max: 1000000, noNaN: true }),
  type: transactionTypeArb,
  category: categoryArb,
  merchant: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined,
  }),
  tags: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 20 })), {
    nil: undefined,
  }),
  notes: fc.option(fc.string({ minLength: 1, maxLength: 200 }), {
    nil: undefined,
  }),
});

describe('transactionsStore', () => {
  describe('Property 4: Transaction Addition Preserves Data', () => {
    it('**Validates: Requirements 6.2** - should preserve all provided fields when adding a transaction', () => {
      fc.assert(
        fc.property(transactionDataArb, (transactionData) => {
          const store = useTransactionsStore.getState();

          // Add transaction
          store.addTransaction(transactionData);

          // Get the added transaction (should be the last one)
          const transactions = useTransactionsStore.getState().transactions;
          const addedTransaction = transactions[transactions.length - 1];

          // Verify all provided fields match exactly
          expect(addedTransaction.date).toBe(transactionData.date);
          expect(addedTransaction.description).toBe(transactionData.description);
          expect(addedTransaction.amount).toBe(transactionData.amount);
          expect(addedTransaction.type).toBe(transactionData.type);
          expect(addedTransaction.category).toBe(transactionData.category);
          expect(addedTransaction.merchant).toBe(transactionData.merchant);
          expect(addedTransaction.tags).toEqual(transactionData.tags);
          expect(addedTransaction.notes).toBe(transactionData.notes);

          // Verify generated fields are present and valid
          expect(addedTransaction.id).toBeDefined();
          expect(typeof addedTransaction.id).toBe('string');
          expect(addedTransaction.id.length).toBeGreaterThan(0);

          expect(addedTransaction.createdAt).toBeDefined();
          expect(typeof addedTransaction.createdAt).toBe('string');
          expect(new Date(addedTransaction.createdAt).toString()).not.toBe('Invalid Date');

          expect(addedTransaction.updatedAt).toBeDefined();
          expect(typeof addedTransaction.updatedAt).toBe('string');
          expect(new Date(addedTransaction.updatedAt).toString()).not.toBe('Invalid Date');

          // Verify transaction appears in the transactions array
          expect(transactions).toContain(addedTransaction);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 6: Transaction Deletion Removes Only Target', () => {
    it('**Validates: Requirements 6.2** - should remove only the target transaction and leave others unchanged', () => {
      fc.assert(
        fc.property(
          fc.array(transactionDataArb, { minLength: 2, maxLength: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (transactionsData, deleteIndex) => {
            const store = useTransactionsStore.getState();

            // Add multiple transactions
            transactionsData.forEach((data) => store.addTransaction(data));

            // Get all transactions
            const transactions = useTransactionsStore.getState().transactions;
            const initialCount = transactions.length;

            // Select a transaction to delete (use modulo to ensure valid index)
            const targetIndex = deleteIndex % transactions.length;
            const targetTransaction = transactions[targetIndex];
            const targetId = targetTransaction.id;

            // Store other transactions for comparison
            const otherTransactions = transactions.filter((t) => t.id !== targetId);

            // Delete the target transaction
            store.deleteTransaction(targetId);

            // Get updated transactions
            const updatedTransactions = useTransactionsStore.getState().transactions;

            // Verify deleted transaction is not in the store
            expect(updatedTransactions.find((t) => t.id === targetId)).toBeUndefined();

            // Verify all other transactions remain in the store
            otherTransactions.forEach((transaction) => {
              const found = updatedTransactions.find((t) => t.id === transaction.id);
              expect(found).toBeDefined();
              expect(found).toEqual(transaction);
            });

            // Verify transaction count decreased by exactly 1
            expect(updatedTransactions.length).toBe(initialCount - 1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Transaction Update Preserves Unmodified Fields', () => {
    it('**Validates: Requirements 6.2** - should preserve unmodified fields and update updatedAt when updating a transaction', () => {
      fc.assert(
        fc.property(
          transactionDataArb,
          fc.record({
            description: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
              nil: undefined,
            }),
            amount: fc.option(fc.double({ min: 0.01, max: 1000000, noNaN: true }), {
              nil: undefined,
            }),
            type: fc.option(transactionTypeArb, { nil: undefined }),
            category: fc.option(categoryArb, { nil: undefined }),
            merchant: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
              nil: undefined,
            }),
            notes: fc.option(fc.string({ minLength: 1, maxLength: 200 }), {
              nil: undefined,
            }),
          }),
          (transactionData, partialUpdate) => {
            const store = useTransactionsStore.getState();

            // Add transaction
            store.addTransaction(transactionData);

            // Get the added transaction
            const transactions = useTransactionsStore.getState().transactions;
            const originalTransaction = transactions[transactions.length - 1];
            const originalUpdatedAt = originalTransaction.updatedAt;
            const originalCreatedAt = originalTransaction.createdAt;

            // Wait a tiny bit to ensure updatedAt changes
            const now = Date.now();
            while (Date.now() === now) {
              // Busy wait
            }

            // Update transaction with partial data
            store.updateTransaction(originalTransaction.id, partialUpdate);

            // Get the updated transaction
            const updatedTransactions = useTransactionsStore.getState().transactions;
            const updatedTransaction = updatedTransactions.find(
              (t) => t.id === originalTransaction.id
            )!;

            // Verify updated fields changed
            if (partialUpdate.description !== undefined) {
              expect(updatedTransaction.description).toBe(partialUpdate.description);
            } else {
              expect(updatedTransaction.description).toBe(originalTransaction.description);
            }

            if (partialUpdate.amount !== undefined) {
              expect(updatedTransaction.amount).toBe(partialUpdate.amount);
            } else {
              expect(updatedTransaction.amount).toBe(originalTransaction.amount);
            }

            if (partialUpdate.type !== undefined) {
              expect(updatedTransaction.type).toBe(partialUpdate.type);
            } else {
              expect(updatedTransaction.type).toBe(originalTransaction.type);
            }

            if (partialUpdate.category !== undefined) {
              expect(updatedTransaction.category).toBe(partialUpdate.category);
            } else {
              expect(updatedTransaction.category).toBe(originalTransaction.category);
            }

            if (partialUpdate.merchant !== undefined) {
              expect(updatedTransaction.merchant).toBe(partialUpdate.merchant);
            } else {
              expect(updatedTransaction.merchant).toBe(originalTransaction.merchant);
            }

            if (partialUpdate.notes !== undefined) {
              expect(updatedTransaction.notes).toBe(partialUpdate.notes);
            } else {
              expect(updatedTransaction.notes).toBe(originalTransaction.notes);
            }

            // Verify updatedAt timestamp is newer than original
            expect(new Date(updatedTransaction.updatedAt).getTime()).toBeGreaterThan(
              new Date(originalUpdatedAt).getTime()
            );

            // Verify createdAt timestamp remains unchanged
            expect(updatedTransaction.createdAt).toBe(originalCreatedAt);

            // Verify other fields remain unchanged
            expect(updatedTransaction.id).toBe(originalTransaction.id);
            expect(updatedTransaction.date).toBe(originalTransaction.date);
            expect(updatedTransaction.tags).toEqual(originalTransaction.tags);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

describe('Property 7: Search Filter Matches Description or Merchant', () => {
  it(
    '**Validates: Requirements 6.4** - should return only transactions matching search query in description or merchant',
    { timeout: 15000 },
    () => {
      fc.assert(
        fc.property(
          fc.array(transactionDataArb, { minLength: 5, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 10 }),
          (transactionsData, searchQuery) => {
            const store = useTransactionsStore.getState();

            // Add multiple transactions
            transactionsData.forEach((data) => store.addTransaction(data));

            // Create filter state with search query
            const filters = {
              searchQuery,
              type: 'all' as const,
              category: 'all' as const,
              dateRange: { start: null, end: null },
              sortField: 'date' as const,
              sortDir: 'desc' as const,
            };

            // Get filtered transactions
            const filtered = store.getFilteredTransactions(filters);

            // Verify all returned transactions contain the query (case-insensitive)
            const lowerQuery = searchQuery.toLowerCase();
            filtered.forEach((transaction) => {
              const matchesDescription = transaction.description.toLowerCase().includes(lowerQuery);
              const matchesMerchant =
                transaction.merchant?.toLowerCase().includes(lowerQuery) || false;
              expect(matchesDescription || matchesMerchant).toBe(true);
            });

            // Verify all transactions containing the query are returned
            const allTransactions = useTransactionsStore.getState().transactions;
            allTransactions.forEach((transaction) => {
              const matchesDescription = transaction.description.toLowerCase().includes(lowerQuery);
              const matchesMerchant =
                transaction.merchant?.toLowerCase().includes(lowerQuery) || false;

              if (matchesDescription || matchesMerchant) {
                expect(filtered).toContainEqual(transaction);
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  it('should return all transactions when search query is empty', () => {
    const store = useTransactionsStore.getState();

    // Add some transactions
    store.addTransaction({
      date: '2025-01-01',
      description: 'Test 1',
      amount: 100,
      type: 'income',
      category: 'salary',
    });
    store.addTransaction({
      date: '2025-01-02',
      description: 'Test 2',
      amount: 200,
      type: 'expense',
      category: 'rent',
    });

    const filters = {
      searchQuery: '',
      type: 'all' as const,
      category: 'all' as const,
      dateRange: { start: null, end: null },
      sortField: 'date' as const,
      sortDir: 'desc' as const,
    };

    const filtered = store.getFilteredTransactions(filters);
    const allTransactions = useTransactionsStore.getState().transactions;

    expect(filtered.length).toBe(allTransactions.length);
  });
});

describe('Property 8: Type Filter Matches Transaction Type', () => {
  it('**Validates: Requirements 6.4** - should return only transactions matching the specified type', () => {
    fc.assert(
      fc.property(
        fc.array(transactionDataArb, { minLength: 10, maxLength: 30 }),
        fc.constantFrom('income', 'expense', 'transfer', 'all'),
        (transactionsData, typeFilter) => {
          // Reset store before each iteration
          useTransactionsStore.setState({ transactions: [] });
          const store = useTransactionsStore.getState();

          // Add multiple transactions
          transactionsData.forEach((data) => store.addTransaction(data));

          // Create filter state with type filter
          const filters = {
            searchQuery: '',
            type: typeFilter as 'income' | 'expense' | 'transfer' | 'all',
            category: 'all' as const,
            dateRange: { start: null, end: null },
            sortField: 'date' as const,
            sortDir: 'desc' as const,
          };

          // Get filtered transactions
          const filtered = store.getFilteredTransactions(filters);
          const allTransactions = useTransactionsStore.getState().transactions;

          if (typeFilter === 'all') {
            // When filter is "all", all transactions should be returned
            expect(filtered.length).toBe(allTransactions.length);
          } else {
            // When filter is specific type, all results should have that type
            filtered.forEach((transaction) => {
              expect(transaction.type).toBe(typeFilter);
            });

            // Verify no transactions of other types are included
            const otherTypes = ['income', 'expense', 'transfer'].filter((t) => t !== typeFilter);
            filtered.forEach((transaction) => {
              expect(otherTypes).not.toContain(transaction.type);
            });

            // Verify all transactions of the specified type are included
            const expectedTransactions = allTransactions.filter((t) => t.type === typeFilter);
            expect(filtered.length).toBe(expectedTransactions.length);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 9: Date Range Filter Respects Boundaries', () => {
  it(
    '**Validates: Requirements 6.4** - should return only transactions within the specified date range',
    { timeout: 15000 },
    () => {
      fc.assert(
        fc.property(
          fc.array(transactionDataArb, { minLength: 10, maxLength: 30 }),
          fc.option(
            fc.integer({ min: 0, max: 3652 }).map((days) => {
              const baseDate = new Date('2020-01-01');
              baseDate.setDate(baseDate.getDate() + days);
              return baseDate.toISOString().split('T')[0];
            })
          ),
          fc.option(
            fc.integer({ min: 0, max: 3652 }).map((days) => {
              const baseDate = new Date('2020-01-01');
              baseDate.setDate(baseDate.getDate() + days);
              return baseDate.toISOString().split('T')[0];
            })
          ),
          (transactionsData, startDate, endDate) => {
            const store = useTransactionsStore.getState();

            // Add multiple transactions
            transactionsData.forEach((data) => store.addTransaction(data));

            // Ensure start <= end if both are specified
            let start = startDate || null;
            let end = endDate || null;
            if (start && end && start > end) {
              [start, end] = [end, start];
            }

            // Create filter state with date range
            const filters = {
              searchQuery: '',
              type: 'all' as const,
              category: 'all' as const,
              dateRange: { start, end },
              sortField: 'date' as const,
              sortDir: 'desc' as const,
            };

            // Get filtered transactions
            const filtered = store.getFilteredTransactions(filters);
            const allTransactions = useTransactionsStore.getState().transactions;

            // Verify all results are within the date range
            filtered.forEach((transaction) => {
              if (start) {
                expect(transaction.date >= start).toBe(true);
              }
              if (end) {
                expect(transaction.date <= end).toBe(true);
              }
            });

            // Verify all transactions within range are included
            const expectedTransactions = allTransactions.filter((t) => {
              const afterStart = !start || t.date >= start;
              const beforeEnd = !end || t.date <= end;
              return afterStart && beforeEnd;
            });

            expect(filtered.length).toBe(expectedTransactions.length);

            // When neither start nor end is specified, all transactions should be returned
            if (!start && !end) {
              expect(filtered.length).toBe(allTransactions.length);
            }
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});

describe('Property 10: Sort Order Consistency', () => {
  it('**Validates: Requirements 6.4** - should return transactions in correct order based on sort field and direction', () => {
    fc.assert(
      fc.property(
        fc.array(transactionDataArb, { minLength: 5, maxLength: 20 }),
        fc.constantFrom('date', 'amount', 'description'),
        fc.constantFrom('asc', 'desc'),
        (transactionsData, sortField, sortDir) => {
          // Reset store before each iteration
          useTransactionsStore.setState({ transactions: [] });
          
          const store = useTransactionsStore.getState();

          // Add multiple transactions
          transactionsData.forEach((data) => store.addTransaction(data));

          // Create filter state with sort options
          const filters = {
            searchQuery: '',
            type: 'all' as const,
            category: 'all' as const,
            dateRange: { start: null, end: null },
            sortField: sortField as 'date' | 'amount' | 'description',
            sortDir: sortDir as 'asc' | 'desc',
          };

          // Get filtered transactions
          const filtered = store.getFilteredTransactions(filters);

          // Verify correct ordering
          for (let i = 0; i < filtered.length - 1; i++) {
            const current = filtered[i];
            const next = filtered[i + 1];

            const currentVal = current[sortField];
            const nextVal = next[sortField];

            if (sortDir === 'asc') {
              // For ascending: each element <= next element
              expect(currentVal <= nextVal).toBe(true);
            } else {
              // For descending: each element >= next element
              expect(currentVal >= nextVal).toBe(true);
            }
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});
