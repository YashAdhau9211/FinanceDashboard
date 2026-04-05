import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeFilterToggle } from './TimeFilterToggle';

describe('TimeFilterToggle Component', () => {
  it('renders all three buttons (3M, 6M, 12M)', () => {
    const mockOnChange = vi.fn();
    render(<TimeFilterToggle active={12} onChange={mockOnChange} />);

    expect(screen.getByText('3M')).toBeInTheDocument();
    expect(screen.getByText('6M')).toBeInTheDocument();
    expect(screen.getByText('12M')).toBeInTheDocument();
  });

  it('highlights active button with teal background', () => {
    const mockOnChange = vi.fn();
    render(<TimeFilterToggle active={6} onChange={mockOnChange} />);

    const sixMonthButton = screen.getByText('6M');
    expect(sixMonthButton).toHaveClass('bg-teal-700', 'text-white');
  });

  it('inactive buttons have white background', () => {
    const mockOnChange = vi.fn();
    render(<TimeFilterToggle active={12} onChange={mockOnChange} />);

    const threeMonthButton = screen.getByText('3M');
    const sixMonthButton = screen.getByText('6M');

    expect(threeMonthButton).toHaveClass('bg-white');
    expect(sixMonthButton).toHaveClass('bg-white');
  });

  it('calls onChange callback with correct value when button clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<TimeFilterToggle active={12} onChange={mockOnChange} />);

    const threeMonthButton = screen.getByText('3M');
    await user.click(threeMonthButton);

    expect(mockOnChange).toHaveBeenCalledWith(3);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange with 6 when 6M button clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<TimeFilterToggle active={3} onChange={mockOnChange} />);

    const sixMonthButton = screen.getByText('6M');
    await user.click(sixMonthButton);

    expect(mockOnChange).toHaveBeenCalledWith(6);
  });

  it('calls onChange with 12 when 12M button clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<TimeFilterToggle active={6} onChange={mockOnChange} />);

    const twelveMonthButton = screen.getByText('12M');
    await user.click(twelveMonthButton);

    expect(mockOnChange).toHaveBeenCalledWith(12);
  });

  it('has proper ARIA attributes for accessibility', () => {
    const mockOnChange = vi.fn();
    render(<TimeFilterToggle active={12} onChange={mockOnChange} />);

    const twelveMonthButton = screen.getByLabelText('12 months');
    expect(twelveMonthButton).toHaveAttribute('aria-pressed', 'true');

    const threeMonthButton = screen.getByLabelText('3 months');
    expect(threeMonthButton).toHaveAttribute('aria-pressed', 'false');
  });
});
