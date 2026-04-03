import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Insights } from './Insights';
import { useUIStore } from '../stores/uiStore';
import { useRoleStore } from '../stores/roleStore';

describe('Insights', () => {
  beforeEach(() => {
    // Reset stores before each test
    useUIStore.setState({ sidebarCollapsed: false, darkMode: false });
    useRoleStore.setState({ role: 'ANALYST' });
  });

  it('renders without errors', () => {
    render(
      <BrowserRouter>
        <Insights />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Insights' })).toBeInTheDocument();
  });

  it('displays the Insights heading', () => {
    render(
      <BrowserRouter>
        <Insights />
      </BrowserRouter>
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Insights' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('displays placeholder content', () => {
    render(
      <BrowserRouter>
        <Insights />
      </BrowserRouter>
    );

    expect(screen.getByText('Insights content coming soon...')).toBeInTheDocument();
  });

  it('wraps content in PageWrapper with correct title', () => {
    render(
      <BrowserRouter>
        <Insights />
      </BrowserRouter>
    );

    // PageWrapper should render TopNav with the page title
    const pageTitles = screen.getAllByText('Insights');
    expect(pageTitles.length).toBeGreaterThan(0);
  });

  it('includes Sidebar navigation', () => {
    render(
      <BrowserRouter>
        <Insights />
      </BrowserRouter>
    );

    // Sidebar should be present via PageWrapper
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('applies correct spacing classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Insights />
      </BrowserRouter>
    );

    const contentDiv = container.querySelector('.space-y-6');
    expect(contentDiv).toBeInTheDocument();
  });
});
