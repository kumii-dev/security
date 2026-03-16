import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { upsertAdminUser, getAdminUserById } from '../services/adminUserService.js';
import { writeAuditLog } from '../services/auditLogService.js';
import { logger } from '../utils/logger.js';

function signSessionToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
      tenantId: user.tenant_id,
    },
    config.jwtSecret,
    { algorithm: 'HS256', expiresIn: config.jwtExpiresIn }
  );
}

/**
 * POST /api/auth/login
 * Body: { idToken: "<microsoft id_token>" }
 * validateToken middleware has already verified idToken → req.msIdentity
 */
export async function login(req, res, next) {
  try {
    const msIdentity = req.msIdentity;
    console.log('[login] msIdentity:', JSON.stringify(msIdentity));
    const email = msIdentity.email || msIdentity.preferred_username || '';
    console.log('[login] email:', email);

    // Enforce allowed domains (e.g. 22onsloane.co)
    if (config.azure.allowedDomains.length > 0) {
      const domain = email.split('@')[1]?.toLowerCase();
      if (!config.azure.allowedDomains.includes(domain)) {
        return res.status(403).json({
          success: false,
          error: { code: 'DOMAIN_NOT_ALLOWED', message: 'Your email domain is not authorised for this portal.' },
        });
      }
    }

    // Resolve role — default to executive_view; extend this logic to read from
    // an Entra group membership claim or a pre-seeded Supabase roles table.
    const existingUser = await getAdminUserById(msIdentity.oid).catch(() => null);
    const role = existingUser?.role || 'executive_view';

    const adminUser = await upsertAdminUser(msIdentity, role);
    const sessionToken = signSessionToken(adminUser);

    await writeAuditLog({
      adminId: adminUser.id,
      adminEmail: adminUser.email,
      action: 'LOGIN',
      entityType: 'admin_user',
      entityId: adminUser.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info({ event: 'login_success', adminId: adminUser.id, email: adminUser.email, role: adminUser.role });

    return res.json({
      success: true,
      data: {
        token: sessionToken,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          displayName: adminUser.display_name,
          role: adminUser.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout(req, res, next) {
  try {
    if (req.admin) {
      await writeAuditLog({
        adminId: req.admin.id,
        adminEmail: req.admin.email,
        action: 'LOGOUT',
        entityType: 'admin_user',
        entityId: req.admin.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
    }
    return res.json({ success: true, message: 'Logged out.' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 */
export async function getMe(req, res, next) {
  try {
    const user = await getAdminUserById(req.admin.id);
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'Admin user not found.' } });
    }
    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        lastLoginAt: user.last_login_at,
      },
    });
  } catch (err) {
    next(err);
  }
}
