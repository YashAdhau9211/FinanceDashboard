export interface ChartColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  income: string;
  expense: string;
  transfer: string;
  grid: string;
  text: string;
  axis: string;
}

export const lightModeColors: ChartColorPalette = {
  primary: '#14B8A6', // teal-500
  secondary: '#3B82F6', // blue-500
  tertiary: '#F59E0B', // amber-500
  quaternary: '#EF4444', // red-500
  income: '#14B8A6', // teal-500
  expense: '#F59E0B', // amber-500
  transfer: '#6B7280', // gray-500
  grid: '#E5E7EB', // gray-200
  text: '#374151', // gray-700
  axis: '#D1D5DB', // gray-300
};

export const darkModeColors: ChartColorPalette = {
  primary: '#2DD4BF', // teal-400 (+10% saturation)
  secondary: '#60A5FA', // blue-400 (+10% saturation)
  tertiary: '#FBBF24', // amber-400 (+10% saturation)
  quaternary: '#F87171', // red-400 (+10% saturation)
  income: '#2DD4BF', // teal-400 (+10% saturation)
  expense: '#FBBF24', // amber-400 (+10% saturation)
  transfer: '#9CA3AF', // gray-400
  grid: '#6B7280', // gray-500
  text: '#F3F4F6', // gray-100
  axis: '#9CA3AF', // gray-400
};


export function getChartColors(isDarkMode: boolean): ChartColorPalette {
  return isDarkMode ? darkModeColors : lightModeColors;
}

/**
 * Category colors for charts (consistent across themes)
 */
export const categoryChartColors = [
  '#14B8A6', // teal
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#10B981', // green
  '#F97316', // orange
  '#6366F1', // indigo
  '#06B6D4', // cyan
];

export function getCategoryChartColor(index: number): string {
  return categoryChartColors[index % categoryChartColors.length];
}
