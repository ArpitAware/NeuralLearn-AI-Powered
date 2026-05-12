/**
 * components/budget/BudgetForm.jsx
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCurrency } from '../../context/CurrencyContext';

const CATEGORIES = [
  'Food & Dining','Transportation','Shopping','Entertainment',
  'Bills & Utilities','Healthcare','Education','Travel','Personal Care','Other',
];

export default function BudgetForm({ initialData, onSubmit, onCancel }) {
  const { currencySymbol } = useCurrency();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { category: '', limit: '', alertThreshold: 80 },
  });

  useEffect(() => {
    if (initialData) {
      reset({ category: initialData.category, limit: initialData.limit, alertThreshold: initialData.alertThreshold || 80 });
    }
  }, [initialData, reset]);

  const inp = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const lbl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={lbl}>Category</label>
        <select {...register('category', { required: 'Category is required' })} className={inp}>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <label className={lbl}>Monthly Limit ({currencySymbol})</label>
        <input
          type="number" step="1" min="1"
          {...register('limit', { required: 'Limit is required', min: { value: 1, message: 'Must be > 0' } })}
          className={inp} placeholder="e.g. 5000"
        />
        {errors.limit && <p className="mt-1 text-xs text-red-500">{errors.limit.message}</p>}
      </div>

      <div>
        <label className={lbl}>
          Alert Threshold <span className="text-gray-400 font-normal">(% of budget)</span>
        </label>
        <input
          type="number" min="1" max="100"
          {...register('alertThreshold', { required: true, min: 1, max: 100 })}
          className={inp} placeholder="80"
        />
        <p className="mt-1 text-xs text-gray-400">You'll be warned when spending reaches this % of your limit</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
          {isSubmitting ? 'Saving...' : initialData ? 'Update Budget' : 'Set Budget'}
        </button>
      </div>
    </form>
  );
}
