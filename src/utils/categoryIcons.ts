import {
  ShoppingCart,
  Utensils,
  Home,
  Zap,
  Car,
  Film,
  Heart,
  ShoppingBag,
  Wallet,
  Briefcase,
  TrendingUp,
  ArrowLeftRight,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '../types';

/**
 * Icon map for transaction categories
 */
export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  groceries: ShoppingCart,
  dining: Utensils,
  rent: Home,
  utilities: Zap,
  transportation: Car,
  entertainment: Film,
  healthcare: Heart,
  shopping: ShoppingBag,
  salary: Wallet,
  freelance: Briefcase,
  investment: TrendingUp,
  transfer: ArrowLeftRight,
  other: HelpCircle,
};

/**
 * Get icon component for a category
 */
export function getCategoryIcon(category: Category): LucideIcon {
  return CATEGORY_ICONS[category];
}
