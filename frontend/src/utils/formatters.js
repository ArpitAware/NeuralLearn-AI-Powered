/**
 * utils/formatters.js
 * Reusable formatting helpers used across the app
 */

import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format currency with locale support
 * @param {number} amount
 * @param {string} currency - e.g. 'USD', 'EUR', 'INR'
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date relative to now (Today, Yesterday, or "Jan 5")
 */
export const formatDate = (date) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

/**
 * Relative time (e.g., "2 hours ago")
 */
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

/**
 * Truncate long strings with ellipsis
 */
export const truncate = (str, maxLen = 50) =>
  str?.length > maxLen ? `${str.slice(0, maxLen)}…` : str;

/**
 * Convert a number to a compact form (e.g. 1200 → "1.2K")
 */
export const compactNumber = (num) =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(num);

/**
 * Capitalize first letter of every word
 */
export const titleCase = (str) =>
  str?.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) || '';
