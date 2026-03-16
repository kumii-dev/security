import { logger } from '../utils/logger.js';

/**
 * Global Express error handler.
 * Must be registered LAST with four arguments (err, req, res, next).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  logger.error({
    event: 'unhandled_error',
    requestId: req.id,
    method: req.method,
    path: req.path,
    status,
    message: err.message,
    stack: isProd ? undefined : err.stack,
  });

  const body = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: status < 500 ? err.message : 'An internal server error occurred.',
    },
  };

  if (!isProd && err.stack) {
    body.error.stack = err.stack;
  }

  res.status(status).json(body);
}
