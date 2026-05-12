/**
 * components/expenses/ExpenseForm.jsx
 * Updated: uses currency symbol from CurrencyContext
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useCurrency } from '../../context/CurrencyContext';

const CATEGORIES = [
  'Food & Dining','Transportation','Shopping','Entertainment',
  'Bills & Utilities','Healthcare','Education','Travel','Personal Care','Other',
];
const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer / UPI' },
  { value: 'other', label: 'Other' },
];

export default function ExpenseForm({ initialData, onSubmit, onCancel }) {
  const { currencySymbol } = useCurrency();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: '', amount: '', category: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'other', notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        paymentMethod: initialData.paymentMethod || 'other',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, reset]);

  const inp = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const lbl = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={lbl}>Title</label>
        <input {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 chars' } })} className={inp} placeholder="e.g. Lunch at cafe" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Amount ({currencySymbol})</label>
          <input type="number" step="0.01" min="0.01"
            {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Must be > 0' } })}
            className={inp} placeholder="0.00" />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
        </div>
        <div>
          <label className={lbl}>Date</label>
          <input type="date" {...register('date', { required: 'Date is required' })} className={inp} />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <label className={lbl}>Category</label>
        <select {...register('category', { required: 'Category is required' })} className={inp}>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <label className={lbl}>Payment Method</label>
        <select {...register('paymentMethod')} className={inp}>
          {PAYMENT_METHODS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <div>
        <label className={lbl}>Notes <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea {...register('notes', { maxLength: { value: 500, message: 'Max 500 chars' } })}
          className={`${inp} resize-none`} rows={3} placeholder="Any extra details..." />
        {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
