export type TransactionType = 'income' | 'expense' | 'transfer';

// Category type with 13 categories
export type Category =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'rent'
  | 'utilities'
  | 'groceries'
  | 'dining'
  | 'transportation'
  | 'entertainment'
  | 'healthcare'
  | 'shopping'
  | 'transfer'
  | 'other';

// Role type for user roles
export type Role = 'ADMIN' | 'ANALYST';

// Sort direction type
export type SortDir = 'asc' | 'desc';

// Transaction interface with all required fields
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category | string; // Allow custom categories
  merchant?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter state interface for transaction filtering
export interface FilterState {
  searchQuery: string;
  type: TransactionType | 'all';
  category: Category | string | 'all'; // Allow custom categories
  dateRange: {
    start: string | null;
    end: string | null;
  };
  sortField: 'date' | 'amount' | 'description';
  sortDir: SortDir;
}

// UI state interface for UI preferences
export interface UIState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  prefersReducedMotion: boolean;
}

// Monthly data interface for aggregated monthly data
export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
  transactionCount: number;
}

// Insight data interface for insights page
export interface InsightData {
  topCategories: Array<{
    category: Category;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: MonthlyData[];
  averageTransaction: number;
  totalIncome: number;
  totalExpenses: number;
}

// Insight type definitions for Sprint 3 Insights Feature

export interface TopSpendingCategoryInsight {
  category: Category | string | null; // Allow custom categories
  amount: number;
  percentage: number;
  chartData: Array<{ category: Category | string; amount: number; color: string }>;
}

export interface BestIncomeMonthInsight {
  month: string | null;
  year: number | null;
  amount: number;
  percentageChange: number;
  monthlyData?: Array<{ month: string; amount: number }>;
}

export interface WorstExpenseMonthInsight {
  month: string | null;
  year: number | null;
  amount: number;
  hasOverspend: boolean;
  monthlyData?: Array<{ month: string; amount: number }>;
}

export interface MonthlyComparisonInsight {
  currentMonth: {
    income: number;
    expenses: number;
  };
  previousMonth: {
    income: number;
    expenses: number;
  };
  deltas: {
    incomeDelta: number;
    expensesDelta: number;
  };
}

export interface SavingsTrendInsight {
  monthlyData: Array<{
    month: string;
    savingsRate: number;
  }>;
  currentSavingsRate: number;
  sixMonthAverage: number;
}

export interface UnusualSpendingInsight {
  alerts: Array<{
    category: Category | string; // Allow custom categories
    currentAmount: number;
    threeMonthAverage: number;
    percentageIncrease: number;
  }>;
}

export interface AISummary {
  text: string;
}
