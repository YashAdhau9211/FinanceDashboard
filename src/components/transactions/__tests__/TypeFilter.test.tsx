import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TypeFilter } from './TypeFilter';
import { useFiltersStore } from '../../stores/filtersStore';

describe('TypeFilter', () => {
  beforeEach(() => {
    // Reset store before each test
    useFiltersStore.getState().resetFilters();
  });

  it('renders dropdown with label', () => {
    render(<TypeFilter />);

    expect(screen.getByLabelText(/transaction type/i)).toBeInTheDocument();
  });

  it('displays all type options', () => {
    render(<TypeFilter />);

    const select = screen.getByLabelText(/transaction type/i);
    const options = Array.from(select.querySelectorAll('option'));
    const optionTexts = options.map((opt) => opt.textContent);

    expect(optionTexts).toEqual(['All', 'Income', 'Expense', 'Transfer']);
  });

  it('defaults to "All" on page load', () => {
    render(<TypeFilter />);

    const select = screen.getByLabelText(/transaction type/i) as HTMLSelectElement;
    expect(select.value).toBe('all');
  });

  it('updates store when type is selected', async () => {
    const user = userEvent.setup();
    render(<TypeFilter />);

    const select = screen.getByLabelText(/transaction type/i);
    await user.selectOptions(select, 'income');

    expect(useFiltersStore.getState().type).toBe('income');
  });

  it('displays currently selected option', async () => {
    const user = userEvent.setup();
    render(<TypeFilter />);

    const select = screen.getByLabelText(/transaction type/i) as HTMLSelectElement;

    await user.selectOptions(select, 'expense');
    expect(select.value).toBe('expense');

    await user.selectOptions(select, 'transfer');
    expect(select.value).toBe('transfer');
  });

  it('has proper label association with select', () => {
    render(<TypeFilter />);

    const label = screen.getByText(/transaction type/i);
    const select = screen.getByLabelText(/transaction type/i);

    expect(label).toHaveAttribute('for', 'type-filter');
    expect(select).toHaveAttribute('id', 'type-filter');
  });
});
