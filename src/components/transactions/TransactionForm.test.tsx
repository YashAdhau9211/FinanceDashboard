import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from './TransactionForm';
import type { Transaction } from '../../types';

const mockTransaction: Transaction = {
  id: '1',
  date: '2025-01-15',
  description: 'Test Transaction',
  amount: 1000,
  type: 'expense',
  category: 'groceries',
  createdAt: '2025-01-15T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
};

describe('TransactionForm', () => {
  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByText(/type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('should render Save and Cancel buttons', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should render empty fields in add mode', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
      const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;

      expect(dateInput.value).toBe('');
      expect(descInput.value).toBe('');
      expect(amountInput.value).toBe('');
    });

    it('should render pre-filled fields in edit mode', () => {
      render(
        <TransactionForm
          mode="edit"
          transaction={mockTransaction}
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
      const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;

      expect(dateInput.value).toBe('2025-01-15');
      expect(descInput.value).toBe('Test Transaction');
      expect(amountInput.value).toBe('1000');
    });
  });

  describe('Validation', () => {
    it('should show error when date is empty', async () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i);
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Date is required');
      });
    });

    it('should show error when date is in the future', async () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: futureDateString } });
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Date cannot be in the future');
      });
    });

    it('should show error when description is empty', async () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const descInput = screen.getByLabelText(/description/i);
      fireEvent.blur(descInput);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Description is required');
      });
    });

    it('should show error when amount is empty', async () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.blur(amountInput);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Amount is required');
      });
    });

    it('should show error when amount is less than or equal to 0', async () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '-5' } });
      fireEvent.blur(amountInput);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Amount must be greater than 0');
      });
    });

    it('should disable Save button when there are validation errors', async () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save/i });
      const dateInput = screen.getByLabelText(/date/i);
      
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with valid data', async () => {
      const onSubmit = vi.fn();
      render(
        <TransactionForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i);
      const descInput = screen.getByLabelText(/description/i);
      const amountInput = screen.getByLabelText(/amount/i);
      const categorySelect = screen.getByLabelText(/category/i);

      fireEvent.change(dateInput, { target: { value: '2025-01-15' } });
      fireEvent.change(descInput, { target: { value: 'Test Transaction' } });
      fireEvent.change(amountInput, { target: { value: '1000' } });
      fireEvent.change(categorySelect, { target: { value: 'groceries' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          date: '2025-01-15',
          description: 'Test Transaction',
          amount: 1000,
          type: 'expense',
          category: 'groceries',
        });
      });
    });

    it('should not call onSubmit with invalid data', async () => {
      const onSubmit = vi.fn();
      render(
        <TransactionForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={vi.fn()}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    it('should call onCancel when Cancel button is clicked', () => {
      const onCancel = vi.fn();
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={onCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Field Constraints', () => {
    it('should limit description to 100 characters', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const descInput = screen.getByLabelText(/description/i) as HTMLInputElement;
      expect(descInput).toHaveAttribute('maxLength', '100');
    });

    it('should set minimum amount to 0.01', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
      expect(amountInput).toHaveAttribute('min', '0.01');
      expect(amountInput).toHaveAttribute('step', '0.01');
    });

    it('should prevent selecting future dates', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
      const today = new Date().toISOString().split('T')[0];
      expect(dateInput).toHaveAttribute('max', today);
    });
  });

  describe('Type Selection', () => {
    it('should render all transaction type options', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      expect(screen.getByLabelText(/income/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expense/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/transfer/i)).toBeInTheDocument();
    });

    it('should default to expense type', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const expenseRadio = screen.getByLabelText(/expense/i) as HTMLInputElement;
      expect(expenseRadio).toBeChecked();
    });
  });

  describe('Category Selection', () => {
    it('should render all category options', () => {
      render(
        <TransactionForm
          mode="add"
          onSubmit={vi.fn()}
          onCancel={vi.fn()}
        />
      );

      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
      const options = Array.from(categorySelect.options).map(opt => opt.value);

      expect(options).toContain('salary');
      expect(options).toContain('groceries');
      expect(options).toContain('rent');
      expect(options).toContain('utilities');
    });
  });
});
