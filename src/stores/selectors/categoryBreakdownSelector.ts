import type { Transaction, Category } from '../../types';
import { getCategoryColor } from '../../utils/colorUtils';

export interface CategoryData {
  category: Category | string; // Allow custom categories
  amount: number;
  percentage: number;
  color: string;
}

// Category color map from design document
export const CATEGORY_COLORS: Record<Category, string> = {
  groceries: '#10B981', // green-500
  dining: '#F59E0B', // amber-500
  rent: '#3B82F6', // blue-500
  utilities: '#8B5CF6', // purple-500
  transportation: '#EAB308', // yellow-500
  entertainment: '#EC4899', // pink-500
  healthcare: '#EF4444', // red-500
  shopping: '#14B8A6', // teal-500
  // Income categories (not shown in donut, but included for completeness)
  salary: '#6B7280', // gray-500
  freelance: '#6B7280', // gray-500
  investment: '#6B7280', // gray-500
  transfer: '#6B7280', // gray-500
  other: '#6B7280', // gray-500
};

export function computeCategoryBreakdown(transactions: Transaction[]): CategoryData[] {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Filter only MTD expense transactions
  const expenseTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonth)
  );

  // Return empty array if no expense transactions
  if (expenseTransactions.length === 0) {
    return [];
  }

  // Group by category and sum amounts
  const categoryMap = new Map<Category | string, number>();

  expenseTransactions.forEach((t) => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + Math.abs(t.amount));
  });

  // Compute total expenses
  const totalExpenses = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);

  // Create category data array with percentages
  const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(
    ([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses === 0 ? 0 : (amount / totalExpenses) * 100,
      color: getCategoryColor(category),
    })
  );

  // Sort by amount descending
  categoryData.sort((a, b) => b.amount - a.amount);

  return categoryData;
}
