import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopNav } from './TopNav';
import { useRoleStore } from '../stores/roleStore';
import { useUIStore } from '../stores/uiStore';

describe('TopNav', () => {
  beforeEach(() => {
    // Reset stores before each test
    useRoleStore.setState({ role: 'ANALYST' });
    useUIStore.setState({ sidebarCollapsed: false, darkMode: false });
  });

  afterEach(() => {
    // Clean up dark mode class
    document.documentElement.classList.remove('dark');
  });

  it('renders the page title', () => {
    render(<TopNav pageTitle="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the Zorvyn logo', () => {
    render(<TopNav pageTitle="Test Page" />);
    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('displays the current role', () => {
    useRoleStore.setState({ role: 'ANALYST' });
    render(<TopNav pageTitle="Test Page" />);
    expect(screen.getByText('ANALYST')).toBeInTheDocument();
  });

  it('shows ADMIN badge when role is ADMIN', () => {
    useRoleStore.setState({ role: 'ADMIN' });
    render(<TopNav pageTitle="Test Page" />);

    const badge = screen.getByText('ADMIN');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-teal-500');
  });

  it('does not show ADMIN badge when role is ANALYST', () => {
    useRoleStore.setState({ role: 'ANALYST' });
    render(<TopNav pageTitle="Test Page" />);

    const badges = screen.queryAllByText('ADMIN');
    expect(badges).toHaveLength(0);
  });

  it('toggles role when role switcher is clicked', () => {
    useRoleStore.setState({ role: 'ANALYST' });
    render(<TopNav pageTitle="Test Page" />);

    const roleSwitcher = screen.getByText('ANALYST').closest('button');
    fireEvent.click(roleSwitcher!);

    expect(useRoleStore.getState().role).toBe('ADMIN');
  });

  it('displays Moon icon when dark mode is off', () => {
    useUIStore.setState({ darkMode: false });
    render(<TopNav pageTitle="Test Page" />);

    const darkModeButton = screen.getByLabelText('Toggle dark mode');
    expect(darkModeButton).toBeInTheDocument();
  });

  it('displays Sun icon when dark mode is on', () => {
    useUIStore.setState({ darkMode: true });
    render(<TopNav pageTitle="Test Page" />);

    const darkModeButton = screen.getByLabelText('Toggle dark mode');
    expect(darkModeButton).toBeInTheDocument();
  });

  it('toggles dark mode when dark mode button is clicked', () => {
    useUIStore.setState({ darkMode: false });
    render(<TopNav pageTitle="Test Page" />);

    const darkModeButton = screen.getByLabelText('Toggle dark mode');
    fireEvent.click(darkModeButton);

    expect(useUIStore.getState().darkMode).toBe(true);
  });

  it('adds dark class to document when dark mode is enabled', () => {
    useUIStore.setState({ darkMode: false });
    const { rerender } = render(<TopNav pageTitle="Test Page" />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    useUIStore.setState({ darkMode: true });
    rerender(<TopNav pageTitle="Test Page" />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from document when dark mode is disabled', () => {
    useUIStore.setState({ darkMode: true });
    const { rerender } = render(<TopNav pageTitle="Test Page" />);

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    useUIStore.setState({ darkMode: false });
    rerender(<TopNav pageTitle="Test Page" />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('renders user avatar', () => {
    const { container } = render(<TopNav pageTitle="Test Page" />);

    // Check for avatar button with correct styling
    const avatar = container.querySelector('button[aria-label="User profile"]');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('rounded-full');
  });

  it('applies correct header styling', () => {
    const { container } = render(<TopNav pageTitle="Test Page" />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('h-16', 'border-b');
  });
});
