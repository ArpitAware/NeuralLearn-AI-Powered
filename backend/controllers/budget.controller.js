/**
 * controllers/budget.controller.js
 * FIXED: cast userId to ObjectId in aggregation pipeline
 */
const mongoose = require('mongoose');
const Budget = require('../models/Budget.model');
const Expense = require('../models/Expense.model');
const { AppError } = require('../middleware/error.middleware');

exports.getBudgets = async (req, res, next) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.id); // FIX

    const budgets = await Budget.find({ user: req.user.id, month: Number(month), year: Number(year) }).lean();

    const startDate = new Date(`${year}-${String(month).padStart(2,'0')}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const spending = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const spendingMap = spending.reduce((acc, s) => { acc[s._id] = s.spent; return acc; }, {});

    const enriched = budgets.map((b) => ({
      ...b,
      spent: spendingMap[b.category] || 0,
      remaining: Math.max(0, b.limit - (spendingMap[b.category] || 0)),
      usagePercent: Math.round(((spendingMap[b.category] || 0) / b.limit) * 100),
    }));

    res.json({ success: true, data: enriched });
  } catch (err) { next(err); }
};

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    if (err.code === 11000) return next(new AppError('Budget for this category already exists this month', 409));
    next(err);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, isAlertSent: false },
      { new: true, runValidators: true }
    );
    if (!budget) return next(new AppError('Budget not found', 404));
    res.json({ success: true, data: budget });
  } catch (err) { next(err); }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return next(new AppError('Budget not found', 404));
    res.json({ success: true, message: 'Budget deleted' });
  } catch (err) { next(err); }
};
