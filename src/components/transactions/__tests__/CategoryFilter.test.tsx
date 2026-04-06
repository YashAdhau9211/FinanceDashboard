import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilter } from '../CategoryFilter';
import { useFiltersStore } from '../../../stores/filtersStore';

describe('CategoryFilter', () => {
  beforeEach(() => {
    // Reset store before each test
    useFiltersStore.getState().resetFilters();
  });

  it('renders dropdown with label', () => {
    render(<CategoryFilter />);

    expect(screen.getByLabelText(/^category$/i)).toBeInTheDocument();
  });

  it('displays all 13 categories plus "All Categories" option', () => {
    render(<CategoryFilter />);

    const select = screen.getByLabelText(/^category$/i);
    const options = Array.from(select.querySelectorAll('option'));

    // Should have 14 options: "All Categories" + 13 categories
    expect(options).toHaveLength(14);
    expect(options[0].textContent).toBe('All Categories');
  });

  it('defaults to "All Categories"', () => {
    render(<CategoryFilter />);

    const select = screen.getByLabelText(/^category$/i) as HTMLSelectElement;
    expect(select.value).toBe('all');
  });

  it('updates store when category is selected', async () => {
    const user = userEvent.setup();
    render(<CategoryFilter />);

    const select = screen.getByLabelText(/^category$/i);
    await user.selectOptions(select, 'groceries');

    expect(useFiltersStore.getState().category).toBe('groceries');
  });

  it('displays currently selected option', async () => {
    const user = userEvent.setup();
    render(<CategoryFilter />);

    const select = screen.getByLabelText(/^category$/i) as HTMLSelectElement;

    await user.selectOptions(select, 'dining');
    expect(select.value).toBe('dining');

    await user.selectOptions(select, 'transportation');
    expect(select.value).toBe('transportation');
  });

  it('includes all required categories', () => {
    render(<CategoryFilter />);

    const select = screen.getByLabelText(/^category$/i);
    const options = Array.from(select.querySelectorAll('option'));
    const optionValues = options.map((opt) => (opt as HTMLOptionElement).value);

    const expectedCategories = [
      'all',
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
      'other',
    ];

    expect(optionValues).toEqual(expectedCategories);
  });

  it('has proper label association with select', () => {
    render(<CategoryFilter />);

    const label = screen.getByText(/^category$/i);
    const select = screen.getByLabelText(/^category$/i);

    expect(label).toHaveAttribute('for', 'category-filter');
    expect(select).toHaveAttribute('id', 'category-filter');
  });
});
