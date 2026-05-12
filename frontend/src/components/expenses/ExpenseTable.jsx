/**
 * components/expenses/ExpenseTable.jsx
 * Updated: uses formatAmount from CurrencyContext
 */

import { format } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';

const CATEGORY_COLORS = {
  'Food & Dining':    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Transportation':   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Shopping':         'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Entertainment':    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Bills & Utilities':'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Healthcare':       'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Education':        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Travel':           'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Personal Care':    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'Other':            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  const { formatAmount } = useCurrency();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
        <span className="text-4xl block mb-3">🔍</span>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No expenses found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              {['Title','Category','Date','Amount','Actions'].map((h, i) => (
                <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {expenses.map((exp) => (
              <tr key={exp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 dark:text-white">{exp.title}</p>
                  {exp.notes && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{exp.notes}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other}`}>
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {format(new Date(exp.date), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                  {formatAmount(exp.amount)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(exp)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition" title="Edit">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(exp._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition" title="Delete">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {expenses.map((exp) => (
          <div key={exp._id} className="px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{exp.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other}`}>
                  {exp.category}
                </span>
                <span className="text-xs text-gray-400">{format(new Date(exp.date), 'MMM d')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-semibold text-gray-900 dark:text-white">{formatAmount(exp.amount)}</span>
              <button onClick={() => onEdit(exp)} className="text-gray-400 hover:text-indigo-600 transition"><FiEdit2 className="w-4 h-4" /></button>
              <button onClick={() => onDelete(exp._id)} className="text-gray-400 hover:text-red-600 transition"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
