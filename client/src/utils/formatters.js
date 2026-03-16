/**
 * Formatting utilities for currency, dates, durations
 */

/**
 * Format number as ZAR currency
 * @param {number} value
 * @param {boolean} symbol - show R symbol
 */
export function formatCurrency(value, symbol = true) {
  if (value === null || value === undefined) return '—';
  const num = Number(value);
  if (isNaN(num)) return '—';

  if (num >= 1_000_000) {
    return `${symbol ? 'R' : ''}${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${symbol ? 'R' : ''}${(num / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-ZA', {
    style: symbol ? 'currency' : 'decimal',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format ISO date string to human-readable
 * @param {string|Date} dateInput
 * @param {boolean} withTime
 */
export function formatDate(dateInput, withTime = false) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date)) return '—';

  const options = withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };

  return date.toLocaleDateString('en-ZA', options);
}

/**
 * Calculate human-readable age from a date (e.g., "3 days ago")
 * @param {string|Date} dateInput
 */
export function calcAge(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

/**
 * Truncate a string at max length with ellipsis
 */
export function truncate(str, max = 50) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

/**
 * Format large numbers with locale separators
 */
export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('en-ZA');
}
