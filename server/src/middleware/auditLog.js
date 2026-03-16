import { writeAuditLog } from '../services/auditLogService.js';

/**
 * auditLog({ action, entityType })
 * Middleware factory — writes an audit log row AFTER the handler responds.
 * Captures the response body via a monkey-patched res.json.
 *
 * Usage:
 *   router.post('/', requireAuth, auditLog({ action: 'CREATE', entityType: 'startup' }), handler)
 */
export function auditLog({ action, entityType }) {
  return function auditMiddleware(req, res, next) {
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Fire-and-forget: don't block the response
      if (res.statusCode < 400) {
        const entityId =
          body?.data?.id ||
          req.params?.id ||
          null;

        writeAuditLog({
          adminId: req.admin?.id,
          adminEmail: req.admin?.email,
          action,
          entityType,
          entityId: entityId ? String(entityId) : null,
          metadata: {
            method: req.method,
            path: req.path,
            requestId: req.id,
            statusCode: res.statusCode,
          },
          ipAddress: req.ip || req.socket?.remoteAddress,
          userAgent: req.get('user-agent'),
        }).catch(() => {}); // silent — never fail a request due to audit log errors
      }

      return originalJson(body);
    };

    next();
  };
}
