import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker } from './DateRangePicker';
import { useFiltersStore } from '../../stores/filtersStore';

describe('DateRangePicker', () => {
  beforeEach(() => {
    // Reset store before each test
    useFiltersStore.getState().resetFilters();
  });

  it('renders two date inputs with labels', () => {
    render(<DateRangePicker />);
    
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('has proper label associations', () => {
    render(<DateRangePicker />);
    
    const startLabel = screen.getByText(/start date/i);
    const endLabel = screen.getByText(/end date/i);
    const startInput = screen.getByLabelText(/start date/i);
    const endInput = screen.getByLabelText(/end date/i);
    
    expect(startLabel).toHaveAttribute('for', 'date-start');
    expect(startInput).toHaveAttribute('id', 'date-start');
    expect(endLabel).toHaveAttribute('for', 'date-end');
    expect(endInput).toHaveAttribute('id', 'date-end');
  });

  it('prevents selecting future dates', () => {
    render(<DateRangePicker />);
    
    const today = new Date().toISOString().split('T')[0];
    const startInput = screen.getByLabelText(/start date/i);
    const endInput = screen.getByLabelText(/end date/i);
    
    expect(startInput).toHaveAttribute('max', today);
    expect(endInput).toHaveAttribute('max', today);
  });

  it('updates store when start date changes', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const startInput = screen.getByLabelText(/start date/i);
    await user.type(startInput, '2025-01-01');
    
    expect(useFiltersStore.getState().dateRange.start).toBe('2025-01-01');
  });

  it('updates store when end date changes', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const endInput = screen.getByLabelText(/end date/i);
    await user.type(endInput, '2025-01-31');
    
    expect(useFiltersStore.getState().dateRange.end).toBe('2025-01-31');
  });

  it('displays validation error when end date is before start date', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const startInput = screen.getByLabelText(/start date/i);
    const endInput = screen.getByLabelText(/end date/i);
    
    await user.type(startInput, '2025-01-31');
    await user.type(endInput, '2025-01-01');
    
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/end date cannot be before start date/i);
  });

  it('does not display error when dates are valid', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const startInput = screen.getByLabelText(/start date/i);
    const endInput = screen.getByLabelText(/end date/i);
    
    await user.type(startInput, '2025-01-01');
    await user.type(endInput, '2025-01-31');
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows clear button for start date when date is selected', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const startInput = screen.getByLabelText(/start date/i);
    
    // Clear button should not be visible initially
    expect(screen.queryByLabelText(/clear start date/i)).not.toBeInTheDocument();
    
    await user.type(startInput, '2025-01-01');
    
    // Clear button should now be visible
    expect(screen.getByLabelText(/clear start date/i)).toBeInTheDocument();
  });

  it('shows clear button for end date when date is selected', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const endInput = screen.getByLabelText(/end date/i);
    
    // Clear button should not be visible initially
    expect(screen.queryByLabelText(/clear end date/i)).not.toBeInTheDocument();
    
    await user.type(endInput, '2025-01-31');
    
    // Clear button should now be visible
    expect(screen.getByLabelText(/clear end date/i)).toBeInTheDocument();
  });

  it('clears start date when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const startInput = screen.getByLabelText(/start date/i) as HTMLInputElement;
    await user.type(startInput, '2025-01-01');
    
    const clearButton = screen.getByLabelText(/clear start date/i);
    await user.click(clearButton);
    
    expect(startInput.value).toBe('');
    expect(useFiltersStore.getState().dateRange.start).toBeNull();
  });

  it('clears end date when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    
    const endInput = screen.getByLabelText(/end date/i) as HTMLInputElement;
    await user.type(endInput, '2025-01-31');
    
    const clearButton = screen.getByLabelText(/clear end date/i);
    await user.click(clearButton);
    
    expect(endInput.value).toBe('');
    expect(useFiltersStore.getState().dateRange.end).toBeNull();
  });
});
