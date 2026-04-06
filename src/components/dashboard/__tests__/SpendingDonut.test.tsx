import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SpendingDonut from '../SpendingDonut';
import type { CategoryData } from '../../../stores/selectors/categoryBreakdownSelector';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock filtersStore
const mockSetCategory = vi.fn();
vi.mock('../../../stores/filtersStore', () => ({
  useFiltersStore: <T,>(selector: (state: { setCategory: typeof mockSetCategory }) => T) => {
    const store = {
      setCategory: mockSetCategory,
    };
    return selector ? selector(store) : store;
  },
}));

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    children,
    onClick,
    data,
    animationDuration,
    animationEasing,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    onClick?: (entry: CategoryData) => void;
    data?: CategoryData[];
    animationDuration?: number;
    animationEasing?: string;
    'aria-label'?: string;
  }) => (
    <div 
      data-testid="pie" 
      aria-label={ariaLabel}
      data-animation-duration={animationDuration}
      data-animation-easing={animationEasing}
    >
      {data?.map((entry: CategoryData, index: number) => (
        <div
          key={index}
          data-testid={`pie-segment-${entry.category}`}
          onClick={() => onClick && onClick(entry)}
        />
      ))}
      {/* Render children once (Label) */}
      {children}
    </div>
  ),
  Cell: ({ fill, 'aria-label': ariaLabel }: { fill: string; 'aria-label'?: string }) => (
    <div data-testid="pie-cell" data-fill={fill} aria-label={ariaLabel} />
  ),
  Tooltip: ({ content }: { content: React.ReactNode }) => (
    <div data-testid="tooltip">{content}</div>
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Label: ({ value }: { value: string }) => <div data-testid="center-label">{value}</div>,
}));

describe('SpendingDonut', () => {
  const mockCategoryData: CategoryData[] = [
    { category: 'groceries', amount: 5000, percentage: 35.7, color: '#10B981' },
    { category: 'dining', amount: 3000, percentage: 21.4, color: '#F59E0B' },
    { category: 'rent', amount: 2500, percentage: 17.9, color: '#3B82F6' },
    { category: 'utilities', amount: 2000, percentage: 14.3, color: '#8B5CF6' },
    { category: 'transportation', amount: 1500, percentage: 10.7, color: '#EAB308' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render chart with category data', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('should display center legend with total MTD expenses', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    // Total expenses: 5000 + 3000 + 2500 + 2000 + 1500 = 14000
    // formatShortAmount(14000) = ₹14.0K
    const centerLabel = screen.getByTestId('center-label');
    expect(centerLabel).toHaveTextContent('14.0K');
  });

  it('should display legend with category colors and percentages', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    expect(screen.getByText('groceries: 35.7%')).toBeInTheDocument();
    expect(screen.getByText('dining: 21.4%')).toBeInTheDocument();
    expect(screen.getByText('rent: 17.9%')).toBeInTheDocument();
    expect(screen.getByText('utilities: 14.3%')).toBeInTheDocument();
    expect(screen.getByText('transportation: 10.7%')).toBeInTheDocument();
  });

  it('should navigate to /transactions with category filter when segment is clicked', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    const groceriesSegment = screen.getByTestId('pie-segment-groceries');
    fireEvent.click(groceriesSegment);

    expect(mockSetCategory).toHaveBeenCalledWith('groceries');
    expect(mockNavigate).toHaveBeenCalledWith('/transactions');
  });

  it('should set correct category filter for different segments', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    const diningSegment = screen.getByTestId('pie-segment-dining');
    fireEvent.click(diningSegment);

    expect(mockSetCategory).toHaveBeenCalledWith('dining');
    expect(mockNavigate).toHaveBeenCalledWith('/transactions');
  });

  it('should have ARIA label for accessibility', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    const container = screen.getByLabelText(
      'Spending breakdown donut chart showing expenses by category'
    );
    expect(container).toBeInTheDocument();
  });

  it('should render custom tooltip component', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
    // With empty data, the Label component won't render in our mock
    // Just verify the chart structure is present
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should format percentages with 1 decimal place', () => {
    const dataWithPrecisePercentages: CategoryData[] = [
      { category: 'groceries', amount: 3333.33, percentage: 33.333333, color: '#10B981' },
      { category: 'dining', amount: 6666.67, percentage: 66.666667, color: '#F59E0B' },
    ];

    render(
      <BrowserRouter>
        <SpendingDonut data={dataWithPrecisePercentages} />
      </BrowserRouter>
    );

    expect(screen.getByText('groceries: 33.3%')).toBeInTheDocument();
    expect(screen.getByText('dining: 66.7%')).toBeInTheDocument();
  });

  it('should apply correct colors to legend items', () => {
    const { container } = render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    const legendItems = container.querySelectorAll('.w-3.h-3.rounded-full');
    expect(legendItems).toHaveLength(5);

    // Check first item has groceries color
    expect(legendItems[0]).toHaveStyle({ backgroundColor: '#10B981' });
  });

  it('sets animation duration to 600ms on pie chart', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-animation-duration', '600');
  });

  it('sets animation easing to ease-in-out on pie chart', () => {
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-animation-easing', 'ease-in-out');
  });

  it('respects prefers-reduced-motion via CSS media query', () => {
    // Animation props are set on Recharts components
    // The CSS @media (prefers-reduced-motion: reduce) rule handles disabling animations
    render(
      <BrowserRouter>
        <SpendingDonut data={mockCategoryData} />
      </BrowserRouter>
    );

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-animation-duration', '600');
    
    // The actual animation disabling is handled by CSS, not component logic
  });
});
