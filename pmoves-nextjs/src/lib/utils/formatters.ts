/**
 * Utility functions for formatting values in the application
 */

/**
 * Format a number as currency (USD)
 * @param value The number to format
 * @param simplified Use simplified format for charts (default: false)
 * @param minimumFractionDigits Minimum number of decimal places (default: 2)
 * @param maximumFractionDigits Maximum number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | undefined | null,
  simplified = false,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string {
  if (value === undefined || value === null) return 'N/A';

  // For chart labels, use a more compact format
  if (simplified) {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a number as a percentage
 * @param value The number to format (0-1 range)
 * @param minimumFractionDigits Minimum number of decimal places (default: 1)
 * @param maximumFractionDigits Maximum number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | undefined | null,
  minimumFractionDigits = 1,
  maximumFractionDigits = 1
): string {
  if (value === undefined || value === null) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a number with commas as thousands separators
 * @param value The number to format
 * @param minimumFractionDigits Minimum number of decimal places (default: 0)
 * @param maximumFractionDigits Maximum number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | undefined | null,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2
): string {
  if (value === undefined || value === null) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a trend value as a percentage with a + or - sign
 * @param value The trend value to format
 * @returns Formatted trend string
 */
export function formatTrend(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'N/A';

  const sign = value > 0 ? '+' : '';
  return `${sign}${formatPercentage(value, 1, 1)}`;
}
