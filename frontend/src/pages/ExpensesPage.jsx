/**
 * pages/ExpensesPage.jsx
 * Full expense management with CRUD, search, filter, pagination, export
 */

import { useEffect, useState, useCallback } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseTable from '../components/expenses/ExpenseTable';
import FilterBar from '../components/expenses/FilterBar';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import { FiPlus, FiDownload } from 'react-icons/fi';

const DEFAULT_FILTERS = {
  search: '', category: '', startDate: '', endDate: '',
  paymentMethod: '', sortBy: 'date', order: 'desc', page: 1, limit: 10,
};

export default function ExpensesPage() {
  const {
    expenses, pagination, loading,
    fetchExpenses, createExpense, updateExpense, deleteExpense, exportCSV,
  } = useExpenses();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => fetchExpenses(filters), filters.search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleOpenAdd = () => { setEditingExpense(null); setShowModal(true); };
  const handleOpenEdit = (e) => { setEditingExpense(e); setShowModal(true); };

  const handleSubmit = async (formData) => {
    if (editingExpense) {
      await updateExpense(editingExpense._id, formData);
    } else {
      await createExpense(formData);
    }
    setShowModal(false);
    fetchExpenses(filters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) await deleteExpense(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination?.total ?? 0} total expenses
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FiDownload className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
          >
            <FiPlus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      <FilterBar filters={filters} onChange={handleFilterChange} />
      <ExpenseTable expenses={expenses} loading={loading} onEdit={handleOpenEdit} onDelete={handleDelete} />

      {pagination && pagination.totalPages > 1 && (
        <Pagination current={pagination.page} total={pagination.totalPages} onChange={handlePageChange} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm initialData={editingExpense} onSubmit={handleSubmit} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
