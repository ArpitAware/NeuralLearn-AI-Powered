/**
 * controllers/expense.controller.js
 * Full CRUD, filtering, search, stats aggregation, and CSV export
 * FIX: cast userId to ObjectId in aggregation pipelines
 */

const mongoose = require('mongoose');
const Expense = require('../models/Expense.model');
const Budget = require('../models/Budget.model');
const { AppError } = require('../middleware/error.middleware');

// ─── GET /api/expenses ────────────────────────────────────────────────────────
exports.getExpenses = async (req, res, next) => {
  try {
    const {
      search, category, startDate, endDate, paymentMethod,
      sortBy = 'date', order = 'desc', page = 1, limit = 10,
    } = req.query;

    const filter = { user: req.user.id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (category) filter.category = category;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(Number(limit)).lean(),
      Expense.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        total, page: Number(page), limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNext: skip + expenses.length < total,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (err) { next(err); }
};

// ─── POST /api/expenses ───────────────────────────────────────────────────────
exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user.id });
    await checkBudgetAlert(req.user.id, expense.category, expense.date);
    res.status(201).json({ success: true, data: expense });
  } catch (err) { next(err); }
};

// ─── GET /api/expenses/:id ────────────────────────────────────────────────────
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) return next(new AppError('Expense not found', 404));
    res.json({ success: true, data: expense });
  } catch (err) { next(err); }
};

// ─── PATCH /api/expenses/:id ──────────────────────────────────────────────────
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true, runValidators: true }
    );
    if (!expense) return next(new AppError('Expense not found', 404));
    res.json({ success: true, data: expense });
  } catch (err) { next(err); }
};

// ─── DELETE /api/expenses/:id ─────────────────────────────────────────────────
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return next(new AppError('Expense not found', 404));
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) { next(err); }
};

// ─── GET /api/expenses/stats ──────────────────────────────────────────────────
// FIX: cast userId string to ObjectId so $match works in aggregation
exports.getStats = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    // CRITICAL FIX: aggregation $match needs an ObjectId, not a string
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear   = new Date(`${year}-12-31T23:59:59.999Z`);

    const [monthlyStats, categoryStats, totalStats] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } } },
        { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { month: '$_id', total: 1, count: 1, _id: 0 } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 }, avgAmount: { $avg: '$amount' } } },
        { $sort: { total: -1 } },
        { $project: { category: '$_id', total: 1, count: 1, avgAmount: 1, _id: 0 } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfYear, $lte: endOfYear } } },
        { $group: { _id: null, totalSpent: { $sum: '$amount' }, totalExpenses: { $sum: 1 }, avgExpense: { $avg: '$amount' }, maxExpense: { $max: '$amount' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        monthly: monthlyStats,
        byCategory: categoryStats,
        totals: totalStats[0] || { totalSpent: 0, totalExpenses: 0, avgExpense: 0, maxExpense: 0 },
      },
    });
  } catch (err) { next(err); }
};

// ─── GET /api/expenses/export ─────────────────────────────────────────────────
exports.exportCSV = async (req, res, next) => {
  try {
    const { Parser } = require('json2csv');
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 }).lean();
    const fields = ['title', 'amount', 'category', 'date', 'paymentMethod', 'notes'];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);
    res.header('Content-Type', 'text/csv');
    res.attachment(`expenses-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) { next(err); }
};

// ─── Internal: Check and update budget alert status ──────────────────────────
async function checkBudgetAlert(userId, category, date) {
  const month = new Date(date).getMonth() + 1;
  const year  = new Date(date).getFullYear();
  const budget = await Budget.findOne({ user: userId, category, month, year });
  if (!budget || budget.isAlertSent) return;
  const spent = await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), category, date: { $gte: new Date(`${year}-${String(month).padStart(2,'0')}-01`) } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalSpent = spent[0]?.total || 0;
  if ((totalSpent / budget.limit) * 100 >= budget.alertThreshold) {
    budget.isAlertSent = true;
    await budget.save();
  }
}
