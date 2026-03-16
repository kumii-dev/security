import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { auditLog } from '../middleware/auditLog.js';
import {
  getSettings,
  upsertSetting,
  getAdminUsers,
  updateUserRole,
  deactivateUser,
} from '../controllers/settingsController.js';
import { validateUpsertSetting, validateUpdateRole } from '../validators/index.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('super_admin'));

router.get('/', getSettings);
router.put('/', validateUpsertSetting, auditLog({ action: 'UPDATE_SETTING', entityType: 'setting' }), upsertSetting);

router.get('/users', getAdminUsers);
router.patch('/users/:userId/role', validateUpdateRole, auditLog({ action: 'UPDATE_ROLE', entityType: 'admin_user' }), updateUserRole);
router.delete('/users/:userId', auditLog({ action: 'DEACTIVATE_USER', entityType: 'admin_user' }), deactivateUser);

export default router;
