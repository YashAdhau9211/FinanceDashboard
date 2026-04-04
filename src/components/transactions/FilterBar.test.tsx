import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterBar } from './FilterBar';
import { useFiltersStore } from '../../stores/filtersStore';

describe('FilterBar', () => {
  beforeEach(() => {
    // Reset store before each test
    useFiltersStore.getState().resetFilters();
  });

  it('renders all filter components', () => {
    render(<FilterBar />);
    
    // Check for SearchBar
    expect(screen.getByLabelText(/search transactions/i)).toBeInTheDocument();
    
    // Check for TypeFilter
    expect(screen.getByLabelText(/transaction type/i)).toBeInTheDocument();
    
    // Check for CategoryFilter
    expect(screen.getByLabelText(/^category$/i)).toBeInTheDocument();
    
    // Check for DateRangePicker
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    
    // Check for FilterResetButton
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('has proper layout structure', () => {
    const { container } = render(<FilterBar />);
    
    // Should have a container with proper styling
    const filterBar = container.firstChild as HTMLElement;
    expect(filterBar).toHaveClass('bg-white', 'p-4', 'rounded-lg', 'border');
  });

  it('displays components in correct order', () => {
    render(<FilterBar />);
    
    const labels = screen.getAllByText(/search transactions|transaction type|^category$|start date|end date/i);
    
    // Search should come first
    expect(labels[0]).toHaveTextContent(/search transactions/i);
  });
});
