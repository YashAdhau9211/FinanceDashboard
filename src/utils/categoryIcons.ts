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
};

/**
 * Get icon component for a category
 * Returns HelpCircle for custom categories not in the predefined list
 */
export function getCategoryIcon(category: Category | string): LucideIcon {
  if (category in CATEGORY_ICONS) {
    return CATEGORY_ICONS[category as Category];
  }
  return HelpCircle; // Default icon for custom categories
}
