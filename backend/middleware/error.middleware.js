/**
 * middleware/error.middleware.js
 * Centralized error handling and custom AppError class
 */

const logger = require('../utils/logger');

// ─── Custom error class with HTTP status ─────────────────────────────────────
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── 404 handler for unmatched routes ────────────────────────────────────────
const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

// ─── Global error handler ─────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Mongoose cast error (e.g., invalid ObjectId format)
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join('. '), 400);
  }

  const statusCode = error.statusCode || 500;

  // Only log server errors (5xx), not client errors (4xx)
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} >> ${err.message}`, { stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    // Stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, notFound, errorHandler };
