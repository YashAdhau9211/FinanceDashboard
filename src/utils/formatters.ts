// Convert number into INR format (₹1,23,456.78)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Turn a date into something like "Jan 15, 2025"
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Convert number into short INR format like ₹1.5K, ₹2.5L, ₹1.5Cr
export function formatShortAmount(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  // Indian numbering system: Crore (10M), Lakh (100K), Thousand
  if (absAmount >= 10_000_000) {
    return `${sign}₹${(absAmount / 10_000_000).toFixed(1)}Cr`;
  }

  if (absAmount >= 100_000) {
    return `${sign}₹${(absAmount / 100_000).toFixed(1)}L`;
  }

  if (absAmount >= 1_000) {
    return `${sign}₹${(absAmount / 1_000).toFixed(1)}K`;
  }

  return `${sign}₹${absAmount}`;
}
