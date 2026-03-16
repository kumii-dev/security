/**
 * requireRole(...roles)
 * Factory that returns middleware enforcing at least one of the given roles.
 * Must come AFTER requireAuth (depends on req.admin.role).
 *
 * Usage:
 *   router.delete('/settings', requireAuth, requireRole('super_admin'), handler)
 *   router.patch('/stage',     requireAuth, requireRole('super_admin','funding_manager'), handler)
 */
export function requireRole(...roles) {
  const allowed = new Set(roles.flat());

  return function roleGuard(req, res, next) {
    if (!req.admin) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' } });
    }

    if (!allowed.has(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_ROLE',
          message: `Role '${req.admin.role}' is not authorized for this action.`,
        },
      });
    }

    next();
  };
}
