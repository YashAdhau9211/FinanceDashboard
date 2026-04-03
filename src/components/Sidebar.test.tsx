import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../stores/uiStore';

describe('Sidebar', () => {
  beforeEach(() => {
    // Reset UI store state before each test
    useUIStore.setState({ sidebarCollapsed: false, darkMode: false });
  });

  it('renders the Zorvyn logo and brand name', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Z')).toBeInTheDocument();
    expect(screen.getByText('Zorvyn')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the active route with teal styling', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-teal-500/10', 'text-teal-400');
  });

  it('does not highlight inactive routes', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar />
      </MemoryRouter>
    );

    const transactionsLink = screen.getByText('Transactions').closest('a');
    expect(transactionsLink).not.toHaveClass('bg-teal-500/10');
    expect(transactionsLink).toHaveClass('text-gray-400');
  });

  it('hides labels when sidebar is collapsed', () => {
    useUIStore.setState({ sidebarCollapsed: true });

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.queryByText('Zorvyn')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Transactions')).not.toBeInTheDocument();
  });

  it('shows only logo icon when collapsed', () => {
    useUIStore.setState({ sidebarCollapsed: true });

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('w-60', 'bg-navy-900', 'fixed', 'h-full');
  });

  it('renders navigation links with correct paths', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const transactionsLink = screen.getByText('Transactions').closest('a');
    const insightsLink = screen.getByText('Insights').closest('a');
    const settingsLink = screen.getByText('Settings').closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(transactionsLink).toHaveAttribute('href', '/transactions');
    expect(insightsLink).toHaveAttribute('href', '/insights');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });
});
