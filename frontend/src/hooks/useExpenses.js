/**
 * hooks/useExpenses.js
 * Custom hook for expense CRUD with loading, error, and pagination state
 */

import { useState, useCallback } from 'react';
import { expenseAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await expenseAPI.getAll(params);
      setExpenses(data.data);
      setPagination(data.pagination);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load expenses';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = useCallback(async (formData) => {
    try {
      const { data } = await expenseAPI.create(formData);
      toast.success('Expense added!');
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id, formData) => {
    try {
      const { data } = await expenseAPI.update(id, formData);
      toast.success('Expense updated!');
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update expense');
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      await expenseAPI.delete(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      toast.success('Expense deleted');
    } catch {
      toast.error('Failed to delete expense');
    }
  }, []);

  const exportCSV = useCallback(async () => {
    try {
      await expenseAPI.exportCSV();
      toast.success('CSV downloaded!');
    } catch {
      toast.error('Export failed');
    }
  }, []);

  return { expenses, pagination, loading, error, fetchExpenses, createExpense, updateExpense, deleteExpense, exportCSV };
};
