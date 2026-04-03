import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { useUIStore } from '../stores/uiStore';
import { useRoleStore } from '../stores/roleStore';

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset stores before each test
    useUIStore.setState({ sidebarCollapsed: false, darkMode: false });
    useRoleStore.setState({ role: 'ANALYST' });
  });

  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeInTheDocument();
  });

  it('displays the Dashboard heading', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Dashboard' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('displays placeholder content', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard content coming soon...')).toBeInTheDocument();
  });

  it('wraps content in PageWrapper with correct title', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // PageWrapper should render TopNav with the page title
    const pageTitles = screen.getAllByText('Dashboard');
    expect(pageTitles.length).toBeGreaterThan(0);
  });

  it('includes Sidebar navigation', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Sidebar should be present via PageWrapper
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('applies correct spacing classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const contentDiv = container.querySelector('.space-y-6');
    expect(contentDiv).toBeInTheDocument();
  });
});
