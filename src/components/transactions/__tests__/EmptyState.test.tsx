import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';
import { useRoleStore } from '../../../stores/roleStore';

vi.mock('../../../stores/roleStore');

type RoleState = { role: 'ADMIN' | 'ANALYST' };
type RoleActions = { setRole: (role: 'ADMIN' | 'ANALYST') => void; toggleRole: () => void };
type RoleSelector<T> = (state: RoleState & RoleActions) => T;

describe('EmptyState', () => {
  const mockOnAddTransaction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays empty state message', () => {
    vi.mocked(useRoleStore).mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ANALYST' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return selector ? selector(state) : (state as T);
    });

    render(<EmptyState onAddTransaction={mockOnAddTransaction} />);

    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first one to get started/i)).toBeInTheDocument();
  });

  it('displays folder icon', () => {
    vi.mocked(useRoleStore).mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ANALYST' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return selector ? selector(state) : (state as T);
    });

    const { container } = render(<EmptyState onAddTransaction={mockOnAddTransaction} />);

    // Check for icon container
    const iconContainer = container.querySelector('.rounded-full.bg-gray-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('displays Add Transaction button for ADMIN role', () => {
    vi.mocked(useRoleStore).mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ADMIN' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return selector ? selector(state) : (state as T);
    });

    render(<EmptyState onAddTransaction={mockOnAddTransaction} />);

    const addButton = screen.getByRole('button', { name: /add transaction/i });
    expect(addButton).toBeInTheDocument();
  });

  it('does not display Add Transaction button for ANALYST role', () => {
    vi.mocked(useRoleStore).mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ANALYST' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return selector ? selector(state) : (state as T);
    });

    render(<EmptyState onAddTransaction={mockOnAddTransaction} />);

    const addButton = screen.queryByRole('button', { name: /add transaction/i });
    expect(addButton).not.toBeInTheDocument();
  });

  it('calls onAddTransaction when button is clicked', async () => {
    vi.mocked(useRoleStore).mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ADMIN' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return selector ? selector(state) : (state as T);
    });
    const user = userEvent.setup();

    render(<EmptyState onAddTransaction={mockOnAddTransaction} />);

    const addButton = screen.getByRole('button', { name: /add transaction/i });
    await user.click(addButton);

    expect(mockOnAddTransaction).toHaveBeenCalledTimes(1);
  });

  it('centers content vertically and horizontally', () => {
    vi.mocked(useRoleStore).mockImplementation(<T,>(selector: RoleSelector<T>) => {
      const state = { role: 'ANALYST' as const, setRole: vi.fn(), toggleRole: vi.fn() };
      return selector ? selector(state) : (state as T);
    });

    const { container } = render(<EmptyState onAddTransaction={mockOnAddTransaction} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
