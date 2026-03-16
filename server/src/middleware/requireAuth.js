import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

/**
 * requireAuth
 * Validates the backend-issued JWT (issued after Microsoft token verification).
 * Populates req.admin = { id, email, displayName, role, tenantId }
 */
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: { code: 'MISSING_TOKEN', message: 'Authentication required.' } });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'],
    });

    req.admin = {
      id: decoded.sub,
      email: decoded.email,
      displayName: decoded.displayName,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    next();
  } catch (err) {
    logger.warn({ event: 'auth_failed', error: err.message, requestId: req.id });

    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(401).json({ success: false, error: { code, message: 'Session invalid or expired.' } });
  }
}
