/**
 * components/expenses/FilterBar.jsx
 * Search, category filter, date range, sort controls
 */

import { FiSearch, FiX } from 'react-icons/fi';

const CATEGORIES = [
  'Food & Dining','Transportation','Shopping','Entertainment',
  'Bills & Utilities','Healthcare','Education','Travel','Personal Care','Other',
];

export default function FilterBar({ filters, onChange }) {
  const inp = 'w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  const hasActiveFilters =
    filters.search || filters.category || filters.startDate || filters.endDate || filters.paymentMethod;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className={`${inp} pl-9`}
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className={`${inp} sm:w-44`}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            onChange({ sortBy, order });
          }}
          className={`${inp} sm:w-44`}
        >
          <option value="date-desc">Date: Newest</option>
          <option value="date-asc">Date: Oldest</option>
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Date range */}
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className={inp}
          />
          <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className={inp}
          />
        </div>

        {/* Payment method */}
        <select
          value={filters.paymentMethod}
          onChange={(e) => onChange({ paymentMethod: e.target.value })}
          className={`${inp} sm:w-44`}
        >
          <option value="">All Methods</option>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="bank_transfer">Bank Transfer / UPI</option>
          <option value="other">Other</option>
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: '', category: '', startDate: '', endDate: '', paymentMethod: '' })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-700 rounded-xl transition whitespace-nowrap"
          >
            <FiX className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
