import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterResetButton } from './FilterResetButton';
import { useFiltersStore } from '../../stores/filtersStore';

describe('FilterResetButton', () => {
  beforeEach(() => {
    // Reset store before each test
    useFiltersStore.getState().resetFilters();
  });

  it('renders button with "Clear Filters" text', () => {
    render(<FilterResetButton />);

    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('is disabled when no filters are active', () => {
    render(<FilterResetButton />);

    const button = screen.getByRole('button', { name: /clear filters/i });
    expect(button).toBeDisabled();
  });

  it('is enabled when search query is active', () => {
    useFiltersStore.getState().setSearchQuery('test');
    render(<FilterResetButton />);

    const button = screen.getByRole('button', { name: /clear filters/i });
    expect(button).not.toBeDisabled();
  });

  it('is enabled when type filter is active', () => {
    useFiltersStore.getState().setType('income');
    render(<FilterResetButton />);

    const button = screen.getByRole('button', { name: /clear filters/i });
    expect(button).not.toBeDisabled();
  });

  it('is enabled when category filter is active', () => {
    useFiltersStore.getState().setCategory('groceries');
    render(<FilterResetButton />);

    const button = screen.getByRole('button', { name: /clear filters/i });
    expect(button).not.toBeDisabled();
  });

  it('is enabled when date range start is active', () => {
    useFiltersStore.getState().setDateRange('2025-01-01', null);
    render(<FilterResetButton />);

    const button = screen.getByRole('button', { name: /clear filters/i });
    expect(button).not.toBeDisabled();
  });

  it('is enabled when date range end is active', () => {
    useFiltersStore.getState().setDateRange(null, '2025-01-31');
    render(<FilterResetButton />);

    const button = screen.getByRole('button', { name: /clear filters/i });
    expect(button).not.toBeDisabled();
  });

  it('displays active filter count badge when count > 0', () => {
    useFiltersStore.getState().setSearchQuery('test');
    render(<FilterResetButton />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calculates correct count with multiple active filters', () => {
    useFiltersStore.getState().setSearchQuery('test');
    useFiltersStore.getState().setType('income');
    useFiltersStore.getState().setCategory('groceries');
    useFiltersStore.getState().setDateRange('2025-01-01', '2025-01-31');

    render(<FilterResetButton />);

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('does not display badge when count is 0', () => {
    render(<FilterResetButton />);

    // Badge should not be in the document
    const button = screen.getByRole('button', { name: /clear filters/i });
    const badge = button.querySelector('.bg-teal-600');
    expect(badge).not.toBeInTheDocument();
  });

  it('calls resetFilters when clicked', async () => {
    const user = userEvent.setup();
    useFiltersStore.getState().setSearchQuery('test');
    useFiltersStore.getState().setType('income');

    render(<FilterResetButton />);

    const button = screen.getByRole('button', { name: /clear filters/i });
    await user.click(button);

    const state = useFiltersStore.getState();
    expect(state.searchQuery).toBe('');
    expect(state.type).toBe('all');
    expect(state.category).toBe('all');
    expect(state.dateRange.start).toBeNull();
    expect(state.dateRange.end).toBeNull();
  });

  it('counts date range as one filter even when both start and end are set', () => {
    useFiltersStore.getState().setDateRange('2025-01-01', '2025-01-31');
    render(<FilterResetButton />);

    // Should count as 1 filter, not 2
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
