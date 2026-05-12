/**
 * routes/budget.routes.js
 */
const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(budgetController.getBudgets)
  .post(budgetController.createBudget);

router.route('/:id')
  .patch(budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

module.exports = router;
