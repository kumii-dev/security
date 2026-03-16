import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

/**
 * Attaches a unique request ID and logs every incoming request.
 * Must be mounted FIRST before any other middleware.
 */
export function requestLogger(req, res, next) {
  req.id = uuidv4();
  req.startTime = Date.now();

  res.setHeader('X-Request-Id', req.id);

  logger.info({
    event: 'request_received',
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket?.remoteAddress,
    userAgent: req.get('user-agent'),
  });

  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    logger[level]({
      event: 'request_finished',
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration,
    });
  });

  next();
}
