import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { list } from '../controllers/auditLogsController.js';
import { validateAuditLogQuery } from '../validators/index.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('super_admin', 'compliance_officer'));

router.get('/', validateAuditLogQuery, list);

export default router;
