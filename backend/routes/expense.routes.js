/**
 * routes/expense.routes.js
 */
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateExpense } = require('../validators/expense.validator');

// All expense routes require authentication
router.use(protect);

router.get('/stats', expenseController.getStats);       // Dashboard stats
router.get('/export', expenseController.exportCSV);     // CSV export
router.route('/')
  .get(expenseController.getExpenses)
  .post(validateExpense, expenseController.createExpense);

router.route('/:id')
  .get(expenseController.getExpense)
  .patch(validateExpense, expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;
