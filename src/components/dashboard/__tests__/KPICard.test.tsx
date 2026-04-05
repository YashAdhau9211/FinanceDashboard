import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { KPICard } from './KPICard';

// Mock the useCountUp hook to return the target value immediately
vi.mock('../../hooks/useCountUp', () => ({
  useCountUp: (target: number) => target,
}));

describe('KPICard', () => {
  const mockSparklineData = [100, 120, 110, 130, 125, 140];

  it('should render label and value', () => {
    render(
      <KPICard
        label="Total Balance"
        value={50000}
        delta={5.2}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="currency"
      />
    );

    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('₹50,000.00')).toBeInTheDocument();
  });

  it('should format currency values correctly', () => {
    render(
      <KPICard
        label="Total Income"
        value={75000}
        delta={3.5}
        icon={TrendingUp}
        sparklineData={mockSparklineData}
        format="currency"
      />
    );

    expect(screen.getByText('₹75,000.00')).toBeInTheDocument();
  });

  it('should format percentage values correctly', () => {
    render(
      <KPICard
        label="Savings Rate"
        value={25.5}
        delta={2.1}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="percentage"
      />
    );

    expect(screen.getByText('25.5%')).toBeInTheDocument();
  });

  it('should display delta badge with correct color for positive delta', () => {
    const { container } = render(
      <KPICard
        label="Total Balance"
        value={50000}
        delta={5.2}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="currency"
      />
    );

    const badge = container.querySelector('.bg-green-100');
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('5.2%')).toBeInTheDocument();
  });

  it('should display delta badge with correct color for negative delta', () => {
    const { container } = render(
      <KPICard
        label="Total Expenses"
        value={30000}
        delta={-3.7}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="currency"
      />
    );

    const badge = container.querySelector('.bg-red-100');
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('3.7%')).toBeInTheDocument();
  });

  it('should show edit button when showEditButton is true', () => {
    render(
      <KPICard
        label="Total Balance"
        value={50000}
        delta={5.2}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="currency"
        showEditButton={true}
      />
    );

    const editButton = screen.getByLabelText('Edit Total Balance');
    expect(editButton).toBeInTheDocument();
  });

  it('should not show edit button when showEditButton is false', () => {
    render(
      <KPICard
        label="Total Balance"
        value={50000}
        delta={5.2}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="currency"
        showEditButton={false}
      />
    );

    const editButton = screen.queryByLabelText('Edit Total Balance');
    expect(editButton).not.toBeInTheDocument();
  });

  it('should have correct ARIA label', () => {
    const { container } = render(
      <KPICard
        label="Total Balance"
        value={50000}
        delta={5.2}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="currency"
      />
    );

    const card = container.querySelector('[aria-label]');
    expect(card?.getAttribute('aria-label')).toBe(
      'Total Balance: ₹50,000.00, up 5.2% from last month'
    );
  });

  it('should have correct ARIA label for negative delta', () => {
    const { container } = render(
      <KPICard
        label="Total Expenses"
        value={30000}
        delta={-3.7}
        icon={DollarSign}
        sparklineData={mockSparklineData}
        format="currency"
      />
    );

    const card = container.querySelector('[aria-label]');
    expect(card?.getAttribute('aria-label')).toBe(
      'Total Expenses: ₹30,000.00, down 3.7% from last month'
    );
  });
});
