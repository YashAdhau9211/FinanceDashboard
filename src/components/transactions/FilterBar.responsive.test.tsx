import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterBar } from './FilterBar';

// Mock the filter components
vi.mock('./SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}));

vi.mock('./TypeFilter', () => ({
  TypeFilter: () => <div data-testid="type-filter">Type Filter</div>,
}));

vi.mock('./CategoryFilter', () => ({
  CategoryFilter: () => <div data-testid="category-filter">Category Filter</div>,
}));

vi.mock('./DateRangePicker', () => ({
  DateRangePicker: () => <div data-testid="date-range-picker">Date Range Picker</div>,
}));

vi.mock('./FilterResetButton', () => ({
  FilterResetButton: () => <div data-testid="filter-reset-button">Filter Reset Button</div>,
}));

describe('FilterBar - Responsive Design', () => {
  it('should render all filter components', () => {
    render(<FilterBar />);

    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('type-filter')).toBeInTheDocument();
    expect(screen.getByTestId('category-filter')).toBeInTheDocument();
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
    expect(screen.getByTestId('filter-reset-button')).toBeInTheDocument();
  });

  it('should have responsive grid layout classes', () => {
    const { container } = render(<FilterBar />);

    // Check for responsive grid classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer?.className).toContain('grid-cols-1');
    expect(gridContainer?.className).toContain('sm:grid-cols-2');
    expect(gridContainer?.className).toContain('lg:grid-cols-4');
  });

  it('should have full-width search bar container', () => {
    const { container } = render(<FilterBar />);

    // Search bar should be in a full-width container
    const searchContainer = screen.getByTestId('search-bar').parentElement;
    expect(searchContainer?.className).toContain('w-full');
  });

  it('should stack filter controls vertically on mobile', () => {
    const { container } = render(<FilterBar />);

    // Grid should start with single column (mobile)
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer?.className).toContain('grid-cols-1');
  });

  it('should use 2 columns on tablet screens', () => {
    const { container } = render(<FilterBar />);

    // Grid should have 2 columns on small screens
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer?.className).toContain('sm:grid-cols-2');
  });

  it('should use 4 columns on desktop screens', () => {
    const { container } = render(<FilterBar />);

    // Grid should have 4 columns on large screens
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer?.className).toContain('lg:grid-cols-4');
  });

  it('should have proper spacing between filter controls', () => {
    const { container } = render(<FilterBar />);

    // Check for gap classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer?.className).toContain('gap-4');
  });

  it('should span date range picker across 2 columns on tablet', () => {
    const { container } = render(<FilterBar />);

    // Date range picker container should span 2 columns on tablet
    const dateRangeContainer = screen.getByTestId('date-range-picker').parentElement;
    expect(dateRangeContainer?.className).toContain('sm:col-span-2');
  });

  it('should span filter reset button across 2 columns on tablet', () => {
    const { container } = render(<FilterBar />);

    // Filter reset button container should span 2 columns on tablet
    const resetButtonContainer = screen.getByTestId('filter-reset-button').parentElement;
    expect(resetButtonContainer?.className).toContain('sm:col-span-2');
  });
});
