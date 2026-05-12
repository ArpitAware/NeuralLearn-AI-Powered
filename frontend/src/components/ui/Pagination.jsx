/**
 * components/ui/Pagination.jsx
 * Smart ellipsis pagination
 */

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  // Build page numbers with ellipsis
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btn = (disabled, onClick, children, active = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] h-9 px-2 rounded-xl text-sm font-medium transition flex items-center justify-center ${
        active
          ? 'bg-indigo-600 text-white'
          : disabled
          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-1">
      {btn(current === 1, () => onChange(current - 1), <FiChevronLeft className="w-4 h-4" />)}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} className="px-1 text-gray-400 text-sm">…</span>
        ) : (
          btn(false, () => onChange(p), p, p === current)
        )
      )}
      {btn(current === total, () => onChange(current + 1), <FiChevronRight className="w-4 h-4" />)}
    </div>
  );
}
