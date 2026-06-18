// backend/middleware/errorMiddleware.js
// Centralized error handler. Instead of every controller writing its own
// try/catch response formatting, controllers can just throw or call
// next(error), and this single place formats the response consistently.

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // Multer file-too-large error has its own error code.
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum allowed size is 5MB.';
  }

  // MySQL duplicate entry (e.g. email already registered).
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'This record already exists.';
  }

  console.error('❌ Error:', err.message);

  res.status(statusCode).json({
    message,
    // Stack trace only in development — never leak internals in production.
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };