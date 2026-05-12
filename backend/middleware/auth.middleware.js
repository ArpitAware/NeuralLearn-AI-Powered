/**
 * middleware/auth.middleware.js
 * Verifies JWT on protected routes and attaches user to req
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { AppError } = require('./error.middleware');

const protect = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Not authenticated. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists (token valid but user deleted)
    const user = await User.findById(decoded.id).select('_id name email');
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    // 4. Attach user to request for downstream controllers
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please log in again.', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    next(err);
  }
};

module.exports = { protect };
