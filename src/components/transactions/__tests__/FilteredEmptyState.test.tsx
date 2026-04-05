import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilteredEmptyState } from './FilteredEmptyState';
import { useFiltersStore } from '../../stores/filtersStore';

vi.mock('../../stores/filtersStore');

describe('FilteredEmptyState', () => {
  const mockResetFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFiltersStore).mockReturnValue(mockResetFilters as any);
  });

  it('displays filtered empty state message', () => {
    render(<FilteredEmptyState />);

    expect(screen.getByText(/no transactions match your filters/i)).toBeInTheDocument();
    expect(screen.getByText(/try adjusting your search or filter criteria/i)).toBeInTheDocument();
  });

  it('displays Clear Filters button', () => {
    render(<FilteredEmptyState />);

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('calls resetFilters when button is clicked', async () => {
    const user = userEvent.setup();

    render(<FilteredEmptyState />);

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearButton);

    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });

  it('centers content vertically and horizontally', () => {
    const { container } = render(<FilteredEmptyState />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('does not display an illustration', () => {
    const { container } = render(<FilteredEmptyState />);

    // Should not have the icon container that EmptyState has
    const iconContainer = container.querySelector('.rounded-full.bg-gray-100');
    expect(iconContainer).not.toBeInTheDocument();
  });

  it('has simpler styling than EmptyState', () => {
    const { container } = render(<FilteredEmptyState />);

    // Should have text-center class for centered text
    const textContainer = container.querySelector('.text-center');
    expect(textContainer).toBeInTheDocument();
  });
});
