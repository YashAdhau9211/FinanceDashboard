import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Transactions } from './Transactions';
import { useUIStore } from '../stores/uiStore';
import { useRoleStore } from '../stores/roleStore';
import { useTransactionsStore } from '../stores/transactionsStore';
import { mockTransactions } from '../utils/mockTransactions';

describe('Transactions', () => {
  beforeEach(() => {
    // Reset stores before each test
    useUIStore.setState({ sidebarCollapsed: false, darkMode: false });
    useRoleStore.setState({ role: 'ANALYST' });
    useTransactionsStore.setState({ transactions: mockTransactions });
  });

  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Transactions' })).toBeInTheDocument();
  });

  it('displays the Transactions heading', () => {
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Transactions' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('displays transaction count', () => {
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    expect(screen.getByText('103 transactions loaded')).toBeInTheDocument();
  });

  it('updates transaction count when store changes', () => {
    const { rerender } = render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    expect(screen.getByText('103 transactions loaded')).toBeInTheDocument();

    // Update store with fewer transactions
    useTransactionsStore.setState({ transactions: mockTransactions.slice(0, 10) });

    rerender(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    expect(screen.getByText('10 transactions loaded')).toBeInTheDocument();
  });

  it('displays zero transactions when store is empty', () => {
    useTransactionsStore.setState({ transactions: [] });

    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    expect(screen.getByText('0 transactions loaded')).toBeInTheDocument();
  });

  it('wraps content in PageWrapper with correct title', () => {
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // PageWrapper should render TopNav with the page title
    const pageTitles = screen.getAllByText('Transactions');
    expect(pageTitles.length).toBeGreaterThan(0);
  });

  it('includes Sidebar navigation', () => {
    render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    // Sidebar should be present via PageWrapper
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('applies correct spacing classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Transactions />
      </BrowserRouter>
    );

    const contentDiv = container.querySelector('.space-y-6');
    expect(contentDiv).toBeInTheDocument();
  });
});
