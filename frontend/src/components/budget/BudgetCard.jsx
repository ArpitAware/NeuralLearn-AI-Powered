/**
 * components/budget/BudgetCard.jsx
 * Budget card with animated progress bar and alert color states
 */

import { FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';

function getStatusColor(pct) {
  if (pct >= 100) return { bar: 'bg-red-500',   bg: 'bg-red-50 dark:bg-red-900/20',   border: 'border-red-200 dark:border-red-800',   text: 'text-red-600 dark:text-red-400' };
  if (pct >= 80)  return { bar: 'bg-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400' };
  return           { bar: 'bg-emerald-500', bg: 'bg-white dark:bg-gray-800',          border: 'border-gray-100 dark:border-gray-700',  text: 'text-emerald-600 dark:text-emerald-400' };
}

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { formatAmount } = useCurrency();
  const pct = Math.min(budget.usagePercent || 0, 100);
  const status = getStatusColor(pct);
  const isOver = budget.usagePercent >= 100;
  const isWarning = budget.usagePercent >= (budget.alertThreshold || 80) && !isOver;

  return (
    <div className={`rounded-2xl border p-5 ${status.bg} ${status.border} transition-all hover:-translate-y-1 hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Budget for {new Date(2024, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(budget)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-700 transition" title="Edit">
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(budget._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-gray-700 transition" title="Delete">
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {(isOver || isWarning) && (
        <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg mb-3 ${isOver ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
          <FiAlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {isOver ? 'Budget exceeded!' : `${budget.usagePercent}% used — nearing limit`}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span>Spent</span>
          <span className={`font-semibold ${status.text}`}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${status.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/70 dark:bg-gray-700/50 rounded-xl p-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Spent</p>
          <p className="font-bold text-gray-900 dark:text-white text-sm">{formatAmount(budget.spent || 0)}</p>
        </div>
        <div className="bg-white/70 dark:bg-gray-700/50 rounded-xl p-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Limit</p>
          <p className="font-bold text-gray-900 dark:text-white text-sm">{formatAmount(budget.limit)}</p>
        </div>
        <div className="bg-white/70 dark:bg-gray-700/50 rounded-xl p-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Left</p>
          <p className={`font-bold text-sm ${isOver ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isOver ? `-${formatAmount(Math.abs(budget.remaining))}` : formatAmount(budget.remaining || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
